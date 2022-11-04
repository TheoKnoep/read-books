

// Navigation Primary Button : 
function toggleAddButton(elt) {
	if (checkStateButton() === 1) {
		disactivateButton(elt); 
	} else {
		activateButton(elt); 
	}
}

function activateButton(elt) {
	elt.classList.add('active');
	window.location.hash = "#/add"; 
}
function disactivateButton(elt) {
	elt.classList.remove('active');
	window.location.hash = "#/"; 
}

function checkStateButton() {
	let route = window.location.hash; 
	if (route.includes('#/add')) {
		return 1; 
	} else {
		return 0; 
	}
}
function applyRightBtnStyle() {
	if (checkStateButton() === 1) {
		document.querySelector("#open-search-btn").classList.add('active');
	} else {
		document.querySelector("#open-search-btn").classList.remove('active');
	}
}

window.addEventListener('load', applyRightBtnStyle); 
window.addEventListener('hashchange', applyRightBtnStyle); 


window.addEventListener('scroll', modifyPositionOfMainButton); 

function modifyPositionOfMainButton() {
	const btn = document.querySelector('#open-search-btn'); 
	let ascending = this.oldScroll > this.scrollY;
	if (ascending) {
		btn.style.bottom = '.6em'; 
	} else {
		btn.style.bottom = '-2.6em'; 
	}
	this.oldScroll = this.scrollY;
}





// More Actions btn
function getAllButtons() {
	let res = document.querySelectorAll('.more-actions-btn'); 
	return res; 
}


