import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from './cx';

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  /** `default` riquadro pieno con ombra, `soft` più leggero e senza ombra (per sezioni dentro una pagina). */
  tone?: 'default' | 'soft';
  /** Margine interno: sm 12px, md 20px, lg 28px. */
  padding?: 'sm' | 'md' | 'lg';
  /** Etichetta dorata in maiuscolo sopra il contenuto (es. "⚓ Il tuo nome da Pirata"). */
  label?: ReactNode;
  /** Emoji grande e trasparente nell'angolo in basso a destra (es. "🏴‍☠️"). */
  watermark?: string;
  children?: ReactNode;
}

/** Riquadro scuro arrotondato: il contenitore base delle sezioni di ogni modulo. */
export function Panel({ tone = 'default', padding = 'md', label, watermark, className, children, ...rest }: PanelProps) {
  return (
    <div className={cx('eg-panel', tone === 'soft' && 'eg-panel--soft', `eg-panel--pad-${padding}`, className)} {...rest}>
      {label != null && <span className="eg-panel__label">{label}</span>}
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
      {watermark && <div className="eg-panel__watermark" aria-hidden="true">{watermark}</div>}
    </div>
  );
}
