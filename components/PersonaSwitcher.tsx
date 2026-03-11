
import React from 'react';
import { UserTier } from '../types';

interface PersonaSwitcherProps {
  currentTier: UserTier;
  setTier: (tier: UserTier) => void;
}

const TIERS: { id: UserTier; label: string }[] = [
    { id: 'DEVELOPER_FREE', label: 'Developer (Free)' },
    { id: 'DEVELOPER_ADVISORY', label: 'Developer (Advisory)' },
    { id: 'INVESTOR_PRO', label: 'Investor (Pro)' },
];

export const PersonaSwitcher: React.FC<PersonaSwitcherProps> = ({ currentTier, setTier }) => {
  return (
    <div className="flex items-center bg-brand-secondary rounded-lg p-1">
        <span className="text-xs font-bold text-brand-text-secondary mr-3 ml-2">VIEW AS:</span>
      {TIERS.map(tier => (
        <button
          key={tier.id}
          onClick={() => setTier(tier.id)}
          className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
            currentTier === tier.id
              ? 'bg-brand-accent text-white'
              : 'text-brand-text-secondary hover:bg-brand-primary'
          }`}
        >
          {tier.label}
        </button>
      ))}
    </div>
  );
};
