/** Unisce nomi di classe ignorando i valori vuoti. */
export const cx = (...parts: Array<string | false | null | undefined>): string => parts.filter(Boolean).join(' ');
