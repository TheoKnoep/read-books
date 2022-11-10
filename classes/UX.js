/**
 * Outil qui permet d'afficher à la volée une boite de notification à l'utilisateur de type "toast"
 * Utilisation : 
 * - charger le code dans le fichier HTML : 
 * `<script src="/path/to/file/UX.js"></script>`
 * 
 * -> QuickToast : affichage discret d'un message pour valider un feedback suite à une action utilisateur
 * -> UserChoice : un remplacement personnalisable à la boite de dialogue native "Confirm"
 */


/** 
 * QuickToast 
 * `let toast = new QuickToast("Message par défaut", 5000); `
 * `toast.display("Le texte à afficher"); `
 */

class QuickToast {
    constructor(msg = '', delay = 3000) {
        this.msg = msg; 
        this.delay = delay; 
    }

    display(options = {}) {
        //handle options : 
        let message = options.message || this.msg; 
        let delay = options.delay || this.delay; 
        let style = options.style || 'bottomLeft'; 


        // display : 
        let id = Math.floor(Math.random() * 1000000); 
        let template = this.fillTemplate(id, message, style); 
        document.body.insertAdjacentHTML('beforeend', template); 
        const removeNotification = () => {
            // document.getElementById(`notif-${id}`).remove()
            this.removeFadeOut(document.getElementById(`notif-${id}`), 1000); 
        }
        setTimeout(removeNotification, delay); 
        document.getElementById(`notif-${id}`).addEventListener('click', (removeNotification)); 
    }

    fillTemplate(id, txt, style) {
        let successColor = "#20a779"; 
        return  `<div 
                    class="quick-notification"
                    id="notif-${id}" 
                    style="
                        ${ this.listOfStyles(style) }
                    ">
                    ${txt}
                </div>`; 
    }

    removeFadeOut( el, speed ) {
        var seconds = speed/1000;
        el.style.transition = "opacity "+seconds+"s ease";
    
        el.style.opacity = 0;
        setTimeout(function() {
            el.parentNode.removeChild(el);
        }, speed);
    }


    listOfStyles(specificStyle) {
        let list = {
            bottomLeft: `position: fixed; 
                z-index: 1; 
                // width: calc(100% - 2em); 
                bottom: 1em; 
                left: 1em; 
                background-color: var(--text); 
                padding: .8em 2em; 
                box-shadow: 1px 1px 4px rgba(0,0,0,.4); 
                border-radius: 4px; 
                border-left: solid var(--accent) 4px; 
                color: var(--bg); 
                user-select: none;
                display: flex;
                align-items: center; 
                `, 
            topFull: `position: fixed; 
                width: calc(100% - 16px); 
                top: 16px; 
                left: 8px; 
                z-index: 1000; 
                background: var(--text); 
                color: var(--bg);
                padding: .8em 2em;
                box-shadow: 1px 1px 4px rgba(0,0,0,.4); 
                border-radius: 4px; 
                solid 1px var(--border);
                `, 
            smallBottomCenter: `
                position: fixed; 
                bottom: 16px; 
                z-index: 1000; 
                margin: auto; 
                border-radius: 120px; 
                background: var(--text); 
                color: var(--bg);
                padding: .4em 1em; 
                box-shadow: 1px 1px 4px rgba(0,0,0,.4); 
                opacity: .7; 
                font-size: 16px;
                text-align: center; 
                `
        }

        return list[specificStyle]; 
    }
}





class MoreActions {

}


class UserChoice {
    constructor(message = "Voulez-vous continuer ?", confirm = null, cancel = null, input = null) {
        this.id = this.createHash();  
        this.message = message; 
        this.confirm = confirm; 
        this.cancel = cancel; 
        this.input = input; 
    }

    applyStyle() {
        let style = `
            .user-choice-popin {
                position: fixed;
                width: 100%;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 999; 
            }
            .popin-background {
                position: absolute;
                width: 300%;
                height: 300%;
                background: #282828;
                opacity: .6;
            }
            .popin-content {
                position: absolute;
                max-width: 95%;
                z-index: 1;
                padding: 1em; 
                border-radius: 4px;
                padding-bottom: 0; 
                background: var(--bg);
                box-shadow: 4px 4px 24px rgb(0 0 0 / 40%);
            }
            .message__container {
                padding: 1em;
            }
            .btn-container {
                text-align: right;
                border-top: solid 1px var(--accent);
            }
            #cancel-btn {
                background: transparent;
                color: var(--accent);
            }
            
            `; 

        let moreStyle = document.createElement('style'); 
        moreStyle.id = `style-for-${this.id}`; 
        moreStyle.textContent = style; 
        document.head.append(moreStyle); 
    }

    returnTemplate() {
        return `
        <div id="popin-${this.id}" class="user-choice-popin" >
            <div class="popin-content">
                <p class="message__container" id="choice-text">${this.message}</p>
                ${this.input ? `<input type="date" id="date" >` : '' }
                <div class="btn-container">
                    ${ this.cancel ? `<button id="cancel-btn">${this.cancel}</button>` : ''}
                    ${ this.confirm ? `<button id="confirm-btn">${this.confirm}</button>` : ''}
                </div>
            </div>
            <div class="popin-background"></div>
        </div>`; 
    }

    waitFor() {
        let html = this.returnTemplate(); 
        this.applyStyle(); 
        document.body.insertAdjacentHTML('afterbegin', html); 
        document.querySelector(`#popin-${this.id} #cancel-btn`).focus();
        return new Promise((resolve, reject) => {
            if (document.querySelector(`#popin-${this.id} #confirm-btn`)) {
                document.querySelector(`#popin-${this.id} #confirm-btn`).addEventListener('click', event => {
                    let response = ''; 
                    if(document.getElementById('date')) { response = document.getElementById('date').value }; 
                    
                    document.querySelector(`#popin-${this.id}`).remove(); 
                    document.querySelector(`#style-for-${this.id}`).remove(); 
                    
                    resolve(response); 
                })
            }
            if (document.querySelector(`#popin-${this.id} #cancel-btn`)) {
                document.querySelector(`#popin-${this.id} #cancel-btn`).addEventListener('click', event => {
                    document.querySelector(`#popin-${this.id}`).remove(); 
                    document.querySelector(`#style-for-${this.id}`).remove(); 
                    reject(); 
                })
            }
            document.querySelector('.popin-background').addEventListener('click', event => {
                document.querySelector(`#popin-${this.id}`).remove(); 
                document.querySelector(`#style-for-${this.id}`).remove(); 
                reject(); 
            })
        })
    }

    createHash(length = 16) {
        const c = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMONPQRSTUVWXYZ1234567890"; 
        let res = ''; 
        for (let i = 0; i < length; i++) {
            res += c[ Math.floor(Math.random() * c.length) ]; 
        }
        return res; 
    }

    
}