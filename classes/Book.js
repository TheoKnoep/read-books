class Book {
	constructor(title, author, publisher, description, miniature_link, isbn, rate, comment, format, google_id, series, series_number, language, added_date, status, started_date, finished_date, owned) {
		this.title = title; 
		this.author = author; 
		this.publisher = publisher; 
		this.description = description; 
		this.miniature_link = miniature_link; 
		this.isbn = isbn; 
		this.rate = Number(rate); 
		this.comment = comment; 
		this.format = format; 
		this.google_id = google_id; 
		this.series = series; 
		this.series_number = series_number; 
		this.language = language; 
		this.added_date = added_date; 
		this.status = this.verifyStatus(status); // "to-read", "started" or "finished"
		this.started_date = started_date; 
		this.finished_date = finished_date; 
		this.owned = owned; 
	}


	verifyStatus(status) {
		let authorizedValues = ["to-read", "started", "finished"]; 
		if ( authorizedValues.indexOf(status) < 0 ) {
			throw new Error('Unathorized status for this book'); 
		}
		return status; 
	}

	writeStatus() {
		const transl = {
			"to-read": "à lire", 
			"started": "en cours", 
			"finished": "terminé"
		}; 
		return transl[this.status]; 
	}

	updateStatus(state) {
		const lifeCycle = {
			1: "to-read", 
			2: "started", 
			3: "finished"
		}
		this.status = lifeCycle[state]; 

		if (this.status === lifeCycle[state]) { return true } else { return false }
	}

	startTheReading() {
		if (this.started_date) { throw new Error('started date already exixts') }

		this.status = 'started', 
		this.started_date = Date.now(); 
	}

	finishTheReading() {
		if (this.finished_date) { throw new Error('finished date already exixts') }

		this.status = 'finished', 
		this.finished_date = Date.now(); 
	}

	reinitReading() {
		this.status = 'to-read';
		this.started_date = null;
		this.finished_date = null;  
	}

	changeOwnedInfo(bool) {
		if (!typeof bool === "boolean") { throw new Error('Invalid paramter format :: requires Boolean') }
		if (bool) {
			this.owned = true; 
		} else {
			this.owned = false; 
		}
	}
}