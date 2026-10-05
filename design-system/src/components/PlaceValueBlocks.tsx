import type { HTMLAttributes } from 'react';
import { cx } from './cx';

export interface PlaceValueBlocksProps extends HTMLAttributes<HTMLDivElement> {
  /** Numero da rappresentare, da 0 a 9.999.999. */
  value: number;
  /** Mostra il numero in cifre sopra i blocchi. */
  showNumber?: boolean;
  /** Mostra la legenda dei colori delle posizioni presenti. */
  showLegend?: boolean;
}

/* Stessi colori e misure di matematica.html: ogni posizione è un pezzo ~20% più grande della precedente. */
const POS = [
  { key: 'mln', label: 'Mln', name: 'Milioni',             div: 1000000, size: 42, color: '#fbbf24', border: '#b45309' },
  { key: 'cm',  label: 'CM',  name: 'Centinaia di migliaia', div: 100000, size: 35, color: '#f472b6', border: '#be185d' },
  { key: 'dm',  label: 'DM',  name: 'Decine di migliaia',  div: 10000,   size: 29, color: '#f87171', border: '#b91c1c' },
  { key: 'm',   label: 'M',   name: 'Migliaia',            div: 1000,    size: 24, color: '#fb923c', border: '#c2410c' },
  { key: 'c',   label: 'C',   name: 'Centinaia',           div: 100,     size: 20, color: '#c084fc', border: '#7e22ce' },
  { key: 'd',   label: 'D',   name: 'Decine',              div: 10,      size: 17, color: '#60a5fa', border: '#1d4ed8' },
  { key: 'u',   label: 'U',   name: 'Unità',               div: 1,       size: 14, color: '#4ade80', border: '#15803d' },
];
const GAP = 3;
const SEP_BEFORE = new Set(['m', 'mln']);

/**
 * Tabella posizionale per la discalculia: una colonna per posizione, tanti pezzi quanto vale la cifra.
 * Ogni posizione ha il suo colore e un pezzo un po' più grande della precedente (doppio indizio, utile anche ai daltonici).
 * I pezzi stanno in un quadrato 3×3 riempito dal basso: con 9 è pieno, il decimo non entra → cambio.
 */
export function PlaceValueBlocks({ value, showNumber = true, showLegend = true, className, ...rest }: PlaceValueBlocksProps) {
  const n = Math.max(0, Math.min(9999999, Math.floor(value)));
  const all = POS.map(p => ({ ...p, digit: Math.floor(n / p.div) % 10 }));
  const first = all.findIndex(p => p.digit > 0);
  const shown = all.slice(first === -1 ? all.length - 1 : first);
  const gridH = 3 * Math.max(...shown.map(p => p.size)) + 2 * GAP;
  const rep = (k: number) => Array.from({ length: k }, (_, i) => i);
  return (
    <div className={cx('eg-blocks', className)} {...rest}>
      {showNumber && <div className="eg-blocks__number">{n.toLocaleString('it-IT')}</div>}
      <div className="eg-blocks__area" aria-label={shown.map(p => `${p.digit} ${p.name.toLowerCase()}`).join(', ')}>
        {shown.map((p, i) => (
          <div key={p.key} style={{ display: 'contents' }}>
            {i > 0 && SEP_BEFORE.has(p.key) && <div className="eg-blocks__sep" />}
            <div className="eg-blocks__col">
              <div className="eg-blocks__label" style={{ color: p.color, borderColor: p.border }}>{p.label}</div>
              <div className="eg-blocks__stack" style={{ height: gridH }}>
                <div className="eg-blocks__grid" style={{ width: 3 * p.size + 2 * GAP, gap: GAP }}>
                  {rep(p.digit).map(j => (
                    <div key={j} className="eg-blocks__piece"
                      style={{ width: p.size, height: p.size, background: p.color, borderColor: p.border, borderRadius: p.key === 'mln' ? '50%' : 3 }} />
                  ))}
                </div>
              </div>
              <div className="eg-blocks__digit" style={{ color: p.digit > 0 ? p.color : 'var(--eg-text-faint)', borderColor: p.border }}>{p.digit}</div>
            </div>
          </div>
        ))}
      </div>
      {showLegend && (
        <div className="eg-blocks__legend">
          {shown.map(p => (
            <span key={p.key} className="eg-blocks__legend-item">
              <span className="eg-blocks__swatch" style={{ background: p.color }} />{p.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
