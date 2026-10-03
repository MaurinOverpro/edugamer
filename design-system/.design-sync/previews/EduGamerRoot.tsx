import { EduGamerRoot, PirateTitle, Panel, XPBar } from 'edugamer-design-system';

export const SchermataModulo = () => (
  <EduGamerRoot padded style={{ minHeight: 260 }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 12, height: 12, borderRadius: 9999, background: '#22c55e' }} />EDUGAMER OS
      </div>
      <Panel watermark="🏴‍☠️">
        <XPBar level={4} xp={742} levelName="Corsaro" />
      </Panel>
    </div>
  </EduGamerRoot>
);

export const SfondoIsola = () => (
  <EduGamerRoot background="isola" padded style={{ minHeight: 220, textAlign: 'center' }}>
    <div style={{ fontSize: 56, filter: 'drop-shadow(0 0 20px rgba(251,191,36,0.6))' }}>🏴‍☠️</div>
    <PirateTitle glow>ISOLA MISTERIOSA</PirateTitle>
    <p style={{ color: '#94a3b8', fontSize: 14, margin: '6px 0 0' }}>Crea il tuo profilo per salpare</p>
  </EduGamerRoot>
);
