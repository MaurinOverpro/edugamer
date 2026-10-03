import { cx } from './cx';

export interface PirateAvatarProps {
  /** Immagine (URL o data-URI) oppure un'emoji (es. "🦜"). Default "🏴‍☠️". */
  src?: string;
  /** Diametro in px. Default 44. */
  size?: number;
  /** Cornice: `oro` (avatar dello studente, con bagliore) o `semplice`. */
  ring?: 'oro' | 'semplice';
  /** Rende l'avatar un bottone (es. "modifica profilo"). */
  onClick?: () => void;
  /** Testo alternativo / etichetta accessibile. */
  label?: string;
  className?: string;
}

const isImage = (s?: string) => !!s && (s.startsWith('data:') || s.startsWith('http') || s.startsWith('/') || s.includes('.'));

/** Avatar rotondo del pirata: foto/immagine AI oppure emoji, con cornice dorata. */
export function PirateAvatar({ src = '🏴‍☠️', size = 44, ring = 'oro', onClick, label = 'Avatar pirata', className }: PirateAvatarProps) {
  const cls = cx('eg-avatar', ring === 'oro' && 'eg-avatar--oro', onClick && 'eg-avatar--clickable', className);
  const style = { width: size, height: size, fontSize: Math.round(size * 0.5) };
  const inner = isImage(src) ? <img src={src} alt={label} /> : <span aria-hidden="true">{src}</span>;
  return onClick
    ? <button type="button" className={cls} style={style} onClick={onClick} aria-label={label}>{inner}</button>
    : <span className={cls} style={style} role="img" aria-label={label}>{inner}</span>;
}
