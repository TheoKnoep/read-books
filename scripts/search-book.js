const DEFAULT_RESULTS_NUMBER = 20;





async function displaySearchResults(query, maxResults, onlyThumbnails = false) {
	try {
		const resultsBooks = await fetchBooksInformations(sanitizeQuery(query), maxResults, onlyThumbnails); 

		let newInsert = ''; 
		for (let i in resultsBooks) {
			newInsert += writeBookCard(resultsBooks[i], i); 
		}

		document.getElementById('search-results').innerHTML = newInsert; 

		const allEntries = document.querySelectorAll("#search-results .book-entry"); 
		const allEntriesBtn = document.querySelectorAll("#search-results .book-entry button"); 

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
				if (wishlist.add(resultsBooks[event.target.id])) {
					// console.log(allEntriesBtn[i]); 
					allEntriesBtn[i].remove();
					new QuickToast("Livre ajouté à la wishlist", 3000).display();
				} else {
					new QuickToast('Ce livre est déjà votre wishlist', 3000).display(); 
				}
				
			})
		}
	} catch(err) {
		console.log('OMG cé la mérde', err); 
		new QuickToast('❌ désolé, la recherche a échoué', 6000).display(); 
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
					b.title, // title, 
					b.authors ? b.authors.join(',') : '', // authors
					b.publisher, // publisher, 
					b.description, // description, 
					b.imageLinks ? b.imageLinks.thumbnail : "images/empty.svg", // miniature_link, 
					b.industryIdentifiers ? b.industryIdentifiers[0].identifier : '', // isbn, 
					null, // rate, 
					null, // comment,
					null, // format, 
					data.items[i].id, // google_id, 
					null, // series, 
					null, // series_number, 
					b.language ? b.language : null, // language, 
					Date.now(), // added_date, 
					'to-read', // status, 
					null, // started_date, 
					null, // finished_date
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
			<p class="description maxheight0">${book.description || '<em>Pas de description disponible</em>'}</p>
			<p class="publisher"><strong>${book.publisher || '?'}</strong></p>
		</div>
		<div class="cta-container">
			<button id="${index}">+</button>
		</div>
	</article>`; 

	return template; 
}


function sanitizeQuery(query) {
	let sanitized_query = ''; 
	sanitized_query = query.replaceAll('-', ''); 
	sanitized_query = encodeURI(sanitized_query); 
	return sanitized_query; 
}


let singleBookJSON = {
	"volumeInfo": {
		"title": "Alexandre le Grand et les Aigles de Rome",
		"authors": [
		  "Javier Negrete"
		],
		"publisher": "L'Atalante",
		"publishedDate": "2017-05-17",
		"description": "\u003cp\u003eAlexandre le Grand est mort à Babylone le 28 daisios au soir, c’est-à-dire le 10 juin de l’an 323 avant J.-C., à l’âge de trente-trois ans.\u003c/p\u003e \u003cp\u003eAlexandre le Grand ne meurt pas ce jour-là. Un mystérieux médecin qui se dit envoyé par l’oracle de Delphes le sauve d’une tentative d’empoisonnement.\u003c/p\u003e \u003cp\u003eSix ans plus tard, Alexandre a tourné son regard vers l’Occident. Sur le chemin de ses nouvelles conquêtes se dresse alors la république de Rome, tout autant que lui convaincue de la grandeur de son destin. Qui des phalanges macédoniennes et des légions romaines aura la suprématie ?\u003c/p\u003e \u003cp\u003eEntre l’histoire, l’uchronie et la fantasy, \u003cb\u003eJavier Negrete\u003c/b\u003e revisite l’Antiquité, nourri par sa culture de la Grèce classique, sa passion des destins exceptionnels et son attention portée aux êtres qui les subissent.\u003c/p\u003e",
		"industryIdentifiers": [
		  {
			"type": "ISBN_10",
			"identifier": "2367931518"
		  },
		  {
			"type": "ISBN_13",
			"identifier": "9782367931517"
		  }
		],
		"readingModes": {
		  "text": true,
		  "image": true
		},
		"pageCount": 720,
		"printedPageCount": 461,
		"printType": "BOOK",
		"categories": [
		  "Fiction / Science Fiction / General"
		],
		"maturityRating": "NOT_MATURE",
		"allowAnonLogging": true,
		"contentVersion": "1.26.22.0.preview.3",
		"panelizationSummary": {
		  "containsEpubBubbles": false,
		  "containsImageBubbles": false
		},
		"imageLinks": {
		  "smallThumbnail": "http://books.google.com/books/publisher/content?id=vVeGAQAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&imgtk=AFLRE73gXWH9xbvzsV_5DdbykETj7_jGXmLddbxe_6-re1creD96yaY_s3C6LoVwJ4ZZ2lnQ8zfNIfBQFK3lY8PPuVuv8itNzC1NqbJ4fgc_JngPm-IBqH5o-WhK1QohjjglGVGOl6vf&source=gbs_api",
		  "thumbnail": "http://books.google.com/books/publisher/content?id=vVeGAQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE73UJelDc5ji0R9qPJyqonIiNX7X-5-IlROqX_Dl7XA0HPg4jAnzaDlRNDhZyh7X8vJKS1shvU06s0LCfVfKAZwcwdUdJW3jPa_tvuBai8nNMuzlwMaZqL7-OySxhzRLPyv5JFle&source=gbs_api",
		  "small": "http://books.google.com/books/publisher/content?id=vVeGAQAAQBAJ&printsec=frontcover&img=1&zoom=2&edge=curl&imgtk=AFLRE72uBZv03E60157ttwpGVfPbUL5uVrbm0IwQhBJ2JeypIvNORIAvihtjwWCb8tNt7A5pvmubQLZi6YAgJprkjTCoHR6IGfq96FpaUmIL7qc3bVvOsGsQ8l6ELl2bA2NM4RYFXaIr&source=gbs_api",
		  "medium": "http://books.google.com/books/publisher/content?id=vVeGAQAAQBAJ&printsec=frontcover&img=1&zoom=3&edge=curl&imgtk=AFLRE712JvSBTLUEhvjVaXkL55p6t5VDN9UpJZmCeElJwh-iGa7enahb4QA-ZOJqnWBNos146z-1aj6GqULtIjusR4U6ASuOl1e0syjUol_fTOVfp-HT0alrbkC2d0IbKquw4DYwBeTd&source=gbs_api",
		  "large": "http://books.google.com/books/publisher/content?id=vVeGAQAAQBAJ&printsec=frontcover&img=1&zoom=4&edge=curl&imgtk=AFLRE73MHpSR1WhyGqr6hY2GeHzVfuUcWP0nTHUDoBGyp63j1PFTLFIVb71JhJlc5kTn_Jk7-NkGE4uQztCn0k6J__CVRKojt_U6NXd9rXqjV68SvaIvy3zGqIYK7aDIQPAzS3sDmsu4&source=gbs_api",
		  "extraLarge": "http://books.google.com/books/publisher/content?id=vVeGAQAAQBAJ&printsec=frontcover&img=1&zoom=6&edge=curl&imgtk=AFLRE72KTtZ0DAeuKYEnRW-Dt8DHjhMffBj66wE9LbWixstQx1i_RnvYdUnBDhi_vGos7w6fKU2vXo6lj2QCBB2eMuyYTv6MFL_Pltmrwfbcuf1SuG8VZtBt1TTxyMyhl7J9cNnqbijY&source=gbs_api"
		},
		"language": "fr",
		"previewLink": "http://books.google.fr/books?id=vVeGAQAAQBAJ&hl=&source=gbs_api",
		"infoLink": "https://play.google.com/store/books/details?id=vVeGAQAAQBAJ&source=gbs_api",
		"canonicalVolumeLink": "https://play.google.com/store/books/details?id=vVeGAQAAQBAJ"
	  },
	  "layerInfo": {
		"layers": [
		  {
			"layerId": "geo",
			"volumeAnnotationsVersion": "36"
		  }
		]
	  },
	  "saleInfo": {
		"country": "FR",
		"saleability": "FOR_SALE",
		"isEbook": true,
		"listPrice": {
		  "amount": 7.99,
		  "currencyCode": "EUR"
		},
		"retailPrice": {
		  "amount": 7.99,
		  "currencyCode": "EUR"
		},
		"buyLink": "https://play.google.com/store/books/details?id=vVeGAQAAQBAJ&rdid=book-vVeGAQAAQBAJ&rdot=1&source=gbs_api",
		"offers": [
		  {
			"finskyOfferType": 1,
			"listPrice": {
			  "amountInMicros": 7990000,
			  "currencyCode": "EUR"
			},
			"retailPrice": {
			  "amountInMicros": 7990000,
			  "currencyCode": "EUR"
			},
			"giftable": true
		  }
		]
	  },
	  "accessInfo": {
		"country": "FR",
		"viewability": "PARTIAL",
		"embeddable": true,
		"publicDomain": false,
		"textToSpeechPermission": "ALLOWED",
		"epub": {
		  "isAvailable": true
		},
		"pdf": {
		  "isAvailable": true
		},
		"webReaderLink": "http://play.google.com/books/reader?id=vVeGAQAAQBAJ&hl=&source=gbs_api",
		"accessViewStatus": "SAMPLE",
		"quoteSharingAllowed": false
	  }
}

function getISBNofSingleBook(singleBook) {
	let arrayOfIdentifers = singleBook.volumeInfo.industryIdentifiers; 
	for (let i in arrayOfIdentifers) {
		if (arrayOfIdentifers[i].type === 'ISBN_13') {
			return(arrayOfIdentifers[i].identifier); 
		}
	}
	return null; 
}

async function getSingleBookInformation(google_id) {
	const base_url = 'https://www.googleapis.com/books/v1/volumes/'; 
	const response = await fetch(base_url + google_id); 
	const singleBookJSON = await response.json(); 
	// console.log(singleBookJSON); 
	if (singleBookJSON.volumeInfo) {
		return singleBookJSON.volumeInfo; 
	} else {
		throw Error('No book returned from Google API for ID = ' + google_id); 
	}
}

async function getBooksInfosThroughListOfIDs(listOfIDs) {
	let arrayOfPromises = []; 
	listOfIDs.forEach(id => {
		arrayOfPromises.push(getSingleBookInformation(id)); 
	});
	return Promise.all(arrayOfPromises)
		.then(res => {
			return res
		}); 
}