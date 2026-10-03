import type { CSSProperties, HTMLAttributes } from 'react';
import { cx } from './cx';

export interface PathProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Grado attuale nel percorso (es. "Cartografo"). */
  tierName: string;
  /** Emoji del percorso (es. "🗺️"). */
  emoji?: string;
  /** Breve descrizione del percorso (es. "Mappe mentali create"). */
  description?: string;
  /** Valore numerico mostrato grande a destra (es. 12). */
  value?: number | string;
  /** Avanzamento verso il grado successivo, 0–100. */
  progress: number;
  /** Nome del grado successivo. */
  nextTierName?: string;
  /** Soglia del grado successivo. */
  nextTierMin?: number;
  /** Grado massimo raggiunto: mostra "🏆 MASSIMO!". */
  isMax?: boolean;
  /** Colore della zona (esadecimale). Usa la palette: #4ade80 giungla, #fbbf24 oro, #38bdf8 mare, #c084fc abisso, #fb923c corallo. */
  color?: string;
}

/** Avanzamento in un percorso di studio dell'Isola (grado attuale, barra colorata, grado successivo). */
export function PathProgress({ tierName, emoji, description, value, progress, nextTierName, nextTierMin, isMax = false, color = '#4ade80', className, style, ...rest }: PathProgressProps) {
  const pct = Math.max(0, Math.min(100, Math.round(progress)));
  return (
    <div className={cx('eg-path', className)} style={{ '--eg-path-color': color, ...style } as CSSProperties} {...rest}>
      <div className="eg-path__head">
        {emoji && <span className="eg-path__emoji" aria-hidden="true">{emoji}</span>}
        <div>
          <div className="eg-path__tier">{tierName}</div>
          {description && <div className="eg-path__desc">{description}</div>}
        </div>
        {value != null && <span className="eg-path__value">{value}</span>}
      </div>
      <div className="eg-path__labels">
        <strong>{tierName}</strong>
        <span>{isMax ? '🏆 MASSIMO!' : nextTierName ? `→ ${nextTierName}${nextTierMin != null ? ` (${nextTierMin})` : ''}` : ''}</span>
      </div>
      <div className="eg-path__track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="eg-path__fill" style={{ width: `${isMax ? 100 : pct}%` }} />
      </div>
      <div className="eg-path__pct">{isMax ? 100 : pct}%</div>
    </div>
  );
}
