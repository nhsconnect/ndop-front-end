function unhappyStateCallback() {
  window.location = '#mainContent';
  document.getElementById('errorBox').focus();
}

function inputFocus(event) {
  document.getElementById(event.target.name).focus();
}

export {
  unhappyStateCallback,
  inputFocus
};
