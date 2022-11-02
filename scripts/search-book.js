const searchForm = document.querySelector('#search-form'); 
const DEFAULT_RESULTS_NUMBER = 5;


// !dev-only : 
// fetchBooksInformations("au guet", DEFAULT_RESULTS_NUMBER); 
// ****************

searchForm.addEventListener('submit', event => {
	event.preventDefault(); 

	let data = new FormData(searchForm); 
	console.log(data.get('query')); 

	const query = data.get('query'); 

	fetchBooksInformations(query, DEFAULT_RESULTS_NUMBER); 
})

async function fetchBooksInformations(query, maxResults) {
	const url = "https://www.googleapis.com/books/v1/volumes?q="; 

	const response = await fetch(url + query + "&maxResults=" + maxResults); 
	const data = await response.json(); 

	// console.log(data); 
	// console.log("Résultats : " + data.totalItems); 
	// console.log(data.items); 

	let resultsBooks = []; 

	data.items.forEach(book => {
		let i = book.volumeInfo; 
		resultsBooks.push(new Book(
			i.title,
			i.authors ? i.authors.join(',') : '', 
			i.publisher,  
			i.description, 
			i.imageLinks ? i.imageLinks.thumbnail : "images/empty.svg", 
			i.industryIdentifiers ? i.industryIdentifiers[0].identifier : '',
			book.id
		))
	})

	// console.log(resultsBooks); 

	let newInsert = ''; 
	for (let i in resultsBooks) {
		newInsert += writeBookCard(resultsBooks[i], i); 
	}

	let newBlock = `<div id="search-results">${newInsert}</div>`; 

	if (document.getElementById('search-results')) { document.getElementById('search-results').remove() }

	searchForm.insertAdjacentHTML('afterend', newBlock); 

	let allEntries = document.querySelectorAll(".book-entry button"); 
	console.log(allEntries); 

	for (let i = 0 ; i < allEntries.length; i++ ) {
		allEntries[i].addEventListener('click', event => {
			wishlist.add(resultsBooks[event.target.id]); 
			alert('Livre ajouté'); 
		})
	}
	
}

function writeBookCard(book, index) {
	let template = `<article class="book-entry" id="book-${index}">
		<div><img width="80" src="${book.miniature_link}" /></div>	
		<div class="info-container">
			<h3 class="title">${book.title}</h3>
			<h4 class="author">${book.author}</h4>
			<p class="description">${book.description}</p>
			<p class="publisher"><strong>${book.publisher}</strong></p>
		</div>
		<div class="cta-container">
			<button id="${index}">+</button>
		</div>
	</article>`; 

	return template; 
}