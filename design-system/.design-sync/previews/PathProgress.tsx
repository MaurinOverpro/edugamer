import { PathProgress } from 'edugamer-design-system';

export const InCorso = () => (
  <div style={{ maxWidth: 460 }}>
    <PathProgress emoji="🗺️" tierName="Cartografo" description="Mappe mentali create" value={14} progress={20} nextTierName="Esploratore" nextTierMin={30} color="#4ade80" />
  </div>
);

export const Numeri = () => (
  <div style={{ maxWidth: 460 }}>
    <PathProgress emoji="🔢" tierName="Calcolatore" description="Problemi risolti" value={63} progress={54} nextTierName="Maestro dei Numeri" nextTierMin={100} color="#fbbf24" />
  </div>
);

export const Massimo = () => (
  <div style={{ maxWidth: 460 }}>
    <PathProgress emoji="📜" tierName="Maestro di Grammatica" description="Testi senza errori" value={52} progress={100} isMax color="#c084fc" />
  </div>
);
