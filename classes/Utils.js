class Utils {
	/**
	 * Return the first parent element which has the requested className
	 * @param { HTMLElement } elt 
	 * @param { String } className 
	 * @returns 
	 */
	static getParentOfClass(elt, className) {
		if (elt.classList.contains(className)) {
			return elt; 
		} else if (elt.parentElement.classList.contains(className)) {
			return elt.parentElement; 
		} else {
			return this.getParentOfClass(elt.parentElement, className); 
		}
	}

	static findFlag(countryCode) {
		const set = {
			'fr': 'fr', 
			'en': 'gb'
		}
		return set[countryCode] || countryCode; 
	}


	static shuffleArray(values) {
		let index = values.length,  randomIndex;
		
		// While there remain elements to shuffle.
		while (index != 0) {
		
			// Pick a remaining element.
			randomIndex = Math.floor(Math.random() * index);
			index--;
		
			// And swap it with the current element.
			[values[index], values[randomIndex]] = [
			values[randomIndex], values[index]];
		}
		
		return values;
	}



	static isVisibleInViewport(elt) {
		let rect = elt.getBoundingClientRect();
		return (rect.top < window.innerHeight && rect.bottom > 0); 
	}




	static calculateNumberOfDaysBetweenTwoTimestamps(a, b) {
		let start_time = new Date(Math.min(a,b)).setHours(0, 0, 0, 0); 
		let final_time = new Date(Math.max(a,b)).setHours(0, 0, 0, 0); 

		let millisecondsInOneDay = 1000 * 3600 * 24; 

		return Math.round(((final_time - start_time) / millisecondsInOneDay) + 1); 
				
	}

	static preventRightClick() {
		document.querySelectorAll('img, a').forEach(elt => {
			elt.addEventListener('contextmenu', event => {
				event.preventDefault(); 
			})
		})
	}


	static async wait(delay) {
		return new Promise(resolve => {
			setTimeout(() => { resolve() }, delay); 
		})
	}




	static detectNetworkStatus(target) {
		if (navigator.onLine) {
			target.style.display = 'none'; 
		} else {
			target.style.display = 'block'; 
		}
	}


	static formatBytes(bytes, decimals = 2) {
		if (bytes === 0) return '0 bytes';
		const k = 1024;
		const sizes = ['bytes', 'kb', 'Mb', 'Gb', 'Tb'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
	}

	static generateGUID() {
		// Générer un GUID aléatoire en utilisant la version 4 du format UUID
		// Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx (où x est une caractère hexadécimal et y est 8, 9, A ou B)
		var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		  var r = Math.random() * 16 | 0,
			  v = c === 'x' ? r : (r & 0x3 | 0x8);
		  return v.toString(16);
		});
		return guid;
	  }
	  
}