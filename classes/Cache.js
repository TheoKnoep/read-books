class Cache {
    static config() {
        return {
            cache_name: "svg-read-list"
        }
    }

    static getCachename() {
        return this.config().cache_name; 
    }
}