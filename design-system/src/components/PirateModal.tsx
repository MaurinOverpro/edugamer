import type { CSSProperties, ReactNode } from 'react';
import { cx } from './cx';

export interface PirateModalProps {
  /** Titolo (es. "Caverna dei Numeri"). */
  title: string;
  /** Sottotitolo colorato (es. "🐙 Numerus il Kraken"). */
  subtitle?: ReactNode;
  /** Emoji nel riquadro a sinistra del titolo. */
  icon?: string;
  /** Colore della zona per bordo e bagliore (esadecimale, default oro #fbbf24). */
  color?: string;
  /** Chiamato dal bottone ✕ e dal clic sullo sfondo. Se omesso il bottone ✕ non compare. */
  onClose?: () => void;
  /** `true` (default): finestra sopra uno sfondo scuro a tutto schermo. `false`: solo il riquadro, nel flusso della pagina. */
  overlay?: boolean;
  /** Posizione con overlay: `bottom` (foglio dal basso, come su smartphone) o `center`. */
  placement?: 'bottom' | 'center';
  className?: string;
  children?: ReactNode;
}

/** Finestra modale scura con bordo e bagliore del colore della zona, icona, titolo e bottone di chiusura. */
export function PirateModal({ title, subtitle, icon, color = '#fbbf24', onClose, overlay = true, placement = 'bottom', className, children }: PirateModalProps) {
  const box = (
    <div className={cx('eg-modal', className)} style={{ '--eg-modal-color': color } as CSSProperties} role="dialog" aria-label={title} onClick={e => e.stopPropagation()}>
      <div className="eg-modal__head">
        {icon && <div className="eg-modal__icon" aria-hidden="true">{icon}</div>}
        <div className="eg-modal__titles">
          <h2 className="eg-modal__title">{title}</h2>
          {subtitle != null && <p className="eg-modal__subtitle">{subtitle}</p>}
        </div>
        {onClose && <button type="button" className="eg-modal__close" onClick={onClose} aria-label="Chiudi">✕</button>}
      </div>
      <div className="eg-modal__body">{children}</div>
    </div>
  );
  if (!overlay) return box;
  return (
    <div className={cx('eg-backdrop', placement === 'center' && 'eg-backdrop--center')} onClick={onClose}>
      {box}
    </div>
  );
}
