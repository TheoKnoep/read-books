const readingList = document.querySelector('#reading-list-content'); 


if ('content' in document.createElement('template')) {
    displayBooksOfWishlist(); 
} else {
    console.log('hoooon'); 
}


function displayBooksOfWishlist() {
    const reset = () => {
        let elts = document.querySelectorAll('#reading-list-content .book-entry');
        elts.forEach(elt => elt.remove() ); 
    }
    // reset(); 

    const listOfBooks = wishlist.books; 
    const bookListContainer = document.querySelector('#reading-list-content'); 

    const template = document.querySelector('#book-item-template'); 

    let counter = 0; 
    listOfBooks.forEach(book => {
        const clone = template.content.cloneNode(true); 

        clone.querySelector('article').id = book.isbn; 
        clone.querySelector('img').src = book.miniature_link; 
        clone.querySelector('.title').textContent = book.title; 
        clone.querySelector('.author').textContent = book.author; 
        clone.querySelector('.description').textContent = book.description; 
        clone.querySelector('.publisher strong').textContent = book.publisher; 
        clone.querySelector('button').id =  book.isbn; 
    
        bookListContainer.appendChild(clone); 
        counter++; 
    })

    // Handle view description : 
    const allBooks = document.querySelectorAll('#reading-list-content .book-entry'); 
	for (let i = 0 ; i < allBooks.length; i++ ) {
		allBooks[i].addEventListener('click', event => {
			// allEntries[i].querySelector('.description').classList.toggle('displaynone'); 
			allBooks[i].querySelector('.description').classList.toggle('maxheight0'); 
		})
	}

	// Handle CTA : 
    const allDeleteBtn = document.querySelectorAll('#reading-list-content .book-entry button');
	for (let i = 0 ; i < allDeleteBtn.length; i++ ) {
		allDeleteBtn[i].addEventListener('click', event => {
			event.stopPropagation(); 
            Utils.getParentOfClass(event.target, 'book-entry').remove(); 
            wishlist.remove(Utils.getParentOfClass(event.target, 'delete-btn').id); 
			new QuickToast("Supprimé !", 3000).display(); 
		})
	}
}