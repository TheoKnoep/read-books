

// Navigation Primary Button : 
function toggleAddButton(elt) {
	console.log(checkStateButton()); 
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
	if (route === '#/add') {
		return 1; 
	} else {
		return 0; 
	}
}
