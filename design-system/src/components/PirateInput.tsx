import type { InputHTMLAttributes, ReactNode } from 'react';
import { cx } from './cx';

export interface PirateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Etichetta dorata in maiuscolo sopra il campo (es. "⚓ Il tuo nome da Pirata"). */
  label?: ReactNode;
  /** Suggerimento grigio sotto il campo. */
  hint?: ReactNode;
  /** Messaggio di errore rosso sotto il campo (colora anche il bordo). */
  error?: ReactNode;
}

/** Campo di testo: alto 56px, testo OpenDyslexic, bordo che diventa oro quando è attivo. */
export function PirateInput({ label, hint, error, className, id, ...rest }: PirateInputProps) {
  return (
    <label className={cx('eg-field', error != null && 'eg-field--error', className)} htmlFor={id}>
      {label != null && <span className="eg-field__label">{label}</span>}
      <input id={id} className="eg-input" aria-invalid={error != null || undefined} {...rest} />
      {error != null ? <div className="eg-field__error">{error}</div> : hint != null ? <div className="eg-field__hint">{hint}</div> : null}
    </label>
  );
}
