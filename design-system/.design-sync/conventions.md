# EduGamer — convenzioni per chi progetta con questa libreria

EduGamer è un'app di studio per un ragazzo delle medie con **DSA** (dislessia, discalculia), ambientata nel **mondo dei pirati**: Isola Misteriosa, Capitano Squall, Barbanera, Wanted Poster, taglie in **Berry**. Il tema pirata è il filo narrativo, non una decorazione. Tutti i testi dell'interfaccia sono **in italiano**. Non usare termini fantasy o RPG generici ("mana", "quest", "dungeon") che rompono la finzione pirata.

## Struttura e radice

Avvolgi sempre la schermata in `EduGamerRoot`. Applica lo sfondo notte (`--eg-bg` #0a0e17), il font OpenDyslexic, la spaziatura tra lettere e l'interlinea. Senza `EduGamerRoot` il testo esce in un font qualsiasi su sfondo bianco.

```jsx
const { EduGamerRoot, Panel, XPBar, ModuleCard, PirateButton } = window.EduGamerDS;
<EduGamerRoot padded>                      {/* background="isola" per le schermate dell'Isola */}
  <Panel watermark="🏴‍☠️"><XPBar level={4} xp={742} levelName="Corsaro" /></Panel>
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginTop: 16 }}>
    <ModuleCard icon="📐" title="MATEMATICA" accent="oro" href="#" />
    <ModuleCard icon="📖" title="ITALIANO" accent="mare" href="#" />
  </div>
  <PirateButton variant="tutor" icon="🎓" fullWidth>CHIEDI AL TUTOR</PirateButton>
</EduGamerRoot>
```

## Regole di accessibilità DSA (obbligatorie)

- **Font**: tutto il testo leggibile usa `var(--eg-font)` (OpenDyslexic). Georgia (`var(--eg-font-titolo)`) solo tramite `PirateTitle`, per titoli di **massimo 5 parole**. Mai per paragrafi.
- **Aree di tocco** di almeno 56px (`var(--eg-touch)`); `PirateButton` e `PirateInput` le rispettano già.
- **Interlinea**: 1.6 (`--eg-line-height`); 1.8 per il testo da leggere a lungo (`--eg-line-height-lettura`).
- **Tema sempre scuro.** Testo `--eg-text`, secondario `--eg-text-muted`. Niente sfondi chiari, tranne la pergamena.
- Frasi brevi, una sola azione principale (`variant="oro"`) per schermata, molte emoji come appiglio visivo.

## Stile: variabili CSS e classi `eg-`

Niente Tailwind e niente classi inventate. Per lo stile dei componenti usa le props; per il layout usa stili inline con le variabili:

| Ruolo | Variabili |
|---|---|
| Fondali | `--eg-bg`, `--eg-bg-isola`, `--eg-surface`, `--eg-surface-deep`, `--eg-border`, `--eg-border-strong` |
| Palette pirata | `--eg-oro` (tesoro), `--eg-mare` (acque profonde), `--eg-abisso` (fosforescenza), `--eg-giungla` (foresta), `--eg-corallo`, `--eg-rosso`, `--eg-indaco` |
| Pergamena | `--eg-pergamena`, `--eg-pergamena-bordo`, `--eg-inchiostro` |
| Rarità | `--eg-rarita-comune`, `--eg-rarita-raro`, `--eg-rarita-epico`, `--eg-rarita-leggendario` |
| Forme | `--eg-radius-sm` 10, `--eg-radius` 12, `--eg-radius-lg` 16, `--eg-radius-xl` 24 |
| Bagliori | `--eg-glow-oro`, `--eg-glow-giungla`, `--eg-glow-abisso`, `--eg-shadow` |

Le props colore che accettano un esadecimale (`color` in `PirateModal`, `PathProgress`, `CharacterQuote`; `glowColor` in `Celebration`) vanno prese da questa palette: #fbbf24 oro, #38bdf8 mare, #c084fc abisso, #4ade80 giungla, #fb923c corallo, #f87171 rosso.

## Quale componente usare

- Sezioni: `Panel` (con `label` dorata o `watermark`). Testo narrativo o regole: `Parchment`, con elenchi dentro `<div className="eg-parchment__box">`.
- Progressi: `XPBar` (livello generale), `PathProgress` (percorso per materia), `AchievementBadge` (medaglie per rarità), `Pill` (stati brevi).
- Identità: `PirateAvatar`, `WantedPoster` (`variant` mini, full o empty; la taglia è in Berry).
- Personaggi dell'Isola: `CharacterQuote`. Squall 🦜 #38bdf8, Numerus il Kraken 🐙 #fbbf24, Zara 🔭 #4ade80, Isabella 🌊 #c084fc, Rex 🗝️ #fb923c, Barbanera 💀 #fde68a.
- Finestre: `PirateModal` (overlay; `overlay={false}` per mostrarla dentro la pagina). Traguardi: `Celebration`.
- Tutor AI: `ChatThread` + `ChatBubble` (`from="studente"` verde a destra, `from="tutor"` viola a sinistra).
- Matematica: `PlaceValueBlocks` (da 0 a 9.999.999). Un pezzo per ogni unità della cifra, in un quadrato 3×3 riempito dal basso. Colori fissi: unità verdi, decine blu, centinaia viola, migliaia arancio, poi rosso, rosa e oro per DM, CM e milioni. Ogni posizione ha un pezzo ~20% più grande della precedente (14→42 px). La decina è **un solo pezzo blu**, mai una barretta da 10. Le quantità "sciolte" (es. i gruppi di una divisione, 852 ÷ 9 → gruppi da 9) sono pezzi **verdi**: il blu indica solo le decine. Se i gruppi sono tanti se ne mostrano 10, poi una pila «+ N gruppi da X» con bordo oro.
- Gradi pirata dei livelli 1–10: Marinaio, Esploratore, Navigatore, Corsaro, Avventuriero, Cacciatore, Leggenda, Gran Maestro, Anima Antica, Gran Corsaro.

Prima di dare stile, leggi `styles.css` (importa `_ds_bundle.css` con tutte le classi `eg-*` e le variabili) e il file `components/<gruppo>/<Nome>/<Nome>.prompt.md` del componente.
