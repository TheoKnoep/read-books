class Wishlist {
	constructor() {
		this.books = this.initWishlist(); 	
	}

	initWishlist() {
		const local = localStorage.getItem('wishlist'); 
		let output = []; 
		if (local) { 
			output = JSON.parse(localStorage.getItem('wishlist')); 
		}
		return output; 
	}

	add(newBook) {
		this.books.push(newBook); 
		this.saveWishlist(); 
	}

	saveWishlist() {
		localStorage.setItem('wishlist', JSON.stringify(this.books)); 
	}

	getBooksByStatus(status) {
		console.log('status ', status); 
		let output = [...this.books]; 
		// console.log("filter ", output); 
		// output.forEach(book => console.log(book.status)); 
		return output.filter(book => {
			console.log(book.status); 
			book.status == status; 
		})
	}

	static testAlert(elt) {
		console.log(elt);  

	}

	static empty() {
		localStorage.setItem('wishlist', ''); 
	}
}