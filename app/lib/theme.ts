export const themes = [
  {
    name: 'fractional-red',
    primary: '#C41230',
    primaryHover: '#A50E28',
    bg: '#0A0000',
    bgCard: '#1A0505',
    border: '#3D0F0F',
    accent: '#C41230',
    accentLight: '#FF4D4D',
  },
  {
    name: 'fractional-gold',
    primary: '#B8860B',
    primaryHover: '#D4A853',
    bg: '#0A0800',
    bgCard: '#1A1400',
    border: '#3D3000',
    accent: '#D4A853',
    accentLight: '#FFD700',
  },
  {
    name: 'red-gold',
    primary: '#C41230',
    primaryHover: '#A50E28',
    bg: '#0A0500',
    bgCard: '#1A0A00',
    border: '#3D1A00',
    accent: '#D4A853',
    accentLight: '#FFD700',
  },
  {
    name: 'navy',
    primary: '#1B2E6B',
    primaryHover: '#243D8F',
    bg: '#020510',
    bgCard: '#080D1F',
    border: '#151F3D',
    accent: '#4A7FD4',
    accentLight: '#7FAEE8',
  },
  {
    name: 'forest',
    primary: '#1A4D2E',
    primaryHover: '#226037',
    bg: '#010A04',
    bgCard: '#051409',
    border: '#0D2B12',
    accent: '#2ECC71',
    accentLight: '#5DDDAA',
  },
  {
    name: 'deep-purple',
    primary: '#4A1259',
    primaryHover: '#5E1870',
    bg: '#06010A',
    bgCard: '#100318',
    border: '#250635',
    accent: '#A855F7',
    accentLight: '#C084FC',
  },
]

export function getSessionTheme() {
  if (typeof window === 'undefined') return themes[0]
  const saved = sessionStorage.getItem('fractus-theme')
  if (saved) {
    const found = themes.find(t => t.name === saved)
    if (found) return found
  }
  const random = themes[Math.floor(Math.random() * themes.length)]
  sessionStorage.setItem('fractus-theme', random.name)
  return random
}

export function getThemeScript() {
  return `
    (function() {
      var themes = ${JSON.stringify(themes)};
      var saved = sessionStorage.getItem('fractus-theme');
      var theme = saved ? themes.find(function(t){return t.name===saved}) : null;
      if (!theme) {
        theme = themes[Math.floor(Math.random() * themes.length)];
        sessionStorage.setItem('fractus-theme', theme.name);
      }
      var r = document.documentElement;
      r.style.setProperty('--color-primary', theme.primary);
      r.style.setProperty('--color-primary-hover', theme.primaryHover);
      r.style.setProperty('--color-bg', theme.bg);
      r.style.setProperty('--color-bg-card', theme.bgCard);
      r.style.setProperty('--color-border', theme.border);
      r.style.setProperty('--color-accent', theme.accent);
      r.style.setProperty('--color-accent-light', theme.accentLight);
      document.documentElement.style.backgroundColor = theme.bg;
    })();
  `
}