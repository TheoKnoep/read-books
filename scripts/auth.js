const CONFIG = {
	'storage_name': '_tok_vghfT', 
	'api_source': 'http://theokne.cluster021.hosting.ovh.net/index.php?route='
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
				return { success: false }
			}
			})
		.catch(err => console.log(err)); 
}