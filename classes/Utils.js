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

		return ((final_time - start_time) / millisecondsInOneDay) + 1; 
				
	}
}