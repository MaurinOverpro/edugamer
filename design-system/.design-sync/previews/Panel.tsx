import { Panel, XPBar, PirateInput } from 'edugamer-design-system';

export const ConFiligrana = () => (
  <Panel watermark="🏴‍☠️" style={{ maxWidth: 520 }}>
    <XPBar level={3} xp={455} levelName="Navigatore" />
  </Panel>
);

export const ConEtichetta = () => (
  <Panel tone="soft" label="⚓ Il tuo nome da Pirata" style={{ maxWidth: 420 }}>
    <PirateInput placeholder="es. Tempesta dei Mari, Occhio di Fuoco..." />
  </Panel>
);

export const Spaziature = () => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-start' }}>
    <Panel padding="sm"><span style={{ fontSize: 14 }}>Piccolo</span></Panel>
    <Panel padding="md"><span style={{ fontSize: 14 }}>Medio</span></Panel>
    <Panel padding="lg"><span style={{ fontSize: 14 }}>Grande</span></Panel>
  </div>
);
