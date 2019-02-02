const cacheName = 'blood-dynamic';
const staticAssets = [
    './',
    './css/style.css',
    './index.html',
    './img/banner1.jpg',
    './img/custom.jpg',
    './img/custom1.jpg',
    './img/EXfZ.gif',
    './img/19279-200.png',
    './img/donationChart.png',
    './icon/Icon.png',
    './js/auth.js',
    './js/authenticated.js',
    './pages/signup.html',
    './pages/signin.html',
    './pages/loading.html',
    './pages/home.html',
    './pages/details.html',
    './pages/profile.html',
    './pages/edit.html',
    './pages/upload.html',
]

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
          console.log('[ServiceWorker] Caching app shell');
          return cache.addAll(staticAssets);
        })
      );
})

self.addEventListener('activate', e =>{
    console.log('sw activate');
    e.waitUntil(
        caches.keys().then(keyList =>{
            return Promise.all(keyList.map(key =>{
                if(key !== cacheName){
                    console.log('sw is removing old cache',key);
                    return caches.delete(key);
                }
            }))
        })
    )
})

self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);
    if (url.origin === location.origin) {
        event.respondWith(cacheFirst(req))
    } else {
        event.respondWith(networkFirst(req))
    }
})

async function cacheFirst(req) {
    const cacheResponse = await caches.match(req);
    return cacheResponse || fetch(req);
}

async function networkFirst(req) {
    const cache = await caches.open(cacheName);
    try {
        const res = await fetch(req);
        cache.put(req, res.clone())
        return res
    } catch (error) {
        return await cache.match(req)
    }
}