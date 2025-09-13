let isOverlayOpen = false;

export function clickNavButton(link, navButtons) {
  link.classList.add('active');
  navButtons.forEach(notActiveLink => {
    if (notActiveLink.classList.contains('active') && notActiveLink.innerHTML !== link.innerHTML)
      notActiveLink.classList.remove('active');
  });
}

export function getOverlayState() {
  return isOverlayOpen;
}

export function openImageOverlay(imageSrc, imageAlt = '') {
  const overlay = document.getElementById('imageOverlay');
  const overlayImage = document.getElementById('overlayImage');

  if (!overlay) {
    console.error('Overlay element not found. Make sure the HTML structure exists.');
    return;
  }

  overlayImage.src = imageSrc;
  overlayImage.alt = imageAlt;

  overlay.style.display = 'flex';

  // Force reflow before adding active class for smooth transition
  overlay.offsetHeight;

  overlay.classList.add('active');
  isOverlayOpen = true;

  history.pushState({ overlayOpen: true }, '', '');

  document.body.style.overflow = 'hidden';
}

export function closeImageOverlay() {
  const overlay = document.getElementById('imageOverlay');

  if (!overlay) {
    console.error('Overlay element not found.');
    return;
  }

  overlay.classList.remove('active');
  isOverlayOpen = false;

  document.body.style.overflow = '';

  setTimeout(() => {
    if (!isOverlayOpen) {
      overlay.style.display = 'none';
    }
  }, 300);

  if (history.state && history.state.overlayOpen) {
    history.back();
  }
}