/**
 * EduGamer - Sistema di Gamification
 * Gestisce XP, Livelli, Streak, Achievement e Statistiche
 * Funziona offline con localStorage, pronto per sync con Neon
 */

const EduGamer = {
    // ==================== CONFIGURAZIONE LIVELLI ====================
    LEVELS: [
        { level: 1, name: "Principiante", xpRequired: 0, icon: "🥉", color: "#cd7f32" },
        { level: 2, name: "Apprendista", xpRequired: 100, icon: "🥉", color: "#cd7f32" },
        { level: 3, name: "Studente", xpRequired: 300, icon: "🥈", color: "#c0c0c0" },
        { level: 4, name: "Esperto", xpRequired: 600, icon: "🥈", color: "#c0c0c0" },
        { level: 5, name: "Maestro", xpRequired: 1000, icon: "🥇", color: "#ffd700" },
        { level: 6, name: "Campione", xpRequired: 1500, icon: "🥇", color: "#ffd700" },
        { level: 7, name: "Leggenda", xpRequired: 2500, icon: "💎", color: "#00d4ff" },
        { level: 8, name: "Mito", xpRequired: 4000, icon: "👑", color: "#ff6b00" },
        { level: 9, name: "Divinità", xpRequired: 6000, icon: "⚡", color: "#a855f7" },
        { level: 10, name: "Immortale", xpRequired: 10000, icon: "🌟", color: "#ff0080" }
    ],

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
        { id: "level_5", name: "Maestro", desc: "Raggiungi livello 5", icon: "🥇", xpReward: 100, rarity: "raro", condition: (s) => s.level >= 5 },
        { id: "level_8", name: "Mito", desc: "Raggiungi livello 8", icon: "👑", xpReward: 200, rarity: "epico", condition: (s) => s.level >= 8 },
        { id: "level_10", name: "Immortale", desc: "Raggiungi livello 10", icon: "🌟", xpReward: 500, rarity: "leggendario", condition: (s) => s.level >= 10 },
        
        // Speciali
        { id: "all_modules", name: "Tuttofare", desc: "Usa tutti i 4 moduli in un giorno", icon: "🌈", xpReward: 75, rarity: "raro", condition: (s) => s.allModulesToday },
        { id: "night_owl", name: "Gufo Notturno", desc: "Studia dopo le 22:00", icon: "🦉", xpReward: 25, rarity: "comune", condition: (s) => s.nightOwl },
        { id: "early_bird", name: "Mattiniero", desc: "Studia prima delle 7:00", icon: "🐦", xpReward: 25, rarity: "comune", condition: (s) => s.earlyBird }
    ],

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


















