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

/* 
- les méthode de type 'template' retournent du HTML brut 
- les méthode de type 'events_handler' gèrent les événements liés au HTML générés dans les 'templates'
- les méthodes autre gèrent assemblent les 'templates' et les 'events_handlers' pour retourner une vue interactive au router

(les templates et event_handlers interviennet s'il y a besoin de factoriser du code réutilisé dans plusieurs views); 
*/




/* ===================================================================================================
VIEWS
=================================================================================================== */
/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    static home(order) {

        let sort_order = order; 
        const sort_by_date = (arr) => {
            arr.sort((a, b) => {
                if (sort_order) {
                    return b.added_date - a.added_date; 
                } else {
                    return a.added_date - b.added_date; 
                } 
            }); 
        }

        const next_reading = wishlist.getAllBooksByStatus('to-read').filter(item => { return item.owned }); 
        const wish_list = wishlist.getAllBooksByStatus('to-read').filter(item => { return !item.owned });; 

        sort_by_date(next_reading); 
        sort_by_date(wish_list); 

        const CONTAINER = document.querySelector('#app-container'); 


        let HTMLcontent = `
        <div><input id="filter-cards" type="search" oninput="filterCards(event.target.value)" placeholder="Filtrer les livres"></div>
        ${ this.template_current_reading() }
        ${ next_reading.length || !wish_list.length ? this.template_list(next_reading, { id:'next-reading', name:'Prochaines lectures'}) : '' } 
        ${ wish_list.length ? this.template_list(wish_list, {id:'wish-list', name:'Liste d\'achat'}) : '' }`; 
        

        CONTAINER.innerHTML = HTMLcontent; 

        // Apply icons to title of custom lists : 
        if (next_reading.length) {
            document.querySelector('#next-reading h2').outerHTML = '<h2><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg> <span style="margin-left: 6px">' + document.querySelector('#next-reading h2').innerHTML + '</span></h2>'; 
            document.querySelector('#next-reading h2').setAttribute('style', `display: flex; align-items: center;`);
        }
        
        if (wish_list.length) {
            document.querySelector('#wish-list h2').outerHTML = '<h2><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg> <span style="margin-left: 6px">' + document.querySelector('#wish-list h2').innerHTML + '</span></h2>'; 
            document.querySelector('#wish-list h2').setAttribute('style', `display: flex; align-items: center;`); 
        }
        
    

        this.list_events_handler(); 
    }
















































    static display_list(books_list, list_name) {
        //sort books by added_date order : 
        const CONTAINER = document.querySelector('#app-container'); 
        let HTMLcontent = ''; 


        HTMLcontent = this.template_list(books_list,{name:list_name}); 

        CONTAINER.innerHTML = HTMLcontent; 

        
        this.list_events_handler(); 


        return 'displayed'; 
    }

































