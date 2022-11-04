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
}