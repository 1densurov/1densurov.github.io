// --- Site Loader Logic ---
const siteLoader = document.querySelector('[data-site-loader]');
const hideSiteLoader = () => {
  if (!siteLoader) return;
  if (siteLoader.classList.contains('is-hidden')) return;
  siteLoader.classList.add('is-hidden');
  window.setTimeout(() => siteLoader.remove(), 520);
};

// Wait for window load or fallback to 2.5s maximum
window.addEventListener('load', hideSiteLoader);
window.setTimeout(hideSiteLoader, 2500);

const nav = document.querySelector('[data-nav]');
const toast = document.querySelector('.toast');

// --- Toast and Clipboard Copy Logic ---
const showToast = () => {
  if (!toast) return;
  toast.hidden = false;
  window.clearTimeout(window.__toastTimer);
  window.__toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 1800);
};

const fallbackCopyText = (text, button) => {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showToast();
    } else {
      alert(`Пожалуйста, скопируйте вручную: ${text}`);
    }
  } catch (err) {
    alert(`Пожалуйста, скопируйте вручную: ${text}`);
  }
  document.body.removeChild(textArea);
};

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', () => {
    const value = button.getAttribute('data-copy');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(value).then(() => {
        showToast();
      }).catch(() => {
        fallbackCopyText(value, button);
      });
    } else {
      fallbackCopyText(value, button);
    }
  });
});

// --- Scroll Styling ---
const setNavState = () => {
  nav?.classList.toggle('is-scrolled', window.scrollY > 24);
};
window.addEventListener('scroll', setNavState, { passive: true });
setNavState();

// --- Lightbox with Focus Trap ---
const lightbox = document.querySelector('[data-lightbox]');
const lightboxImage = document.querySelector('[data-lightbox-image]');
const lightboxCaption = document.querySelector('[data-lightbox-caption]');
const lightboxClose = document.querySelector('[data-lightbox-close]');
let lightboxTriggerElement = null;

const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.hidden = true;
  if (lightboxTriggerElement) {
    lightboxTriggerElement.focus();
    lightboxTriggerElement = null;
  }
};

document.querySelectorAll('[data-lightbox-src]').forEach((button) => {
  button.addEventListener('click', () => {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    const src = button.getAttribute('data-lightbox-src');
    const title = button.getAttribute('data-lightbox-title') || button.querySelector('img')?.alt || '';
    lightboxImage.src = src;
    lightboxImage.alt = title;
    lightboxCaption.textContent = title;
    lightboxTriggerElement = button;
    lightbox.hidden = false;
    lightboxClose?.focus();
  });
});

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

if (lightbox) {
  lightbox.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      lightboxClose?.focus();
    }
  });
}

// --- Minecraft Server Status ---
const fetchServerStatus = async () => {
  const ip = 'play.mineream.ru';
  const headerBadge = document.getElementById('header-online-badge');
  const statusIndicator = document.getElementById('status-indicator');
  const statusText = document.getElementById('status-text');

  try {
    const res = await fetch(`https://api.mcstatus.io/v2/status/java/${ip}`);
    if (!res.ok) throw new Error('API Error');
    const data = await res.json();

    if (data.online) {
      const onlinePlayers = data.players.online;
      const maxPlayers = data.players.max;

      // Update Header Badge (if exists)
      if (headerBadge) {
        const countSpan = headerBadge.querySelector('.online-count');
        if (countSpan) countSpan.textContent = `${onlinePlayers} онлайн`;
        headerBadge.style.display = 'flex';
      }

      // Update Hero status display
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

// --- Discord Live Widget Logic ---
const fetchDiscordWidget = async () => {
  const guildId = '931925987678113872'; // Testing ID provided by user
  const countSpan = document.getElementById('discord-online-count');
  const membersList = document.getElementById('discord-members-list');
  const inviteLink = document.getElementById('discord-widget-invite');

  if (!countSpan && !membersList) return; // Not on the page with widget

  try {
    const res = await fetch(`https://discord.com/api/guilds/${guildId}/widget.json`);
    if (!res.ok) throw new Error('Failed to load Discord widget');
    const data = await res.json();

    // Update online presence count
    if (countSpan) {
      countSpan.innerHTML = `<span class="presence-dot"></span>${data.presence_count || 0} онлайн`;
      countSpan.classList.add('online');
    }

    // Set correct instant invite link
    if (inviteLink && data.instant_invite) {
      inviteLink.href = data.instant_invite;
    }

    // Populate active online members avatars
    if (membersList && data.members) {
      membersList.innerHTML = '';
      // Limit to 12 active members
      const activeMembers = data.members.slice(0, 12);
      activeMembers.forEach(member => {
        const item = document.createElement('div');
        item.className = 'widget-member-avatar';
        item.title = member.username;
        item.innerHTML = `
          <img src="${member.avatar_url}" alt="${member.username}" loading="lazy">
          <span class="member-status-dot ${member.status}"></span>
        `;
        membersList.appendChild(item);
      });
    }
  } catch (err) {
    console.warn('Failed to fetch Discord widget:', err);
    if (countSpan) {
      countSpan.textContent = 'Сообщество MineReam';
    }
  }
};

// --- Single Safe Initialization ---
let isInitialized = false;
const initAll = () => {
  if (isInitialized) return;
  isInitialized = true;
  fetchServerStatus();
  fetchDiscordWidget();
  initMobileNav();
  initFaqAccordion();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}
