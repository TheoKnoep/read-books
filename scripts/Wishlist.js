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
				book.started,
				book.finished, 
				book.rate, 
				book.comment,
				book.format,
				book.status, 
				book.google_id,
				book.series,
				book.series_number, 
				book.language
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
		let index = this.getSingleBookByISBN(isbn); 
		this.books.splice(index, 1); 
		this.saveWishlist(); 
		new QuickToast('Supprimée avec succès').display(); 
	}

	saveWishlist() {
		localStorage.setItem('wishlist', JSON.stringify(this.books)); 
	}

	getAllBooksByStatus(status) {
		console.log('status ', status); 
		let output = [...this.books]; 
		// console.log("filter ", output); 
		// output.forEach(book => console.log(book.status)); 
		return output.filter(book => {
			console.log(book.status); 
			book.status == status; 
		})
	}

	getSingleBookByISBN(isbn) {
		for (let i = 0; i < this.books.length; i++) {
			if (this.books[i].isbn == isbn) {
				return i; 
			}
			return null; 
		}
	}

	static testAlert(elt) {
		console.log(elt);  

	}

	static empty() {
		localStorage.setItem('wishlist', ''); 
	}
}