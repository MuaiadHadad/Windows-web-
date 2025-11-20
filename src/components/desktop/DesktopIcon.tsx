import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useWindowsStore } from '../../store/windowsStore';
import { useUIStore } from '../../store/uiStore';
import { getAppMeta } from '../../apps/registry';
import { useDesktopIconsStore, getDefaultPosition } from '../../store/desktopIconsStore';
import { Icon } from '../icons/Icons';
import interact from 'interactjs';

interface DesktopIconProps {
  appId: string;
  title: string;
  index: number;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ appId, title, index }) => {
  const openWindow = useWindowsStore((s) => s.openWindow);
  const meta = getAppMeta(appId);
  const selectedId = useUIStore((s) => s.selectedDesktopIconId);
  const selectIcon = useUIStore((s) => s.selectDesktopIcon);
  const isSelected = selectedId === appId;

  const iconRef = useRef<HTMLButtonElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const posRef = useRef({ x: 0, y: 0 });

  // Get position from store or use default
  const iconPositions = useDesktopIconsStore((s) => s.iconPositions);
  const setIconPosition = useDesktopIconsStore((s) => s.setIconPosition);

  const position = useMemo(() => {
    if (iconPositions[appId]) {
      return iconPositions[appId];
    }
    return getDefaultPosition(index);
  }, [iconPositions, appId, index]);

  // Setup draggable with interact.js
  useEffect(() => {
    const node = iconRef.current;
    if (!node) return;

    interact(node)
      .draggable({
        inertia: false,
        listeners: {
          start: () => {
            setIsDragging(true);
            selectIcon(appId);
            posRef.current = { x: position.x, y: position.y };
          },
          move: (event) => {
            const x = posRef.current.x + event.dx;
            const y = posRef.current.y + event.dy;

            // Prevent dragging off screen
            const maxX = window.innerWidth - 80;
            const maxY = window.innerHeight - 160; // Account for taskbar

            posRef.current = {
              x: Math.max(20, Math.min(x, maxX)),
              y: Math.max(20, Math.min(y, maxY)),
            };

            // Update position immediately for smooth dragging
            if (node) {
              node.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
            }
          },
          end: () => {
            setIsDragging(false);
            // Save to store with snap to grid
            setIconPosition(appId, posRef.current.x, posRef.current.y);
          },
        },
      });

    return () => {
      interact(node).unset();
    };
  }, [appId, position, selectIcon, setIconPosition]);

  return (
    <button
      ref={iconRef}
      onClick={(e) => {
        e.stopPropagation();
        if (!isDragging) selectIcon(appId);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        if (!isDragging) openWindow(appId, title);
      }}
      aria-label={title}
      aria-pressed={isSelected}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'pointer',
      }}
      className={`pointer-events-auto group relative flex w-[70px] flex-col items-center gap-1.5 rounded-lg px-2 py-2 text-center outline-none transition-all duration-200 ${
        isSelected
          ? 'bg-white/15 ring-1 ring-white/30'
          : 'hover:bg-white/10'
      } ${isDragging ? 'scale-110 shadow-2xl' : ''}`}
    >
      {/* Icon container - smaller and cleaner */}
      <div
        className={`relative flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${meta.accent} text-2xl shadow-lg transition-all duration-200 ${
          isDragging ? 'scale-110' : 'group-hover:scale-105'
        }`}
      >
        <span className="relative z-10 drop-shadow-md">
          <Icon name={meta.icon as any} />
        </span>
      </div>

      {/* Text - compact, no description */}
      <span className={`block text-[11px] font-medium leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] transition-colors line-clamp-2 ${
        isSelected ? 'text-white' : 'text-white/90 group-hover:text-white'
      }`}>
        {title}
      </span>
    </button>
  );
};

