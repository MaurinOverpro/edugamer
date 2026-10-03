import { Pill } from 'edugamer-design-system';

export const Toni = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
    <Pill>APRI MODULO</Pill>
    <Pill tone="oro">💰 1.200 Berry</Pill>
    <Pill tone="giungla">✓ Corretto</Pill>
    <Pill tone="mare">🌊 Nuovo</Pill>
    <Pill tone="abisso">🔮 Tutor AI</Pill>
    <Pill tone="pericolo">⚠️ 2 errori</Pill>
  </div>
);

export const Contatore = () => <Pill tone="oro">🔥 7 giorni di fila</Pill>;
