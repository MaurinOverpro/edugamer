import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from './cx';

export interface PirateTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Livello del titolo HTML. */
  as?: 'h1' | 'h2' | 'h3';
  /** Dimensione: md 24px, lg 30px, xl 40px. */
  size?: 'md' | 'lg' | 'xl';
  /** Colore: oro (default), inchiostro (su pergamena), bianco. */
  tone?: 'oro' | 'inchiostro' | 'bianco';
  /** Alone dorato attorno al testo. */
  glow?: boolean;
  children?: ReactNode;
}

/**
 * Titolo decorativo "da manoscritto" in Georgia. Usalo SOLO per titoli brevi (massimo 5 parole) e grandi;
 * mai per paragrafi o testo da leggere, che restano in OpenDyslexic.
 */
export function PirateTitle({ as: Tag = 'h1', size = 'lg', tone = 'oro', glow = false, className, children, ...rest }: PirateTitleProps) {
  return (
    <Tag className={cx('eg-title', `eg-title--${size}`, tone !== 'oro' && `eg-title--${tone}`, glow && 'eg-title--glow', className)} {...rest}>
      {children}
    </Tag>
  );
}
