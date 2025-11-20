import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesktopIconsStore } from '../../store/desktopIconsStore';
import { usePreferencesStore } from '../../store/preferencesStore';

interface DesktopContextMenuProps {
  x: number;
  y: number;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Context menu for desktop operations
 */
export const DesktopContextMenu: React.FC<DesktopContextMenuProps> = ({
  x,
  y,
  isOpen,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const resetPositions = useDesktopIconsStore((s) => s.resetPositions);
  const darkTheme = usePreferencesStore((s) => s.darkTheme);
  const setDarkTheme = usePreferencesStore((s) => s.setDarkTheme);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const menuItems = [
    {
      label: 'Reorganizar ícones',
      icon: '🔄',
      action: () => {
        resetPositions();
        onClose();
      }
    },
    { divider: true },
    {
      label: darkTheme ? 'Tema claro' : 'Tema escuro',
      icon: darkTheme ? '☀️' : '🌙',
      action: () => {
        setDarkTheme(!darkTheme);
        onClose();
      }
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          style={{
            position: 'fixed',
            left: x,
            top: y,
            zIndex: 10000,
          }}
          className="min-w-[200px] rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-950/95 p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(139,92,246,0.15)] backdrop-blur-xl"
        >
          {menuItems.map((item, index) => {
            if (item.divider) {
              return <div key={index} className="my-1 h-px bg-white/5" />;
            }

            return (
              <button
                key={index}
                onClick={item.action}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-white/90 transition-all hover:bg-white/10 hover:text-white"
              >
                <span className="text-base" aria-hidden>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

