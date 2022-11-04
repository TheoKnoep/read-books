class Cache {
    static config() {
        return {
            cache_name: "read-list"
        }
    }

    static getCachename() {
        return this.config().cache_name; 
    }

    static async addToCache(request) {
        caches.open(this.config().cache_name)
            .then(cache => {
                cache.add(request); 
            })
    }

    static async svgID(arrayOfBooks) {
        let idsList = []; 
        arrayOfBooks.forEach(book => idsList.push(book.google_id)); 
        let idsString = idsList.join(';'); 

        console.log('./#?list=' + idsString); 

        caches.open('svg-read-list')
            .then(cache => {
                cache.add('?list=' + idsString)
                    .then(() => {
                        cache.keys()
                            .then(res => console.log(res)); 
                    })
            })
    }

    static async debugCacheAddAll(array) {
        array.forEach(req => {
            fetch(req) 
                .then((res) => console.log('ok :: ', req))
                .catch(err => console.log('ERR :: ', req)); 
        });
    }
}