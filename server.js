const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const RATINGS_FILE = path.join(__dirname, 'data', 'ratings.json');

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
};

function readRatings() {
  try {
    return JSON.parse(fs.readFileSync(RATINGS_FILE, 'utf8'));
  } catch {
    return { total: 0, count: 0 };
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

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0].split('#')[0];

  if (urlPath === '/api/rating' && req.method === 'GET') {
    const data = readRatings();
    const avg = data.count > 0 ? (data.total / data.count) : 0;
    sendJson(res, 200, { avg: Math.round(avg * 10) / 10, count: data.count });
    return;
  }

  if (urlPath === '/api/rating' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { star } = JSON.parse(body);
        if (!star || star < 1 || star > 5) {
          sendJson(res, 400, { error: 'Invalid star value' });
          return;
        }
        const data = readRatings();
        data.total += Number(star);
        data.count += 1;
        writeRatings(data);
        const avg = data.total / data.count;
        sendJson(res, 200, { avg: Math.round(avg * 10) / 10, count: data.count });
      } catch {
        sendJson(res, 400, { error: 'Bad request' });
      }
    });
    return;
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST', 'Access-Control-Allow-Headers': 'Content-Type' });
    res.end();
    return;
  }

  const mapped = routes[urlPath];
  let filePath = mapped
    ? path.join(PUBLIC_DIR, mapped)
    : path.join(PUBLIC_DIR, urlPath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (err2, data2) => {
          if (err2) { res.writeHead(404); res.end('Not Found'); return; }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data2);
        });
      } else {
        res.writeHead(500);
        res.end('Server Error');
      }
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
