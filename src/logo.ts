// The site mark: blue peaks with white snow caps and an orange maple leaf. The .logo-* rules in style.css colour it.
export const logoPaths = '<path class="logo-peak" d="M1.5 21 9 3.5 13 10.5 16.5 6.5 22.5 21Z"/><path class="logo-snow" d="M9 3.5 5.8 11 7.9 9.4 9.6 11.2 12.4 9.5ZM16.5 6.5 13.5 9.9 15.2 9.3 16.7 10.8 18.4 11Z"/><path class="logo-leaf" d="m15 12.6 1.2 3.3 3.3-1.3-1.3 3 1.3 1.5-3.5 1-1-.5-1 .5-3.5-1 1.3-1.5-1.3-3 3.3 1.3Z"/>';

export const logoMark = () => `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">${logoPaths}</svg>`;
