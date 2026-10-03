import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from './cx';

export interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  /** Colore: neutro (grigio), oro, giungla (verde), mare (azzurro), abisso (viola), pericolo (rosso). */
  tone?: 'neutro' | 'oro' | 'giungla' | 'mare' | 'abisso' | 'pericolo';
  children?: ReactNode;
}

/** Etichetta arrotondata piccola: stati ("APRI MODULO", "NUOVO"), contatori, categorie. */
export function Pill({ tone = 'neutro', className, children, ...rest }: PillProps) {
  return <span className={cx('eg-pill', tone !== 'neutro' && `eg-pill--${tone}`, className)} {...rest}>{children}</span>;
}
