import { WantedPoster } from 'edugamer-design-system';

export const Grande = () => (
  <WantedPoster variant="full" portrait="🦜" name="Tempesta dei Mari" bounty={742000000} level={4} />
);

export const Miniature = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
    <WantedPoster variant="mini" portrait="🦜" size={60} />
    <WantedPoster variant="mini" portrait="💀" size={80} />
    <WantedPoster variant="empty" size={60} />
  </div>
);
