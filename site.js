(() => {
  const key = 'pathwise-theme';
  let saved = 'dark';
  try { saved = localStorage.getItem(key) || 'dark'; } catch (_) {}
  document.documentElement.dataset.theme = saved;
  const nav = document.querySelector('.nav');
  if (nav && !nav.querySelector('.theme-toggle')) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle';
    button.setAttribute('aria-label', 'Switch color theme');
    const update = () => {
      const light = document.documentElement.dataset.theme === 'light';
      button.textContent = light ? '☾ Dark mode' : '☀ Light mode';
      button.setAttribute('aria-pressed', String(light));
    };
    button.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem(key, next); } catch (_) {}
      update();
    });
    nav.appendChild(button);
    update();
  }
})();
