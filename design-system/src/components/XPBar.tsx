import type { HTMLAttributes } from 'react';
import { cx } from './cx';

export interface XPBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Livello attuale (1–10). */
  level: number;
  /** Punti esperienza totali. */
  xp: number;
  /** Nome del grado pirata (es. "Navigatore"). Progressione: Marinaio, Esploratore, Navigatore, Corsaro, Avventuriero, Cacciatore, Leggenda, Gran Maestro, Anima Antica, Gran Corsaro. */
  levelName?: string;
  /** Avanzamento verso il prossimo livello, 0–100. Se omesso: xp % 100. */
  progress?: number;
  /** Testo sotto la barra (es. "Mancano 120 XP per Corsaro"). */
  hint?: string;
  /** Colore della barra: giungla (verde, default della Home) oppure oro. */
  color?: 'giungla' | 'oro';
  /** Versione ridotta per intestazioni. */
  compact?: boolean;
}

/** Barra dell'esperienza: "LIVELLO N", grado pirata, punti XP e barra luccicante animata. */
export function XPBar({ level, xp, levelName, progress, hint, color = 'giungla', compact = false, className, ...rest }: XPBarProps) {
  const pct = Math.max(0, Math.min(100, progress ?? xp % 100));
  return (
    <div className={cx('eg-xp', compact && 'eg-xp--compact', className)} {...rest}>
      <div className="eg-xp__head">
        <div>
          {levelName && <span className="eg-xp__name">{levelName}</span>}
          <span className="eg-xp__level">LIVELLO {level}</span>
        </div>
        <span className="eg-xp__points">{xp.toLocaleString('it-IT')} XP</span>
      </div>
      <div className="eg-xp__track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className={cx('eg-xp__fill', color === 'oro' && 'eg-xp__fill--oro')} style={{ width: `${pct}%` }} />
      </div>
      {hint && <div className="eg-xp__foot">{hint}</div>}
    </div>
  );
}
