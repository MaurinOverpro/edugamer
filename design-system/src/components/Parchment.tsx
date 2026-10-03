import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from './cx';

export interface ParchmentProps extends HTMLAttributes<HTMLDivElement> {
  /** Titolo breve in stile manoscritto (es. "L'Isola Misteriosa"). */
  title?: string;
  /** Emoji sopra il titolo (default "📜"). */
  icon?: string;
  /** Riga finale centrata in grassetto (es. "⚓ Buona fortuna, Pirata! ⚓"). */
  footer?: ReactNode;
  /** Mostra le stelline ✦ decorative negli angoli. */
  corners?: boolean;
  children?: ReactNode;
}

/**
 * Pergamena: riquadro color carta antica con bordo bronzo, per regole, storie e messaggi narrativi.
 * Dentro usa paragrafi `<p>`; per un elenco evidenziato usa un `<div className="eg-parchment__box">`.
 */
export function Parchment({ title, icon = '📜', footer, corners = true, className, children, ...rest }: ParchmentProps) {
  return (
    <div className={cx('eg-parchment', className)} {...rest}>
      {corners && ['tl', 'tr', 'bl', 'br'].map(p => (
        <span key={p} className={`eg-parchment__corner eg-parchment__corner--${p}`} aria-hidden="true">✦</span>
      ))}
      {(title || icon) && (
        <div className="eg-parchment__head">
          {icon && <div className="eg-parchment__icon" aria-hidden="true">{icon}</div>}
          {title && <h2 className="eg-title eg-title--md eg-title--inchiostro">{title}</h2>}
          <div className="eg-parchment__rule" />
        </div>
      )}
      <div className="eg-parchment__body">{children}</div>
      {footer != null && <div className="eg-parchment__foot">{footer}</div>}
    </div>
  );
}
