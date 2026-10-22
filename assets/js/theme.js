/**
 * Nidhi Pezhai - Dark Mode Controller
 * Accessible, keyboard-navigable, screen-reader friendly (Tamil)
 */
(function () {
  const STORAGE_KEY = 'np-theme';

  function getTheme() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') return stored;
    } catch (e) {}
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function syncChartJS(isDark) {
    if (window.Chart) {
      if (window.Chart.defaults) {
        window.Chart.defaults.color = isDark ? '#93ada5' : '#64748b';
        window.Chart.defaults.borderColor = isDark ? '#263c3a' : '#e2e8f0';
      }
      // If charts are currently active on page, update them
      if (typeof window.Chart.instances === 'object') {
        Object.values(window.Chart.instances).forEach(function (inst) {
          try {
            inst.update();
          } catch (e) {}
        });
      }
    }
  }

  function applyTheme(theme, announce) {
    const isDark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', theme);

    // Update meta theme-color for browser tab / mobile UI
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', isDark ? '#0f1717' : '#0D7377');
    }

    // Update all toggle buttons on page
    const toggles = document.querySelectorAll('.theme-toggle');
    const label = isDark ? 'ஒளி முறைக்கு மாற்று' : 'இருள் முறைக்கு மாற்று';
    toggles.forEach(function (btn) {
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    });

    // Screen reader live region announcement in Tamil
    if (announce) {
      let announcer = document.getElementById('theme-announcer');
      if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'theme-announcer';
        announcer.className = 'visually-hidden';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        document.body.appendChild(announcer);
      }
      announcer.textContent = isDark ? 'இருள் முறை இயக்கப்பட்டது' : 'ஒளி முறை இயக்கப்பட்டது';
    }

    // Synchronize Chart.js if present
    syncChartJS(isDark);

    // Dispatch global event for custom components
    window.dispatchEvent(new CustomEvent('np-theme-change', { detail: { theme: theme, isDark: isDark } }));
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {}
    applyTheme(next, true);
  }

  function init() {
    // Sync current buttons with active theme
    const active = document.documentElement.getAttribute('data-theme') || getTheme();
    applyTheme(active, false);

    // Bind click events using delegation on document to handle dynamic buttons seamlessly
    document.addEventListener('click', function (e) {
      const toggleBtn = e.target.closest('.theme-toggle');
      if (toggleBtn) {
        e.preventDefault();
        toggleTheme();
      }
    });

    // Listen for OS theme preference changes if user hasn't explicitly chosen
    try {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        try {
          if (!localStorage.getItem(STORAGE_KEY)) {
            applyTheme(e.matches ? 'dark' : 'light', true);
          }
        } catch (err) {
          applyTheme(e.matches ? 'dark' : 'light', true);
        }
      });
    } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

