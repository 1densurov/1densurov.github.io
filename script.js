
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

// --- Minecraft Server Status ---
const fetchServerStatus = async () => {
  const ip = 'play.mineream.ru';
  const headerBadge = document.getElementById('header-online-badge');
  const statusContainer = document.getElementById('server-status-container');
  const statusIndicator = document.getElementById('status-indicator');
  const statusText = document.getElementById('status-text');

  try {
    const res = await fetch(`https://api.mcstatus.io/v2/status/java/${ip}`);
    if (!res.ok) throw new Error('API Error');
    const data = await res.json();

    if (data.online) {
      const onlinePlayers = data.players.online;
      const maxPlayers = data.players.max;

      // Update Header Badge
      if (headerBadge) {
        const countSpan = headerBadge.querySelector('.online-count');
        if (countSpan) countSpan.textContent = `${onlinePlayers} онлайн`;
        headerBadge.style.display = 'flex';
      }

      // Update Homepage Card Status
      if (statusIndicator && statusText) {
        statusIndicator.className = 'status-indicator online';
        statusText.textContent = `Сервер онлайн • Игроков: ${onlinePlayers} / ${maxPlayers}`;
      }
    } else {
      throw new Error('Server offline');
    }
  } catch (err) {
    console.warn('Failed to fetch server status:', err);
    if (statusIndicator && statusText) {
      statusIndicator.className = 'status-indicator offline';
      statusText.textContent = 'Сервер временно недоступен';
    }
    if (headerBadge) {
      headerBadge.style.display = 'none';
    }
  }
};

// --- Mobile Navigation Menu Toggle ---
const initMobileNav = () => {
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
      mainNav.classList.toggle('is-active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !mainNav.contains(e.target)) {
        navToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('is-active');
      }
    });
  }
};

// --- FAQ Accordion Logic ---
const initFaqAccordion = () => {
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      const targetId = trigger.getAttribute('aria-controls');
      const content = document.getElementById(targetId);
      const icon = trigger.querySelector('.faq-icon');

      // Toggle state
      trigger.setAttribute('aria-expanded', !expanded);
      if (icon) {
        icon.textContent = expanded ? '＋' : '－';
      }
      if (content) {
        content.hidden = expanded;
      }
    });
  });
};

// Run when DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  fetchServerStatus();
  initMobileNav();
  initFaqAccordion();
});
// Fallback if DOMContentLoaded already fired
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  fetchServerStatus();
  initMobileNav();
  initFaqAccordion();
}


