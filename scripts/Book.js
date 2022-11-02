class Book {
	constructor(title, author, publisher, description, miniature_link, isbn, google_id) {
		this.title = title; 
		this.author = author; 
		this.publisher = publisher; 
		this.description = description; 
		this.miniature_link = miniature_link; 
		this.isbn = isbn; 
		this.started = null; 
		this.finished = null; 
		this.rate = null; 
		this.comment = null; 
		this.format = null; 
		this.status = 'to-read'; 
		this.google_id = google_id; 
		this.series = null; 
		this.series_number = null; 
		this.language = null; 
	}

	viewBookInConsole() {
		console.log(`
Titre : ${this.title || ''}
Auteur : ${this.author || ''}
Edition : ${this.publisher || ''}
ISBN : ${this.isbn || ''}
Statut : ${this.writeStatus()}
Format : ${this.format}
		`); 
	}

	writeStatus() {
		const transl = {
			"to-read": "à lire", 
			"on-going": "en cours", 
			"finished": "terminé"
		}; 
		return transl[this.status]; 
	}

	testFunction() {
		alert("Boom"); 
	}

	updateStatus() {
		const lifeCycle = [
			"to-read", 
			"on-going", 
			"finished"
		]
		let currentStep = lifeCycle.indexOf(this.status); 

		if (currentStep < 2 ) { 
			this.status = lifeCycle[currentStep + 1 ]; 
		} 
	}
}