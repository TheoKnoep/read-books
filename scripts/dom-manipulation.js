

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
	
	// return to the page right before all the searches : 
	let searchSteps = 1; 
    if (history.state) { searchSteps = history.state.step + 1 }
	history.go(-searchSteps); 
	history.state = null; 
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


window.addEventListener('scroll', modifyPositionOfMainButton); // !dev-only

function modifyPositionOfMainButton() {
	const btn = document.querySelector('#open-search-btn');
	const header = document.querySelector('header');  
	const footer = document.querySelector('footer'); 

	let ascending = this.oldScroll > this.scrollY;
	if (ascending) {
		btn.style.bottom = '1.8em'; 
		header.style.transform = `translateY(0px)`;
		footer.style.transform = `translateY(0px)`;
	} else {
		btn.style.bottom = '-2.6em'; 
		header.style.transform = `translateY(-${header.offsetHeight}px)`;
		footer.style.transform = `translateY(${footer.offsetHeight + 6 }px)`;
	}
	this.oldScroll = this.scrollY;
}





// More Actions btn
function getAllButtons() {
	let res = document.querySelectorAll('.more-actions-btn'); 
	return res; 
}


function applyFocusedMenuItem() {
	let currentHash = location.hash; 
	document.querySelectorAll('footer a').forEach(item => {
		// console.log(new URL(item.href).hash); 
		if (new URL(item.href).hash === currentHash) {
			item.classList.add('active'); 
		} else {
			item.classList.remove('active'); 
		}
	})
}

