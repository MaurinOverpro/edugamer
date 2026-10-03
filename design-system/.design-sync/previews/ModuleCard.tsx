import { ModuleCard } from 'edugamer-design-system';

export const GrigliaHome = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14, maxWidth: 560 }}>
    <ModuleCard icon="🧠" title="LAVAGNA AI" accent="giungla" href="#" />
    <ModuleCard icon="📐" title="MATEMATICA" accent="oro" href="#" />
    <ModuleCard icon="📖" title="ITALIANO" accent="mare" href="#" />
    <ModuleCard icon="📚" title="RICERCHE" accent="indaco" href="#" />
  </div>
);

export const Singola = () => (
  <div style={{ maxWidth: 260 }}>
    <ModuleCard icon="🗺️" title="DISCOVER" accent="abisso" href="#" actionLabel="INIZIA" />
  </div>
);

export const Bloccata = () => (
  <div style={{ maxWidth: 260 }}>
    <ModuleCard icon="🏰" title="FORTEZZA" accent="corallo" locked />
  </div>
);
