import type { CSSProperties, ReactNode } from 'react';
import { cx } from './cx';

export interface CelebrationProps {
  /** Emoji protagonista, grande e fluttuante (es. "🔢"). */
  icon: string;
  /** Riga dorata in maiuscolo. */
  kicker?: string;
  /** Titolo bianco (es. il nome della zona sbloccata). */
  title: string;
  /** Messaggio sotto il titolo (es. "🐙 Numerus il Kraken ti aspetta!"). */
  message?: ReactNode;
  /** Testo del bottone dorato. */
  actionLabel?: string;
  /** Clic sul bottone (e sullo sfondo, con overlay). */
  onAction?: () => void;
  /** Colore dell'alone attorno all'emoji (esadecimale). */
  glowColor?: string;
  /** `true` (default): a tutto schermo su sfondo nero. `false`: solo il contenuto. */
  overlay?: boolean;
  className?: string;
}

/** Schermata di festa per un traguardo: nuova zona sbloccata, livello raggiunto, medaglia conquistata. */
export function Celebration({ icon, kicker = 'NUOVA ZONA SBLOCCATA!', title, message, actionLabel = '⚓ Fantastico!', onAction, glowColor = '#fbbf24', overlay = true, className }: CelebrationProps) {
  const content = (
    <div className={cx('eg-celebration', className)} style={{ '--eg-celebration-color': glowColor } as CSSProperties} onClick={e => e.stopPropagation()}>
      <div className="eg-celebration__icon" aria-hidden="true">{icon}</div>
      <div className="eg-celebration__spark" aria-hidden="true">✨</div>
      <div className="eg-celebration__kicker">{kicker}</div>
      <div className="eg-celebration__title">{title}</div>
      {message != null && <div className="eg-celebration__message">{message}</div>}
      <button type="button" className="eg-btn eg-btn--oro" onClick={onAction}>{actionLabel}</button>
    </div>
  );
  if (!overlay) return content;
  return (
    <div className="eg-backdrop eg-backdrop--center" style={{ background: 'rgba(0,0,0,0.88)' }} onClick={onAction}>
      {content}
    </div>
  );
}
