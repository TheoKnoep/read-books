/**
 * Outil qui permet d'afficher à la volée une boite de notification à l'utilisateur de type "toast"
 * Utilisation : 
 * - charger le code dans le fichier HTML : 
 * `<script src="/path/to/file/QuickToast.js"></script>`
 * 
 * - afficher un message : 
 * `new QuickToast("Le texte du message à afficher", 5000).display();`
 * 
 * - instancier un objet : 
 * `let toast = new QuickToast("Message par défaut", 5000); `
 * `toast.display("Le texte à afficher"); `
 */

class QuickToast {
    constructor(msg = '', delay = 3000) {
        this.msg = msg; 
        this.delay = delay; 
    }

    display(txt = this.msg, delay = this.delay) {
        let id = Math.floor(Math.random() * 1000000); 
        let template = this.fillTemplate(id, txt); 
        document.body.insertAdjacentHTML('beforeend', template); 
        const removeNotification = () => {
            // document.getElementById(`notif-${id}`).remove()
            this.removeFadeOut(document.getElementById(`notif-${id}`), 1000); 
        }
        setTimeout(removeNotification, delay); 
        document.getElementById(`notif-${id}`).addEventListener('click', (removeNotification)); 
    }

    fillTemplate(id, txt) {
        let successColor = "#20a779"; 
        return  `<div id="notif-${id}" style="position: fixed; z-index: 1; bottom: 1em; left: 1em; background-color: #fff; padding: .4em 1em; box-shadow: 1px 1px 4px rgba(0,0,0,.4); border-radius: 4px; border-left: solid ${successColor} 4px; color: ${successColor}; user-select: none; ">
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

}