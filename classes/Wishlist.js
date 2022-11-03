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
				book.finished_date
			); 
			output.push(newBook); 
		})
		return output; 
	}

	add(newBook) {
		this.books.push(newBook); 
		this.saveWishlist(); 
	}

	remove(isbn) {
		let index = this.getIndexOfSingleBookByISBN(isbn); 
		if (!index) { return new Error('ISBN not found') }
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

	static testAlert(elt) {
		console.log(elt);  

	}

	static empty() {
		localStorage.setItem('wishlist', ''); 
	}


	checkForDoublon(new_book) {
		if (!Book.prototype.isPrototypeOf(new_book)) { return new Error('Parameter is not Book type') }
		let res = false; 
		this.books.forEach(existing_book => {; 
			if (new_book === existing_book) { res = true }
		})
		return res; 
	}
}