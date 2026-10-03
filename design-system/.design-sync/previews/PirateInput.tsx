import { PirateInput } from 'edugamer-design-system';

export const ConEtichetta = () => (
  <PirateInput label="⚓ Il tuo nome da Pirata" placeholder="es. Tempesta dei Mari, Occhio di Fuoco..." style={{ maxWidth: 420 }} />
);

export const ConSuggerimento = () => (
  <PirateInput label="🔢 La tua risposta" defaultValue="125" hint="Scrivi solo il numero" inputMode="numeric" style={{ maxWidth: 420 }} />
);

export const ConErrore = () => (
  <PirateInput label="⚓ Il tuo nome da Pirata" defaultValue="" placeholder="Scegli un nome" error="Scegli il tuo nome da pirata!" style={{ maxWidth: 420 }} />
);
