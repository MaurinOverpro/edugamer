import { PirateTitle, Parchment } from 'edugamer-design-system';

export const Oro = () => <PirateTitle size="xl" glow>ISOLA MISTERIOSA</PirateTitle>;

export const Dimensioni = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <PirateTitle size="xl">Il Tesoro</PirateTitle>
    <PirateTitle as="h2" size="lg">Mappa del Pirata</PirateTitle>
    <PirateTitle as="h3" size="md" tone="bianco">Diario di bordo</PirateTitle>
  </div>
);

export const SuPergamena = () => (
  <Parchment icon="" corners={false} style={{ maxWidth: 360, textAlign: 'center' }}>
    <PirateTitle as="h2" size="lg" tone="inchiostro">Le Regole della Ciurma</PirateTitle>
  </Parchment>
);
