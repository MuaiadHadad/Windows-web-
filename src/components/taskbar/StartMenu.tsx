import React from 'react';
import { useWindowsStore } from '../../store/windowsStore';
import { useUIStore } from '../../store/uiStore';
import { motion, AnimatePresence } from 'framer-motion';

const StartMenu: React.FC = () => {
  const openWindow = useWindowsStore((s) => s.openWindow);
  const startMenuOpen = useUIStore((s) => s.startMenuOpen);
  const closeStartMenu = useUIStore((s) => s.closeStartMenu);

  return (
    <AnimatePresence>
      {startMenuOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="fixed bottom-10 left-2 w-64 bg-slate-800 rounded shadow-xl p-4"
          onMouseLeave={closeStartMenu}
        >
          <div className="font-bold mb-2">Start</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <StartItem label="Notes" onClick={() => { openWindow('notes', 'Notes'); closeStartMenu(); }} />
            <StartItem label="Files" onClick={() => { openWindow('files', 'Files'); closeStartMenu(); }} />
            <StartItem label="Settings" onClick={() => { openWindow('settings', 'Settings'); closeStartMenu(); }} />
          </div>
          <button
            onClick={closeStartMenu}
            className="mt-4 text-xs bg-slate-700 px-2 py-1 rounded hover:bg-slate-600"
          >
            Close
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const StartItem: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1 p-2 bg-slate-700 rounded hover:bg-slate-600"
  >
    <div className="w-10 h-10 bg-slate-600 rounded" />
    {label}
  </button>
);

const ToggleButton: React.FC = () => {
  const toggleStartMenu = useUIStore((s) => s.toggleStartMenu);
  return (
    <button
      onClick={toggleStartMenu}
      className="px-3 py-1 text-sm rounded bg-blue-600 hover:bg-blue-500 active:scale-[.97] transition"
    >
      Start
    </button>
  );
};

export default Object.assign(StartMenu, { ToggleButton });

