// Convertir l'image en base64
function convertFileToB64(file, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
        callback(reader.result);
    }, false);
    reader.readAsDataURL(file);
}

function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]); // Exclut le préfixe de type de données
        reader.onerror = error => reject(error);
    });
}

// Redimensionner et compresser l'image
function compressImage(file, quality) {
    convertFileToB64(file, (base64) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
            // Utiliser compressedBase64 comme nécessaire : 
            // ...
        };
        img.src = base64;
    });
}

// Appel de la fonction pour compresser une image avec une qualité de 50%
// compressImage(yourImageFile, 0.5);