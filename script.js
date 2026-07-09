
const siteLoader = document.querySelector('[data-site-loader]');
const hideSiteLoader = () => {
  if (!siteLoader) return;
  siteLoader.classList.add('is-hidden');
  window.setTimeout(() => siteLoader.remove(), 520);
};

window.addEventListener('load', () => {
  window.setTimeout(hideSiteLoader, 1700);
});
window.setTimeout(hideSiteLoader, 4200);
const nav = document.querySelector('[data-nav]');
const toast = document.querySelector('.toast');

const setNavState = () => {
  nav?.classList.toggle('is-scrolled', window.scrollY > 24);
};

window.addEventListener('scroll', setNavState, { passive: true });
setNavState();

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const value = button.getAttribute('data-copy');
    try {
      await navigator.clipboard.writeText(value);
      if (toast) {
        toast.hidden = false;
        window.clearTimeout(window.__toastTimer);
        window.__toastTimer = window.setTimeout(() => {
          toast.hidden = true;
        }, 1800);
      }
    } catch (error) {
      button.textContent = value;
    }
  });
});

const lightbox = document.querySelector('[data-lightbox]');
const lightboxImage = document.querySelector('[data-lightbox-image]');
const lightboxCaption = document.querySelector('[data-lightbox-caption]');
const lightboxClose = document.querySelector('[data-lightbox-close]');

const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.hidden = true;
};

document.querySelectorAll('[data-lightbox-src]').forEach((button) => {
  button.addEventListener('click', () => {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    const src = button.getAttribute('data-lightbox-src');
    const title = button.getAttribute('data-lightbox-title') || button.querySelector('img')?.alt || '';
    lightboxImage.src = src;
    lightboxImage.alt = title;
    lightboxCaption.textContent = title;
    lightbox.hidden = false;
  });
});

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});


