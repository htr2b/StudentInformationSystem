const CACHE_NAME = 'student-info-system-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/homework.html',
    '/reminders.html',
    '/schedule.html',
    '/css/styles.css',
    '/css/homework.css',
    '/css/reminders.css',
    '/css/schedule.css',
    '/js/script.js',
    '/js/homework.js',
    '/js/reminders.js',
    '/js/schedule.js',
    '/images/icons/icon-192x192.png',
    '/images/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache açılıyor ve dosyalar ekleniyor.');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
