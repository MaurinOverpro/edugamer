# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**EduGamer OS** is an educational web platform for middle school students with learning disabilities (DSA - Disturbi Specifici dell'Apprendimento). It is a fully client-side static web application written in Italian with no build step.

## Development

**I file della radice (`index.html`, `matematica.html`, …) restano la sorgente che modifichi.** Puoi editarli e aprirli direttamente nel browser: caricano React/Babel/Tailwind dai CDN, così vedi subito le modifiche senza build (comodo per lo sviluppo).

**Per la PRODUZIONE c'è un passo di build:** `npm run build` legge i file della radice e ne genera una versione ottimizzata in `docs/`:
- il JSX inline viene **precompilato** (niente più Babel nel browser);
- Tailwind viene **generato staticamente** in `docs/assets/tailwind.css` (niente più CDN JIT a runtime);
- font e asset vengono copiati in `docs/`.

GitHub Pages serve la cartella **`docs/`**. Quindi il flusso è: *modifica i file della radice → `npm run build` → commit → push*. Se dimentichi il build, il sito pubblicato non riflette le tue modifiche.

Prima volta / dopo un clone: `npm install` (installa `@babel/core`, `@babel/preset-react`, `tailwindcss` come devDependencies; `node_modules/` è in `.gitignore`).

Quando aggiungi una classe Tailwind **nuova**, rilancia `npm run build`, altrimenti quella classe non avrà stile (il CSS statico contiene solo le classi effettivamente usate). Se crei un file HTML/JS nuovo con classi Tailwind, aggiungilo a `content` in `tailwind.config.js`.

To test: apri `index.html` (radice, modalità sviluppo) oppure `docs/index.html` (build di produzione) in un browser. A Google Gemini API key must be entered in the settings modal for AI features to work. The key is stored in `localStorage` under `gemini_api_key`.

## Architecture

### Hub-and-Spoke Model

`index.html` is the home/launcher page. Each module is a self-contained React SPA in its own HTML file:

- `lavagna.html` — AI-powered mind mapping from image uploads (canvas-based, 3000×3000px, jsPDF export)
- `matematica.html` — Visual mathematics with place-value blocks for dyscalculia support
- `italiano.html` — Grammar/writing correction with AI error categorization
- `tutor.html` — AI chat tutor with speech recognition/TTS and quiz generation
- `profilo.html` — User dashboard: XP, level, achievements, streak
- `discover.html` — DISCOVER v4.0 guided problem-solving method
- `risolvitore.html` — Multi-type problem solver

### Gamification Engine (`game-system.js`)

Shared singleton loaded in every module via `<script src="game-system.js">`. Exposes `window.EduGamer` with:

- `addXP(amount, source, action)` — awards XP, checks achievements, updates streak
- 10 level tiers (Principiante → Immortale), XP thresholds: 0, 100, 300, 600, 1000, 1500, 2500, 4000, 6000, 10000
- 22 achievements across 4 rarity tiers (Comune, Raro, Epico, Leggendario)
- Fires custom events: `edugamer-xp-added`, `xpChanged`, `edugamer-stats-updated`

### localStorage Keys

| Key | Purpose |
|-----|---------|
| `edugamer_stats` | XP, streak, per-module action counts |
| `edugamer_achievements` | Unlocked achievement IDs |
| `gemini_api_key` | Gemini API key entered by user |
| `edu_xp` | Legacy XP key (kept for backwards compatibility) |
| `edugamer_audience` | Target audience chosen in Home → Impostazioni: `elementari` / `medie` (default) / `superiori` / `adulti` |
| `edugamer_voice` | Name of the speech-synthesis voice chosen in Impostazioni (empty = automatic best voice) |

### Audience (everyone, not just one student)

EduGamer is meant for all ages (elementary → adults); DSA support is always on. **Never hard-code the audience in an AI prompt** ("scuola media", "ragazzo"): use `window.EduGamer.getAudience()` (`prompt` = who the user is, `tone` = register for that age), as the modules do via their local `AUD()` helper. UI copy must be age-neutral: no over-praise ("Sei bravissimo!", "fantastica!"); the pirate theme stays as narrative.

### Voice (text-to-speech)

All modules use the browser `speechSynthesis`. **Always call `window.EduGamer.applyVoice(u)` after `new SpeechSynthesisUtterance(...)`**: it sets `it-IT` and the best Italian voice (user choice → Edge "Natural"/"Online" → iOS "Enhanced/Avanzata" → "Google" → Android network voices). Never pick voices locally.

**AI voice (optional, Impostazioni → "Voce AI")**: `game-system.js` hooks `window.speechSynthesis.speak/cancel/speaking` (`_installAIVoice`) so modules need no changes: audio comes from `gemini-3.8-flash-tts` (voice Kore, alt Charon for the second speaker) via the **Interactions API** `POST /v1beta/interactions` with style in `annotations[{type:"speech_metadata", style}]`. Do NOT put style instructions in the text: the model reads them aloud (verified). Each utterance falls back to the device voice on no key / offline / error / 20 s timeout; 429, 401/403 and invalid-key 400 disable AI voice for 10 min. Long texts are split (~350 chars) and prefetched; audio cached (40 items). localStorage: `edugamer_voice_ai` (1/0), `edugamer_voice_speed` (0.8–1.5, playbackRate). onboundary (Lavagna karaoke) does not fire with AI voice: Lavagna uses its timer fallback.

### AI Integration

