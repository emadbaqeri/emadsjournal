(function () {
  try {
    var stored = localStorage.getItem('emaaad-theme');
    var theme = 'dark';
    if (stored === 'light') {
      theme = 'light';
    } else if (stored === 'system') {
      theme = window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark';
    }
    var root = document.documentElement;
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    root.style.colorScheme = theme;
  } catch (e) {
    /* localStorage can throw in privacy modes */
  }
})();
