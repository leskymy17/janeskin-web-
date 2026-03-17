/**
 * JANESKIN — Dev server
 * Slouží jako lokální webserver + umožňuje přepisovat _variables.css
 * přes POST /api/save-variables ze style-guide.html.
 *
 * Spuštění: node server.js
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = 8080;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.webp': 'image/webp',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ── POST /api/save-variables — přepíše _variables.css ──
  if (req.method === 'POST' && req.url === '/api/save-variables') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { css } = JSON.parse(body);
        if (!css || typeof css !== 'string') throw new Error('Chybějící pole css');
        const target = path.join(ROOT, '_variables.css');
        fs.writeFileSync(target, css, 'utf8');
        console.log('✓ _variables.css uložen');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        console.error('✗ Chyba při ukládání:', e.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
    });
    return;
  }

  // ── GET — statické soubory ──
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(ROOT, urlPath);
  const ext = path.extname(filePath).toLowerCase();

  try {
    const data = fs.readFileSync(filePath);
    const headers = { 'Content-Type': MIME[ext] || 'application/octet-stream' };
    // _variables.css nikdy nekešovat — mění se přes style guide
    if (urlPath === '/_variables.css') {
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      headers['Pragma']        = 'no-cache';
      headers['Expires']       = '0';
    }
    res.writeHead(200, headers);
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 — soubor nenalezen');
  }
});

server.listen(PORT, () => {
  console.log(`\n🌸  JANESKIN dev server běží na http://localhost:${PORT}`);
  console.log(`📐  Style guide:         http://localhost:${PORT}/style-guide.html`);
  console.log(`\nZastav server: Ctrl+C\n`);
});
