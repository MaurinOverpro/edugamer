import type { HTMLAttributes } from 'react';
import { cx } from './cx';

export interface PlaceValueBlocksProps extends HTMLAttributes<HTMLDivElement> {
  /** Numero da rappresentare, da 0 a 9999. */
  value: number;
  /** Mostra il numero in cifre sopra i blocchi. */
  showNumber?: boolean;
  /** Mostra la legenda dei colori (migliaia, centinaia, decine, unità). */
  showLegend?: boolean;
}

const LEGEND = [
  { label: 'Migliaia', color: '#f97316' },
  { label: 'Centinaia', color: '#a855f7' },
  { label: 'Decine', color: '#3b82f6' },
  { label: 'Unità', color: '#4ade80' },
];

/**
 * Blocchi posizionali per la discalculia: migliaia (cubo arancio "1000"), centinaia (piastra viola 10×10),
 * decine (barretta blu da 10) e unità (cubetto verde). Colori fissi in tutta l'app.
 */
export function PlaceValueBlocks({ value, showNumber = true, showLegend = true, className, ...rest }: PlaceValueBlocksProps) {
  const n = Math.max(0, Math.min(9999, Math.floor(value)));
  const th = Math.floor(n / 1000), h = Math.floor((n % 1000) / 100), t = Math.floor((n % 100) / 10), u = n % 10;
  const rep = (k: number) => Array.from({ length: k }, (_, i) => i);
  return (
    <div className={cx('eg-blocks', className)} {...rest}>
      {showNumber && <div className="eg-blocks__number">{n.toLocaleString('it-IT')}</div>}
      <div className="eg-blocks__area" aria-label={`${th} migliaia, ${h} centinaia, ${t} decine, ${u} unità`}>
        {th > 0 && <div className="eg-blocks__group">{rep(th).map(i => <div key={i} className="eg-block-thousand">1000</div>)}</div>}
        {h > 0 && <div className="eg-blocks__group">{rep(h).map(i => <div key={i} className="eg-block-hundred">{rep(100).map(j => <span key={j} />)}</div>)}</div>}
        {t > 0 && <div className="eg-blocks__group">{rep(t).map(i => <div key={i} className="eg-block-ten">{rep(10).map(j => <span key={j} />)}</div>)}</div>}
        {u > 0 && <div className="eg-blocks__group">{rep(u).map(i => <div key={i} className="eg-block-unit" />)}</div>}
      </div>
      {showLegend && (
        <div className="eg-blocks__legend">
          {LEGEND.map(l => (
            <span key={l.label} className="eg-blocks__legend-item">
              <span className="eg-blocks__swatch" style={{ background: l.color }} />{l.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
