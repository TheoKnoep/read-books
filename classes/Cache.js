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

    static async debugCacheAddAll(array) {
        array.forEach(req => {
            fetch(req) 
                .then((res) => console.log('ok :: ', req))
                .catch(err => console.log('ERR :: ', req)); 
        });
    }
}