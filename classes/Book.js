class Book {
	constructor(title, author, publisher, description, miniature_link, isbn, rate, comment, format, google_id, series, series_number, language, added_date, status, started_date, finished_date, owned, reading_log) {
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
		this.reading_log = reading_log; 
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
		this.status = 'finished';
		if (!this.finished_date) { 
			this.finished_date = Date.now();
		}
		 
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


	getPurchaseLink() {
		let url = "https://www.placedeslibraires.fr";

		const formatString = (string) => {
			let regex = new RegExp(',| |, '); 
			return encodeURI( string.split(regex).join('+').replaceAll('++', '+')); 
		}


		if (this.isbn[0].toString() === '9') {
			return url + '/livre/' + this.isbn; 
		} 

		return `${url}/listeliv.php?form_recherche_avancee=ok&base=allbooks&titre=${formatString(this.title)}&titre1=${formatString(this.title)}&auteurs=${formatString(this.author)}&auteurs1=${formatString(this.author)}&dispo=1%2C2&select_tri_recherche=pertinence`; 
	}

	recordReadingSession() {
		if (!this.reading_log) {
			this.reading_log = []; 
		}
		this.reading_log.push({start: Date.now(), end: null}); 
	}
	stopReadingSession() {
		this.reading_log[this.reading_log.length-1].end = Date.now(); 
	}
	
	readingSessionIsOnGoing() {
		if (!this.reading_log) { return false }
		if (this.reading_log[this.reading_log.length-1].end === null ) { 
			return true; 
		} else {
			return false; 
		}
	}

	calculateReadingTime() {
		if (!this.reading_log) { return 0 }; 
		let output = 0; 
		this.reading_log.forEach(entry => {
			if (entry.end) {
				output += entry.end - entry.start; 
			}
		}); 

		console.log(Time.formatMs(output)); 
		return output; 
	}


	formatStatistics() {
		let s = this.reading_log; 
		let output = {}; 
		s.forEach(s => {
			let dayTs = Time.getTimestampOfTheDay(s.start); 
			if (output[ dayTs ]) {
				output[ dayTs ].push({start: s.start, end: s.end}); 
			} else {
				output[ dayTs ] = [{start: s.start, end: s.end}]; 
			}
		})

		return output; 

		//
	}
}