/**
 * Last update: 202211031614
 */

self.addEventListener("install", function (event) {
    caches.open('clock').then(function(cache) {
        return cache.addAll([
            './', 
            'classes/Cache.js',
            'classes/View.js',
            'classes/QuickToast.js',
            'classes/Book.js',
            'classes/Wishlist.js',
            'https://cdn.jsdelivr.net/npm/showdown@2.0.3/dist/showdown.min.js',
            'scripts/dom-manipulation.js',
            'scripts/search-book.js',
            'manifest.webmanifest'
        ]);
    });
});



self.addEventListener('fetch', event => {
    // console.log(event.request.url); 
    event.respondWith(
        fetch(event.request)
            .catch(() => {
                return caches.match(event.request)
                    .then(cachedResponse => {
                        return cachedResponse; 
                    }); 
            })
    )
})