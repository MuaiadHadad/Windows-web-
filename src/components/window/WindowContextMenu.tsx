import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WindowContextMenuProps {
  x: number;
  y: number;
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onCloseWindow: () => void;
  onSnapLeft: () => void;
  onSnapRight: () => void;
  isMaximized: boolean;
}

/**
 * Context menu for window operations
 * Provides quick access to window management actions
 */
export const WindowContextMenu: React.FC<WindowContextMenuProps> = ({
  x,
  y,
  isOpen,
  onClose,
  onMinimize,
  onMaximize,
  onCloseWindow,
  onSnapLeft,
  onSnapRight,
  isMaximized,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

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
    { label: isMaximized ? 'Restore' : 'Maximize', icon: '🗖', action: onMaximize },
    { label: 'Minimize', icon: '🗕', action: onMinimize },
    { label: 'Snap Left', icon: '⬅️', action: onSnapLeft },
    { label: 'Snap Right', icon: '➡️', action: onSnapRight },
    { divider: true },
    { label: 'Close', icon: '✕', action: onCloseWindow, danger: true },
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
          className="min-w-[200px] rounded-2xl border border-white/15 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-950/95 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(139,92,246,0.2)] backdrop-blur-xl"
        >
          {menuItems.map((item, index) => {
            if (item.divider) {
              return <div key={index} className="my-2 h-px bg-white/10" />;
            }

            return (
              <button
                key={index}
                onClick={() => {
                  item.action?.();
                  onClose();
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm transition-all hover:bg-white/10 ${
                  item.danger
                    ? 'text-rose-300 hover:bg-rose-500/20 hover:text-rose-200'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                <span className="text-lg" aria-hidden>
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

