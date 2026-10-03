import { XPBar } from 'edugamer-design-system';

export const Home = () => (
  <div style={{ maxWidth: 520 }}><XPBar level={4} xp={742} levelName="Corsaro" progress={47} /></div>
);

export const Oro = () => (
  <div style={{ maxWidth: 520 }}>
    <XPBar level={7} xp={2890} levelName="Leggenda" color="oro" progress={26} hint="Mancano 1.110 XP per Gran Maestro" />
  </div>
);

export const Compatta = () => (
  <div style={{ maxWidth: 300 }}><XPBar level={1} xp={35} levelName="Marinaio" compact /></div>
);
