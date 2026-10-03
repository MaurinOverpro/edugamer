import { AchievementBadge } from 'edugamer-design-system';

export const Rarita = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 440 }}>
    <AchievementBadge icon="👣" name="Primo Passo" description="Completa la prima attività" rarity="comune" xpReward={10} />
    <AchievementBadge icon="🧭" name="Esploratore" description="30 mappe create" rarity="raro" xpReward={50} />
    <AchievementBadge icon="🔢" name="Maestro dei Numeri" description="100 problemi risolti" rarity="epico" xpReward={100} />
    <AchievementBadge icon="🏆" name="Leggenda Vivente" description="100 giorni consecutivi" rarity="leggendario" xpReward={500} />
  </div>
);

export const Bloccata = () => (
  <div style={{ maxWidth: 440 }}>
    <AchievementBadge icon="👑" name="Gran Maestro" description="Raggiungi livello 8" rarity="epico" xpReward={200} locked />
  </div>
);
