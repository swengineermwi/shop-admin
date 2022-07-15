const g = (e) => {
  return document.getElementById(e);
}

const c = (e, classes) => {
  const element = document.createElement(e)
  element.className = classes
  return element
}

const openModal = (element, callback) => {
  var event = new CustomEvent('openModal');
  element.dispatchEvent(event);
  element.addEventListener('modalIsClose', callback);
};

const openModal_v2 = (modal, callback) => {
  const element = g(modal);
  var event = new CustomEvent('openModal');
  element.dispatchEvent(event);
  element.addEventListener('modalIsClose', callback);
};

function closeModal(modal) {
  const element = g(modal);
  var event = new CustomEvent('closeModal');
  element.dispatchEvent(event);
};

function closeDrawer(modal) {
  const element = g(modal);
  var event = new CustomEvent('closeDrawer');
  element.dispatchEvent(event);
};

export { g, c, openModal, openModal_v2, closeModal, closeDrawer}