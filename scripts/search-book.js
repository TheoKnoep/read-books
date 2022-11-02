const searchForm = document.querySelector('#search-form'); 
const DEFAULT_RESULTS_NUMBER = 10;


// !dev-only : 
// displaySearchResults("france sélection", 10, true); 
// ****************

searchForm.addEventListener('submit', event => {
	event.preventDefault(); 
	let data = new FormData(searchForm); 
	const query = data.get('query'); 
	displaySearchResults(query, DEFAULT_RESULTS_NUMBER, true); 
})


async function displaySearchResults(query, maxResults, onlyThumbnails = false) {
	const resultsBooks = await fetchBooksInformations(query, maxResults, onlyThumbnails); 

	let newInsert = ''; 
	for (let i in resultsBooks) {
		newInsert += writeBookCard(resultsBooks[i], i); 
	}

	let newBlock = `<div id="search-results">${newInsert}</div>`; 

	if (document.getElementById('search-results')) { document.getElementById('search-results').remove() }

	searchForm.insertAdjacentHTML('afterend', newBlock); 

	const allEntries = document.querySelectorAll(".book-entry"); 
	const allEntriesBtn = document.querySelectorAll(".book-entry button"); 

	// Handle view description : 
	for (let i = 0 ; i < allEntries.length; i++ ) {
		allEntries[i].addEventListener('click', event => {
			// allEntries[i].querySelector('.description').classList.toggle('displaynone'); 
			allEntries[i].querySelector('.description').classList.toggle('maxheight0'); 
		})
	}

	// Handle CTA : 
	for (let i = 0 ; i < allEntriesBtn.length; i++ ) {
		allEntriesBtn[i].addEventListener('click', event => {
			event.stopPropagation(); 
			wishlist.add(resultsBooks[event.target.id]); 
			new QuickToast("Livre ajouté à la wishlist", 3000).display();
		})
	}
}

async function fetchBooksInformations(query, maxResults, onlyThumbnails = false) {
	const url = "https://www.googleapis.com/books/v1/volumes?q="; 

	const response = await fetch(url + query + "&maxResults=40"); 
	const data = await response.json(); 
	// console.log("data items : ", data.items); 

	let resultsBooks = []; 
	if (onlyThumbnails) {
		for (let i = 0; i < data.items.length; i++) {
			let b = data.items[i].volumeInfo; 
			if (b.imageLinks) {
				resultsBooks.push(new Book(
					b.title,
					b.authors ? b.authors.join(',') : '', 
					b.publisher,  
					b.description, 
					b.imageLinks ? b.imageLinks.thumbnail : "images/empty.svg", 
					b.industryIdentifiers ? b.industryIdentifiers[0].identifier : '',
					data.items[i].id
				))
			}
			if (resultsBooks.length >= maxResults) { break; }
		}
	} else {
		for (let i = 0; i < maxResults; i++) {
			let b = data.items[i].volumeInfo; 
			resultsBooks.push(new Book(
				b.title,
				b.authors ? b.authors.join(',') : '', 
				b.publisher,  
				b.description, 
				b.imageLinks ? b.imageLinks.thumbnail : "images/empty.svg", 
				b.industryIdentifiers ? b.industryIdentifiers[0].identifier : '',
				data.items[i].id
			))
		}
	}
	// console.log(resultsBooks); 

	return resultsBooks; 
	
}

function writeBookCard(book, index) {
	let template = `<article class="book-entry" id="book-${index}">
		<div><img width="80" src="${book.miniature_link}" /></div>	
		<div class="info-container">
			<h3 class="title">${book.title}</h3>
			<h4 class="author">${book.author}</h4>
			<p class="description maxheight0">${book.description}</p>
			<p class="publisher"><strong>${book.publisher}</strong></p>
		</div>
		<div class="cta-container">
			<button id="${index}">+</button>
		</div>
	</article>`; 

	return template; 
}