/**
 * La classe View est chargée de : 
 * - créer le contenu HTML à partir des autres classes, 
 * - l'insérer dans le DOM (#app-container)
 * - gérer les EventListeners
 */
class View {
    static config() {
        return {
            main_container: document.querySelector('#app-container'), 
            API_source: 'http://theokne.cluster021.hosting.ovh.net/index.php?route='
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
        ${ this.template_current_reading() }
        ${ next_reading.length || !wish_list.length ? this.template_list(next_reading, { id:'next-reading', name:'Pile à lire'}) : '' } 
        ${ wish_list.length ? this.template_list(wish_list, {id:'wish-list', name:'Liste d\'achat'}) : '' }`; 
        

        CONTAINER.innerHTML = HTMLcontent; 

        // Apply icons to title of custom lists : 
        if (next_reading.length) {
            document.querySelector('#next-reading h2').outerHTML = '<h2><img href="images/icons/ico-pile-a-lire.svg"/> <span style="margin-left: 6px">' + document.querySelector('#next-reading h2').innerHTML + '</span></h2>'; 
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

        let sort_order = true; 
        const sort_by_date = (arr) => {
            arr.sort((a, b) => {
                if (sort_order) {
                    return b.added_date - a.added_date; 
                } else {
                    return a.added_date - b.added_date; 
                } 
            }); 
        }
        sort_by_date(books_list);


        //sort finished book by finish date : 
        if (list_name === 'Livres terminés') {
            books_list.sort((a, b) => {
                return b.finished_date - a.finished_date; 
            })
        }

        console.log('after : ', books_list);

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

        const estimateLeftTime = () => {
            if (!b.progression.max || !b.progression.current || !b.reading_log ) { return null }
            let readingTime = b.calculateReadingTime(); 
            let percentageRead = (b.progression.current / b.progression.max) * 100; 
            let leftTimestamp = (readingTime / percentageRead) * (100 - percentageRead) ;
            return `environ ${ Time.formatMs(leftTimestamp) }`; 
        }

        console.log('estimateLeftTime', estimateLeftTime()); 




        HTMLContent = `
        <div style="display: flex; ">
            <button style="margin: 1em; margin-left: 0; " class="back-navigation_btn" onclick="history.go(-1); "><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
            <h1>${b.title}</h1>
        </div>
            <div class="single-book__container" id="id${b.google_id}">
                <div class="infos_container">
                    
                    <img class="miniature-cover" src="${b.miniature_link}" width="120" style="clear: both; opacity: 0;  "/ >
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
                        <div class="started">${b.started_date ? `<p><span>Commencé le <span id="started_date--info">${new Date(b.started_date).toLocaleDateString() }</span></span><button class="edit-date" data-book-id="${b.google_id}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-darkreader-inline-stroke="" style="--darkreader-inline-stroke:currentColor;"><line x1="18" y1="2" x2="22" y2="6"></line><path d="M7.5 20.5 19 9l-4-4L3.5 16.5 2 22z"></path></svg></button></p>` : '' }</div>
                        <div class="finished">${b.finished_date ? `<p><span>Terminé le <span id="finished_date--info">${new Date(b.finished_date).toLocaleDateString() }</span></span><button class="edit-date" data-book-id="${b.google_id}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-darkreader-inline-stroke="" style="--darkreader-inline-stroke:currentColor;"><line x1="18" y1="2" x2="22" y2="6"></line><path d="M7.5 20.5 19 9l-4-4L3.5 16.5 2 22z"></path></svg></button></p>` : '' }</div>
                    </div>
                </div>
                
                <div class="progression_custom ${b.status === 'to-read' ? 'maxheight0' : ''}">
                    <h2>Progression : </h2>
                    <p>Durée de lecture : ${Time.formatMs(b.calculateReadingTime())}</p>
                    <p>Progression : <span id="percentage_progression">${ b.progression.max && b.progression.current ? Math.floor((b.progression.current / b.progression.max) * 100) + '%': ''}</span></p>
                    <input type="number" id="current_progression" value="${b.progression ? b.progression.current : ''}" placeholder="Avancement actuel" data-book-id="${b.google_id}">
                    <input type="number" id="max_progression" value="${b.progression ? b.progression.max : ''}" placeholder="Longueur du livre" data-book-id="${b.google_id}">
                    <pre id="estimate-left-time" class="${estimateLeftTime() ? '':'displaynone'}">Estimation du temps restant :</br>${ estimateLeftTime() }</pre>
                    <p><small class="stats-link">${View.icon_statistics()}&nbsp;<a href="#/book/${b.google_id}/stats">Statistiques de lecture</a></small></p>
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
                        <!-- <textarea id="comment_container" placeholder="Ajoutez des notes personnalisées sur le livre" rows="8">${b.comment || ''}</textarea> -->
                        <div class="placeholder" style="position: absolute;padding: .5rem;font-size: 16px;color: #757567;/* color: transparent; *//* transition: color ease 280ms; */">Ajoutez des notes personnalisées sur le livre</div>
                        <div contenteditable="true" id="comment_container_editable" class="editable" style="
                            border: solid 1px var(--border);
                            border-radius: 5px;
                            padding: 0.5rem;
                            font-size: 16px;
                            position: relative;
                            min-height: 72px;
                            max-height: 80svh;
                            overflow: auto;
                        "></div>

                    </div>
                    
                </div>
                <button class="back-navigation_btn" onclick="history.go(-1); "><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>
            </div>
            `; 



    
        CONTAINER.innerHTML = HTMLContent; 
        applyRating(b.rate); 


        

        /** ANNOTATION AREA */
        let txtArea = document.getElementById('comment_container_editable'); 
        // fill annotation text :
        txtArea.innerText = b.comment; 
        // emulate placeholder behavior : 
        const applyRightColorToPlaceHolder = () => {
            if (txtArea.innerText === '') {
                txtArea.previousElementSibling.style.color = "#757567"; 
            } else {
                txtArea.previousElementSibling.style.color = "transparent"; 
            }
        }
        applyRightColorToPlaceHolder(); 
        txtArea.addEventListener('input', event => {
            applyRightColorToPlaceHolder();
        }); 
        // save annotation changes : 
        txtArea.addEventListener('blur', event => {
            b.comment = txtArea.innerText; 
            wishlist.saveWishlist();
            if (txtArea.innerText !== '') { new QuickToast('Note sauvegardée').display(); }
        })


        // EVENTS HANDLER :

        // img smooth loading
        document.querySelector('.miniature-cover').addEventListener('load', evt => {
            evt.target.style.opacity = '1'; 
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
                        document.querySelector('.progression_custom').classList.add('maxheight0'); 
                    }); 
            }
            if (action === "started") {
                wishlist.books[index].startTheReading(); 
                wishlist.saveWishlist(); 
                document.querySelector('.status-log .started').innerHTML = `<p>Commencé le ${new Date(b.started_date).toLocaleDateString() }</p>`; 
                new QuickToast('Statut de lecture mis à jour').display(); 
                document.querySelector('.progression_custom').classList.remove('maxheight0'); 
            }
            if (action === "finished") {
                wishlist.books[index].finishTheReading(); 
                wishlist.saveWishlist(); 
                document.querySelector('.status-log .finished').innerHTML = `<p>Terminé le ${new Date(b.finished_date).toLocaleDateString() }</p>`; 
                new QuickToast('Statut de lecture mis à jour').display(); 
                document.querySelector('.progression_custom').classList.remove('maxheight0'); 
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

        

        checkDblClick(rating_selector).catch(res => {
            new QuickToast('Double cliquer pour changer la note du livre').display({style: 'smallBottomCenter' }); 
        }); 



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





        // EDIT PROGRESSION 
        const current_progression = document.querySelector('#current_progression'); 
        const max_progression = document.querySelector('#max_progression'); 

        const update_percentage_progression = (current, max) => {
            const domElt = document.querySelector('#percentage_progression'); 
            domElt.textContent = Math.floor((current/max)*100) + '%'; 
        }

        max_progression.addEventListener('change', event => {
            const b = wishlist.books[wishlist.getIndexOfSingleBookByID(event.currentTarget.dataset.bookId)]; 
            b.progression['max'] = event.currentTarget.value; 
            wishlist.saveWishlist(); 
            update_percentage_progression(b.progression.current, b.progression.max); 
            document.querySelector('#estimate-left-time').innerHTML = `Estimation du temps restant :<br/>${ estimateLeftTime() }`; 
            new QuickToast('Modifié avec succès').display(); 
        })
        current_progression.addEventListener('change', event => {
            const b = wishlist.books[wishlist.getIndexOfSingleBookByID(event.currentTarget.dataset.bookId)]; 
            b.progression['current'] = event.currentTarget.value; 
            wishlist.saveWishlist(); 
            update_percentage_progression(b.progression.current, b.progression.max); 
            document.querySelector('#estimate-left-time').innerHTML = `Estimation du temps restant :<br/>${ estimateLeftTime() }`;
            new QuickToast('Modifié avec succès').display(); 
        })
    }























    static single_book_statistics(google_id) {
        const CONTAINER = document.querySelector('#app-container'); 

        let indexOfBook = wishlist.getIndexOfSingleBookByID(google_id); 
        let b = wishlist.books[indexOfBook]; 

        let HTMLcontent = `<h2>Statistiques de lecture <strong>${b.title}</strong></h2>`; 

        if (!b.reading_log) {
            HTMLcontent += `Pas de sessions de lectures`; 
        } else {
            let listEntries = ''; 
            let formatedEntries = b.formatStatistics(); 
            console.log(formatedEntries); 
            console.log(Object.keys(formatedEntries)); 
            let listOfDays = Object.keys(formatedEntries); 
            listOfDays.forEach(day => {
                console.log(new Date(day*1).toLocaleDateString()); 
                console.log(formatedEntries[day]); 
                let newList = ''; 
                let totalMsOfDay = 0; 
                formatedEntries[day].forEach(session => {
                    let newLi = ''; 
                    newLi = `<li data-timestamp-start="${session.start}" data-timestamp-end="${session.end}">${new Date(session.start).toLocaleTimeString()} <span class="time-end">&rarr; ${new Date(session.end).toLocaleTimeString()}</span> <span class="session-time">: : : ${ Time.formatMs(session.end-session.start) }</span> </li>`; 
                    newList += newLi; 
                    totalMsOfDay += session.end-session.start; 
                })
                listEntries += `<ul class="statistics-sessions__day">
                                    <div class="list-head"><span class="date">${new Date(day*1).toLocaleDateString()}</span><span class="total-day">${Time.formatMs(totalMsOfDay)}</span></div>
                                     ${newList}
                                </ul>`; 
            })

            HTMLcontent += '<h3>Sessions de lecture</h3>' + listEntries; 
        }


        CONTAINER.innerHTML = HTMLcontent; 



        // EVENTS 
        const allEntries = document.querySelectorAll('.time-entry span'); 
        allEntries.forEach((entry, index) => {
            entry.addEventListener('click', event => {
                console.log(event.currentTarget.dataset.index); 
            })
            entry.addEventListener('blur', event => {
                console.log(index); 
                entry.removeAttribute('contenteditable'); 
                console.log(entry.textContent.split(' -> ')); 
                let parts = entry.textContent.split(' -> '); 
                try {
                    let start = new Date(parts[0]); 
                    let end = new Date(parts[1]); 
                    console.log(start, end); 
                } catch(err) {
                    console.log(err); 
                }
            })
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
                <a href="https://www.buymeacoffee.com/theoknoep" class="buy-me-a-coffee-link">☕ Buy me a coffee</a>
                <h2>Versions : </h2>
                <div class="versions-container">
                    <p>
                        <strong data-time="">2023-09-16</strong> | V.0.9.6<br/>
                        - possibilité de sauvegarder en ligne sa liste locale de livres
                    </p>
                </div>
                <div class="versions-container">
                    <p>
                        <strong data-time="">2023-07-29</strong> | V.0.9.5<br/>
                        - import/export de la liste complète au format JSON
                    </p>
                </div>
                <div class="versions-container">
                    <p>
                        <strong data-time="">2022-11-29</strong> | V.0.9.4<br/>
                        - ajout du tracking de temps de lecture
                    </p>
                </div>
                <div class="versions-container">
                    <p>
                        <strong data-time="">2022-11-08</strong> | V.0.9.3<br/>
                        - ajout des statuts de lecture modifiable pour un livre : à lire, commencé, terminé<br/>
                        - ajout possibilité d'exporter/importer sa liste de lecture au format JSON<br/>
                        - ajout des lectures en cours en ouverture de la page d'accueil
                    </p>
                </div>
                <div class="versions-container">
                    <p>
                        <strong data-time="">2022-11-07</strong> | V.0.9.2<br/>
                        - ouverture du détail d'un livre<br/>
                        - ajout de note personnelle sur la fiche d'un livre<br/>
                        - amélioration de l'expérience de recherche et d'ajout de livre à la liste
                    </p>
                </div>
                <div class="versions-container">
                    <p>
                        <strong data-time="">2022-11-03</strong> | V.0.9.1<br/>
                        - recherche de livre dans l'API de Google Books<br/>
                        - ajout des livres à la liste de lecture<br/>
                        - supprimer des livres de liste de lecture<br/>
                    </p>
                </div>

                
                <h2>
                    Fonctionnalités à venir :
                </h2>
                <ul>
                    <li class="star">Recherche avancée dans les livres (par auteur, éditeur, etc.)</li>
                    <li class="star">Gestion dans les paramètres du thème clair et sombre</li>
                </ul>

                <h2>
                    Crédits :
                </h2>
                <ul>
                    <li class="">L'application utilise le <a href="https://simplecss.org/" target="_blank">framework SimpleCSS</a></li>
                    <li>Certaines icônes proviennent de <a href="https://lucide.dev/icons/" target="-blank">Lucide.dev</a></li>
                </ul>

                <hr/>
                <h2>Suppression des données :</h2>
                <p><strong>ATTENTION : opération irréversible ! </strong</p>
                <div><button id="delete-all-data" onclick=" ">SUPPRIMER TOUTES LES DONNÉES</button></div>
            </div>`; 

        CONTAINER.innerHTML = HTMLcontent; 

        // display notification on new versions : 
        let last_visit = new Date(localStorage.getItem('last-visit-for-news') || null); 
        console.log(last_visit); 
        document.querySelectorAll('.versions-container [data-time]').forEach(item => {
            console.log(new Date(item.textContent) > last_visit); 
            if (new Date(item.textContent) > last_visit) {
                item.insertAdjacentHTML('beforebegin', '<span class="new-marker">Nouveauté</span>'); 
            }
        }); 
        localStorage.setItem('last-visit-for-news', new Date()); 


        // EVENTS HANDLER
        // delete all data
        document.querySelector('#delete-all-data').addEventListener('click', event => {
            new UserChoice("Êtes vous sûr de vouloir supprimer toutes les données de l'application ?<br/><small>⚠ Cette opération est irréversible</small>", 'SUPPRIMER', 'Annuler').waitFor()
                .then(() => { 
                    wishlist.deleteAllBooksFromIndexedDB()
                        .then(res => {
                            new QuickToast('Livres supprimés').display();
                        })
                });
        })

        


    }










/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    static async save() {
        const CONTAINER = this.config().main_container; 


        CONTAINER.style.opacity = "0"; 

        let auth = await testUserConnexion(); 
        console.log(auth); 

        // USER INFO : 
        let user_block = ''; 
        if (auth.success) {
            user_block = `<p class="user-block__logged">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
                    <span>Vous êtes connecté en tant que <strong>${auth.login}</strong>&nbsp;</span>
                    <button onclick="deleteSession()"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg></button>
                </p>
                <button id="synchronize-json"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-cw"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>&nbsp;Sauvegarder en ligne</button>
                `; 
        } else {
            user_block = `<p><strong>Connectez-vous</strong> pour effectuer une sauvegarde en ligne : </p>
                <form id="signin-form">    
                    <input type="text" name="login" id="login" placeholder="Login">
                    <input type="password" name="password" id="password" placeholder="Mot de passe">
                    <input type="submit" value="Connexion">
                </form>
                <p><em>Si vous n'avez pas encore de compte : <a href="#">créer un compte</a></em></p>`; 
        }
        

        // RENDER HTML : 
        let HTMLcontent = `
            <div class="save-container">
                <h1>Sauvegarde de vos données</h1>
                <h2>Sauvegarde en ligne</h2>
                <p><blockquote>Vous avez la possibilité (facultative) de créer un compte pour enregistrer en ligne les données de l'application (votre liste de livre, vos annotations personnalisée et votre log de lecture). Vous pourrez de plus synchoniser vos données entre plusieurs appareils</blockquote></p>

                <div id="user-area">${user_block}</div>

                <hr/>
                <h2>Export des données :</h2>
                
                <button id="export-json" style="">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-json-2"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/><path d="M4 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1"/><path d="M8 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1"/></svg>
                    &nbsp;Exporter au format JSON
                </button>
                <button id="share-json">
                    Partager la sauvegarde
                </button>


                <hr/>
                <h2>Import des données :</h2>
                    <button id="import-json">Importer un fichier JSON</button>
                    <input type="file" id="import-json-file" style="display: none; "/>
            </div>`; 

        CONTAINER.innerHTML = HTMLcontent; 
        CONTAINER.style.opacity = "1"; 



        // EVENTS HANDLER 

        // signin : 
        const signinForm = document.querySelector('#signin-form'); 
        if (signinForm) {
            signinForm.addEventListener('submit', event => {
                event.preventDefault(); 
                let login = event.target.querySelector('#login').value; 
                let password = event.target.querySelector('#password').value; 
                authentifyUser(login, password)
                    .then(res => {
                        console.log('Connection ? ', res); 
                        if (res.success) {
                            location.reload(); 
                        } else {
                            event.target.innerHTML = `<p>Identifiants incorrects, <a href="javascript:location.reload()">veuillez réessayer</a></p>`; 
                        }
                    }); 

            })
        }

        // send JSON online : 
        const synchronizeJSON = document.querySelector('#synchronize-json'); 
        if (synchronizeJSON) {
            synchronizeJSON.addEventListener('click', event => {
                let jsonStr = JSON.stringify(wishlist.books); 

                let jsonFile = new Blob([jsonStr], { type: 'application/json' }); 
                let data = new FormData(); 
                data.append('json', jsonFile); 

                let token = retrievedToken(); 

                fetch(CONFIG.api_source + 'json' + '&token=' + token, {
                    method: 'POST', 
                    body: data
                })
                    .then(res => res.text())
                    .then(text => {
                        console.log(text); 
                        console.log(JSON.parse(text)); 
                        let response = JSON.parse(text); 
                        if (response.success) {
                            new QuickToast('Sauvegarde en ligne réussie').display();
                        }
                    })
            })
        }

        //export JSON 
        const exportJSON = document.getElementById('export-json'); 
        exportJSON.addEventListener('click', event => {
            console.log('export JSON : ', wishlist.books);
            let dataStr = JSON.stringify(wishlist.books); 
            let dataUri = URL.createObjectURL(
                new Blob([dataStr], { type: 'application/json' })
            ); 
            let now = new Date(); 
            let dateString = now.getFullYear() + '.' + String(now.getMonth()+1).padStart(2, '0') + '.' + String(now.getDate()).padStart(2, '0') + '-' + String(now.getHours()).padStart(2, '0') + '.' + String(now.getMinutes()).padStart(2, '0'); 
            let fileName = `${ dateString }_export-read-books.json`; 
            let linkElt = document.createElement('a'); 
            linkElt.setAttribute('href', dataUri);
            linkElt.setAttribute('download', fileName);
            linkElt.click(); 
            URL.revokeObjectURL(dataUri); 
        })

        // share JSON 
        const shareJSON = document.getElementById('share-json'); 
        shareJSON.click(); 
        shareJSON.addEventListener('click', event => {
            console.log('share JSON : ', wishlist.books);
            let dataStr = JSON.stringify(wishlist.books); 
            let dataUri = URL.createObjectURL(
                new Blob([dataStr], { type: 'application/json' })
            ); 
            let blob = new Blob([dataStr], { type: 'application/json' }); 
            
            let now = new Date(); 
            let dateString = now.getFullYear() + '.' + String(now.getMonth()+1).padStart(2, '0') + '.' + String(now.getDate()).padStart(2, '0') + '-' + String(now.getHours()).padStart(2, '0') + '.' + String(now.getMinutes()).padStart(2, '0'); 
            let fileName = `${ dateString }_export-read-books.json`; 

            let file_to_share = new File([blob], fileName, {type: 'application/json'}); 
            console.log(file_to_share); 
           

            if (navigator.canShare && navigator.canShare({ files: [file_to_share] })) {
                navigator.share({
                    files: [file_to_share], 
                    title: fileName, 
                    text: 'Export donnée appli read books'
                }).then((res) => {
                    console.log('sharing successfull'); 
                    new QuickToast('Partage réussi').display();

                }).catch((error) => {
                    alert('share error : ' + error)
                    console.log('share error : ', error); 
                })
            } else {
                alert('Votre système ne permet pas le partage'); 
            }
            
        })

        // import JSON 
        const import_json_btn = document.querySelector('#import-json'); 
        const input_json = document.querySelector('#import-json-file'); 
        import_json_btn.addEventListener('click', evt => {
            input_json.click(); 
        })
        input_json.addEventListener('change', event => {
            console.log(event.currentTarget.files[0]); 
            let file = event.currentTarget.files[0]; 
            if (file.type !== 'application/json') {
                new QuickToast('❌ Erreur : format de fichier invalide, veuillez charger un fichier .JSON').display(); 
                return; 
            }
            let reader = new FileReader(); 
            reader.readAsText(file); 
            reader.onload = (evt) => {
                try {
                    wishlist.importFromJSON(evt.target.result); 
                    new QuickToast('Import des données JSON effectué avec succès').display(); 
                } catch(err) {
                    new QuickToast(`❌ Erreur lors de l'import : ` + err.message).display(); 
                }
            }; 
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
                new QuickToast().display({message: err, delay: 10000})
            }
        })
    }

















/* ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
    static settings() {
        const CONTAINER = document.querySelector('#app-container'); 

        let storedUser = JSON.parse(localStorage.getItem('stored-user')) || {"theme": "default"}; 
        let selectedTheme = storedUser.theme; 

        let html = `<h1>Paramètres</h1>
            <div>Thème : </div>
            <select id="theme-selector">
                
                <option value="light" ${selectedTheme === 'light' ? 'selected':''}>Clair</option>
                <option value="dark" ${selectedTheme === 'dark' ? 'selected':''}>Sombre</option>

                <option value="default" ${selectedTheme === 'default' ? 'selected':''}>Défaut système</option>
            </select>`; 


        CONTAINER.innerHTML = html; 

        // EVENTS : 
        const themeSelector = document.querySelector('#theme-selector'); 

        themeSelector.addEventListener('change', evt => {
            console.log(evt.target.value); 
            let storedUser = JSON.parse(localStorage.getItem('stored-user')) || {};
            storedUser.theme = evt.target.value;  
            localStorage.setItem('stored-user', JSON.stringify(storedUser)); 
            applyPreferredTheme(); 
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


        let booksCards = ''; 
        books_list.forEach(b => {
            //is reading session active ?
            // console.log(b.readingSessionIsOnGoing()); 
            let readingSessionHTML = ''; 
            b.readingSessionIsOnGoing() ? readingSessionHTML = this.stop_reading_session_button(b.google_id) : readingSessionHTML =  this.record_reading_button(b.google_id) ; 

            

            // display progression bar : 
            let progression_bar = ''; 
            if (b.progression.max && b.progression.current) {
                let percentage = (b.progression.current / b.progression.max) * 100; 
                progression_bar = `<div class="progression-bar__container">
                    <div class="progression-bar" style="width: 0%;" data-progression="${percentage}"></div>
                </div>`; 
            }


            // fill card template : 
            booksCards += `<a href="#/book/${b.google_id}" id="id${b.google_id}" class="current-reading__card" style="width: calc(${ 100 / books_list.length }% - ${(books_list.length-1) * 12}px); ">
                <img src="${b.miniature_link}" width="84"/>
                <div>
                    <h3>${b.title}</h3>
                    <div class="reading-session-btn__container" data-book-id="${b.google_id}">${ readingSessionHTML }</div>
                </div>
                <div class="days-counter">
                    <div class="stats ${b.readingSessionIsOnGoing() ? 'maxheight0' : ''}">
                    ${Utils.calculateNumberOfDaysBetweenTwoTimestamps(b.started_date, Date.now())}j.
                    ${b.calculateReadingTime() > 0 ? ' / ' + Time.formatMs(b.calculateReadingTime()) : ''}
                    </div>
                    <div class="counter ${b.readingSessionIsOnGoing() ? '' : 'maxheight0'}">
                    
                    </div>
                </div>
                ${ progression_bar }
            </a>
            `; 

            // launch timer if reading session is on going : 
            if (b.readingSessionIsOnGoing()) {
                let startTimestamp = b.reading_log[ b.reading_log.length-1 ].start; 
                timers.push(setInterval(() => {
                    document.querySelector(`#current-reading #id${b.google_id} .days-counter .counter`).textContent = Time.formatMsMinSec(Date.now() - startTimestamp); 
                }, 1000));
            }
        })

        HTMLContent = `
        <div id="current-reading" ${books_list.length === 1 ? `class="single-current"` : '' }>
            <h2 class="">Lecture${books_list.length > 1 ? 's' : ''} en cours :</h2>
            <div class="current-reading__container" >
                <div class="current-reading__scroller" style="width: ${books_list.length * 90}%;">
                    ${booksCards}
                </div>
            </div>
        </div>`; 


        // launch progression animation : 
        window.addEventListener('renderedHTML', evt => {
            let all_progress_bar = document.querySelectorAll('[data-progression]'); 
            let delay = 0; 
            all_progress_bar.forEach(element => {
                setTimeout(() => {
                    element.style.width = element.dataset.progression + '%'; 
                }, 1000 + delay); 
                delay = delay + 600; 
            })
        })
        

        

        return HTMLContent; 
    }















    static template_list(list, options) {
        let HTMLcontent = ''; 

        let id = options.id || ''; 
        let list_name = options.name || ''; 
        let books_list = list; 

        const owned_icon = `
            <span style="color: var(--accent);position: relative;top: 6px;"><svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z"/><rect x="2" y="19" width="20" height="1" rx=".5" fill="currentColor"/><path d="M5 20h2v1a1 1 0 1 1-2 0v-1ZM17 20h2v1a1 1 0 1 1-2 0v-1ZM4 6h4v12H4zM4 2h4v3H4zM9 5h3v9H9zM9 15h3v3H9zM13 6.026 16 5l4 12-3 1-4-11.974Z" fill="currentColor"/></svg></span>`; 
        

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
                if (books_list[i].finished_date) {
                    dateAdded = `<span class="added-date">Terminé le ${ new Date(books_list[i].finished_date).toLocaleDateString() }</span>`
                }
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






    static record_reading_button() {
        return `<button class="reading-session-btn" data-action="record"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-darkreader-inline-stroke="" style="--darkreader-inline-stroke:currentColor;"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></button>`; 
    }
    static stop_reading_session_button() {
        return `<button class="reading-session-btn active" data-action="stop"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-darkreader-inline-stroke="" style="--darkreader-inline-stroke:currentColor;"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg></button>`; 
    }
    static icon_statistics() {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bar-chart-2"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>`; 
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



    // HANDLER READING SESSIONS : 
    const allCurrentReading = document.querySelectorAll('a.current-reading__card'); 
    allCurrentReading.forEach(elt => {
        elt.addEventListener('click', event => {
            event.preventDefault(); 
            window.location.href = event.currentTarget.href; 
        })
    })

    const handleReadingSession = document.querySelectorAll('.reading-session-btn__container'); 
    handleReadingSession.forEach(btn => {
        btn.addEventListener('click', event => {
            event.stopPropagation(); 
            event.preventDefault(); 
            let container = event.currentTarget; 
            let indexOfBook = wishlist.getIndexOfSingleBookByID(container.dataset.bookId);
            let b = wishlist.books[indexOfBook];
            let action = container.querySelector('button').dataset.action; 
             
            if (action === 'record') {
                wishlist.books[indexOfBook].recordReadingSession(); 
                wishlist.saveWishlist(); 
    
                // animate : 
                container.querySelector('button').classList.remove('appear');
                container.querySelector('button').classList.add('vanish'); 
                Utils.wait(200).then(() => {
                    container.innerHTML = this.stop_reading_session_button(); 
                    container.querySelector('button').classList.remove('vanish'); 
                    container.querySelector('button').classList.add('appear'); 
                })   
                //launch timer : 
                // let startTimestamp = b.reading_log[ b.reading_log.length-1 ].start; 
                // console.log(Time.formatMsMinSec(Date.now() - startTimestamp)); 
                // const timer = setInterval(() => {
                //     document.querySelector(`#current-reading #id${b.google_id} .days-counter`).textContent = Time.formatMsMinSec(Date.now() - startTimestamp); 
                // }, 1000); 
                let startTimestamp = b.reading_log[ b.reading_log.length-1 ].start; 
                document.querySelector(`#current-reading #id${b.google_id} .days-counter .counter`).textContent = Time.formatMsMinSec(Date.now() - startTimestamp); 
                timers.push(setInterval(() => {
                    document.querySelector(`#current-reading #id${b.google_id} .days-counter .counter`).textContent = Time.formatMsMinSec(Date.now() - startTimestamp); 
                }, 1000));
                document.querySelector(`#current-reading #id${b.google_id} .days-counter .stats`).classList.add('maxheight0'); 
                document.querySelector(`#current-reading #id${b.google_id} .days-counter .counter`).classList.remove('maxheight0');

                console.log(timers); 
            } else {
                wishlist.books[indexOfBook].stopReadingSession(); 
                wishlist.saveWishlist(); 
                
                // animate : 
                container.querySelector('button').classList.remove('appear');
                container.querySelector('button').classList.add('vanish');
                Utils.wait(200).then(() => {
                    container.innerHTML = this.record_reading_button(); 
                    container.querySelector('button').classList.remove('vanish'); 
                    container.querySelector('button').classList.add('appear'); 
                })
                //stop timer : 
                // clearInterval(timers[timers.length-1]); 
                timers.forEach(timer => {
                    clearInterval(timer); 
                })
                console.log(timers); 
                console.log(document.querySelector(`#current-reading #id${b.google_id} .days-counter`).textContent); 
                document.querySelector(`#current-reading #id${b.google_id} .days-counter .stats`).textContent = `${Utils.calculateNumberOfDaysBetweenTwoTimestamps(b.started_date, Date.now())}j. / ${Time.formatMs(b.calculateReadingTime()) }`; 
                document.querySelector(`#current-reading #id${b.google_id} .days-counter .stats`).classList.remove('maxheight0'); 
                document.querySelector(`#current-reading #id${b.google_id} .days-counter .counter`).classList.add('maxheight0');
            }
        })
    })
}






}

