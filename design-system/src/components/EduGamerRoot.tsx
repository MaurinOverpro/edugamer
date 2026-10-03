import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from './cx';

export interface EduGamerRootProps extends HTMLAttributes<HTMLDivElement> {
  /** `notte` = sfondo standard dei moduli (#0a0e17); `isola` = gradiente blu dell'Isola Misteriosa. */
  background?: 'notte' | 'isola';
  /** Aggiunge 16px di margine interno. */
  padded?: boolean;
  children?: ReactNode;
}

/**
 * Contenitore radice di ogni schermata EduGamer: applica sfondo scuro, font OpenDyslexic,
 * spaziatura tra lettere e interlinea accessibili (DSA). Avvolgi sempre la pagina in questo componente.
 */
export function EduGamerRoot({ background = 'notte', padded = false, className, children, ...rest }: EduGamerRootProps) {
  return (
    <div className={cx('eg-root', background === 'isola' && 'eg-root--isola', padded && 'eg-root--pad', className)} {...rest}>
      {children}
    </div>
  );
}
