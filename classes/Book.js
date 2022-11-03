class Book {
	constructor(title, author, publisher, description, miniature_link, isbn, rate, comment, format, google_id, series, series_number, language, added_date, status, started_date, finished_date) {
		this.title = title; 
		this.author = author; 
		this.publisher = publisher; 
		this.description = description; 
		this.miniature_link = miniature_link; 
		this.isbn = isbn; 
		this.rate = rate; 
		this.comment = comment; 
		this.format = format; 
		this.google_id = google_id; 
		this.series = series; 
		this.series_number = series_number; 
		this.language = language; 
		this.added_date = added_date; 
		this.status = 'to-read'; 
		this.started_date = started_date; 
		this.finished_date = finished_date; 
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