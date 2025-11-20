import React from 'react';

// Minimal Windows‑like icon set (custom SVGs, not copied from external repo)
// Add more icons as needed; keep paths simple for performance.
export type IconName = 'notes' | 'files' | 'settings' | 'start' | 'close' | 'maximize' | 'restore' | 'minimize';

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
  title?: string;
}

const base = (size?: number) => ({ width: size || 24, height: size || 24, viewBox: '0 0 24 24', fill: 'none' as const });

export const Icon: React.FC<IconProps> = ({ name, className, size, title }) => {
  const common = base(size);
  switch (name) {
    case 'notes':
      return (
        <svg {...common} className={className} aria-label={title || 'Notes'}>
          <rect x="3" y="4" width="14" height="16" rx="2" stroke="currentColor" />
          <path d="M7 8h6M7 12h6M7 16h4" stroke="currentColor" strokeLinecap="round" />
          <path d="M17 4v7l4 4V8l-4-4z" stroke="currentColor" />
        </svg>
      );
    case 'files':
      return (
        <svg {...common} className={className} aria-label={title || 'Files'}>
          <path d="M4 4h7l5 5v11H4V4z" stroke="currentColor" />
          <path d="M11 4v5h5" stroke="currentColor" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...common} className={className} aria-label={title || 'Settings'}>
          <circle cx="12" cy="12" r="3.5" stroke="currentColor" />
          <path d="M4.5 12a7.5 7.5 0 0 1 .27-2L3 8l2.2-3.8 2.3.9a7.5 7.5 0 0 1 2-.28L12 3l2.5 1.82a7.5 7.5 0 0 1 2 .27l2.3-.9L21 8l-1.77 2a7.5 7.5 0 0 1 .28 2l1.82 2.5-3.2 2.2-.9-2.3a7.5 7.5 0 0 1-2-.27L12 21l-2-1.82a7.5 7.5 0 0 1-2.05-.28l-.9 2.3L3 16l1.82-2.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'start':
      return (
        <svg {...common} className={className} aria-label={title || 'Start'}>
          <rect x="3" y="3" width="8" height="8" stroke="currentColor" />
          <rect x="13" y="3" width="8" height="8" stroke="currentColor" />
          <rect x="3" y="13" width="8" height="8" stroke="currentColor" />
          <rect x="13" y="13" width="8" height="8" stroke="currentColor" />
        </svg>
      );
    case 'minimize':
      return (
        <svg {...common} className={className} aria-label={title || 'Minimize'}>
          <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeLinecap="round" />
        </svg>
      );
    case 'maximize':
      return (
        <svg {...common} className={className} aria-label={title || 'Maximize'}>
          <rect x="5" y="5" width="14" height="14" stroke="currentColor" />
        </svg>
      );
    case 'restore':
      return (
        <svg {...common} className={className} aria-label={title || 'Restore'}>
          <rect x="7" y="7" width="10" height="10" stroke="currentColor" />
          <path d="M9 7V5h10v10h-2" stroke="currentColor" />
        </svg>
      );
    case 'close':
      return (
        <svg {...common} className={className} aria-label={title || 'Close'}>
          <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeLinecap="round" />
          <line x1="6" y1="18" x2="18" y2="6" stroke="currentColor" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
};
