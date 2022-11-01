const searchForm = document.querySelector('#search-form'); 
const DEFAULT_RESULTS_NUMBER = 5;


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

	console.log(data); 
	console.log("Résultats : " + data.totalItems); 
	console.log(data.items); 

	let resultsBooks = []; 

	data.items.forEach(book => {
		let i = book.volumeInfo; 
		resultsBooks.push(new Book(
			i.title,
			i.authors ? i.authors.join(',') : '', 
			i.publisher,  
			i.description, 
			i.imageLinks ? i.imageLinks.thumbnail : "images/default_image.png", 
			i.industryIdentifiers ? i.industryIdentifiers[0].identifier : '',
			book.id
		))
	})

	console.log(resultsBooks); 

	let newInsert = ''; 
	resultsBooks.forEach(book => {
		console.log(writeBookCard(book)); 
		newInsert += writeBookCard(book); 
	})

	let newBlock = `<div id="search-results">${newInsert}</div>`; 

	if (document.getElementById('search-results')) { document.getElementById('search-results').remove() }

	searchForm.insertAdjacentHTML('afterend', newBlock); 
	
}

function writeBookCard(book) {
	let template = `<article>
		<div><img width="200" src="${book.miniature_link}" /><div>	
		<div>
			<h3>${book.title}</h3>
			<h4>${book.author}</h4>
			<small>${book.description}</small>
			<p><strong>${book.publisher}</strong></p>
			<button onclick="">Ajouter</button>
		</div>
	</article>`; 

	return template; 
}