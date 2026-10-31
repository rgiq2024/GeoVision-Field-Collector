/* GeoVision Field Collector: offline support */
const CORE = 'gvc-core-v1', RUNTIME = 'gvc-runtime-v1', TILES = 'gvc-tiles-v1';
const PRECACHE = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js',
  'https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.5.0/lz-string.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'];
const TILE_HOSTS = ['tile.openstreetmap.org', 'server.arcgisonline.com'];
const MAX_TILES = 2500;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CORE).then(c => Promise.allSettled(PRECACHE.map(u => c.add(new Request(u, { mode: u.startsWith('http') ? 'cors' : 'same-origin' }))))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => ![CORE, RUNTIME, TILES].includes(k)).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
async function trim(name, max) {
  const c = await caches.open(name); const keys = await c.keys();
  for (let i = 0; i < keys.length - max; i++) await c.delete(keys[i]);
}
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname.endsWith('script.google.com') || url.hostname.endsWith('googleusercontent.com')) return; // never cache records
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(res => { caches.open(CORE).then(c => c.put('./index.html', res.clone())); return res; })
      .catch(() => caches.match('./index.html', { ignoreSearch: true }).then(r => r || caches.match('./'))));
    return;
  }
  if (TILE_HOSTS.some(h => url.hostname.endsWith(h))) {
    e.respondWith(caches.open(TILES).then(c => c.match(req).then(hit => hit || fetch(req).then(res => { c.put(req, res.clone()); trim(TILES, MAX_TILES); return res; }).catch(() => hit))));
    return;
  }
  e.respondWith(caches.match(req).then(hit => {
    const net = fetch(req).then(res => { if (res && (res.ok || res.type === 'opaque')) caches.open(url.origin === location.origin ? CORE : RUNTIME).then(c => c.put(req, res.clone())); return res; }).catch(() => hit);
    return hit || net;
  }));
});
