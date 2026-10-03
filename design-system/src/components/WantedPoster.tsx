import type { CSSProperties } from 'react';
import { cx } from './cx';

export interface WantedPosterProps {
  /** Immagine del poster o del ritratto (URL o data-URI). Se assente usa `portrait`. */
  imageSrc?: string;
  /** Emoji usata come ritratto quando non c'è un'immagine (default "🏴‍☠️"). */
  portrait?: string;
  /** Nome da pirata. */
  name?: string;
  /** Taglia in Berry (la valuta dell'app). */
  bounty?: number;
  /** Livello del pirata. */
  level?: number;
  /** `mini` (miniatura cliccabile per intestazioni), `full` (poster grande), `empty` (invito "CREA POSTER"). */
  variant?: 'mini' | 'full' | 'empty';
  /** Larghezza in px della miniatura (`mini`/`empty`). Default 60. */
  size?: number;
  /** Clic sul poster (es. per aprirlo in grande o andare alla creazione). */
  onClick?: () => void;
  className?: string;
}

/** Poster "WANTED" del pirata con taglia in Berry: miniatura, versione grande o invito a crearlo. */
export function WantedPoster({ imageSrc, portrait = '🏴‍☠️', name, bounty, level, variant = 'mini', size = 60, onClick, className }: WantedPosterProps) {
  if (variant === 'empty') {
    return (
      <button type="button" className={cx('eg-wanted eg-wanted--empty', className)} style={{ width: size }} onClick={onClick} aria-label="Crea il tuo poster Wanted">
        <div style={{ fontSize: size * 0.37, lineHeight: 1 }} aria-hidden="true">{portrait}</div>
        <div className="eg-wanted__tag" style={{ fontSize: Math.max(7, size * 0.11) }}>CREA<br />POSTER</div>
      </button>
    );
  }
  if (variant === 'mini') {
    const w = size - 8;
    const h = Math.round(w * 1.3);
    const pic: CSSProperties = { width: w, height: h };
    return (
      <button type="button" className={cx('eg-wanted', className)} style={{ width: size }} onClick={onClick} aria-label="Mostra il tuo Wanted Poster">
        {imageSrc
          ? <img className="eg-wanted__img" src={imageSrc} alt="" style={pic} />
          : <div className="eg-wanted__portrait" style={{ ...pic, fontSize: w * 0.6 }} aria-hidden="true">{portrait}</div>}
        <div className="eg-wanted__tag" style={{ fontSize: Math.max(7, size * 0.12) }}>WANTED</div>
      </button>
    );
  }
  return (
    <div className={cx('eg-wanted eg-wanted--full', className)} style={{ width: 280 }} onClick={onClick}>
      <div className="eg-wanted__headline">WANTED</div>
      <div className="eg-wanted__sub">VIVO O MORTO</div>
      {imageSrc
        ? <img className="eg-wanted__img" src={imageSrc} alt={name ? `Ritratto di ${name}` : ''} style={{ height: 240 }} />
        : <div className="eg-wanted__portrait" style={{ height: 240, fontSize: 120 }} aria-hidden="true">{portrait}</div>}
      {name && <div className="eg-wanted__name">{name}</div>}
      {(bounty != null || level != null) && (
        <div className="eg-wanted__bounty">
          {bounty != null && <>Taglia: {bounty.toLocaleString('it-IT')} Berry</>}
          {bounty != null && level != null && ' · '}
          {level != null && <>Lv.{level}</>}
        </div>
      )}
    </div>
  );
}
