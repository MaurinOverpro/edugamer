/**
 * EduGamer - Sistema di Gamification
 * Gestisce XP, Livelli, Streak, Achievement e Statistiche
 * Funziona offline con localStorage, pronto per sync con Neon
 */

const EduGamer = {
    // ==================== CONFIGURAZIONE LIVELLI ====================
    // Tema pirata — nomenclatura allineata a isola.html (fonte di verità)
    LEVELS: [
        { level: 1,  name: "Marinaio",      xpRequired: 0,     icon: "⚓",  color: "#cd7f32" },
        { level: 2,  name: "Esploratore",   xpRequired: 100,   icon: "🧭",  color: "#cd7f32" },
        { level: 3,  name: "Navigatore",    xpRequired: 300,   icon: "🗺️",  color: "#c0c0c0" },
        { level: 4,  name: "Corsaro",       xpRequired: 600,   icon: "🗡️",  color: "#c0c0c0" },
        { level: 5,  name: "Avventuriero",  xpRequired: 1000,  icon: "🏴‍☠️", color: "#ffd700" },
        { level: 6,  name: "Cacciatore",    xpRequired: 1500,  icon: "🎯",  color: "#ffd700" },
        { level: 7,  name: "Leggenda",      xpRequired: 2500,  icon: "💎",  color: "#00d4ff" },
        { level: 8,  name: "Gran Maestro",  xpRequired: 4000,  icon: "👑",  color: "#ff6b00" },
        { level: 9,  name: "Anima Antica",  xpRequired: 6000,  icon: "⚡",  color: "#a855f7" },
        { level: 10, name: "Gran Corsaro",  xpRequired: 10000, icon: "🌟",  color: "#ff0080" }
    ],

    // ==================== PUBBLICO (livello scolastico) ====================
    // Unica fonte di verità per "chi sta usando l'app": i prompt AI dei moduli
    // la leggono con EduGamer.getAudience() invece di avere "medie" scritto nel codice.
    // Il supporto DSA resta sempre attivo, a ogni età.
    AUDIENCES: {
        elementari: { label: "Scuola Elementare",   ages: "6-10 anni",
            prompt: "uno studente di scuola elementare (6-10 anni)",
            tone: "Tono caldo e incoraggiante, vocabolario semplice, esempi concreti della vita quotidiana di un bambino." },
        medie:      { label: "Scuola Media",        ages: "11-13 anni",
            prompt: "uno studente di scuola media (11-13 anni)",
            tone: "Tono diretto e amichevole, mai infantile. Esempi legati alla vita di un ragazzo (sport, amici, videogiochi, natura)." },
        superiori:  { label: "Scuola Superiore",    ages: "14-18 anni",
            prompt: "uno studente di scuola superiore (14-18 anni)",
            tone: "Tono maturo e rispettoso, come con un giovane adulto. Niente toni infantili né eccessi di entusiasmo. Usa il lessico specifico della materia, spiegandolo." },
        adulti:     { label: "Università / Adulti", ages: "19+ anni",
            prompt: "una persona adulta (università o formazione personale)",
            tone: "Tono da adulto ad adulto, asciutto e preciso. Nessun tono scolastico o infantile, nessun complimento superfluo. Terminologia corretta, spiegata quando serve." }
    },

    getAudienceKey() {
        try {
            const k = localStorage.getItem('edugamer_audience');
            return this.AUDIENCES[k] ? k : 'medie';
        } catch { return 'medie'; }
    },

    setAudienceKey(key) {
        if (!this.AUDIENCES[key]) return;
        localStorage.setItem('edugamer_audience', key);
        window.dispatchEvent(new CustomEvent('edugamer-audience-changed', { detail: { key } }));
    },

    /** { key, label, ages, prompt, tone } — da usare dentro i prompt AI. */
    getAudience() {
        const key = this.getAudienceKey();
        return { key, ...this.AUDIENCES[key] };
    },

    // ==================== VOCE (sintesi vocale del dispositivo) ====================
    // Unico punto che sceglie la voce italiana. I moduli chiamano
    // EduGamer.applyVoice(utterance) dopo aver creato la SpeechSynthesisUtterance.
    // Ordine: voce scelta nelle Impostazioni → voce "naturale" migliore disponibile.
    _voices: [],

    _loadVoices() {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        const read = () => { this._voices = window.speechSynthesis.getVoices() || []; };
        read();
        // Chrome/Edge/Android caricano l'elenco in ritardo: senza questo la prima frase usa la voce di base
        window.speechSynthesis.addEventListener?.('voiceschanged', read);
    },

    _scoreVoice(v) {
        const n = v.name.toLowerCase();
        let s = 0;
        if (v.lang === 'it-IT' || v.lang === 'it_IT') s += 10;
        if (/natural|neural|online/.test(n)) s += 60;          // Edge: "Microsoft Isabella Online (Natural)"
        if (/enhanced|premium|avanzat|migliorat/.test(n)) s += 55; // iOS/macOS: voci "Avanzate"
        if (/google/.test(n)) s += 45;                          // Chrome desktop: "Google italiano"
        if (/it-it-x-|network|rete/.test(n)) s += 35;           // Android: voci di rete Google
        if (/isabella|elsa|diego|giuseppe|alice|federica|luca|paola|emma|benigno/.test(n)) s += 5;
        if (/compact|espeak/.test(n)) s -= 40;                  // voci di bassa qualità
        return s;
    },

    /** Voci italiane disponibili, dalla più naturale alla meno. */
    listItalianVoices() {
        if (!this._voices.length && typeof window !== 'undefined' && window.speechSynthesis) this._voices = window.speechSynthesis.getVoices() || [];
        return this._voices
            .filter(v => (v.lang || '').toLowerCase().replace('_', '-').startsWith('it'))
            .sort((a, b) => this._scoreVoice(b) - this._scoreVoice(a));
    },

    /** La voce da usare: quella scelta dall'utente se esiste ancora, altrimenti la migliore. */
    getVoice() {
        const list = this.listItalianVoices();
        let chosen = null;
        try { chosen = localStorage.getItem('edugamer_voice'); } catch {}
        return (chosen && list.find(v => v.name === chosen)) || list[0] || null;
    },

    setVoiceName(name) {
        if (name) localStorage.setItem('edugamer_voice', name);
        else localStorage.removeItem('edugamer_voice');
    },

    /** Imposta lingua e voce migliore su una SpeechSynthesisUtterance. Non tocca rate/pitch. */
    applyVoice(u) {
        if (!u) return u;
        u.lang = 'it-IT';
        const v = this.getVoice();
        if (v) u.voice = v;
        return u;
    },

    // ==================== VOCE AI (Gemini TTS, opzionale) ====================
    // Attivabile in Home → Impostazioni. Si aggancia a window.speechSynthesis:
    // i moduli continuano a chiamare speechSynthesis.speak()/cancel() come prima e,
    // se la voce AI è attiva, l'audio arriva da Gemini. Ogni frase che fallisce
    // (niente chiave, offline, errore, timeout) viene letta dalla voce del dispositivo.
    AI_VOICE: {
        model: 'gemini-3.8-flash-tts',
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/interactions',
        voices: { main: 'Kore', alt: 'Charon' },   // alt = secondo personaggio (dialoghi della Lavagna)
        style: 'voce italiana chiara e coinvolgente, ritmo vivace ma ben scandito, come un bravo divulgatore',
        timeoutMs: 20000,
        maxChars: 350                               // frasi lunghe divise in pezzi: il primo arriva prima
    },

    isAIVoiceEnabled() {
        try { return localStorage.getItem('edugamer_voice_ai') === '1'; } catch { return false; }
    },
    setAIVoiceEnabled(on) { localStorage.setItem('edugamer_voice_ai', on ? '1' : '0'); },

    getAIVoiceSpeed() {
        let s = 1;
        try { s = parseFloat(localStorage.getItem('edugamer_voice_speed') || '1'); } catch {}
        return isFinite(s) ? Math.min(1.5, Math.max(0.8, s)) : 1;
    },
    setAIVoiceSpeed(s) { localStorage.setItem('edugamer_voice_speed', String(s)); },

    _aiVoiceUsable() {
        if (!this.isAIVoiceEnabled()) return false;
        if (typeof navigator !== 'undefined' && navigator.onLine === false) return false;
        try { if (!localStorage.getItem('gemini_api_key')) return false; } catch { return false; }
        return !this._aiVoiceDisabledUntil || Date.now() > this._aiVoiceDisabledUntil;
    },

    _splitForTTS(text) {
        const max = this.AI_VOICE.maxChars;
        const t = String(text || '').replace(/\s+/g, ' ').trim();
        if (t.length <= max) return t ? [t] : [];
        const sentences = t.match(/[^.!?;:]+[.!?;:]*\s*/g) || [t];
        const parts = []; let cur = '';
        for (const s of sentences) {
            if ((cur + s).length > max && cur) { parts.push(cur.trim()); cur = ''; }
            cur += s;
        }
        if (cur.trim()) parts.push(cur.trim());
        return parts;
    },

    _ttsCache: new Map(),

    async _fetchTTS(text, voiceName) {
        const cacheKey = voiceName + '|' + text;
        if (this._ttsCache.has(cacheKey)) return this._ttsCache.get(cacheKey);
        const key = localStorage.getItem('gemini_api_key');
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), this.AI_VOICE.timeoutMs);
        try {
            const res = await fetch(this.AI_VOICE.endpoint, {
                method: 'POST', signal: ctrl.signal,
                headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: this.AI_VOICE.model,
                    input: [{ type: 'user_input', content: [{ type: 'text', text,
                        annotations: [{ type: 'speech_metadata', style: this.AI_VOICE.style }] }] }],
                    response_format: { type: 'audio' },
                    generation_config: { speech_config: [{ voice: voiceName }] }
                })
            });
            if (!res.ok) {
                // quota esaurita o chiave non valida: per 10 minuti si usa solo la voce del dispositivo
                const badKey = res.status === 400 && /api key/i.test(await res.text().catch(() => ''));
                if (badKey || res.status === 429 || res.status === 401 || res.status === 403) this._aiVoiceDisabledUntil = Date.now() + 10 * 60 * 1000;
                throw new Error('TTS ' + res.status);
            }
            const data = await res.json();
            const audio = (data.steps || []).filter(s => s.type === 'model_output')
                .flatMap(s => s.content || []).filter(c => c.type === 'audio').pop();
            if (!audio || !audio.data) throw new Error('TTS: nessun audio');
            const bin = atob(audio.data); const bytes = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
            const url = URL.createObjectURL(new Blob([bytes], { type: audio.mime_type || 'audio/wav' }));
            this._ttsCache.set(cacheKey, url);
            if (this._ttsCache.size > 40) { const k = this._ttsCache.keys().next().value; URL.revokeObjectURL(this._ttsCache.get(k)); this._ttsCache.delete(k); }
            return url;
        } finally { clearTimeout(timer); }
    },

    _installAIVoice() {
        if (typeof window === 'undefined' || !window.speechSynthesis || window.speechSynthesis.__egAI) return;
        const synth = window.speechSynthesis;
        const nativeSpeak = synth.speak.bind(synth);
        const nativeCancel = synth.cancel.bind(synth);
        const proto = Object.getPrototypeOf(synth);
        const nativeSpeaking = Object.getOwnPropertyDescriptor(proto, 'speaking');
        const nativePending = Object.getOwnPropertyDescriptor(proto, 'pending');
        const self = this;
        const st = { queue: [], busy: false, audio: null, current: null, gen: 0 };
        // promessa che si risolve a ogni cancel(): sblocca le attese (download/riproduzione) in corso
        const newCancelSignal = () => { st.cancelSignal = new Promise(r => { st.cancelResolve = r; }); };
        newCancelSignal();
        const fire = (u, type) => setTimeout(() => { try { u.dispatchEvent(new Event(type)); } catch {} }, 0);

        const voiceFor = (u) => {
            const def = self.getVoice();
            return (u.voice && def && u.voice.name !== def.name) ? self.AI_VOICE.voices.alt : self.AI_VOICE.voices.main;
        };

        const fallbackNative = (u, gen) => new Promise(resolve => {
            const done = () => { u.removeEventListener('end', done); u.removeEventListener('error', done); resolve(); };
            u.addEventListener('end', done); u.addEventListener('error', done);
            if (gen === st.gen) nativeSpeak(u); else resolve();
        });

        const playUrl = (url, u, gen) => new Promise(resolve => {
            if (gen !== st.gen) return resolve(true);
            const a = new Audio(url);
            a.preservesPitch = true;
            a.playbackRate = Math.min(2, Math.max(0.6, self.getAIVoiceSpeed() * ((u.rate || 0.9) / 0.9)));
            st.audio = a;
            a.onended = () => resolve(true);
            a.onerror = () => resolve(false);
            a.play().catch(() => resolve(false));
        });

        const run = async () => {
            if (st.busy) return;
            st.busy = true;
            while (st.queue.length) {
                const item = st.queue.shift();
                const { u, parts, gen } = item;
                if (gen !== st.gen) continue;
                const cancelled = st.cancelSignal.then(() => 'cancelled');
                st.current = u;
                let started = false, ok = true;
                for (let i = 0; i < parts.length && gen === st.gen; i++) {
                    let url = null;
                    try { url = await Promise.race([parts[i], cancelled]); } catch { url = null; }
                    if (gen !== st.gen || url === 'cancelled') break;
                    if (!url) { ok = false; break; }
                    if (!started) { fire(u, 'start'); started = true; }
                    const played = await Promise.race([playUrl(url, u, gen), cancelled]);
                    if (played === 'cancelled') break;
                    if (!played) { ok = false; break; }
                }
                if (gen !== st.gen) continue;
                if (!ok) {
                    // ritorno automatico alla voce del dispositivo per questa frase
                    await fallbackNative(u, gen);
                } else {
                    fire(u, 'end');
                }
                st.current = null; st.audio = null;
            }
            st.busy = false;
        };

        synth.speak = function (u) {
            if (!self._aiVoiceUsable() || !u || !u.text || !u.text.trim()) return nativeSpeak(u);
            const voice = voiceFor(u);
            const texts = self._splitForTTS(u.text);
            // scarica tutti i pezzi in anticipo (in ordine): mentre suona il primo, arrivano gli altri
            let chain = Promise.resolve();
            const parts = texts.map(t => { const p = chain.then(() => self._fetchTTS(t, voice)); chain = p.catch(() => {}); return p; });
            parts.forEach(p => p.catch(() => {}));
            st.queue.push({ u, parts, gen: st.gen });
            run();
        };

        synth.cancel = function () {
            st.gen++;
            const cur = st.current;
            st.queue = [];
            if (st.audio) { try { st.audio.pause(); } catch {} st.audio = null; }
            st.current = null;
            const wake = st.cancelResolve; newCancelSignal(); wake();
            if (cur) fire(cur, 'error');
            nativeCancel();
        };

        try {
            Object.defineProperty(synth, 'speaking', { configurable: true,
                get: () => !!(st.current || st.queue.length) || (nativeSpeaking ? nativeSpeaking.get.call(synth) : false) });
            Object.defineProperty(synth, 'pending', { configurable: true,
                get: () => st.queue.length > 0 || (nativePending ? nativePending.get.call(synth) : false) });
        } catch {}
        synth.__egAI = true;
    },

    // ==================== AI (Gemini) ====================
    // Unico punto da cui i moduli chiamano Gemini. Per cambiare un modello si tocca
    // solo MODELS (verifica prima https://ai.google.dev/gemini-api/docs/deprecations).
    MODELS: {
        math:   'gemini-3.6-flash',        // ragionamento matematico (matematica, risolvitore, discover, tutor sui numeri)
        text:   'gemini-3.5-flash-lite',   // lingua, mappe, chat, ricerche
        image:  'gemini-3.1-flash-image',  // avatar Isola, illustrazioni Ricerche
        poster: 'gemini-3-pro-image'       // Wanted Poster (testo dentro l'immagine)
    },

    getApiKey() {
        try { return localStorage.getItem('gemini_api_key') || ''; } catch { return ''; }
    },

    /**
     * Chiama generateContent e restituisce la risposta JSON completa.
     * Lancia sempre Error con un messaggio in italiano da mostrare all'utente.
     * opts.timeout in ms (default 30 s; le immagini usano 120 s).
     */
    async gemini(model, body, opts = {}) {
        const key = this.getApiKey();
        if (!key) throw new Error('Manca la chiave API: vai nella Home → Impostazioni e inseriscila.');
        const timeout = opts.timeout || 30000;

        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), timeout);
        let res;
        try {
            res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body), signal: ctrl.signal
            });
        } catch (e) {
            if (e.name === 'AbortError') throw new Error(`Tempo scaduto (${Math.round(timeout / 1000)} s). Controlla la connessione e riprova.`);
            throw new Error('Connessione non riuscita. Controlla internet e riprova.');
        } finally {
            clearTimeout(timer);
        }
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            const msg = err?.error?.message || '';
            if (res.status === 429) throw new Error('Limite di richieste raggiunto. Riprova più tardi.');
            if (res.status === 402) throw new Error('Il credito della chiave API è finito: va ricaricato su Google AI Studio (aistudio.google.com).');

            if (res.status === 401 || res.status === 403 || /API key/i.test(msg)) throw new Error('Chiave API non valida: controllala nella Home → Impostazioni.');
            throw new Error(`Errore AI (${res.status})${msg ? ': ' + msg : ''}`);
        }
        return res.json();
    },

    /** Testo della risposta (parti di testo unite). Accetta un prompt stringa o un body completo. */
    async geminiText(model, promptOrBody, opts) {
        const body = typeof promptOrBody === 'string' ? { contents: [{ parts: [{ text: promptOrBody }] }] } : promptOrBody;
        const data = await this.gemini(model, body, opts);
        const text = (data.candidates?.[0]?.content?.parts || []).filter(p => p.text && !p.thought).map(p => p.text).join('');
        if (!text) throw new Error("L'AI non ha risposto. Riprova.");
        return text.trim();
    },

    /** Risposta JSON già convertita in oggetto (toglie eventuali ```json ... ```). */
    async geminiJSON(model, promptOrBody, opts) {
        const text = await this.geminiText(model, promptOrBody, opts);
        try { return JSON.parse(text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()); }
        catch { throw new Error("L'AI ha risposto in modo inatteso. Riprova."); }
    },

    /** Immagine generata: { mime, data (base64) }. */
    async geminiImage(model, body, opts = {}) {
        const data = await this.gemini(model, body, { timeout: 120000, ...opts });
        const part = (data.candidates?.[0]?.content?.parts || []).find(p => p.inlineData);
        if (!part) throw new Error("L'AI non ha generato l'immagine. Riprova.");
        return { mime: part.inlineData.mimeType, data: part.inlineData.data };
    },

    // ==================== CONFIGURAZIONE ACHIEVEMENT ====================
    ACHIEVEMENTS: [
        // Primi passi
        { id: "first_step", name: "Primo Passo", desc: "Completa la prima attività", icon: "👣", xpReward: 10, rarity: "comune", condition: (s) => s.totalActivities >= 1 },
        { id: "getting_started", name: "Si Parte!", desc: "Accumula 100 XP", icon: "🚀", xpReward: 20, rarity: "comune", condition: (s) => s.totalXP >= 100 },
        
        // Matematica
        { id: "calculator", name: "Calcolatore", desc: "50 operazioni completate", icon: "🧮", xpReward: 30, rarity: "comune", condition: (s) => s.mathOperations >= 50 },
        { id: "problem_solver", name: "Risolutore", desc: "20 problemi risolti con AI", icon: "📐", xpReward: 50, rarity: "raro", condition: (s) => s.problemsSolved >= 20 },
        { id: "math_master", name: "Maestro dei Numeri", desc: "100 problemi risolti", icon: "🔢", xpReward: 100, rarity: "epico", condition: (s) => s.problemsSolved >= 100 },
        
        // Italiano
        { id: "writer", name: "Scrittore", desc: "20 testi controllati", icon: "✍️", xpReward: 30, rarity: "comune", condition: (s) => s.textsChecked >= 20 },
        { id: "perfect_writer", name: "Scrittore Perfetto", desc: "10 testi senza errori", icon: "📝", xpReward: 50, rarity: "raro", condition: (s) => s.perfectTexts >= 10 },
        { id: "grammar_master", name: "Maestro di Grammatica", desc: "50 testi senza errori", icon: "📚", xpReward: 100, rarity: "epico", condition: (s) => s.perfectTexts >= 50 },
        
        // Lavagna
        { id: "mapper", name: "Cartografo", desc: "10 mappe create", icon: "🗺️", xpReward: 30, rarity: "comune", condition: (s) => s.mapsCreated >= 10 },
        { id: "explorer", name: "Esploratore", desc: "30 mappe create", icon: "🧭", xpReward: 50, rarity: "raro", condition: (s) => s.mapsCreated >= 30 },
        { id: "mind_architect", name: "Architetto della Mente", desc: "100 mappe create", icon: "🏛️", xpReward: 100, rarity: "epico", condition: (s) => s.mapsCreated >= 100 },
        
        // Tutor
        { id: "curious", name: "Curioso", desc: "50 domande al tutor", icon: "❓", xpReward: 30, rarity: "comune", condition: (s) => s.tutorQuestions >= 50 },
        { id: "quiz_lover", name: "Amante dei Quiz", desc: "20 quiz completati", icon: "🎯", xpReward: 50, rarity: "raro", condition: (s) => s.quizCompleted >= 20 },
        { id: "knowledge_seeker", name: "Cercatore di Sapere", desc: "100 domande al tutor", icon: "🎓", xpReward: 100, rarity: "epico", condition: (s) => s.tutorQuestions >= 100 },
        
        // Streak
        { id: "streak_3", name: "Costante", desc: "3 giorni consecutivi", icon: "🔥", xpReward: 25, rarity: "comune", condition: (s) => s.maxStreak >= 3 },
        { id: "streak_7", name: "Settimana Perfetta", desc: "7 giorni consecutivi", icon: "🔥", xpReward: 50, rarity: "raro", condition: (s) => s.maxStreak >= 7 },
        { id: "streak_30", name: "Inarrestabile", desc: "30 giorni consecutivi", icon: "💪", xpReward: 150, rarity: "epico", condition: (s) => s.maxStreak >= 30 },
        { id: "streak_100", name: "Leggenda Vivente", desc: "100 giorni consecutivi", icon: "🏆", xpReward: 500, rarity: "leggendario", condition: (s) => s.maxStreak >= 100 },
        
        // Livelli
        { id: "level_5", name: "Avventuriero", desc: "Raggiungi livello 5", icon: "🏴‍☠️", xpReward: 100, rarity: "raro", condition: (s) => s.level >= 5 },
        { id: "level_8", name: "Gran Maestro", desc: "Raggiungi livello 8", icon: "👑", xpReward: 200, rarity: "epico", condition: (s) => s.level >= 8 },
        { id: "level_10", name: "Gran Corsaro", desc: "Raggiungi livello 10", icon: "🌟", xpReward: 500, rarity: "leggendario", condition: (s) => s.level >= 10 },
        
        // Speciali
        { id: "all_modules", name: "Tuttofare", desc: "Usa tutti i 4 moduli in un giorno", icon: "🌈", xpReward: 75, rarity: "raro", condition: (s) => s.allModulesToday },
        { id: "night_owl", name: "Gufo Notturno", desc: "Studia dopo le 22:00", icon: "🦉", xpReward: 25, rarity: "comune", condition: (s) => s.nightOwl },
        { id: "early_bird", name: "Mattiniero", desc: "Studia prima delle 7:00", icon: "🐦", xpReward: 25, rarity: "comune", condition: (s) => s.earlyBird }
    ],

    // ==================== 4 PERCORSI DI CRESCITA ====================
    PATHS_CONFIG: [
        {
            key: 'cartografo',
            name: 'Cartografo', emoji: '🗺️', color: '#4ade80',
            desc: 'Mappe mentali create',
            getValue: (s) => s.mapsCreated || 0,
            tiers: [
                { name: 'Mozzo',           min: 0   },
                { name: 'Timoniere',       min: 10  },
                { name: 'Navigatore',      min: 30  },
                { name: 'Gran Navigatore', min: 100 },
            ],
        },
        {
            key: 'scrittore',
            name: 'Scrittore', emoji: '✍️', color: '#c084fc',
            desc: 'Testi scritti e corretti',
            getValue: (s) => s.textsChecked || 0,
            tiers: [
                { name: 'Copista',        min: 0  },
                { name: 'Cronista',       min: 10 },
                { name: 'Bardo',          min: 25 },
                { name: 'Poeta del Mare', min: 50 },
            ],
        },
        {
            key: 'matematico',
            name: 'Matematico', emoji: '🔢', color: '#fbbf24',
            desc: 'Problemi risolti',
            getValue: (s) => s.problemsSolved || 0,
            tiers: [
                { name: 'Contabile',      min: 0   },
                { name: 'Tesoriere',      min: 5   },
                { name: 'Mastro',         min: 20  },
                { name: 'Gran Tesoriere', min: 100 },
            ],
        },
        {
            key: 'fedele',
            name: 'Fedele', emoji: '🔥', color: '#f97316',
            desc: 'Giorni consecutivi di studio',
            getValue: (s) => s.maxStreak || 0,
            tiers: [
                { name: 'Recluta',       min: 0  },
                { name: 'Marinaio',      min: 3  },
                { name: 'Luogotenente', min: 7  },
                { name: 'Capitano',      min: 30 },
            ],
        },
    ],

    getPaths: function() {
        const stats = this.loadStats();
        return this.PATHS_CONFIG.map(config => {
            const value = config.getValue(stats);
            let tierIndex = 0;
            config.tiers.forEach((t, i) => { if (value >= t.min) tierIndex = i; });
            const tier     = config.tiers[tierIndex];
            const nextTier = config.tiers[tierIndex + 1];
            const progress = nextTier
                ? Math.min(100, Math.round((value - tier.min) / (nextTier.min - tier.min) * 100))
                : 100;
            return {
                key: config.key, name: config.name, emoji: config.emoji,
                color: config.color, desc: config.desc, value,
                tierIndex, tierName: tier.name,
                nextTierName: nextTier?.name, nextTierMin: nextTier?.min,
                progress, isMax: !nextTier,
            };
        });
    },

    // ==================== STORAGE KEYS ====================
    STORAGE_KEYS: {
        stats: 'edugamer_stats',
        achievements: 'edugamer_achievements',
        lastSync: 'edugamer_last_sync',
        settings: 'edugamer_settings'
    },

    // ==================== STATISTICHE DEFAULT ====================
    getDefaultStats: function() {
        return {
            // XP e Livello
            totalXP: 0,
            level: 1,
            
            // Streak
            currentStreak: 0,
            maxStreak: 0,
            lastPlayDate: null,
            
            // Contatori attività
            totalActivities: 0,
            mathOperations: 0,
            problemsSolved: 0,
            textsChecked: 0,
            perfectTexts: 0,
            errorsFixed: 0,
            mapsCreated: 0,
            connectionsFound: 0,
            tutorQuestions: 0,
            quizCompleted: 0,
            
            // Moduli usati oggi
            modulesToday: [],
            todayDate: null,
            
            // Speciali
            nightOwl: false,
            earlyBird: false,
            
            // Tempo
            totalMinutesPlayed: 0,
            sessionsCount: 0,
            firstPlayDate: null
        };
    },

    // ==================== CARICA/SALVA STATS ====================
    loadStats: function() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEYS.stats);
            if (saved) {
                const stats = JSON.parse(saved);
                // Merge con default per nuovi campi
                return { ...this.getDefaultStats(), ...stats };
            }
        } catch (e) {
            console.error('Errore caricamento stats:', e);
        }
        return this.getDefaultStats();
    },

    saveStats: function(stats) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.stats, JSON.stringify(stats));
            window.dispatchEvent(new CustomEvent('edugamer-stats-updated', { detail: stats }));
        } catch (e) {
            console.error('Errore salvataggio stats:', e);
        }
    },

    // ==================== CARICA/SALVA ACHIEVEMENT ====================
    loadUnlockedAchievements: function() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEYS.achievements);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    },

    saveUnlockedAchievements: function(unlocked) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.achievements, JSON.stringify(unlocked));
        } catch (e) {
            console.error('Errore salvataggio achievement:', e);
        }
    },

    // ==================== CALCOLO LIVELLO ====================
    calculateLevel: function(xp) {
        let level = this.LEVELS[0];
        for (const l of this.LEVELS) {
            if (xp >= l.xpRequired) {
                level = l;
            } else {
                break;
            }
        }
        return level;
    },

    getXPForNextLevel: function(currentXP) {
        const currentLevel = this.calculateLevel(currentXP);
        const nextLevelIndex = this.LEVELS.findIndex(l => l.level === currentLevel.level) + 1;
        
        if (nextLevelIndex >= this.LEVELS.length) {
            return { current: currentXP, required: currentXP, progress: 100, isMax: true };
        }
        
        const nextLevel = this.LEVELS[nextLevelIndex];
        const xpInCurrentLevel = currentXP - currentLevel.xpRequired;
        const xpNeededForNext = nextLevel.xpRequired - currentLevel.xpRequired;
        const progress = Math.floor((xpInCurrentLevel / xpNeededForNext) * 100);
        
        return {
            current: xpInCurrentLevel,
            required: xpNeededForNext,
            progress: Math.min(progress, 100),
            isMax: false
        };
    },

    // ==================== GESTIONE STREAK ====================
    updateStreak: function(stats) {
        const today = new Date().toDateString();
        const lastPlay = stats.lastPlayDate;
        
        if (!lastPlay) {
            // Prima volta
            stats.currentStreak = 1;
            stats.maxStreak = 1;
        } else if (lastPlay === today) {
            // Già giocato oggi, non fare nulla
        } else {
            const lastDate = new Date(lastPlay);
            const todayDate = new Date(today);
            const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                // Giorno consecutivo!
                stats.currentStreak++;
                if (stats.currentStreak > stats.maxStreak) {
                    stats.maxStreak = stats.currentStreak;
                }
            } else if (diffDays > 1) {
                // Streak perso
                stats.currentStreak = 1;
            }
        }
        
        stats.lastPlayDate = today;
        return stats;
    },

    // ==================== CONTROLLA ACHIEVEMENT ====================
    checkAchievements: function(stats) {
        const unlocked = this.loadUnlockedAchievements();
        const newUnlocks = [];
        
        // Aggiungi level alle stats per i check
        stats.level = this.calculateLevel(stats.totalXP).level;
        
        // Controlla tutti i moduli oggi
        const today = new Date().toDateString();
        if (stats.todayDate === today && stats.modulesToday) {
            const allModules = ['matematica', 'italiano', 'lavagna', 'tutor'];
            stats.allModulesToday = allModules.every(m => stats.modulesToday.includes(m));
        }
        
        for (const achievement of this.ACHIEVEMENTS) {
            if (!unlocked.includes(achievement.id)) {
                try {
                    if (achievement.condition(stats)) {
                        unlocked.push(achievement.id);
                        newUnlocks.push(achievement);
                        stats.totalXP += achievement.xpReward;
                    }
                } catch (e) {
                    console.error('Errore check achievement:', achievement.id, e);
                }
            }
        }
        
        if (newUnlocks.length > 0) {
            this.saveUnlockedAchievements(unlocked);
            this.saveStats(stats);
            
            // Notifica nuovi achievement
            for (const a of newUnlocks) {
                this.showAchievementNotification(a);
            }
        }
        
        return newUnlocks;
    },

    // ==================== NOTIFICA ACHIEVEMENT ====================
    showAchievementNotification: function(achievement) {
        // Crea elemento notifica
        const notification = document.createElement('div');
        notification.className = 'edugamer-achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <div class="achievement-title">🏆 NUOVO TROFEO!</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-reward">+${achievement.xpReward} XP</div>
            </div>
        `;
        
        // Stili inline per compatibilità
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            border: 2px solid #fbbf24;
            border-radius: 16px;
            padding: 16px 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 10000;
            animation: slideIn 0.5s ease-out, fadeOut 0.5s ease-in 3.5s forwards;
            box-shadow: 0 10px 40px rgba(251, 191, 36, 0.3);
            font-family: 'OpenDyslexic', Verdana, sans-serif;
        `;
        
        // Aggiungi stili animazione se non esistono
        if (!document.getElementById('edugamer-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'edugamer-notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                .edugamer-achievement-notification .achievement-icon {
                    font-size: 2.5rem;
                }
                .edugamer-achievement-notification .achievement-info {
                    color: white;
                }
                .edugamer-achievement-notification .achievement-title {
                    font-size: 0.75rem;
                    color: #fbbf24;
                    font-weight: bold;
                }
                .edugamer-achievement-notification .achievement-name {
                    font-size: 1.1rem;
                    font-weight: bold;
                }
                .edugamer-achievement-notification .achievement-reward {
                    font-size: 0.9rem;
                    color: #4ade80;
                    font-weight: bold;
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Riproduci suono (opzionale)
        this.playSound('achievement');
        
        // Rimuovi dopo 4 secondi
        setTimeout(() => {
            notification.remove();
        }, 4000);
    },

    // ==================== SUONI ====================
    playSound: function(type) {
        // Suoni semplici con Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            if (type === 'achievement') {
                // Suono vittoria
                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
                oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
                oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            } else if (type === 'xp') {
                // Suono XP
                oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.15);
            } else if (type === 'levelup') {
                // Suono level up
                oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(554.37, audioContext.currentTime + 0.15);
                oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.3);
                oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.45);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.8);
            }
        } catch (e) {
            // Audio non supportato, ignora
        }
    },

    // ==================== API PRINCIPALE ====================
    
    /**
     * Aggiunge XP e aggiorna statistiche
     * @param {number} amount - Quantità XP da aggiungere
     * @param {string} source - Sorgente: 'matematica', 'italiano', 'lavagna', 'tutor'
     * @param {string} action - Azione specifica: 'operation', 'problem', 'text', 'map', 'question', 'quiz', etc.
     */
    addXP: function(amount, source = 'generic', action = 'generic') {
        let stats = this.loadStats();
        const oldLevel = this.calculateLevel(stats.totalXP).level;
        
        // Prima giocata
        if (!stats.firstPlayDate) {
            stats.firstPlayDate = new Date().toISOString();
        }
        
        // Aggiorna streak
        stats = this.updateStreak(stats);
        
        // Aggiungi XP
        stats.totalXP += amount;
        stats.totalActivities++;
        
        // Aggiorna contatori specifici
        switch (source) {
            case 'matematica':
                if (action === 'operation') stats.mathOperations++;
                if (action === 'problem') stats.problemsSolved++;
                break;
            case 'italiano':
                if (action === 'check') stats.textsChecked++;
                if (action === 'perfect') stats.perfectTexts++;
                if (action === 'fix') stats.errorsFixed++;
                break;
            case 'lavagna':
                if (action === 'map') stats.mapsCreated++;
                if (action === 'connection') stats.connectionsFound++;
                break;
            case 'tutor':
                if (action === 'question') stats.tutorQuestions++;
                if (action === 'quiz') stats.quizCompleted++;
                break;
        }
        
        // Traccia moduli usati oggi
        const today = new Date().toDateString();
        if (stats.todayDate !== today) {
            stats.todayDate = today;
            stats.modulesToday = [];
        }
        if (!stats.modulesToday.includes(source)) {
            stats.modulesToday.push(source);
        }
        
        // Controlla orari speciali
        const hour = new Date().getHours();
        if (hour >= 22 || hour < 5) stats.nightOwl = true;
        if (hour >= 5 && hour < 7) stats.earlyBird = true;
        
        // Salva
        this.saveStats(stats);
        
        // Controlla level up
        const newLevel = this.calculateLevel(stats.totalXP).level;
        if (newLevel > oldLevel) {
            this.showLevelUpNotification(this.LEVELS.find(l => l.level === newLevel));
        } else {
            this.playSound('xp');
        }
        
        // Controlla achievement
        this.checkAchievements(stats);
        
        // Evento per aggiornare UI
        window.dispatchEvent(new CustomEvent('edugamer-xp-added', { 
            detail: { amount, total: stats.totalXP, source, action } 
        }));
        
        // Compatibilità con vecchio sistema
        localStorage.setItem('edu_xp', stats.totalXP.toString());
        window.dispatchEvent(new Event('xpChanged'));
        
        return stats.totalXP;
    },

    // ==================== LEVEL UP NOTIFICATION ====================
    showLevelUpNotification: function(levelInfo) {
        this.playSound('levelup');
        
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
                animation: fadeIn 0.3s ease-out;
            ">
                <div style="
                    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                    border: 3px solid ${levelInfo.color};
                    border-radius: 24px;
                    padding: 32px 48px;
                    text-align: center;
                    animation: scaleIn 0.5s ease-out;
                    box-shadow: 0 0 60px ${levelInfo.color}40;
                ">
                    <div style="font-size: 4rem; margin-bottom: 16px;">${levelInfo.icon}</div>
                    <div style="color: ${levelInfo.color}; font-size: 1.5rem; font-weight: bold; margin-bottom: 8px;">
                        LIVELLO ${levelInfo.level}!
                    </div>
                    <div style="color: white; font-size: 2rem; font-weight: bold;">
                        ${levelInfo.name}
                    </div>
                    <div style="color: #94a3b8; margin-top: 16px; font-size: 0.9rem;">
                        Tocca per continuare
                    </div>
                </div>
            </div>
        `;
        
        // Aggiungi stili animazione
        if (!document.getElementById('edugamer-levelup-styles')) {
            const style = document.createElement('style');
            style.id = 'edugamer-levelup-styles';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.5); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Chiudi al click
        notification.addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto-chiudi dopo 5 secondi
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    },

    // ==================== GETTERS ====================
    getStats: function() {
        return this.loadStats();
    },

    getLevel: function() {
        const stats = this.loadStats();
        return this.calculateLevel(stats.totalXP);
    },

    getProgress: function() {
        const stats = this.loadStats();
        return this.getXPForNextLevel(stats.totalXP);
    },

    getAchievements: function() {
        const unlocked = this.loadUnlockedAchievements();
        return this.ACHIEVEMENTS.map(a => ({
            ...a,
            unlocked: unlocked.includes(a.id)
        }));
    },

    getStreak: function() {
        const stats = this.loadStats();
        return {
            current: stats.currentStreak,
            max: stats.maxStreak
        };
    },

    // ==================== RESET (per debug) ====================
    resetAll: function() {
        if (confirm('Sei sicuro di voler cancellare tutti i progressi?')) {
            localStorage.removeItem(this.STORAGE_KEYS.stats);
            localStorage.removeItem(this.STORAGE_KEYS.achievements);
            localStorage.removeItem('edu_xp');
            alert('Progressi cancellati!');
            location.reload();
        }
    },

    // ==================== MIGRAZIONE DA VECCHIO SISTEMA ====================
    migrateOldData: function() {
        const oldXP = parseInt(localStorage.getItem('edu_xp') || '0');
        const stats = this.loadStats();
        
        if (oldXP > stats.totalXP) {
            stats.totalXP = oldXP;
            this.saveStats(stats);
            console.log('Migrati', oldXP, 'XP dal vecchio sistema');
        }
    },

    // ==================== INIT ====================
    init: function() {
        this.migrateOldData();
        this._loadVoices();
        this._installAIVoice();
        console.log('🎮 EduGamer System inizializzato!');
        console.log('📊 Stats:', this.getStats());
        console.log('🏆 Level:', this.getLevel());
        return this;
    }
};

// Auto-init quando lo script viene caricato
if (typeof window !== 'undefined') {
    window.EduGamer = EduGamer.init();
}


















