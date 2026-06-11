const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 5000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const RATINGS_FILE = path.join(__dirname, 'data', 'ratings.json');

const _S = 'kztutorial-iwxteam-s3cur3';
const _H = '17850acceb350b88823064a906d79b601cbabb7f0b21f894cdd36417aad54db741f9195da3c7a284f7ed7a5b6db4455bba6085b54b044a030a9ae81b808b0875';

function verifyPassword(input) {
  const derived = crypto.pbkdf2Sync(input, _S, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(derived, 'hex'), Buffer.from(_H, 'hex'));
}

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
};

const routes = {
  '/':        'index.html',
  '/topik':   'topik.html',
  '/legal':   'legal.html',
  '/tools':   'tools.html',
  '/termux':  'termux.html',
  '/quiz':    'quiz.html',
  '/admin':   'admin.html',
};

function readRatings() {
  try {
    const d = JSON.parse(fs.readFileSync(RATINGS_FILE, 'utf8'));
    if (!d.dist) d.dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    return d;
  } catch {
    return { total: 0, count: 0, dist: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
  }
}

function writeRatings(data) {
  fs.writeFileSync(RATINGS_FILE, JSON.stringify(data), 'utf8');
}

function sendJson(res, statusCode, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(body);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { reject(new Error('Bad JSON')); }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const urlPath = req.url.split('?')[0].split('#')[0];

  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST', 'Access-Control-Allow-Headers': 'Content-Type' });
    res.end();
    return;
  }

  /* ── GET /api/rating ── */
  if (urlPath === '/api/rating' && req.method === 'GET') {
    const data = readRatings();
    const avg = data.count > 0 ? data.total / data.count : 0;
    sendJson(res, 200, { avg: Math.round(avg * 10) / 10, count: data.count, dist: data.dist });
    return;
  }

  /* ── POST /api/rating ── */
  if (urlPath === '/api/rating' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const star = Number(body.star);
      const prev = Number(body.prev_star) || 0;
      if (!star || star < 1 || star > 5) { sendJson(res, 400, { error: 'Invalid star' }); return; }
      const data = readRatings();

      if (prev >= 1 && prev <= 5) {
        data.total = data.total - prev + star;
        data.dist[prev] = Math.max(0, (data.dist[prev] || 0) - 1);
      } else {
        data.total += star;
        data.count += 1;
      }
      data.dist[star] = (data.dist[star] || 0) + 1;
      writeRatings(data);

      const avg = data.total / data.count;
      sendJson(res, 200, { avg: Math.round(avg * 10) / 10, count: data.count, dist: data.dist });
    } catch { sendJson(res, 400, { error: 'Bad request' }); }
    return;
  }

  /* ── POST /api/admin ── */
  if (urlPath === '/api/admin' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      if (!body.password || !verifyPassword(body.password)) {
        sendJson(res, 401, { error: 'Password salah' }); return;
      }
      const data = readRatings();
      const avg = data.count > 0 ? data.total / data.count : 0;
      sendJson(res, 200, {
        avg: Math.round(avg * 10) / 10,
        count: data.count,
        total: data.total,
        dist: data.dist
      });
    } catch { sendJson(res, 400, { error: 'Bad request' }); }
    return;
  }

  /* ── Static files ── */
  const mapped = routes[urlPath];
  let filePath = mapped
    ? path.join(PUBLIC_DIR, mapped)
    : path.join(PUBLIC_DIR, urlPath);

  if (!filePath.startsWith(PUBLIC_DIR)) { res.writeHead(403); res.end('Forbidden'); return; }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (err2, d2) => {
          if (err2) { res.writeHead(404); res.end('Not Found'); return; }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(d2);
        });
      } else { res.writeHead(500); res.end('Server Error'); }
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(fileData);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
