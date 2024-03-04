class Wishlist {
	constructor() {
		this.books = []; 

		this.storage = {
			dataBase: 'read-books-app', 
			storeObject: 'books', 
			version: '1'
		}; 
	}

	async initWishlist() {
		let output = []; 


		/* LEGACY FROM LOCALSTORAGE : */
		this.transitionLocaStorageToIndexedDB(); 
		/* END legacy from localStorage */


		let fromIndexedDB = await this.retrievedFromIndexedDB(); 
		fromIndexedDB.forEach(book => {
			let newBook = new Book(
				book
			); 
			output.push(newBook); 
		})

		// return output; 
		this.books = output; 
	}

	async add(newBook) {
		// console.log(this.checkForDoublon(newBook)); 
		if (this.checkForDoublon(newBook)) {
			return false; 
		} else {
			this.books.push(newBook); 
			newBook.handleCoverInCache('add'); 
			await this.saveWishlist(); 
			return true; 
		}
	}

	remove(ID) {
		let index = this.getIndexOfSingleBookByID(ID);
		let bookToDelete = this.books[index]; 
		let isbn = bookToDelete.isbn; 
		console.log('suppressions de l\'isbn : ', isbn); 

		bookToDelete.handleCoverInCache('delete')

		if (index === null) { throw Error('ID not found') }
		
		this.books.splice(index, 1); 
		this.saveWishlist(); 

		let db = new IndexedDB('read-books-app', 'books', '1'); 
		db.deleteData(isbn); 
	}

	saveWishlistLegacy() {
		localStorage.setItem('wishlist', JSON.stringify(this.books)); 
	}

	transitionLocaStorageToIndexedDB() {
		let fromLocal = JSON.parse(localStorage.getItem('wishlist')); 
		if (fromLocal && fromLocal.length > 0) {
			fromLocal.forEach(book => {
				let newBook = new Book(	book ); 
				this.add(newBook); 
			}); 
			this.saveWishlist(); 
			localStorage.removeItem('wishlist'); 
		} 
	}


	async saveWishlist() {
		let db = new IndexedDB('read-books-app', 'books', '1'); 
		// console.log(db); 

		// delete missing wishlist entries 

		let tableOfPromisses = []; 
		this.books.forEach(book => {
			tableOfPromisses.push(db.setData(book.isbn, JSON.stringify(book))); 
		})
		return Promise.all(tableOfPromisses)
			.then(res => {
				return res; 
			})

	}

	async deleteAllBooksFromIndexedDB() {
		let db = new IndexedDB('read-books-app', 'books', '1'); 
		return db.getListOfKeys().then(res => {
			let promisses = []; 
			res.forEach(key => {
				promisses.push(db.deleteData(key))
			})
			return Promise.all(promisses)
				.then(res => {
					return res; 
				})
		})
	}

	async retrievedFromIndexedDB() {
		let db = new IndexedDB('read-books-app', 'books', '1'); 
		return db.getListOfKeys().then(res => {
			let tableOfPromisses = []; 
			res.forEach(key => {
				tableOfPromisses.push(db.getData(key)); 
			})
			return Promise.all(tableOfPromisses)
				.then(res => {
					return res; 
				})
		}); 
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
				console.log('JSON ???', book); 
				console.log('Verification model d import : ', 
					'title' in book,
					'author' in book,
					'publisher' in book,
					'description' in book,
					'miniature_link' in book,
					'isbn' in book,
					'rate' in book,
					'comment' in book,
					'format' in book,
					'google_id' in book,
					'series' in book,
					'series_number' in book,
					'language' in book,
					'added_date' in book,
					'status' in book,
					'started_date' in book,
					'finished_date' in book 
				);
				// throw new Error('Corrupted JSON at ' + index ); 
			} 

			if (!book.google_id) {
				throw new Error('No GOOGLE_ID at ' + index ); 
			}
		}); 


		// execute import : 
		data.forEach(book => {
			let newBook = new Book( book ); 
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





	/**
	 * Legacy : to transform links of books miniatures with
	 * the API cover link, and therefor put them in cache
	 */
	update_minature_cover_with_new_API_link() {
		this.books.forEach(book => {
			let at_least_one_update = false; 
			try {
				let cover_url = new URL(book.miniature_link); 

				let miniature_link_is_base64 = book.miniature_link.substring(0,11) === 'data:image/'; 

				if ( cover_url.host.includes('theoknoepflin.com') === false && !miniature_link_is_base64 ) { 
					console.log('>>> change URL link of cover for : ', book.title, book.google_id); 
					book.miniature_link = `https://theoknoepflin.com/read-books-api/cover.php?id=${book.google_id}`;
					book.handleCoverInCache('add'); 
					at_least_one_update = true; 
				}
			} catch(err) {
				// console.log('--no url'); 
			}

			if (at_least_one_update) { new QuickToast('Les liens des miniatures de couverture ont été mis à jour 👍').display({ delay: 10000 }); }
		}); 
		
		this.saveWishlist(); 
	}







	
}