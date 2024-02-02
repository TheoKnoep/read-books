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


    static async getCacheOccupation() {
        if (navigator.storage && navigator.storage.estimate) {
            return navigator.storage.estimate().then(function(estimate) {
                console.log('stockage : ', estimate); 
                // console.log("Espace utilisé: " + estimate.usage + " octets");
                // console.log("Quota total: " + estimate.quota + " octets");
                // console.log("Espace disponible: " + (estimate.quota - estimate.usage) + " octets");
                // console.log("details : ", estimate.usageDetails); 
                return {
                    'available': estimate.quota - estimate.usage,
                    'db': estimate.usageDetails.indexedDB, 
                    'cache': estimate.usageDetails.caches + estimate.usageDetails.serviceWorkerRegistrations
                }
            }).catch(function(error) {
                console.error("Erreur lors de l'estimation de l'espace de stockage : ", error);
                return {
                    'error': error
                }
            });
            } else {
            console.error("L'API Storage n'est pas prise en charge dans ce navigateur.");
            return {
                'error': "storage API not supported"
            }
        }
    }
}