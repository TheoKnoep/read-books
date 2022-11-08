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
}