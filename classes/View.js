/**
 * La classe View est chargée de : 
 * - créer le contenu HTML à partir des autres classes, 
 * - l'insérer dans le DOM (#app-container)
 * - gérer les EventListeners
 */
class View {
    static config() {
        return {
            main_container: document.querySelector('#app-container')
        }
    }








    static wish_list(books_list) {
        const CONTAINER = document.querySelector('#app-container'); 
        let counter = 0; 
        let HTMLcontent = ''; 
        

        if (books_list.length === 0) {
            HTMLcontent = `<div class="reading-list empty-list">
                <h2><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path><path d="m12 13-1-1 2-2-3-2.5 2.77-2.92"></path></svg>&nbsp;Rien à lire !</h2>
                <p><em>Il semblerait que votre liste est vide&hellip;</em></p>
                <p><a href="#/add" style="display: flex;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path><line x1="12" x2="12" y1="7" y2="13"></line><line x1="15" x2="9" y1="10" y2="10"></line></svg>&nbsp;Ajouter un livre ?</a></p>
            </div>`; 
        } else {
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
            HTMLcontent = `
                <div id="reading-list">
                    <!-- <h2>Livres à lire</h2> -->
                    ${booksList}
                </div>`; 
        }

        

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
                console.log(event.target); 
                try {
                    Utils.getParentOfClass(event.target, 'book-entry').remove(); 
                    console.log( Utils.getParentOfClass(event.target, 'delete-btn').id ); 
                    wishlist.remove( Utils.getParentOfClass(event.target, 'delete-btn').id ); 
                    new QuickToast('Supprimé avec succès').display(); 
                    if (wishlist.books.length === 0 ) { this.wish_list(wishlist.books) }
                } catch(err) {
                    new QuickToast(err).display(); 
                }
                
            })
        }

        return 'displayed'; 
    }












    static search_form(existing_query = "") {
        const CONTAINER = document.querySelector('#app-container'); 

        let HTMLContent = `
        <form class="" action="" id="search-form">
            <input type="text" name="query" id="query" placeholder="Titre, auteur, ISBN, &hellip;" >
            <input type="submit" name="" id="submit-form" value="Chercher">
        </form>`; 

        CONTAINER.innerHTML = HTMLContent; 

        document.querySelector('#query').focus(); 

        if (existing_query) { 
            displaySearchResults(existing_query, DEFAULT_RESULTS_NUMBER, true);  
            document.querySelector('#query').value = decodeURI(existing_query); 
        }

        // EVENTS
        document.querySelector('#search-form').addEventListener('submit', event => {
            event.preventDefault(); 
            let data = new FormData(document.querySelector('#search-form')); 
            document.querySelector('#search-form').blur(); // try to hide keyboard on mobile device. Is it working ?
            const query = data.get('query'); 
            displaySearchResults(query, DEFAULT_RESULTS_NUMBER, true); 
            // window.location.hash = '#/add/' + query; 
            history.pushState(null, null, '#/add/' + query);
        })
    }














    static single_book(book) {

    }














    static about() {
        const CONTAINER = this.config().main_container; 
        let HTMLcontent = `<div class="about-container">
                <h1>À propos : Web application de gestion de liste de lecture</h1>
                <blockquote>Cherchez et ajoutez des livres à votre liste de lecture pour les garder en mémoire</blockquote>

                <div class="data-clarification" style="">
                    <div style=" width: 25%; max-width: 132px; min-width: 72px; float: left; text-align: center;">
                        <svg style="width: 80%; height: 80%; opacity: .4;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                    </div>
                    <div>
                        <p><strong>Aucune de vos données n'est partagée en utilisant cette application, toutes les informations de livres restent stockées uniquement sur votre appareil</strong></p>
                        <p><em>Attention à ne pas les supprimer par mégarde (en supprimant les données de ce site dans les paramètres de votre navigateur).</em></p>
                    </div>
                </div>
                
                <h2>Versions : </h2>
                <div class="versions-container">
                    <p>
                        <strong>2022-11-03</strong> | V.0.9.1<br/>
                        - recherche de livre dans l'API de Google Books<br/>
                        - ajout des livres à la liste de lecture<br/>
                        - supprimer des livres de liste de lecture<br/>
                    </p>
                </div>

                
                <h2>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M6 21V9a9 9 0 0 0 9 9"></path></svg>
                    Fonctionnalités à venir :
                </h2>
                <ul>
                    <li class="star">Gérer sa bibliothèque</li>
                    <li class="star">Tracker ses lectures en cours</li>
                    <li class="star">Prendre des notes sur un ouvrage</li>
                    <li class="star">Import/export de données de livres au format JSON</li>
                    <li class="star">Synchronisation en ligne sur plusieurs appareils</li>
                    <li class="star">Recherche avancée dans les livres (par auteur, éditeur, etc.)</li>
                </ul>

            </div>`; 

        CONTAINER.innerHTML = HTMLcontent; 

    }















    static not_found() {
        const CONTAINER = document.querySelector('#app-container'); 
        
        const TEMPLATE = 
        `<h1>Holy 404 of God</h1>
        <p>Rien n'a été trouvé avec le chemin de l'url que vous avez demandé ¯\\_(ツ)_/¯</p>
        <p>(peut-être que vous devriez arrêter de bidouiller les URL n'importe comment, aussi)</p>
        <a href="#/">Ramenez-moi</a>🙏
        `; 

        CONTAINER.innerHTML = TEMPLATE; 
    }
}