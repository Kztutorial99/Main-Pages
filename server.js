const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 5000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const RATINGS_FILE = path.join(__dirname, 'data', 'ratings.json');
const VISITORS_FILE = path.join(__dirname, 'data', 'visitors.json');

const _S = 'kztutorial-iwxteam-s3cur3';
const _H = '17850acceb350b88823064a906d79b601cbabb7f0b21f894cdd36417aad54db741f9195da3c7a284f7ed7a5b6db4455bba6085b54b044a030a9ae81b808b0875';

function verifyPassword(input) {
  const derived = crypto.pbkdf2Sync(input, _S, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(derived, 'hex'), Buffer.from(_H, 'hex'));
}

const mimeTypes = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.webp': 'image/webp',
};

const routes = {
  '/': 'index.html', '/topik': 'topik.html', '/legal': 'legal.html',
  '/tools': 'tools.html', '/termux': 'termux.html', '/quiz': 'quiz.html',
  '/admin': 'admin.html',
};

/* ── Geo cache (in-memory, per-IP) ── */
const geoCache = new Map();

function getIP(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (fwd) return fwd.split(',')[0].trim();
  return req.socket.remoteAddress || '0.0.0.0';
}

function parseUA(ua = '') {
  let browser = 'Unknown', device = 'Desktop', os = 'Unknown';
  if (/Android/i.test(ua)) { device = 'Android'; os = 'Android'; }
  else if (/iPad/i.test(ua)) { device = 'Tablet (iOS)'; os = 'iOS'; }
  else if (/iPhone/i.test(ua)) { device = 'iPhone'; os = 'iOS'; }
  else if (/Windows NT/i.test(ua)) { device = 'Desktop'; os = 'Windows'; }
  else if (/Macintosh/i.test(ua)) { device = 'Desktop'; os = 'macOS'; }
  else if (/Linux/i.test(ua)) { device = 'Desktop'; os = 'Linux'; }

  if (/Edg\//i.test(ua)) browser = 'Edge';
  else if (/OPR\/|Opera/i.test(ua)) browser = 'Opera';
  else if (/SamsungBrowser/i.test(ua)) browser = 'Samsung Internet';
  else if (/UCBrowser/i.test(ua)) browser = 'UC Browser';
  else if (/Firefox\/\d/i.test(ua)) browser = 'Firefox';
  else if (/Chrome\/\d/i.test(ua)) browser = 'Chrome';
  else if (/Safari\/\d/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';

  return { browser, device, os };
}

async function fetchGeo(ip) {
  if (geoCache.has(ip)) return geoCache.get(ip);
  const isLocal = ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168') || ip.startsWith('10.');
  if (isLocal) {
    const geo = { country: 'Localhost', countryCode: '🖥️', city: '-' };
    geoCache.set(ip, geo); return geo;
  }
  try {
    const result = await new Promise((resolve, reject) => {
      const opts = { host: 'ip-api.com', path: `/json/${ip}?fields=country,countryCode,city`, headers: { 'User-Agent': 'kztutorial/1.0' } };
      http.get(opts, r => {
        let d = '';
        r.on('data', c => d += c);
        r.on('end', () => { try { resolve(JSON.parse(d)); } catch { reject(); } });
      }).on('error', reject);
    });
    const geo = { country: result.country || '—', countryCode: result.countryCode || '—', city: result.city || '—' };
    geoCache.set(ip, geo);
    return geo;
  } catch {
    const geo = { country: '—', countryCode: '—', city: '—' };
    geoCache.set(ip, geo);
    return geo;
  }
}

function readVisitors() {
  try { return JSON.parse(fs.readFileSync(VISITORS_FILE, 'utf8')); }
  catch { return { visits: [] }; }
}

function saveVisit(visit) {
  const data = readVisitors();
  data.visits.unshift(visit);
  if (data.visits.length > 300) data.visits = data.visits.slice(0, 300);
  fs.writeFileSync(VISITORS_FILE, JSON.stringify(data), 'utf8');
}

/* ── Rating helpers ── */
function readRatings() {
  try {
    const d = JSON.parse(fs.readFileSync(RATINGS_FILE, 'utf8'));
    if (!d.dist) d.dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    return d;
  } catch { return { total: 0, count: 0, dist: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }; }
}

function writeRatings(data) { fs.writeFileSync(RATINGS_FILE, JSON.stringify(data), 'utf8'); }

function sendJson(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(obj));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let b = '';
    req.on('data', c => { b += c; });
    req.on('end', () => { try { resolve(JSON.parse(b)); } catch { reject(new Error('Bad JSON')); } });
  });
}

