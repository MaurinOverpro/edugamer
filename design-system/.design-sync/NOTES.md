# design-sync — note per EduGamer

## Com'è fatta
- `design-system/` è una libreria **ricavata** dalle pagine HTML di EduGamer (index, isola, matematica, tutor, profilo): l'app non la importa. Se cambi lo stile nell'app, riportalo qui a mano (src/styles/*.css, src/components/*.tsx) e risincronizza.
- Build: `npm run build` → `node build-ds.mjs` = `tsc` (dist/*.js + .d.ts) + concatenazione di `src/styles/{fonts,theme,components}.css` in `dist/edugamer.css`, con i font copiati in `dist/fonts/`.
- Comando del convertitore: `node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules ./node_modules --entry ./dist/index.js --out ./ds-bundle` (da `design-system/`).
- I gruppi (Fondamenta, Azioni, Gioco, Narrativa, Moduli) vengono dai file stub `.design-sync/groups/<Nome>.md` collegati in `docsMap`: i componenti non hanno documentazione propria.

## Ambiente (Windows, PC di Mauro)
- Verifica a vista: nessun Chromium di Playwright installato. Si usa **Edge** tramite `DS_CHROMIUM_PATH="C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"`. Playwright va installato in `.ds-sync` con `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm i playwright`.
- Se la shell ha la cwd dentro `ds-bundle/`, la build fallisce con `EPERM` (Windows blocca il rm della cartella): lancia sempre da `design-system/`.
- Il `.gitignore` della radice ignora `*token*`: non chiamare "tokens" un file sorgente (per questo il foglio si chiama `theme.css`).

## Correzioni fatte durante la verifica
- Pergamena: `.eg-parchment__body p { margin:0 }` annullava lo spazio `> * + *` → ora il body usa flex column con `gap: 12px`.
- Chat: le bolle usano `align-self` (flex-end per lo studente, flex-start per il tutor) e `.eg-chat` ha `width:100%`.

## Avvisi noti
- Nessuno (render check 19/19 pulito, 0 bad/thin).

## Rischi per le prossime sincronizzazioni
- **Disallineamento dall'app**: la libreria è una copia. Se l'app cambia palette o componenti, qui nessuno se ne accorge.
- Il ritratto di `WantedPoster` senza immagine è un'emoji su fondo pergamena; nell'app il poster vero è un'immagine generata dall'AI (`edugamer_wanted_poster`).
- Il convertitore è stato eseguito con Node 24.14 e TypeScript 5.x; le anteprime sono verificate solo su Edge (Chromium), non su Safari/Firefox.
- `tokens/` nel bundle resta vuoto: le variabili sono definite in `_ds_bundle.css` (da `dist/edugamer.css`), che è comunque importato da `styles.css`.
