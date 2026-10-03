import type { HTMLAttributes } from 'react';
import { cx } from './cx';

const RARITY_LABEL = { comune: 'Comune', raro: 'Raro', epico: 'Epico', leggendario: 'Leggendario' } as const;

export interface AchievementBadgeProps extends HTMLAttributes<HTMLDivElement> {
  /** Emoji della medaglia (es. "🗺️"). */
  icon: string;
  /** Nome della medaglia (es. "Cartografo"). */
  name: string;
  /** Come si conquista (es. "10 mappe create"). */
  description?: string;
  /** Rarità, che colora il bordo: comune (grigio), raro (blu), epico (viola), leggendario (oro). */
  rarity?: 'comune' | 'raro' | 'epico' | 'leggendario';
  /** XP di ricompensa. */
  xpReward?: number;
  /** Non ancora conquistata: grigia e trasparente. */
  locked?: boolean;
}

/** Medaglia/trofeo del profilo: icona, nome, descrizione, rarità colorata e XP di ricompensa. */
export function AchievementBadge({ icon, name, description, rarity = 'comune', xpReward, locked = false, className, ...rest }: AchievementBadgeProps) {
  return (
    <div className={cx('eg-badge', `eg-badge--${rarity}`, locked && 'eg-badge--locked', className)} {...rest}>
      <div className="eg-badge__icon" aria-hidden="true">{locked ? '🔒' : icon}</div>
      <div className="eg-badge__body">
        <div className="eg-badge__name">{name}</div>
        {description && <div className="eg-badge__desc">{description}</div>}
      </div>
      <div className="eg-badge__meta">
        <span className="eg-badge__rarity">{RARITY_LABEL[rarity]}</span>
        {xpReward != null && <span className="eg-badge__xp">+{xpReward} XP</span>}
      </div>
    </div>
  );
}
