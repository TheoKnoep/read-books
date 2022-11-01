class Wishlist {
	constructor() {
		this.books = JSON.parse(localStorage.getItem('wishlist')) || []; 	
	}

	addBook(newBook) {
		this.books.push(newBook); 
	}

	saveWishlist() {
		localStorage.setItem('wishlist', JSON.stringify(this.books)); 
	}
}