/**
 * Initial script for handling users and distant saves
 * Used in /save page
 * But duplicate with User.js, which will replace it in the end
 * Both are used for now
 */

const CONFIG = {
	'storage_name': '_tok_vghfT', 
	'api_source': 'https://theoknoepflin.com/read-books-api/index.php?route='
}; 

function saveToken(token) {
	localStorage.setItem(CONFIG.storage_name, token); 
}

function retrievedToken() {
	return localStorage.getItem(CONFIG.storage_name) || null; 
}

function deleteSession() {
	localStorage.removeItem(CONFIG.storage_name); 
	location.reload(); 
}

async function testUserConnexion() {
	let url = CONFIG.api_source; 
	let token = retrievedToken(); 
	if (!token) {
		console.log('PAS DE TOKEN DE SESSION'); 
		return { success: false, message: 'PAS DE TOKEN DE SESSION' }; 
	}
	let response = await fetch(url + 'auth' + '&token=' + token); 
	let text = await response.text(); 
	console.log('test session', text); 
	console.log(JSON.parse(text)); 
	let result = JSON.parse(text); 
	return result; 
}


async function authentifyUser(login, password) {
	let data = new FormData(); 
	data.append('login', login); 
	data.append('password', password); 

	let options = {
		method: 'POST'
	}
	options.body = data; 
	let url = CONFIG.api_source; 
	
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

async function saveJSONonline() {
	let jsonStr = JSON.stringify(wishlist.books); 
	let jsonFile = new Blob([jsonStr], { type: 'application/json' }); 
	let data = new FormData(); 
	data.append('json', jsonFile); 

	let token = retrievedToken(); 

	return fetch('https://theoknoepflin.com/read-books-api/?route=json&token=' + token, {
		method: 'POST', 
		body: data
	}).then(res => { 
		return res; 
	})
		// .then(text => {
		// 	console.log(text); 
		// 	console.log(JSON.parse(text)); 
		// 	let response = JSON.parse(text); 
		// 	if (response.success) {
		// 		new QuickToast('Sauvegarde en ligne réussie').display();
		// 	}
		// })
}