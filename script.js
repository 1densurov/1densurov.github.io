
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

// --- Donate Page Logic ---
const initDonateLogic = () => {
  const chooseButtons = document.querySelectorAll('.donate-choose-btn');
  const checkoutSection = document.getElementById('checkout-section');
  const summaryTierName = document.getElementById('summary-tier-name');
  const summaryTierPrice = document.getElementById('summary-tier-price');
  const checkoutForm = document.getElementById('checkout-form');
  const cancelCheckoutBtn = document.getElementById('btn-cancel-checkout');
  
  const paymentModal = document.getElementById('payment-modal');
  const paymentLoader = document.getElementById('payment-loader');
  const paymentSuccess = document.getElementById('payment-success');
  const closePaymentModalBtn = document.getElementById('btn-close-payment-modal');
  const playerNickConfirm = document.getElementById('player-nick-confirm');
  
  let selectedTier = '';
  let selectedPrice = 0;

  if (chooseButtons.length === 0) return; // Not on donate page

  chooseButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedTier = btn.getAttribute('data-tier');
      selectedPrice = btn.getAttribute('data-price');
      
      let tierDisplayName = 'Ранг';
      if (selectedTier === 'squire') tierDisplayName = 'Сквайр';
      if (selectedTier === 'knight') tierDisplayName = 'Рыцарь';
      if (selectedTier === 'baron') tierDisplayName = 'Барон';

      if (summaryTierName) summaryTierName.textContent = tierDisplayName;
      if (summaryTierPrice) summaryTierPrice.textContent = `${selectedPrice} ₽`;
      
      if (checkoutSection) {
        checkoutSection.style.display = 'block';
        checkoutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  if (cancelCheckoutBtn && checkoutSection) {
    cancelCheckoutBtn.addEventListener('click', () => {
      checkoutSection.style.display = 'none';
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nicknameInput = document.getElementById('mc-nickname');
      const nickname = nicknameInput ? nicknameInput.value.trim() : '';

      if (!nickname) return;

      if (paymentModal && paymentLoader && paymentSuccess) {
        paymentModal.style.display = 'flex';
        paymentLoader.style.display = 'flex';
        paymentSuccess.style.display = 'none';

        // Simulate API call to checkout gateway
        setTimeout(() => {
          paymentLoader.style.display = 'none';
          paymentSuccess.style.display = 'block';
          if (playerNickConfirm) playerNickConfirm.textContent = nickname;
        }, 2200);
      }
    });
  }

  if (closePaymentModalBtn && paymentModal && checkoutSection && checkoutForm) {
    closePaymentModalBtn.addEventListener('click', () => {
      paymentModal.style.display = 'none';
      checkoutSection.style.display = 'none';
      checkoutForm.reset();
    });
  }
};

// Run when script loaded
document.addEventListener('DOMContentLoaded', () => {
  fetchServerStatus();
  initDonateLogic();
});
// Fallback if DOMContentLoaded already fired
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  fetchServerStatus();
  initDonateLogic();
}


