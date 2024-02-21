class Book {
	constructor(options = {}) {
		this.title = options.title || null; 
		this.author = options.author || null; 
		this.publisher = options.publisher || null; 
		this.description = options.description  || 'Pas de description'; 
		this.miniature_link = options.miniature_link || 'images/empty-cover.png'; 
		this.isbn = options.isbn || Utils.generateGUID(); 
		this.rate = Number(options.rate) || null; 
		this.comment = options.comment || null; 
		this.format = options.format || null; 
		this.google_id = options.google_id || Utils.generateGUID(); 
		this.series = options.series || null; 
		this.series_number = options.series_number || null; 
		this.language = options.language || null; 
		this.added_date = options.added_date || Date.now(); 
		this.status = this.verifyStatus(options.status || 'to-read'); // "to-read", "started" or "finished"
		this.started_date = options.started_date || null; 
		this.finished_date = options.finished_date || null; 
		this.owned = options.owned  || false; 
		this.reading_log = options.reading_log || null; 
		this.progression = options.progression || {current: null, max: null }; 
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


	handleCoverInCache(action) {
		let cache_name = 'read-list-covers'; 
		switch (action) {
			case 'add': 
				if (this.miniature_link !== "images/empty-cover.png") {
					caches.open(cache_name)
						.then(cache => cache.add(this.miniature_link));
				}
				break; 
			case 'delete': 
			caches.open(cache_name)
				.then(cache => cache.delete(this.miniature_link));
				break;
			default: 
				console.log('no parameter'); 
		}
	}
}