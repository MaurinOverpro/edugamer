import { Celebration } from 'edugamer-design-system';

export const NuovaZona = () => (
  <Celebration overlay={false} icon="🔢" title="Caverna dei Numeri" message="🐙 Numerus il Kraken ti aspetta!" glowColor="#fbbf24" />
);

export const NuovoLivello = () => (
  <Celebration overlay={false} icon="⚓" kicker="LIVELLO 5 RAGGIUNTO!" title="Sei diventato Avventuriero" message="+100 XP · Nuova medaglia sbloccata" actionLabel="🏴‍☠️ Avanti!" glowColor="#38bdf8" />
);
