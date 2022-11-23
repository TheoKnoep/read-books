class Wishlist {
	constructor() {
		this.books = this.initWishlist(); 	
	}

	initWishlist() {
		const local = localStorage.getItem('wishlist'); 
		if (!local) { return [] }; 

		let output = []; 
		let fromLocal = JSON.parse(localStorage.getItem('wishlist')); 
		fromLocal.forEach(book => {
			let newBook = new Book(
				book.title, 
				book.author, 
				book.publisher, 
				book.description, 
				book.miniature_link, 
				book.isbn, 
				book.rate, 
				book.comment, 
				book.format, 
				book.google_id, 
				book.series, 
				book.series_number, 
				book.language, 
				book.added_date, 
				book.status, 
				book.started_date, 
				book.finished_date, 
				book.owned, 
				book.reading_log
			); 
			output.push(newBook); 
		})
		return output; 
	}

	add(newBook) {
		console.log(this.checkForDoublon(newBook)); 
		if (this.checkForDoublon(newBook)) {
			return false; 
		} else {
			this.books.push(newBook); 
			this.saveWishlist(); 
			return true; 
		}
	}

	remove(ID) {
		let index = this.getIndexOfSingleBookByID(ID); 

		if (index === null) { throw Error('ID not found') }
		
		this.books.splice(index, 1); 
		this.saveWishlist(); 
	}

	saveWishlist() {
		localStorage.setItem('wishlist', JSON.stringify(this.books)); 
	}

	getAllBooksByStatus(status) {
		let output = []; 
		this.books.forEach(book => {
			if (book.status === status) { output.push(book) }
		})
		return output; 
	}

	getIndexOfSingleBookByISBN(isbn) {
		for (let i = 0; i < this.books.length; i++) {
			if (this.books[i].isbn == isbn) {
				return i; 
			} 
		}
		return null;
	}

	getIndexOfSingleBookByID(ID) {
		for (let i = 0; i < this.books.length; i++) {
			if (this.books[i].google_id == ID) {
				return i; 
			} 
		}
		return null;
	}


	getListOfIDs() {
		let res = []; 
		this.books.forEach(book => res.push(book.google_id));
		return res; 
	}

	static empty() {
		this.books = []; 
		localStorage.setItem('wishlist', ''); 
	}


	checkForDoublon(new_book) {
		if (!Book.prototype.isPrototypeOf(new_book)) { return new Error('Parameter is not Book type') }
		let res = false; 
		this.books.forEach(existing_book => {; 
			if (new_book.isbn === existing_book.isbn) { res = true }
		})
		return res; 
	}
	checkForDoublonByID(new_book) {
		if (!Book.prototype.isPrototypeOf(new_book)) { return new Error('Parameter is not Book type') }
		let res = false; 
		this.books.forEach(existing_book => {; 
			if (new_book.google_id === existing_book.google_id) { res = true }
		})
		return res; 
	}



	exportToCSV() {
		let head = `Titre;Auteurs;Edition`; 
	}

	importFromJSON(stringifiedJSON) {
		let data = JSON.parse(stringifiedJSON); 
		console.log(data); 

		// Verify input : 
		data.forEach((book, index) => {
			if (
				'title' in book &&
				'author' in book &&
				'publisher' in book &&
				'description' in book &&
				'miniature_link' in book &&
				'isbn' in book &&
				'rate' in book &&
				'comment' in book &&
				'format' in book &&
				'google_id' in book &&
				'series' in book &&
				'series_number' in book &&
				'language' in book &&
				'added_date' in book &&
				'status' in book &&
				'started_date' in book &&
				'finished_date' in book 
			) {
				// all keys are ok : continue
			} else {
				throw new Error('Corrupted JSON at ' + index ); 
			} 

			if (!book.google_id) {
				throw new Error('No GOOGLE_ID at ' + index ); 
			}
		}); 


		

		// execute import : 
		data.forEach(book => {
			let newBook = new Book(
				book.title, 
				book.author, 
				book.publisher, 
				book.description, 
				book.miniature_link, 
				book.isbn, 
				book.rate, 
				book.comment, 
				book.format, 
				book.google_id, 
				book.series, 
				book.series_number, 
				book.language, 
				book.added_date, 
				book.status, 
				book.started_date, 
				book.finished_date, 
				book.owned
			); 
			this.add(newBook); 
		})
	}






	readingSessionIsOnGoing() {
		for (let i in this.books) {
			if (this.books[i].readingSessionIsOnGoing()) {
				return i; 
			}
		}
		return null; 
	}





	
}