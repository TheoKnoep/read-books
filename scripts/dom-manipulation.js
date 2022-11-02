const openSearchButton = document.querySelector('#open-search-btn'); 
const HTMLform = document.querySelector('#search-form'); 
const HTMLreadingList = document.querySelector('#reading-list'); 

openSearchButton.addEventListener('click', event => {
	HTMLform.classList.toggle('displaynone'); 
	HTMLreadingList.classList.toggle('displaynone'); 
	openSearchButton.classList.toggle('active'); 
	if (document.querySelector("#search-results")) { document.querySelector("#search-results").remove() }
})