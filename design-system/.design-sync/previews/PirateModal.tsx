import { PirateModal, PirateButton, CharacterQuote } from 'edugamer-design-system';

export const ZonaDellIsola = () => (
  <PirateModal overlay={false} title="Caverna dei Numeri" subtitle="🐙 Numerus il Kraken" icon="🔢" color="#fbbf24" onClose={() => {}}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <CharacterQuote name="Numerus il Kraken" emoji="🐙" color="#fbbf24">
        Argh! Hai osato entrare nella mia Caverna dei Numeri? Ottima mossa! I numeri sono il vero tesoro dell'isola.
      </CharacterQuote>
      <PirateButton variant="oro" icon="🔢" fullWidth>ENTRA NELLA ZONA!</PirateButton>
    </div>
  </PirateModal>
);

export const ZonaBloccata = () => (
  <PirateModal overlay={false} title="Fortezza del Gran Corsaro" subtitle="👑 Il Gran Corsaro" icon="🏰" color="#f87171" onClose={() => {}}>
    <div style={{ textAlign: 'center', padding: '16px 0', borderRadius: 16, background: 'rgba(30,41,59,0.8)', border: '1px solid #334155' }}>
      <p style={{ fontSize: 24, margin: '0 0 8px' }}>🏆</p>
      <p style={{ color: '#cbd5e1', fontWeight: 700, fontSize: 14, margin: 0 }}>Raggiungi il Livello 10</p>
      <p style={{ color: '#64748b', fontSize: 12, margin: '4px 0 0' }}>per sbloccare la Fortezza del Gran Corsaro</p>
    </div>
  </PirateModal>
);
