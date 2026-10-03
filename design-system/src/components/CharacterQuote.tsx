import type { CSSProperties, ReactNode } from 'react';
import { cx } from './cx';

export interface CharacterQuoteProps {
  /** Nome del personaggio (es. "Capitano Squall", "Numerus il Kraken", "Zara la Veggente", "Barbanera"). */
  name: string;
  /** Emoji del personaggio (es. "🦜", "🐙", "🔭", "💀"). */
  emoji: string;
  /** Colore del personaggio (esadecimale): Squall #38bdf8, Numerus #fbbf24, Zara #4ade80, Isabella #c084fc, Rex #fb923c. */
  color?: string;
  /** Battuta del personaggio (senza virgolette: le aggiunge il componente). */
  children: ReactNode;
  className?: string;
}

/** Fumetto di un personaggio dell'Isola: emoji e nome colorati, battuta in corsivo su fondo tinto. */
export function CharacterQuote({ name, emoji, color = '#38bdf8', children, className }: CharacterQuoteProps) {
  return (
    <figure className={cx('eg-quote', className)} style={{ '--eg-quote-color': color, margin: 0 } as CSSProperties}>
      <figcaption className="eg-quote__who">
        <span className="eg-quote__emoji" aria-hidden="true">{emoji}</span>
        <span>{name}</span>
      </figcaption>
      <blockquote className="eg-quote__text">“{children}”</blockquote>
    </figure>
  );
}
