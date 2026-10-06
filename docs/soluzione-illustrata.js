// soluzione-illustrata.js — fogli "soluzione illustrata" per il PDF di Discover e Risolvitore.
// Gemini (modello immagini Flash) disegna l'intero foglio partendo da passaggi GIÀ VERIFICATI.
// Di norma 3 passaggi per foglio (oltre, il modello sbaglia di più: prove del 6/10/2026), ma al massimo 2 fogli:
// con 7 passaggi si fa 4+3. Più fogli costano e allungano l'attesa.
// Ogni foglio viene riletto dal modello math; se non torna si rifà una volta, poi si rinuncia
// (meglio un PDF senza illustrazione che un numero sbagliato stampato).
// Richiede game-system.js (window.EduGamer) e jsPDF.
(function () {
    const E = () => window.EduGamer;
    // SPENTA il 6/10/2026 (scelta di Mauro): nelle sue prove il foglio non usciva mai nel PDF e il costo
    // in immagini era alto; il PDF testuale basta. Il codice resta per proporla alle maestre:
    // per riaccenderla metti ATTIVA = true (e rimetti le scritte "con soluzione illustrata" in Discover/Risolvitore).
    const ATTIVA = false;
    const MAX_PASSI = 3, MAX_FOGLI = 2;

    /** problema = { titolo, testo, passi: [{ titolo, domanda, risposta, spiegazione }], risposta } */
    function gruppi(passi) {
        const n = Math.min(MAX_FOGLI, Math.ceil(passi.length / MAX_PASSI)), size = Math.ceil(passi.length / n);
        return Array.from({ length: n }, (_, k) => passi.slice(k * size, (k + 1) * size));
    }

    // Dati per il modello: NON sono testo da copiare sul foglio (le etichette finivano stampate).
    const elenco = (passi, da) => passi.map((p, i) =>
        `[PASSO ${da + i}] titolo: ${p.titolo} | cosa si chiede: ${p.domanda} | risultato: ${p.risposta} | calcolo: ${p.spiegazione || ''}`).join('\n');

    function promptFoglio(problema, passi, da, k, tot) {
        const primo = k === 0, ultimo = k === tot - 1;
        return `Disegna un FOGLIO DI SOLUZIONE ILLUSTRATA di un problema di matematica, da stampare su A4 verticale${tot > 1 ? ` (foglio ${k + 1} di ${tot})` : ''}.
È per uno studente con DSA (dislessia, discalculia): deve essere chiarissimo, ma NON scrivere mai sul foglio parole come DSA, dislessia, discalculia, "studente", "scheda per".

PROBLEMA: "${problema.testo}"

DATI DEI PASSAGGI DI QUESTO FOGLIO (già verificati: usa numeri, operazioni e risultati ESATTAMENTE così, non ricalcolare, non aggiungere altri numeri, passaggi o metodi alternativi).
Sono appunti per te: NON copiare sul foglio le etichette "titolo", "cosa si chiede", "risultato", "calcolo", né le domande intere.
${elenco(passi, da)}
${ultimo ? `RISPOSTA FINALE: ${problema.risposta}` : ''}

STRUTTURA:
${primo ? `- In alto un piccolo disegno della situazione e il titolo "${problema.titolo}".` : `- In alto solo il titolo "${problema.titolo}" piccolo, poi si continua dal PASSO ${da}. Niente disegno della situazione.`}

- Un riquadro per ogni passaggio con SOLO: "PASSO n – titolo"; UNO schema semplice se aiuta (barra divisa in parti uguali, oggetti disegnati da contare, frecce); l'operazione scritta GRANDE con il risultato (es. "3 × 0,80 € = 2,40 €"). Al massimo una frase di 8 parole per passaggio.
- Nel passaggio in cui si raccolgono i dati: un elenco breve di TUTTI i dati del problema con piccoli disegni, senza operazione.
- Schemi a barre: le parti uguali che rappresentano la stessa cosa hanno lo STESSO colore (es. le 3 parti fatte tutte blu, quella che manca bianca).
${ultimo ? '- In fondo un riquadro verde con la risposta finale.' : '- In fondo una freccia "continua nel foglio successivo".'}

REGOLE DI LEGGIBILITÀ:
- Stampatello senza grazie, grande; cifre ben distinte; simbolo € chiaro. Numeri decimali SEMPRE con la virgola all'italiana (0,90), mai con il punto (0.90). Moltiplicazione con ×, divisione con :.
- Controlla l'ortografia di ogni parola: niente refusi.
- Addizioni e sottrazioni con numeri decimali o con 3 o più numeri: IN COLONNA, cifre e virgole perfettamente allineate una sotto l'altra.
- Poche parole, frasi brevissime, italiano semplice. TUTTE le scritte in italiano (anche insegne e cartelli). Niente istruzioni allo studente come "devi fare…".

- Niente decorazioni inutili, niente testo di riempimento. Sfondo bianco, pochi colori pieni, adatto alla stampa.`;
    }

    async function disegnaFoglio(prompt) {
        return E().geminiImage(E().MODELS.image, {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '3:4' } }
        });
    }

    async function controllaFoglio(img, problema, passi, da, ultimo) {
        const attesi = passi.map((p, i) => `PASSO ${da + i} – ${p.titolo}: ${p.domanda} → ${p.risposta}`).join('\n') + (ultimo ? `\nRISPOSTA: ${problema.risposta}` : '');
        const prompt = `Questo è un foglio di soluzione di un problema di matematica da dare a uno studente con discalculia.
Controlla SOLO la correttezza di ciò che è scritto e disegnato rispetto ai passaggi attesi.
PASSAGGI ATTESI:
${attesi}
È un errore: un numero, un'operazione o un risultato diverso da quelli attesi; etichette tecniche scritte sul foglio come "Risultato verificato", "Come si calcola", "Domanda:", "cosa si chiede", "Schema"; frasi lunghe che ricopiano il testo del problema; metodi alternativi aggiunti ("oppure…");
 un numero ripetuto o coperto; una cifra illeggibile; un'addizione o sottrazione in colonna con cifre o virgole non allineate; uno schema che mostra quantità sbagliate (es. barra divisa nel numero sbagliato di parti, oggetti contati male); testo senza senso; parole scritte male o non italiane (refusi); numeri decimali scritti con il punto invece della virgola;
 parole come DSA, dislessia, discalculia scritte sul foglio.
Non è un errore: scelte grafiche, frasi descrittive corrette, un dato del problema indicato come non utile se davvero non serve nei passaggi.
Rispondi SOLO JSON: {"ok": true|false, "errori": ["..."]}`;
        return E().geminiJSON(E().MODELS.math, {
            contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: img.mime, data: img.data } }] }],
            generationConfig: { responseMimeType: 'application/json' }
        }, { timeout: 60000 });
    }

    /** Un foglio verificato, o null. Riprova se il foglio è sbagliato (1 volta) o se Google è sovraccarico. */
    async function foglioVerificato(problema, passi, da, k, tot, log) {
        const prompt = promptFoglio(problema, passi, da, k, tot);
        let sbagliati = 0;
        for (let t = 1; t <= 5 && sbagliati < 3; t++) {
            try {
                const img = await disegnaFoglio(prompt);
                const v = await controllaFoglio(img, problema, passi, da, k === tot - 1);
                log.push(`foglio ${k + 1}, tentativo ${t}: ${v.ok ? 'ok' : 'scartato – ' + (v.errori || []).join(' | ')}`);
                if (v.ok) return img;
                sbagliati++;
            } catch (e) {
                log.push(`foglio ${k + 1}, tentativo ${t}: ${e.message}`);
                await new Promise(r => setTimeout(r, 3000 * t));
            }
        }
        return null;
    }

    /** Genera i fogli in parallelo. Ritorna { fogli: [img|null], log }. */
    async function genera(problema) {
        const g = gruppi(problema.passi), log = [];
        if (!problema.titolo) {
            try { problema.titolo = (await E().geminiText(E().MODELS.text, `Dai un titolo di massimo 5 parole, in italiano, a questo problema di matematica (es. "La spesa di Anastasia"). Rispondi solo con il titolo, senza virgolette.\n\n${problema.testo}`)).replace(/["'«»*“”‘’]/g, ' ').replace(/\s+/g, ' ').trim(); }

            catch { problema.titolo = 'Soluzione illustrata'; }
        }
        let da = 1;
        const fogli = await Promise.all(g.map((passi, k) => { const p = foglioVerificato(problema, passi, da, k, g.length, log); da += passi.length; return p; }));
        return { fogli, log };
    }

    /** Aggiunge al PDF una pagina A4 per ogni foglio. Se un foglio manca, salta tutta l'illustrazione
     *  (un foglio 2 senza il foglio 1 confonderebbe). Ritorna true se le pagine sono state aggiunte. */
    function aggiungiPagine(doc, fogli) {
        if (!fogli.length || fogli.some(f => !f)) return false;
        fogli.forEach(f => {
            doc.addPage();
            const W = 210, H = 297, m = 10, w = W - 2 * m, h = w * 4 / 3, y = (H - h) / 2;
            doc.addImage(`data:${f.mime};base64,${f.data}`, 'JPEG', m, y, w, h);
        });
        return true;
    }

    /** Inserisce i fogli come PRIME pagine di un PDF già scritto. Tiene i fogli riusciti fino al primo mancante
     *  (il foglio 1 da solo va bene: dopo seguono comunque le pagine con tutti i passaggi; un foglio 2 senza il 1 no). */
    function inserisciAllInizio(doc, fogli) {
        const buoni = [];
        for (const f of (fogli || [])) { if (!f) break; buoni.push(f); }
        if (!buoni.length) return false;
        buoni.forEach((f, k) => {

            doc.addPage();
            const W = 210, H = 297, m = 10, w = W - 2 * m, h = w * 4 / 3, y = (H - h) / 2;
            doc.addImage(`data:${f.mime};base64,${f.data}`, 'JPEG', m, y, w, h);
            doc.movePage(doc.getNumberOfPages(), k + 1);
        });
        return true;
    }

    // ---- uso dai moduli: avvia() a fine percorso, attendi() quando si crea il PDF ----
    let corrente = null;
    /** Parte in sottofondo; errori silenziosi (il PDF uscirà comunque, senza illustrazione). */
    function avvia(problema) {
        if (!ATTIVA) { corrente = null; return Promise.resolve({ fogli: [], log: ['spenta'] }); }
        corrente = genera(problema).catch(e => ({ fogli: [], log: ['errore: ' + e.message] }));
        corrente.then(r => console.log('[SoluzioneIllustrata]', r.log.join(' | ')));
        return corrente;
    }
    /** Fogli pronti (o [] se non avviata / fallita). Al massimo maxMs di attesa. */
    async function attendi(maxMs = 120000) {
        if (!corrente) return [];
        const r = await Promise.race([corrente, new Promise(res => setTimeout(() => res({ fogli: [] }), maxMs))]);
        return r.fogli || [];
    }
    function annulla() { corrente = null; }

    window.SoluzioneIllustrata = { ATTIVA,
 genera, aggiungiPagine, inserisciAllInizio, avvia, attendi, annulla, gruppi };

})();
