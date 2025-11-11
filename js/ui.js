// ui.js — автономный, подключается как обычный скрипт

(function () {
  console.log('[ui.js] loaded');

  // --- translations ---
  const i18n = {
    en: {
      title: "The Three Whales of Fortune",
      subtitle: "Canada’s Big 3 Lotteries Await You",
      menu: "Menu",
      notifications: "🔔 Notifications",
      receive_notifications_permition: "Allow notifications to receive reminders",
      enable_notifications: "Enable notifications",
      lotto_max: "Lotto Max",
      lotto_649: "Lotto 6/49",
      daily_grand: "Daily Grand",
      next_draw: "Next Draw",
      quick_pick: "Quick Pick",
      stats: "Stats",
      wins: "Wins",
      hints: "Hints",
      today: "Today",
      ok: "OK",
      jackpot: "Jackpot",
      gold_ball_jackpot: "Gold Ball Jackpot",
      last_numbers: "Last Numbers"
    },
    fr: {
      title: "Les Trois Baleines de la Fortune",
      subtitle: "Les 3 grandes loteries du Canada vous attendent",
      menu: "Menu",
      notifications: "🔔 Notifications",
      receive_notifications_permition: "Autorisez les notifications pour recevoir des rappels",
      enable_notifications: "Activer les notifications",
      lotto_max: "Lotto Max",
      lotto_649: "Lotto 6/49",
      daily_grand: "Grande Vie",
      quick_pick: "Sélection rapide",
      stats: "Statistiques",
      wins: "Gains",
      hints: "Astuces",
      today: "Aujourd'hui",
      ok: "OK",
      next_draw: "Prochain tirage",
      jackpot: "Cagnotte",
      gold_ball_jackpot: "Cagnotte Boule d’or",
      last_numbers: "Derniers numéros"
    }
  };

  // --- helpers ---
  const $id = id => document.getElementById(id);
  const $all = sel => Array.from(document.querySelectorAll(sel));
  const safeText = (el, txt) => { if (el) el.textContent = txt; };

  // --- apply translations where elements exist ---
  function applyTranslations(lang) {
    const t = i18n[lang] || i18n.en;
    document.documentElement.lang = lang;
    safeText($id('title'), t.title);
    safeText($id('subtitle'), t.subtitle);
    safeText($id('menuTitle'), t.menu);
    safeText($id('notificationsHdr'), t.notifications);
    safeText($id('receivePerm'), t.receive_notifications_permition);
    safeText($id('enablePerm'), t.enable_notifications);
    safeText($id('navMax'), t.lotto_max);
    safeText($id('nav649'), t.lotto_649);
    safeText($id('navDaily'), t.daily_grand);

    // lotto-max specifics
    safeText($id('nextDrawTitle'), t.next_draw);
    safeText($id('navQuikPick'), t.quick_pick);
    safeText($id('navStarts'), t.stats);
    safeText($id('navWins'), t.wins);
    safeText($id('navHints'), t.hints);

    // --- lotto 649 specifics ---
    safeText($id('lotto_649-title'), t.lotto_649);
    safeText($id('lotto_649-nextDrawTitle'), t.next_draw + ":");
    safeText($id('lotto_649-jackpotTitle'), t.jackpot + ":");
    safeText($id('lotto_649-goldBallTitle'), t.gold_ball_jackpot + ":");
    safeText($id('lotto_649-numbersTitle'), t.last_numbers + ":");

    // --- daily grand specifics ---
    safeText($id('daily_grand-title'), t.daily_grand);
    safeText($id('daily_grand-nextDrawTitle'), t.next_draw + ":");
    safeText($id('daily_grand-jackpotTitle'), t.jackpot + ":");
    safeText($id('daily_grand-numbersTitle'), t.last_numbers + ":");

  }

  // --- language init ---
  function initLanguage() {
    const saved = localStorage.getItem('lang') || 'en';
    applyTranslations(saved);

    // if there is a select element with id 'langSelect' use it
    const sel = $id('langSelect');
    if (sel) {
      sel.value = saved;
      sel.addEventListener('change', () => {
        const newLang = sel.value;
        localStorage.setItem('lang', newLang);
        applyTranslations(newLang);
        console.log('[ui.js] language changed ->', newLang);
      });
    } else {
      // create small persistent language UI (if you like)
      // do nothing — saved lang still applied
      console.log('[ui.js] no langSelect found, applied saved lang:', saved);
    }
  }

  // --- drawer (menu) init ---
  function initDrawer() {
    const drawer = $id('drawer');
    const menuToggle = $id('menuToggle');
    const openDrawerBtn = $id('openDrawer');

    if (!drawer && !menuToggle && !openDrawerBtn) {
      console.log('[ui.js] no drawer/menu elements found — skipping drawer init');
      return;
    }

    // ensure aria-hidden default
    if (drawer && !drawer.hasAttribute('aria-hidden')) drawer.setAttribute('aria-hidden', 'true');

    if (menuToggle && drawer) {
      menuToggle.addEventListener('click', (e) => {
        drawer.classList.toggle('open');
        const isOpen = drawer.classList.contains('open');
        drawer.setAttribute('aria-hidden', (!isOpen).toString());
        e.stopPropagation();
      });
    }

    if (openDrawerBtn && drawer) {
      openDrawerBtn.addEventListener('click', (e) => {
        drawer.classList.add('open');
        drawer.setAttribute('aria-hidden', 'false');
        e.stopPropagation();
      });
    }

    // close on outside click
    document.addEventListener('click', (e) => {
      if (!drawer) return;
      if (!drawer.contains(e.target) && !(menuToggle && menuToggle.contains(e.target))) {
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
      }
    });

    console.log('[ui.js] drawer initialized');
  }

  // --- navigation with fade ---
  function navigateWithFade(url, delay = 200) {
    if (!url) return;
    // if same page, do nothing
    const current = window.location.pathname.split('/').pop();
    if (current === url) {
      console.log('[ui.js] navigateWithFade: already on', url);
      return;
    }
    document.body.classList.add('page-fade-out');
    setTimeout(() => window.location.href = url, delay);
  }

  // --- ball buttons ---
  function initBallButtons() {
    const mapping = {
      btnLottoMax: 'lottomax.html',
      btn649: 'lotto649.html',
      btnDaily: 'dailygrand.html'
    };
    Object.entries(mapping).forEach(([id, url]) => {
      const el = $id(id);
      if (!el) return;
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => navigateWithFade(url));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') navigateWithFade(url);
      });
      el.setAttribute('tabindex', '0');
    });
    console.log('[ui.js] ball buttons initialized');
  }

  // --- generic page buttons (lottomax) ---
  function initPageButtons() {
    const mapping = {
      navQuikPick: 'quickpick.html',
      navStarts: 'stats.html',
      navWins: 'wins.html',
      navHints: 'hints.html'
    };
    Object.entries(mapping).forEach(([id, url]) => {
      const el = $id(id);
      if (!el) return;
      el.addEventListener('click', () => navigateWithFade(url));
    });
  }

  // --- DOM ready init ---
  function initUI() {
    console.log('[ui.js] initUI start');
    initLanguage();
    initDrawer();
    initBallButtons();
    initPageButtons();
    // remove fade-out class if any (on load show fade-in)
    document.body.classList.remove('page-fade-out');
    console.log('[ui.js] initUI done');
  }

  // --- run when DOM loaded ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
  } else {
    initUI();
  }

  // expose small debug function (optional)
  window.__ui = {
    applyTranslations,
    navigateWithFade,
  };

})();

