export function getThemeScript() {
  return `
    (function() {
      var r = document.documentElement;
      r.style.setProperty('--color-primary', '#D4A017');
      r.style.setProperty('--color-cyan', '#2DD4BF');
      r.style.setProperty('--color-bg', '#0D0A06');
      r.style.setProperty('--color-bg-card', '#141210');
      r.style.setProperty('--color-border', '#2A2420');
      document.documentElement.style.backgroundColor = '#0D0A06';
    })();
  `
}