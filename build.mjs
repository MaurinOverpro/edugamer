#!/usr/bin/env node
/*
 * EduGamer — build di produzione.
 *
 * Cosa fa:
 *   1. Genera un CSS Tailwind STATICO (solo le classi usate) → docs/assets/tailwind.css
 *   2. Per ogni .html della radice:
 *        - precompila il JSX inline (<script type="text/babel">) in JS normale
 *          → niente più Babel nel browser
 *        - sostituisce il CDN di Tailwind con il CSS statico
 *   3. Copia gli asset (game-system.js, font, immagini) in docs/
 *
 * I file che MODIFICHI restano quelli della radice (con i CDN, per anteprima
 * immediata aprendoli nel browser). Prima di pubblicare: `npm run build`.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import babel from '@babel/core';
import presetReact from '@babel/preset-react';

const root = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(root, 'docs');

// --- pulizia docs/ ---
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(path.join(outDir, 'assets'), { recursive: true });

// --- 1. Tailwind statico ---
console.log('▸ Genero il CSS Tailwind statico…');
const twBin = path.join(root, 'node_modules', '.bin', process.platform === 'win32' ? 'tailwindcss.cmd' : 'tailwindcss');
execFileSync(twBin, [
  '-c', path.join(root, 'tailwind.config.js'),
  '-i', path.join(root, 'build', 'tailwind-input.css'),
  '-o', path.join(outDir, 'assets', 'tailwind.css'),
  '--minify',
], { stdio: 'inherit', shell: process.platform === 'win32' });

// --- 2. Trasformazione HTML ---
const htmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html'));
let babelBlocks = 0;
for (const file of htmlFiles) {
  let src = fs.readFileSync(path.join(root, file), 'utf8');

  // rimuovi il tag <script> di Babel standalone
  src = src.replace(/[ \t]*<script[^>]*@babel\/standalone[^>]*><\/script>\s*\n?/g, '');

  // rimuovi il CDN di Tailwind…
  src = src.replace(
    /[ \t]*<script[^>]*src="https:\/\/cdn\.tailwindcss\.com[^"]*"[^>]*><\/script>\s*\n?/g,
    ''
  );
  // …e carica il CSS statico come ULTIMO foglio di stile del <head>.
  // (Il Play CDN inietta le sue utility dopo i <style> inline: per non
  //  ribaltare la cascata — es. i bordi colorati di .cyber-card — il link
  //  deve stare in fondo al head, dopo gli <style> della pagina.)
  src = src.replace(
    /<\/head>/i,
    '    <link rel="stylesheet" href="assets/tailwind.css">\n</head>'
  );

  // precompila ogni blocco JSX inline
  src = src.replace(
    /<script type="text\/babel"[^>]*>([\s\S]*?)<\/script>/g,
    (_m, code) => {
      const out = babel.transformSync(code, {
        presets: [[presetReact, { runtime: 'classic' }]],
        compact: false,
        comments: false,
      }).code;
      babelBlocks++;
      // Babel Standalone eseguiva i blocchi text/babel su DOMContentLoaded,
      // cioè DOPO game-system.js (che è più in basso nel body). Replichiamo
      // quel timing: senza questo wrapper lo script girerebbe subito, prima
      // che window.EduGamer esista → profilo.html resta su "Caricamento…".
      return '<script>\n(function(){function __run(){\n' + out +
             '\n}\nif(document.readyState==="loading")document.addEventListener("DOMContentLoaded",__run);else __run();})();\n</script>';
    }
  );

  fs.writeFileSync(path.join(outDir, file), src);
}
console.log(`▸ ${htmlFiles.length} HTML trasformati (${babelBlocks} blocchi JSX precompilati).`);

// --- 3. Copia asset ---
const assetExt = ['.js', '.jpg', '.jpeg', '.png', '.ico', '.svg', '.webp', '.gif'];
const skipFiles = new Set(['build.mjs', 'tailwind.config.js']);
for (const f of fs.readdirSync(root)) {
  const full = path.join(root, f);
  if (fs.statSync(full).isFile() && assetExt.includes(path.extname(f).toLowerCase()) && !skipFiles.has(f)) {
    fs.copyFileSync(full, path.join(outDir, f));
  }
}
// cartella font
fs.cpSync(path.join(root, 'fonts'), path.join(outDir, 'fonts'), { recursive: true });
console.log('▸ Asset copiati (game-system.js, font, immagini).');

console.log('\n✅ Build completata in docs/  →  pronta per GitHub Pages.');
