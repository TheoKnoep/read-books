/** Last update: 2025.04.07.001
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
            'classes/Time.js',
            'classes/indexeddb.js',
            'classes/User.js',

            'scripts/auth.js',
            'scripts/dom-manipulation.js',
            'scripts/search-book.js',
            'scripts/images.js',

            'manifest.webmanifest', 
            'images/icons/icon_512x512.png',
            'images/icons/icon_maskable.png', 
            'images/empty-cover.png',
            'images/bg-featured.png', 
            'images/bg-grain-l.png', 
            'images/bg-grain-d.png'
        ]);
    });
});



self.addEventListener('fetch', event => {
    // console.log(new URL(event.request.url).origin === "https://theoknoepflin.com"); 
    if (new URL(event.request.url).origin === "https://theoknoepflin.com") {
        event.respondWith(
            caches.match(event.request)
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse; 
                    } else {
                        return fetch(event.request)
                        .then(res => {
                            return res; 
                        }); 
                    }
                })
                // .catch(() => {
                //     console.log('boo'); 
                //     return fetch(event.request)
                //         .then(res => {
                //             console.log('res', res); 
                //             return res; 
                //         }); 
                // })
        )
    } else {
        event.respondWith( // network first strategy
            fetch(event.request)
                .catch(() => {
                    return caches.match(event.request)
                        .then(cachedResponse => {
                            return cachedResponse; 
                        }); 
                })
        )
    }
})