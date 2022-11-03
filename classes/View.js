/**
 * La classe View est chargée de : 
 * - créer le contenu HTML à partir des autres classes, 
 * - l'insérer dans le DOM (#app-container)
 * - gérer les EventListeners
 */
class View {
    static wish_list(books_list) {
        const CONTAINER = document.querySelector('#app-container'); 
        let counter = 0; 
    
        let booksList = ''; 

        for (let i = books_list.length-1; i >= 0; i--) {
            let dateAdded = books_list[i].added_date ? `<span class="added-date">Ajouté le ${ new Date(books_list[i].added_date).toLocaleDateString() }</span>` : ''; 
            let flag = books_list[i].language ? `<img width="18" src="images/flags/4x3/${Utils.findFlag(books_list[i].language)}.svg" />` : '' ; 

            let newEntry = `    <article class="book-entry" id="entry-${books_list.length-i}">
                                    <div><img width="80" src="${books_list[i].miniature_link}"></div>	
                                    <div class="info-container">
                                        <h3 class="title">${books_list[i].title}</h3>
                                        <h4 class="author">${books_list[i].author}</h4>
                                        <p class="description maxheight0">${books_list[i].description}</p>
                                        <p class="publisher"><strong>${books_list[i].publisher}</strong></p>
                                        ${ flag }
                                        ${ dateAdded }
                                    </div>
                                    <div>
                                        <button class="delete-btn" id="${books_list[i].isbn}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                                    </div>
                                </article>`; 
            booksList += newEntry; 
        }

        let HTMLcontent = `
        <main id="app-container">
            <div id="reading-list">
                <h2>Livres à lire</h2>
                ${booksList}
            </div>
	    </main>`; 

        CONTAINER.innerHTML = HTMLcontent; 

        // Handle view description : 
        const allBooks = document.querySelectorAll('#reading-list .book-entry'); 
        for (let i = 0 ; i < allBooks.length; i++ ) {
            allBooks[i].addEventListener('click', event => {
                allBooks[i].querySelector('.description').classList.toggle('maxheight0'); 
            })
        }

        // Handle CTA : 
        const allDeleteBtn = document.querySelectorAll('#reading-list .book-entry button');
        for (let i = 0 ; i < allDeleteBtn.length; i++ ) {
            allDeleteBtn[i].addEventListener('click', event => {
                event.stopPropagation(); 
                Utils.getParentOfClass(event.target, 'book-entry').remove(); 
                wishlist.remove(Utils.getParentOfClass(event.target, 'delete-btn').id); 
                new QuickToast("Supprimé !", 3000).display(); 
            })
        }

        return 'displayed'; 
    }

    static search_form() {
        const CONTAINER = document.querySelector('#app-container'); 

        let HTMLContent = `
        <form class="" action="" id="search-form">
            <input type="text" name="query" id="query" >
            <input type="submit" name="" id="submit-form" value="Chercher">
        </form>`; 

        CONTAINER.innerHTML = HTMLContent; 

        document.querySelector('#query').focus(); 

        // EVENTS
        document.querySelector('#search-form').addEventListener('submit', event => {
            event.preventDefault(); 
            let data = new FormData(document.querySelector('#search-form')); 
            const query = data.get('query'); 
            displaySearchResults(query, DEFAULT_RESULTS_NUMBER, true); 
        })
    }

    static single_book(book) {

    }

    static not_found() {
        const CONTAINER = document.querySelector('#app-container'); 
        
        const TEMPLATE = 
        `<h1>Holy 404 of God</h1>
        <a href="#/wishlist">Ramenez-moi</a>🙏
        `; 

        CONTAINER.innerHTML = TEMPLATE; 
    }
}