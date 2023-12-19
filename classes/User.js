const THIS_CONFIG = {
	'storage_name': '_tok_vghfT', 
	'api_source': 'https://theoknoepflin.com/read-books-api/index.php?route='
}; 

class User {
    constructor() {
        this.state = 'pending'; 
        // this.testAuthentification(); 
        this.testUserConnexion(); 
    }

    is_logged() {
        return new Promise(resolve => {
            if (this.state !== 'pending') {
                resolve(this.state); 
            } else {
                window.addEventListener('loginCompleted', event => {
                    resolve(this.state)
                })
            }
        })
    }

    async testAuthentification() {
        let randomTime = Math.random() * 10 * 1000; 
        setTimeout(() => {
            if (Math.random() > .5) {
                this.state = true; 
            } else {
                this.state = false; 
            }
            window.dispatchEvent(new Event('loginCompleted')); 
        }, randomTime)
    }

    async testUserConnexion() {
        let url = THIS_CONFIG.api_source; 
        let token = this.retrievedToken(); 
        if (!token) {
            console.log('PAS DE TOKEN DE SESSION'); 
            this.state = false; 
        } else {
            let response = await fetch(url + 'auth' + '&token=' + token); 
            let text = await response.text(); 
            console.log('test session', text); 
            console.log(JSON.parse(text)); 
            let result = JSON.parse(text); 
            this.state = result.success; 
            Cache.addToCache(url + 'auth' + '&token=' + token); 
        }
        window.dispatchEvent(new Event('loginCompleted')); 
    }

    async authentifyUser(login, password) {
        let data = new FormData(); 
        data.append('login', login); 
        data.append('password', password); 
    
        let options = {
            method: 'POST'
        }
        options.body = data; 
        let url = THIS_CONFIG.api_source; 
        
        return fetch(url + 'auth', options)
            .then(res => res.text())
            .then(res => { 
                console.log(res); 
                console.log(JSON.parse(res));
                let result = JSON.parse(res); 
                if (result.success) {
                    saveToken(result.token); 
                    return { success: true }
                } else {
                    localStorage.removeItem(CONFIG.storage_name); 
                    return { success: false }
                }
                })
            .catch(err => console.log(err)); 
    }

    saveToken(token) {
        localStorage.setItem(THIS_CONFIG.storage_name, token); 
    }
    
    retrievedToken() {
        return localStorage.getItem(THIS_CONFIG.storage_name) || null; 
    }
    
    deleteSession() {
        localStorage.removeItem(THIS_CONFIG.storage_name); 
        location.reload(); 
    }
}