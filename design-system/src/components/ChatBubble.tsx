import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from './cx';

export interface ChatBubbleProps extends HTMLAttributes<HTMLDivElement> {
  /** Chi parla: `studente` (verde, a destra) o `tutor` (viola, a sinistra). */
  from: 'studente' | 'tutor';
  /** Piccola intestazione sopra il messaggio (es. "🎓 Tutor"). */
  author?: ReactNode;
  children?: ReactNode;
}

/**
 * Messaggio della chat con il tutor AI. Testo grande (1.1rem) e interlinea 1.8 per la lettura DSA.
 * Metti più bolle dentro `ChatThread`.
 */
export function ChatBubble({ from, author, className, children, ...rest }: ChatBubbleProps) {
  return (
    <div className={cx('eg-bubble', `eg-bubble--${from}`, className)} {...rest}>
      {author != null && <span className="eg-bubble__author">{author}</span>}
      {children}
    </div>
  );
}

export interface ChatThreadProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/** Colonna di messaggi della chat (spaziatura 14px tra le bolle). */
export function ChatThread({ className, children, ...rest }: ChatThreadProps) {
  return <div className={cx('eg-chat', className)} {...rest}>{children}</div>;
}
