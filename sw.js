/**
 * Last update: 202211071452
 */

self.addEventListener("install", function (event) {
    caches.open('read-list').then(function(cache) {
        return cache.addAll([
            './',
            'style.css', 
            'simplecss.css',  
            'classes/Cache.js',
            'classes/View.js',
            'classes/UX.js',
            'classes/Book.js',
            'classes/Wishlist.js',
            'classes/Utils.js',
            'scripts/dom-manipulation.js',
            'scripts/search-book.js',
            'manifest.webmanifest', 
            'images/icons/icon_512x512.png',
            'images/icons/icon_maskable.png'
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