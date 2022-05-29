
function toggleBtnText(element, btnText) {
    element.innerHTML = btnText;
}

function hideElement(element) {
    element.style.visibility = 'hidden'
}

function showElement(element) {
    element.style.visibility = 'visible'
}

function displayNone(element) {
    element.style.display = 'none'
}

function displayBlock(element) {
    element.style.display = 'block'
}

function removeBorder(element) {
    element.style.border = 'none';
}

export { toggleBtnText, hideElement, showElement, removeBorder, displayNone, displayBlock }