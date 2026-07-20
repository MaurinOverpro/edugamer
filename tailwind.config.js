/** @type {import('tailwindcss').Config} */
// Scansiona TUTTE le fonti da cui possono uscire nomi di classe Tailwind:
// gli HTML (incluso il JSX inline) e game-system.js. Se aggiungi un file
// nuovo con classi Tailwind, aggiungilo qui, poi rilancia `npm run build`.
export default {
  content: ['./*.html', './game-system.js'],
  theme: { extend: {} },
  plugins: [],
};
