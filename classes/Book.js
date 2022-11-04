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
		this.status = status; 
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

	updateStatus(state) {
		const lifeCycle = {
			1: "to-read", 
			2: "on-going", 
			3: "finished"
		}
		this.status = lifeCycle[state]; 

		if (this.status === lifeCycle[state]) { return true } else { return false }
	}
}