/* ─────────────── SERVER ─────────────── */
const server = http.createServer(async (req, res) => {
  const urlPath = req.url.split('?')[0].split('#')[0];

  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST', 'Access-Control-Allow-Headers': 'Content-Type' });
    res.end(); return;
  }

  /* ── GET /api/rating ── */
  if (urlPath === '/api/rating' && req.method === 'GET') {
    const d = readRatings();
    const avg = d.count > 0 ? d.total / d.count : 0;
    sendJson(res, 200, { avg: Math.round(avg * 10) / 10, count: d.count, dist: d.dist });
    return;
  }

  /* ── POST /api/rating ── */
  if (urlPath === '/api/rating' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const star = Number(body.star), prev = Number(body.prev_star) || 0;
      if (!star || star < 1 || star > 5) { sendJson(res, 400, { error: 'Invalid star' }); return; }
      const d = readRatings();
      if (prev >= 1 && prev <= 5) {
        d.total = d.total - prev + star;
        d.dist[prev] = Math.max(0, (d.dist[prev] || 0) - 1);
      } else { d.total += star; d.count += 1; }
      d.dist[star] = (d.dist[star] || 0) + 1;
      writeRatings(d);
      const avg = d.total / d.count;
      sendJson(res, 200, { avg: Math.round(avg * 10) / 10, count: d.count, dist: d.dist });
    } catch { sendJson(res, 400, { error: 'Bad request' }); }
    return;
  }

  /* ── POST /api/admin/reset ── */
  if (urlPath === '/api/admin/reset' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      if (!body.password || !verifyPassword(body.password)) {
        sendJson(res, 401, { error: 'Password salah' }); return;
      }
      fs.writeFileSync(VISITORS_FILE, JSON.stringify({ visits: [] }), 'utf8');
      sendJson(res, 200, { ok: true });
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
      const rd = readRatings();
      const avg = rd.count > 0 ? rd.total / rd.count : 0;
      const vd = readVisitors();
      sendJson(res, 200, {
        rating: { avg: Math.round(avg * 10) / 10, count: rd.count, total: rd.total, dist: rd.dist },
        visitors: vd.visits,
        totalVisits: vd.visits.length,
      });
    } catch { sendJson(res, 400, { error: 'Bad request' }); }
    return;
  }

  /* ── Static files + visitor logging ── */
  const mapped = routes[urlPath];
  let filePath = mapped
    ? path.join(PUBLIC_DIR, mapped)
    : path.join(PUBLIC_DIR, urlPath);

  if (!filePath.startsWith(PUBLIC_DIR)) { res.writeHead(403); res.end('Forbidden'); return; }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, async (err, fileData) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (e2, d2) => {
          if (e2) { res.writeHead(404); res.end('Not Found'); return; }
          res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(d2);
        });
      } else { res.writeHead(500); res.end('Server Error'); }
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(fileData);

    /* log visitor only for HTML page requests */
    if (ext === '.html' || mapped) {
      const ip = getIP(req);
      const ua = req.headers['user-agent'] || '';
      const { browser, device, os } = parseUA(ua);
      const geo = await fetchGeo(ip).catch(() => ({ country: '—', countryCode: '—', city: '—' }));
      saveVisit({
        time: new Date().toISOString(),
        ip,
        country: geo.country,
        countryCode: geo.countryCode,
        city: geo.city,
        browser,
        device,
        os,
        page: urlPath || '/',
      });
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
