export function getThemeScript() {
  return `
    (function() {
      var r = document.documentElement;
      r.style.setProperty('--color-primary', '#F6981F');
      r.style.setProperty('--color-primary-hover', '#E08710');
      r.style.setProperty('--color-teal', '#05809B');
      r.style.setProperty('--color-bg', '#0F1117');
      r.style.setProperty('--color-bg-card', '#1B2130');
      r.style.setProperty('--color-border', '#2A3145');
      document.documentElement.style.backgroundColor = '#0F1117';
    })();
  `
}