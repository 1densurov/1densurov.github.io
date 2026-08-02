
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

const serverStatus = document.querySelector('[data-server-status]');
const serverStatusText = document.querySelector('[data-server-status-text]');

const renderServerStatus = (state, text) => {
  if (!serverStatus || !serverStatusText) return;
  serverStatus.classList.remove('is-checking', 'is-online', 'is-offline');
  serverStatus.classList.add(state);
  serverStatusText.textContent = text;
};

const loadServerStatus = async () => {
  if (!serverStatus) return;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 6500);

  try {
    const response = await fetch('https://api.mcsrvstat.us/3/play.mineream.ru', {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error('status request failed');

    const data = await response.json();
    const onlinePlayers = Number.isFinite(Number(data.players?.online)) ? Number(data.players.online) : 0;
    const maxPlayers = Number.isFinite(Number(data.players?.max)) ? Number(data.players.max) : 99;

    if (data.online) {
      renderServerStatus('is-online', `Сервер онлайн • Игроков: ${onlinePlayers} / ${maxPlayers}`);
    } else {
      renderServerStatus('is-offline', `Сервер офлайн • Игроков: 0 / ${maxPlayers}`);
    }
  } catch (error) {
    renderServerStatus('is-checking', 'Статус недоступен • Лимит: 99 игроков');
  } finally {
    window.clearTimeout(timeout);
  }
};

loadServerStatus();

const scrollTopButton = document.querySelector('[data-scroll-top]');
const updateScrollTopButton = () => {
  if (!scrollTopButton) return;
  scrollTopButton.hidden = window.scrollY < 520;
};

window.addEventListener('scroll', updateScrollTopButton, { passive: true });
updateScrollTopButton();

scrollTopButton?.addEventListener('click', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
});

// Brewery filters
(() => {
  const cards = Array.from(document.querySelectorAll("[data-recipe-card]"));
  const search = document.querySelector("[data-brewery-search]");
  const clear = document.querySelector("[data-brewery-clear]");
  const status = document.querySelector("[data-brewery-status]");
  const empty = document.querySelector("[data-brewery-empty]");
  const filters = Array.from(document.querySelectorAll("[data-brewery-filter]"));

  if (!cards.length || !search || !status) return;

  let activeCategory = "all";

  const update = () => {
    const query = search.value.trim().toLowerCase();
    let visible = 0;

    cards.forEach((card) => {
      const category = card.dataset.category || "";
      const text = card.dataset.search || "";
      const categoryMatch = activeCategory === "all" || category === activeCategory;
      const searchMatch = !query || text.includes(query);
      const show = categoryMatch && searchMatch;
      card.hidden = !show;
      if (show) visible += 1;
    });

    status.textContent = query || activeCategory !== "all"
      ? `Найдено рецептов: ${visible}.`
      : "Показаны все рецепты.";

    if (clear) clear.hidden = !query && activeCategory === "all";
    if (empty) empty.hidden = visible !== 0;
  };

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.breweryFilter || "all";
      filters.forEach((item) => item.classList.toggle("is-active", item === button));
      update();
    });
  });

  search.addEventListener("input", update);
  clear?.addEventListener("click", () => {
    search.value = "";
    activeCategory = "all";
    filters.forEach((item) => item.classList.toggle("is-active", item.dataset.breweryFilter === "all"));
    update();
    search.focus();
  });
})();
