import { PirateButton } from 'edugamer-design-system';

export const Principale = () => (
  <PirateButton variant="oro" size="lg" icon="⚓" fullWidth>SALPA VERSO L'ISOLA!</PirateButton>
);

export const Varianti = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
    <PirateButton variant="oro" icon="💰">Riscatta</PirateButton>
    <PirateButton variant="tutor" icon="🎓">Chiedi al tutor</PirateButton>
    <PirateButton variant="mare" icon="📷">Carica una foto</PirateButton>
    <PirateButton variant="giungla">SALVA</PirateButton>
    <PirateButton variant="secondario">ANNULLA</PirateButton>
    <PirateButton variant="pericolo" icon="🗑️">Cancella</PirateButton>
  </div>
);

export const Stati = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
    <PirateButton variant="tutor" loading>Creando avatar AI...</PirateButton>
    <PirateButton variant="oro" disabled>Controlla risposta</PirateButton>
  </div>
);
