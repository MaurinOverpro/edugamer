import type { AnchorHTMLAttributes, CSSProperties } from 'react';
import { cx } from './cx';

const ACCENTS = {
  giungla: ['#4ade80', 'rgba(74,222,128,0.25)'],
  oro: ['#facc15', 'rgba(250,204,21,0.25)'],
  mare: ['#60a5fa', 'rgba(96,165,250,0.25)'],
  abisso: ['#c084fc', 'rgba(192,132,252,0.25)'],
  indaco: ['#818cf8', 'rgba(129,140,248,0.25)'],
  corallo: ['#fb923c', 'rgba(251,146,60,0.25)'],
} as const;

export interface ModuleCardProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Emoji grande del modulo (es. "📐"). */
  icon: string;
  /** Nome del modulo, in maiuscolo (es. "MATEMATICA"). */
  title: string;
  /** Colore di bordo e titolo: giungla, oro, mare, abisso, indaco, corallo. */
  accent?: 'giungla' | 'oro' | 'mare' | 'abisso' | 'indaco' | 'corallo';
  /** Testo dell'etichetta in basso. */
  actionLabel?: string;
  /** Modulo non ancora sbloccato: grigio e non cliccabile. */
  locked?: boolean;
}

/**
 * Card di accesso a un modulo (la griglia della Home). Bordo colorato, emoji grande, titolo colorato
 * ed etichetta "APRI MODULO"; al passaggio si solleva con un bagliore.
 */
export function ModuleCard({ icon, title, accent = 'giungla', actionLabel = 'APRI MODULO', locked = false, className, style, ...rest }: ModuleCardProps) {
  const [color, glow] = ACCENTS[accent];
  const vars = { '--eg-accent': color, '--eg-accent-glow': glow, ...style } as CSSProperties;
  return (
    <a className={cx('eg-module-card', locked && 'eg-module-card--locked', className)} style={vars} aria-disabled={locked || undefined} {...rest}>
      <div className="eg-module-card__icon" aria-hidden="true">{locked ? '🔒' : icon}</div>
      <h2 className="eg-module-card__title">{title}</h2>
      <span className="eg-pill">{locked ? 'BLOCCATO' : actionLabel}</span>
    </a>
  );
}
