const CACHE_NAME = 'ramadan-2026-v1';
const urlsToCache = ['/', '/index.html', '/styles.css', '/script.js'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))));
self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(response => response || fetch(e.request))));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(names => Promise.all(names.map(name => name !== CACHE_NAME ? caches.delete(name) : null)))));
