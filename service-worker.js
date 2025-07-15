const cacheName = 'dino-clicker-cache-v1';
const assetsToCache = [
  './',
  './index.html',
  './manifest.json',
  './js/app.js',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assetsToCache);
    })
  );
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request);
    })
  );
});
