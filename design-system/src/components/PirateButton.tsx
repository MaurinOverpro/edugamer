import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from './cx';

export interface PirateButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Stile: `oro` azione principale (tesoro), `tutor` viola per il tutor AI, `mare` blu (caricamenti, foto),
   * `giungla` verde (salva/conferma), `secondario` neutro (annulla, chiudi), `pericolo` rosso.
   */
  variant?: 'oro' | 'tutor' | 'mare' | 'giungla' | 'secondario' | 'pericolo';
  /** `md` altezza 56px (minimo di tocco), `lg` 64px per la chiamata principale della schermata. */
  size?: 'md' | 'lg';
  /** Emoji o icona mostrata prima del testo. */
  icon?: ReactNode;
  /** Occupa tutta la larghezza disponibile. */
  fullWidth?: boolean;
  /** Mostra uno spinner e disabilita il bottone. */
  loading?: boolean;
  /** Se presente, il bottone diventa un link `<a>`. */
  href?: string;
  children?: ReactNode;
}

/**
 * Bottone EduGamer. Area di tocco minima 56px, testo in grassetto OpenDyslexic, leggero "rimbalzo" al tocco.
 * Una sola azione `oro` per schermata.
 */
export function PirateButton({ variant = 'oro', size = 'md', icon, fullWidth = false, loading = false, href, className, children, disabled, ...rest }: PirateButtonProps) {
  const cls = cx('eg-btn', `eg-btn--${variant}`, size === 'lg' && 'eg-btn--lg', fullWidth && 'eg-btn--full', className);
  const content = (
    <>
      {loading ? <span className="eg-spinner" aria-hidden="true" /> : icon ? <span className="eg-btn__icon" aria-hidden="true">{icon}</span> : null}
      {children != null && <span>{children}</span>}
    </>
  );
  if (href) {
    return <a href={href} className={cls} aria-disabled={disabled || loading || undefined}>{content}</a>;
  }
  return <button type="button" className={cls} disabled={disabled || loading} {...rest}>{content}</button>;
}
