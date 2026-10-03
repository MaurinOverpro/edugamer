import { PirateAvatar } from 'edugamer-design-system';

export const Dimensioni = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
    <PirateAvatar src="🏴‍☠️" size={44} />
    <PirateAvatar src="🦜" size={64} />
    <PirateAvatar src="🐙" size={112} />
  </div>
);

export const SceltaAvatar = () => (
  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', maxWidth: 360 }}>
    {['🏴‍☠️', '🦜', '⚓', '💀', '🗡️', '🔮', '🐙', '🌊', '🗺️', '💎', '🦊', '🐉'].map((e, i) => (
      <PirateAvatar key={e} src={e} size={48} ring={i === 1 ? 'oro' : 'semplice'} onClick={() => {}} label={`Scegli ${e}`} />
    ))}
  </div>
);
