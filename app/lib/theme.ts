export const fractionalTheme = {
  name: 'fractional-aeco',
  primary: '#C41230',
  primaryHover: '#A50E28',
  bg: '#0A0A0A',
  bgCard: '#141414',
  bgLight: '#F8F8F8',
  border: '#242424',
  borderLight: '#E5E5E5',
  accent: '#C41230',
  accentLight: '#FF3352',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textDark: '#0A0A0A',
}

export function getThemeScript() {
  const t = fractionalTheme
  return `
    (function() {
      var r = document.documentElement;
      r.style.setProperty('--color-primary', '${t.primary}');
      r.style.setProperty('--color-primary-hover', '${t.primaryHover}');
      r.style.setProperty('--color-bg', '${t.bg}');
      r.style.setProperty('--color-bg-card', '${t.bgCard}');
      r.style.setProperty('--color-bg-light', '${t.bgLight}');
      r.style.setProperty('--color-border', '${t.border}');
      r.style.setProperty('--color-border-light', '${t.borderLight}');
      r.style.setProperty('--color-accent', '${t.accent}');
      r.style.setProperty('--color-accent-light', '${t.accentLight}');
      document.documentElement.style.backgroundColor = '${t.bg}';
    })();
  `
}