All modules call the Google Gemini API directly from the browser, **always through `game-system.js`** — never write a `fetch` to Gemini inside a module:
- `EduGamer.geminiText(model, promptOrBody, opts)` → text; `geminiJSON(...)` → parsed object (strips ```json fences); `geminiImage(model, body)` → `{ mime, data }`; `gemini(model, body)` → raw response.
- Models: `EduGamer.MODELS.math` / `.text` / `.image` / `.poster`. To change a model, edit only `MODELS`.
- Errors are thrown as `Error` with an Italian message ready for the UI (missing key, invalid key, 429, timeout, network). Timeout: 30 s default, 120 s for images, override with `{ timeout }`.
- `EduGamer.getApiKey()` reads the key.

Models are chosen per task (verified on Google's docs, 3 Oct 2026):
- **Math reasoning** (`matematica`, `risolvitore`, `discover`): `gemini-3.6-flash` — official replacement for `gemini-3-flash-preview`; paid price doubles on 1 Jan 2027.
- **Language / maps / chat / research** (`italiano`, `lavagna`, `tutor`, `ricerche`, `isola` text): `gemini-3.5-flash-lite` — cheapest 3.5 model, accepts image input.
- **Tutor exception**: when the talk is about numbers (materia Matematica/DISCOVER, or an operation like `24-9` in the message or the last 2 turns) `tutor.html` switches to `MODELS.math` (`gemini-3.6-flash`). Tested 5 Oct 2026: the lite model called correct calculations wrong 6 times out of 9; 3.6-flash 18/18. The tutor prompt also forbids doing homework for the student (first step + DISCOVER, never the full solution).
- **Images** (`isola` avatar, `ricerche` illustrations): `gemini-3.1-flash-image` ("Nano Banana 2", stable).
- **Wanted Poster** (`profilo`): `gemini-3-pro-image` ("Nano Banana Pro", stable) — best at rendering text inside images.
- The `-preview` image models were shut down on 25 June 2026. Check https://ai.google.dev/gemini-api/docs/deprecations before changing models.
- Endpoint (inside `EduGamer.gemini`): `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`


### Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 (UMD via CDN `unpkg.com`) |
| JSX Transpilation | Babel Standalone (CDN, in-browser) |
| Styling | Tailwind CSS 3 (CDN) |
| Font | OpenDyslexic (accessibility) |
| PDF Export | jsPDF 2.5.1 |
| Markdown | marked.js |
| AI | Google Gemini 3 Flash Preview API |

### Git & Deploy Workflow

After completing any code change, always:
1. `npm run build` (rigenera `docs/` — il sito pubblicato)
2. `git add <modified files>` (by name, never `git add .`) — includi sia i file di radice modificati sia `docs/`
3. `git commit -m "..."` with a descriptive message
4. `git push` to origin/main

GitHub Pages is configured on this repo (`maurinoverpro.github.io/edugamer`) e serve la cartella **`/docs`** del branch `main`. Every push to main deploys automatically. **Ricorda `npm run build` prima del commit**, altrimenti `docs/` (ciò che viene pubblicato) resta indietro rispetto ai file di radice.

### Pitfalls to avoid

- **`game-system.js` must be loaded at the bottom of `<body>`**, after the `<script type="text/babel">` block. Loading it in `<head>` causes it to run before React initializes. In sviluppo Babel esegue il blocco JSX su `DOMContentLoaded` (cioè dopo `game-system.js`); il build (`build.mjs`) replica questo timing avvolgendo il codice compilato in un handler `DOMContentLoaded`, così `window.EduGamer` esiste già quando i moduli montano (senza, `profilo.html` resta bloccato su "Caricamento…").
- **Never use direct localStorage XP writes** (e.g. `localStorage.setItem('edu_xp', ...)`). Always call `window.EduGamer.addXP(amount, source, action)` so achievements and streaks are triggered correctly.

### Accessibility Conventions

All modules use OpenDyslexic font, `letter-spacing: 0.02–0.08em`, `line-height: 1.6–1.8`, dark theme (`#0a0e17` background), and minimum 56px touch targets. Maintain these when editing UI.

Load the font via: `<link href="https://fonts.cdnfonts.com/css/opendyslexic" rel="stylesheet">` and use the stack `'OpenDyslexic', Verdana, sans-serif`.

### Theme & Naming Conventions

The app is themed around the **pirate world** (Isola Misteriosa, Wanted posters, Berry currency). This is not a cosmetic choice — it's the narrative anchor for the specific student using the app.

**Font rules:**
- Body text, prose, buttons, form fields → **OpenDyslexic** (non-negotiable for DSA accessibility)
- Decorative titles (≤5 words, large size only) **may** use `Georgia, 'Times New Roman', serif` via the `.title-pirate` helper class in `isola.html`. Never apply to paragraphs or reading content.

**Level naming — single source of truth:** `EduGamer.LEVELS` in `game-system.js`. All modules that display the level name must read from `window.EduGamer.LEVELS[level-1].name` rather than maintaining a local copy. Current progression: Marinaio → Esploratore → Navigatore → Corsaro → Avventuriero → Cacciatore → Leggenda → Gran Maestro → Anima Antica → Gran Corsaro.

**Color palette:** neon/fluo colors (gold `#fbbf24`, electric blue `#38bdf8`, purple `#c084fc`, acid green `#4ade80`) are retained but narrated as pirate metaphors — treasure gold, deep water, abyssal phosphorescence, tropical jungle. Do not introduce generic "fantasy" or "RPG" terminology that breaks the pirate fiction.