/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    static single_book(book_id) {
        const CONTAINER = document.querySelector('#app-container'); 
        let HTMLContent = ''; 
        //parse book ID : 
        let indexOfBook = wishlist.getIndexOfSingleBookByID(book_id); 

        const b = wishlist.books[indexOfBook]; 

        let purchase_link = ''; 
        if (!b.owned) {
            purchase_link = `<div class="purchase-link">
                <span class="purchase-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-darkreader-inline-stroke="" style="--darkreader-inline-stroke:currentColor;"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg></span>
                <a class="button" href="${b.getPurchaseLink()}" target="_blank">Acheter le livre</a>
            </div>`; 
        }

        const applyRating = (rate) => {
            document.querySelectorAll('#rating-selector span').forEach(elt => {
                elt.classList.remove('rated'); 
                if (rate >= elt.dataset.rating) { elt.classList.add('rated') }
            })
        }




        HTMLContent = `
        <div style="display: flex; ">
            <button style="margin: 1em; margin-left: 0; " class="back-navigation_btn" onclick="history.go(-1); "><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
            <h1>${b.title}</h1>
        </div>

            <div class="single-book__container" id="id${b.google_id}">
                <div class="infos_container">
                    
                    <img class="miniature-cover" src="${b.miniature_link}" width="120" style="clear: both; "/ >
                    <div class="owned-checkbox" >
                        <label class="${b.owned ? 'owned-label' : ''}" for="owned" >Dans votre bibliothèque&nbsp;: </label>
                        <input type="checkbox" name="owned" id="owned-checkbox" ${b.owned ? 'checked="true"' : ''}  data-book-id="${b.google_id}">
                    </div>
                    <p class="description-content">${b.description}</p>
                    <div class="meta-container">
                        <div class="column">
                            <ul>
                                <li>Auteur : <strong>${b.author}</strong></li>
                                <li>Édition : <strong>${b.publisher}</strong></li>
                                <li>Langue : <strong>${b.language}</strong></li>
                            </ul>
                        </div>
                        <div class="column">
                            <ul>
                                <li>ISBN : <strong>${b.isbn}</strong></li>
                                <li>Google ID : <strong>${b.google_id}</strong></li>
                            </ul>
                        </div>
                    </div>
                    ${ purchase_link }
                </div>
                <div class="reading-status__container">
                    <label for="reading-status" class="">Statut de lecture :</label>
                    <select id="reading-status" name="reading-status" data-bookid=${b.google_id}>
                        <option value="to-read" ${b.status === 'to-read' ? 'selected' : '' }>À lire</option>
                        <option value="started" ${b.status === 'started' ? 'selected' : '' }>Commencé</option>
                        <option value="finished" ${b.status === 'finished' ? 'selected' : '' }>Terminé</option>
                    </select>
                    <div class="status-log">
                        <div class="started">${b.started_date ? `<p>Commencé le <span id="started_date--info">${new Date(b.started_date).toLocaleDateString() }</span><button class="edit-date" data-book-id="${b.google_id}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-darkreader-inline-stroke="" style="--darkreader-inline-stroke:currentColor;"><line x1="18" y1="2" x2="22" y2="6"></line><path d="M7.5 20.5 19 9l-4-4L3.5 16.5 2 22z"></path></svg></button></p>` : '' }</div>
                        <div class="finished">${b.finished_date ? `<p>Terminé le <span id="finished_date--info">${new Date(b.finished_date).toLocaleDateString() }</span><button class="edit-date" data-book-id="${b.google_id}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-darkreader-inline-stroke="" style="--darkreader-inline-stroke:currentColor;"><line x1="18" y1="2" x2="22" y2="6"></line><path d="M7.5 20.5 19 9l-4-4L3.5 16.5 2 22z"></path></svg></button></p>` : '' }</div>
                    </div>
                </div>
                <div class="custom_section">
                    <h2>Avis : </h2>
                    <div id="rating-selector" class="rating-container" data-book-id="${b.google_id}">
                        <span data-rating="1"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-darkreader-inline-stroke="" style="--darkreader-inline-stroke:currentColor;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></span>
                        <span data-rating="2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-darkreader-inline-stroke="" style="--darkreader-inline-stroke:currentColor;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></span>
                        <span data-rating="3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-darkreader-inline-stroke="" style="--darkreader-inline-stroke:currentColor;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></span>
                        <span data-rating="4"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-darkreader-inline-stroke="" style="--darkreader-inline-stroke:currentColor;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></span>
                        <span data-rating="5"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-darkreader-inline-stroke="" style="--darkreader-inline-stroke:currentColor;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></span>
                    </div>
                    <div class="annotation-container">
                        <textarea id="comment_container" placeholder="Ajoutez des notes personnalisées sur le livre">${b.comment || ''}</textarea>
                    </div>
                    
                </div>
                <button class="back-navigation_btn" onclick="history.go(-1); "><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
            </div>
            
            
            `; 



        



        CONTAINER.innerHTML = HTMLContent; 




        applyRating(b.rate); 


        //set correct height for text area : 
        let txtArea = document.getElementById('comment_container'); 
        let heightToSet = Math.max(txtArea.value.split('\n').length*22, 72);  
        txtArea.style.height = heightToSet + "px";  



        // EVENTS HANDLER :

        //svg comment : 
        txtArea.addEventListener('input', event => {
            b.comment = txtArea.value; 
            wishlist.saveWishlist();

            let heightToSet = Math.max(txtArea.value.split('\n').length*22, 72);  
            txtArea.style.height = heightToSet + "px"; 
            
        })

        txtArea.addEventListener('blur', event => {
            if (txtArea.value) { new QuickToast('Note sauvegardée').display({style: 'topFull'}); }
        })

        //update reading status : 
        const selecStatus = document.querySelector('#reading-status'); 
        selecStatus.addEventListener('change', event => {
            let action = event.target.value;  
            let book_id = event.target.dataset.bookid; 
            let index = wishlist.getIndexOfSingleBookByID(book_id); 

            if (action === "to-read") {
                new UserChoice('Vous allez réinitialiser les date de lecture<br/>Cette opération est irréversible<br/>Êtes-vous sûr ?', 'Réinitaliser', "Annuler").waitFor()
                    .then(() => {
                        document.querySelector('.status-log').innerHTML = ''; 
                        wishlist.books[index].reinitReading(); 
                        wishlist.saveWishlist(); 
                        new QuickToast('Statut de lecture mis à jour').display(); 
                    }); 
            }
            if (action === "started") {
                wishlist.books[index].startTheReading(); 
                wishlist.saveWishlist(); 
                document.querySelector('.status-log .started').innerHTML = `<p>Commencé le ${new Date(b.started_date).toLocaleDateString() }</p>`; 
                new QuickToast('Statut de lecture mis à jour').display(); 
            }
            if (action === "finished") {
                wishlist.books[index].finishTheReading(); 
                wishlist.saveWishlist(); 
                document.querySelector('.status-log .finished').innerHTML = `<p>Terminé le ${new Date(b.finished_date).toLocaleDateString() }</p>`; 
                new QuickToast('Statut de lecture mis à jour').display(); 
            }
        })

        // Add book to personnal shelve : 
        const ownedCheckbox = document.querySelector('#owned-checkbox'); 
        ownedCheckbox.addEventListener('change', event => {
            const index = wishlist.getIndexOfSingleBookByID(event.target.dataset.bookId); 
            const b = wishlist.books[index]; 
            if (event.target.checked) {
                b.changeOwnedInfo(true); 
                wishlist.saveWishlist(); 
                document.querySelector('.owned-checkbox label').classList.toggle('owned-label')
                new QuickToast(`<span><em>${b.title}</em> ajouté à votre bibliothèque</span>`).display();
            } else {
                b.changeOwnedInfo(false); 
                wishlist.saveWishlist(); 
                document.querySelector('.owned-checkbox label').classList.toggle('owned-label')
                new QuickToast(`<span><em>${b.title}</em> retiré de votre bibliothèque</span>`).display();
            }
             
        })
        document.querySelector("div.owned-checkbox > label").addEventListener('click', () => {
            ownedCheckbox.click(); 
        })


        // Edit dates 
        const allBtnEditDate = document.querySelectorAll('button.edit-date'); 
        allBtnEditDate.forEach(btn => {
            btn.addEventListener('click', event => {
                let spanToChange = event.currentTarget.previousSibling; 
                let action = event.currentTarget.previousSibling.id.split('--')[0]; 
                let indexToChange = wishlist.getIndexOfSingleBookByID(event.currentTarget.dataset.bookId); 
                let bookToChange = wishlist.books[indexToChange];
                new UserChoice('Mettre la date à jour : ', "Valider", "Annuler", true).waitFor()
                    .then(res => {
                        if (res === '') { throw new Error('Undefined date') }
                        spanToChange.textContent = new Date(res).toLocaleDateString(); 
                        bookToChange[action] = new Date(res).getTime(); 
                        wishlist.saveWishlist(); 
                    })
                    .catch(err => {
                        console.log(err); 
                    }); 
            })
        })


        // Select rating 


        // If 'dblclick' occurs, 'click event' also occurs.
        // However, I need only one event occurs, either one or other, but not both at the same time
        // So, I use a Promise to wait 600 ms before fire a click event, a time I consider enough to resolve a dblclick event before if it occurs : the 'click event' never occurs in this configuration
        const checkDblClick = (elt) => {
            return new Promise((resolve, reject) => {
                elt.addEventListener('dblclick', event => {
                    resolve(event); 
                })
                elt.addEventListener('click', event => {
                    setTimeout(() => {
                        reject(event); 
                    }, 300); 
                })
            })
        }
        const rating_selector = document.getElementById('rating-selector'); 

        

        checkDblClick(rating_selector).catch(res => new QuickToast('Double cliquer pour changer la note du livre').display({style: 'smallBottomCenter' })); 



        // rating_selector.addEventListener('click', () => {
        //     checkDblClick(rating_selector).catch(res => new QuickToast('Double cliquer pour changer la note du livre').display({style: 'smallBottomCenter' })); 
        // }); 
        

        const rating_item = document.querySelectorAll('#rating-selector span'); 
        rating_item.forEach(elt => {
            elt.addEventListener('dblclick', event => {
                let newRating = event.currentTarget.dataset.rating; 
                applyRating(event.currentTarget.dataset.rating); 
                let index = wishlist.getIndexOfSingleBookByID( event.currentTarget.parentElement.dataset.bookId ); 
                if (wishlist.books[index].rate == newRating) { 
                    wishlist.books[index].rate = 0;  
                    wishlist.saveWishlist(); 
                    applyRating(0); 
                    new QuickToast('Note supprimée').display(); 
                } else {
                    wishlist.books[index].rate = newRating; 
                    wishlist.saveWishlist(); 
                    new QuickToast('Note mise à jour').display(); 
                }  
            })
            // elt.addEventListener('mouseover', event => {
            //     applyRating(event.currentTarget.dataset.rating); 
            // })
        })

        
        
    }
















/* DISPLAY SEARCH FORM ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    static search_form(existing_query = "") {
        const CONTAINER = document.querySelector('#app-container'); 

        let HTMLContent = `
        <div>
        <form class="focus" action="" id="search-form" >
            <input type="search" name="query" id="query" placeholder="Titre, auteur, ISBN, &hellip;" >
            <input type="submit" name="" id="submit-form" value="Chercher">
        </form>
        <div id="search-results"></div>
        </div>`; 

        CONTAINER.innerHTML = HTMLContent; 

        document.querySelector('#query').focus(); 

        if (existing_query) { 
            existing_query = decodeURI(existing_query); 
            displaySearchResults(existing_query, DEFAULT_RESULTS_NUMBER, false);  
            document.querySelector('#query').value = decodeURI(existing_query); 
        }

        // EVENTS
        document.querySelector('#search-form').addEventListener('submit', event => {
            event.preventDefault(); 
            document.querySelector('#search-results').innerHTML = '<p style="text-align: center; ">● ● ●</p>'; 
            let data = new FormData(document.querySelector('#search-form')); 
            document.querySelector('#query').blur(); // try to hide keyboard on mobile device. Is it working ?
            const query = data.get('query'); 
            displaySearchResults(query, DEFAULT_RESULTS_NUMBER, false); 
            
            let newSearchStep = 1; 
            if (history.state) { newSearchStep = history.state.step + 1 }
            history.pushState({step: newSearchStep}, null, '#/add/' + query);
        })


        document.querySelector('#query').addEventListener('focus', () => {
            document.querySelector('#search-form').classList.add('focus'); 
        })
        document.querySelector('#query').addEventListener('blur', () => {
            document.querySelector('#search-form').classList.remove('focus'); 
        })


    }



























/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    static about() {
        const CONTAINER = this.config().main_container; 
        let HTMLcontent = `
            <div class="about-container">
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
                        <strong>2022-11-08</strong> | V.0.9.3<br/>
                        - ajout des statuts de lecture modifiable pour un livre : à lire, commencé, terminé<br/>
                        - ajout possibilité d'exporter/importer sa liste de lecture au format JSON<br/>
                        - ajout des lectures en cours en ouverture de la page d'accueil
                    </p>
                </div>
                <div class="versions-container">
                    <p>
                        <strong>2022-11-07</strong> | V.0.9.2<br/>
                        - ouverture du détail d'un livre<br/>
                        - ajout de note personnelle sur la fiche d'un livre<br/>
                        - amélioration de l'expérience de recherche et d'ajout de livre à la liste
                    </p>
                </div>
                <div class="versions-container">
                    <p>
                        <strong>2022-11-03</strong> | V.0.9.1<br/>
                        - recherche de livre dans l'API de Google Books<br/>
                        - ajout des livres à la liste de lecture<br/>
                        - supprimer des livres de liste de lecture<br/>
                    </p>
                </div>

                
                <h2>
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


                <h2>Export des données :</h2>
                    <p>Cette chaîne de caractère vous permet de partager vos livres avec une autre personne, ou bien de la sauvegarder dans vos documents <em>(cliquez pour copier le code)</em> :</p>
                    <button style="user-select: text; word-break: break-all; " class="copy-button">${wishlist.getListOfIDs().join(';')}</button>
                    <p>Elle vous permet de réimporter vos livres mémorisés dans la page d'import de l'application.</p>

                    <h3>Export de vos données au format JSON : </h3>
                    <p>Si vous souhaitez inclure vos notes personnelles dans l'export :</p>
                    <div id="export-container" class="versions-container" contenteditable="false">${JSON.stringify(wishlist.books)}</div>
                    <button id="copy-json" style="">Copier</button>
                    <button id="export-json" style="">Exporter</button>

                <h2>Import des données :</h2>
                <p>★&nbsp;<a href="#/import">Formulaire d'import des données</a></p>

                <h2>Suppression des données :</h2>
                <p><strong>ATTENTION : opération irréversible ! </strong</p>
                <button onclick="new UserChoice('Nuke the data ?', 'Destroy all', 'Cancel').waitFor().then(() => { localStorage.setItem('wishlist', ''); wishlist.books = []; }); ">SUPPRIMER TOUTES LES DONNÉES</button>
            </div>`; 

        CONTAINER.innerHTML = HTMLcontent; 


        // EVENTS HANDLER 
        const copyButton = document.querySelector('.copy-button'); 
        copyButton.addEventListener('click', (event) => {
            let copyText = copyButton.textContent; 
            navigator.clipboard.writeText(copyText); 
            new QuickToast("Copié dans le presse-papier", 3500).display(); 
        })

        //Copy JSON 
        const copyJSON = document.getElementById('copy-json'); 
        copyJSON.addEventListener('click', event => {
            let copyText = document.getElementById('export-container').textContent; 
            navigator.clipboard.writeText(copyText); 
            new QuickToast("Copié dans le presse-papier", 3500).display({style: 'topFull'}); 
        })

        //export JSON 
        const exportJSON = document.getElementById('export-json'); 
        exportJSON.addEventListener('click', event => {
            try {
                navigator.share({ 
                    title: document.getElementById('export-container').textContent, 
                    content: document.getElementById('export-container').textContent, 
                    url: '#/import/ids/' + wishlist.getListOfIDs().join(';')
                })
                .catch(err => console.log('Oups : ', new UserChoice(err.toString(), null, "Compris").waitFor())); 
            } catch(err) {
                console.log('Oups : ', err.toString()); 
                new UserChoice(err.toString(), null, "Compris").waitFor();  
            } 
        })



    }




















/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    static import(method = 'json', list = '' ) {
        const CONTAINER = document.querySelector('#app-container'); 

        

        let HTMLContent = `
            <div>
            <p>Méthode d'import : ${method.toUpperCase()}</p>
            ${list ? `<p>IDs list : ${list}</p>` : ''}

            <textarea id="import-json" placeholder="Coller ici les données à importer au format JSON"></textarea>
            <button id="import-btn">Importer</button>
            </div>
            `; 


        CONTAINER.innerHTML = HTMLContent; 

        // EVENTS 
        const textArea = document.getElementById('import-json'); 
        // Import json 
        const importBtn = document.getElementById('import-btn'); 
        importBtn.addEventListener('click', event => {
            try {
                wishlist.importFromJSON(textArea.value); 
                new QuickToast().display({message: 'Import des données réussi', delay: 3000 }); 
                location.href = '#/'; 
            } catch(err) {
                console.log(err); 
                new QuickToast().display({message: err, delay: 10000, style: 'topFull'})
            }
        })
    }




















/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    static not_found(message = null) {
        const CONTAINER = document.querySelector('#app-container'); 
        
        const TEMPLATE = 
        `<h1>Holy 404 of God</h1>
        <p>Rien n'a été trouvé avec le chemin de l'url que vous avez demandé ¯\\_(ツ)_/¯</p>
        <a href="#/">Ramenez-moi</a><span>🙏</span>

        ${message ? `<pre>${message}</pre>`: '' }
        `; 

        CONTAINER.innerHTML = TEMPLATE; 
    }


































/* =====================================================================================
TEMPLATES 
===================================================================================== */

    static template_current_reading() {
        // const books_list = wishlist.getAllBooksByStatus('started').sort((a,b) => {
        //     return (a.started_date - b.started_date); 
        // }); 
        const books_list = Utils.shuffleArray(wishlist.getAllBooksByStatus('started')); 

        if (books_list.length === 0) { return '' }

        let HTMLContent = ``; 

        const writeCard = (b) => {
            return `
            <a href="#/book/${b.google_id}" id="id${b.google_id}" class="current-reading__card" style="width: calc(${ 100 / books_list.length }% - ${(books_list.length-1) * 12}px); ">
                <div class="fav-star" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg>
                </div>
                <img src="${b.miniature_link}" width="84"/>
                <h3>${b.title}</h3>
                <div class="days-counter">${Utils.calculateNumberOfDaysBetweenTwoTimestamps(b.started_date, Date.now())}j.</div>
            </a>`
        }

        let booksCards = ''; 
        books_list.forEach(book => {
            booksCards += writeCard(book); 
        })

        HTMLContent = `
        
        <div id="current-reading" ${books_list.length === 1 ? `class="single-current"` : '' }>
            <h2 class="">Lecture${books_list.length > 1 ? 's' : ''} en cours :</h2>
            <div class="current-reading__container" >
                <div class="current-reading__scroller" style="width: ${books_list.length * 90}%;">
                    ${booksCards}
                </div>
            </div>
        </div>`

        return HTMLContent; 
    }















    static template_list(list, options) {
        let HTMLcontent = ''; 

        let id = options.id || ''; 
        let list_name = options.name || ''; 

        let books_list = list; 

        const owned_icon = `
            <span style="color: var(--accent);position: relative;top: 6px;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H2v15h7c1.7 0 3 1.3 3 3V7c0-2.2-1.8-4-4-4Z"></path><path d="m16 12 2 2 4-4"></path><path d="M22 6V3h-6c-2.2 0-4 1.8-4 4v14c0-1.7 1.3-3 3-3h7v-2.3"></path></svg></span>`; 
        

        if (books_list.length === 0) {
            HTMLcontent = `<div class="reading-list empty-list">
                <h2><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path><path d="m12 13-1-1 2-2-3-2.5 2.77-2.92"></path></svg>&nbsp;${list_name}&nbsp;: rien à afficher !</h2>
                <p><em>Il semblerait que votre liste est vide&hellip;</em></p>
                <p><a href="#/add" style="display: flex;"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path><line x1="12" x2="12" y1="7" y2="13"></line><line x1="15" x2="9" y1="10" y2="10"></line></svg>&nbsp;Ajouter un livre ?</a></p>
            </div>`; 
        } else {
            let booksList = `<h2>${list_name} :</h2>`; 
            for (let i in books_list) {
                let dateAdded = books_list[i].added_date ? `<span class="added-date">Ajouté le ${ new Date(books_list[i].added_date).toLocaleDateString() }</span>` : ''; 
                let flag = books_list[i].language ? `<img width="18" src="images/flags/4x3/${Utils.findFlag(books_list[i].language)}.svg" />` : '' ; 
    
                let newEntry = `    <article class="book-entry" id="entry-${i}">
                                        <div><img class="cover-miniature" width="80" src="${books_list[i].miniature_link}"></div>	
                                        <div class="info-container">
                                            <h3 class="title">${books_list[i].title}</h3>
                                            <h4 class="author">${books_list[i].author}</h4>
                                            <p class="description maxheight0">${books_list[i].description}</p>
                                            <p class="publisher"><strong>${books_list[i].publisher}</strong></p>
                                            ${books_list[i].owned ? owned_icon + ' ' : ''}
                                            ${ dateAdded }
                                            
                                        </div>
                                        <div class="more-actions-button" id="id${books_list[i].google_id}">
                                            <div class="visible"> ⁝ </div>
                                            <div class="openable">
                                                <button class="details-btn">Détails</button>
                                                <button class="share-btn">Partager</button>
                                                <button class="delete-btn"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>&nbsp;Supprimer</button>
                                            </div>
                                        </div>
                                    </article>`; 
                booksList += newEntry; 
            }
            HTMLcontent = `
                <div id="${id}" class="reading-list"> 
                    ${booksList}
                </div>`; 
        }

        

        return HTMLcontent; 
    }















/* ===================================================================================================
EVENTS HANDLERS
=================================================================================================== */
 static list_events_handler() {
    // Handle view description : 
    const allBooks = document.querySelectorAll('.reading-list .book-entry'); 
    for (let i = 0 ; i < allBooks.length; i++ ) {
        allBooks[i].addEventListener('click', event => {
            let book_id = allBooks[i].querySelector('.more-actions-button').id.split('id')[1]; 
            window.location.hash = '#/book/' + book_id; 
            // allBooks[i].querySelector('.description').classList.toggle('maxheight0'); 
        })
    }

    // Handle More Action Button
    const allMoreActionsBtn = document.querySelectorAll('.reading-list .book-entry .more-actions-button'); 
    allMoreActionsBtn.forEach(btn => {
        btn.addEventListener('click', event => {
            event.stopPropagation(); 
            let btn = event.currentTarget; 
            if (btn.querySelector('.openable').classList.contains('opened')) {
                btn.querySelector('.openable').classList.remove('opened'); 
            } else {
                document.querySelectorAll('.openable.opened').forEach(elt => elt.classList.remove('opened')); // reset
                btn.querySelector('.openable').classList.add('opened'); 
            }            
        })
    })
    window.addEventListener('click', event => {
        try {
            let elt_to_create = Utils.getParentOfClass(event.target, 'openable') ; 
        } catch {
            event.stopPropagation(); 
            document.querySelectorAll('.openable.opened').forEach(elt => elt.classList.remove('opened')); // reset
        }
        
    })



    // Handle DELETE : 
    const allDeleteBtn = document.querySelectorAll('.reading-list .book-entry button.delete-btn');
    for (let i = 0 ; i < allDeleteBtn.length; i++ ) {
        allDeleteBtn[i].addEventListener('click', event => {
            event.stopPropagation(); 
            try {
                new UserChoice('Supprimer le livre de votre liste ? <br/>Cette action est irréversible', "Supprimer", "Annuler").waitFor()
                    .then(() => {
                        let book_id = ( Utils.getParentOfClass(event.target, 'more-actions-button').id ).split('id')[1] ;  
                        Utils.getParentOfClass(event.target, 'book-entry').remove(); 
                        wishlist.remove( book_id ); 
                        new QuickToast('Livre supprimé').display(); 
                        if (wishlist.books.length === 0 ) { this.wish_list(wishlist.books) }
                    });
            } catch(err) {
                new QuickToast(err).display(); 
            }
            
        })
    }

    // Handle SHARE : see : https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API 
    const allShareBtn = document.querySelectorAll('.reading-list .book-entry button.share-btn');
    for (let i = 0 ; i < allShareBtn.length; i++ ) {
        //get parent element book entry : 
        let parentBookEntry = Utils.getParentOfClass(allShareBtn[i], "book-entry"); 

        const shareData = {
            title: "Livre : " + parentBookEntry.querySelector('.title').textContent, 
            content: parentBookEntry.querySelector('.description').textContent.substring(0, 250) + '…',
            url: "https://theoknoep.github.io/read-books/#/add/" + parentBookEntry.querySelector('.more-actions-button').id.split('id')[1]
        }

        allShareBtn[i].addEventListener('click', event => {
            event.stopPropagation(); 
            try {
                navigator.share(shareData); 
            } catch(err) {
                new UserChoice(err, null, "OK").waitFor();  
            } 
        })
    }


    // Handle DETAILS 
    const allDetailsBtn = document.querySelectorAll('.reading-list .book-entry button.details-btn');
    for (let i = 0 ; i < allDetailsBtn.length; i++ ) {
        allDetailsBtn[i].addEventListener('click', event => {
            event.stopPropagation(); 
            // new UserChoice('🚧 Cette action n\'est pas encore disponible', null, "OK").waitFor();  
            let book_id = ( Utils.getParentOfClass(event.target, 'more-actions-button').id ).split('id')[1] ; 
            window.location.hash = '#/book/' +  book_id; 
        })
    }
}






}

