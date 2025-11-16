import React from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowsStore } from '../../store/windowsStore';
import type { WindowInstance } from '../../types/window';
import NotesApp from '../../apps/notes/NotesApp';
import FilesApp from '../../apps/files/FilesApp';
import SettingsApp from '../../apps/settings/SettingsApp';

const AppContent: React.FC<{ appId: string }> = ({ appId }) => {
  switch (appId) {
  case 'notes':
    return <NotesApp />;
  case 'files':
    return <FilesApp />;
  case 'settings':
    return <SettingsApp />;
  default:
    return <div className="p-2">Unknown app</div>;
  }
};

const Window: React.FC<{ win: WindowInstance }> = ({ win }) => {
  const closeWindow = useWindowsStore((s) => s.closeWindow);
  const minimizeWindow = useWindowsStore((s) => s.minimizeWindow);
  const maximizeWindow = useWindowsStore((s) => s.maximizeWindow);
  const moveWindow = useWindowsStore((s) => s.moveWindow);
  const resizeWindow = useWindowsStore((s) => s.resizeWindow);
  const focusWindow = useWindowsStore((s) => s.focusWindow);

  if (win.minimized) return null;

  const onDragStop = (_: any, data: any) => {
    moveWindow(win.id, data.x, data.y);
  };

  const body = (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/70 shadow-[0_25px_80px_rgba(2,6,23,0.6)] backdrop-blur-2xl">
      <div
        className="window-handle flex h-12 items-center justify-between border-b border-white/5 bg-white/5 px-4 text-sm font-medium"
        onMouseDown={() => focusWindow(win.id)}
      >
        <span className="select-none tracking-tight">{win.title}</span>
        <div className="flex items-center gap-2">
          <WindowControlButton label="Minimize" color="bg-yellow-300" onClick={() => minimizeWindow(win.id)} />
          <WindowControlButton label="Maximize" color="bg-green-300" onClick={() => maximizeWindow(win.id)} />
          <WindowControlButton label="Close" color="bg-rose-400" onClick={() => closeWindow(win.id)} />
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-slate-950/50" onMouseDown={() => focusWindow(win.id)}>
        <AppContent appId={win.appId} />
      </div>
    </div>
  );

  if (win.maximized) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.15 }}
        style={{ zIndex: win.zIndex }}
        className="absolute inset-0"
        onMouseDown={() => focusWindow(win.id)}
      >
        {body}
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <Draggable
        handle=".window-handle"
        defaultPosition={{ x: win.x, y: win.y }}
        position={{ x: win.x, y: win.y }}
        onStop={onDragStop}
        onMouseDown={() => focusWindow(win.id)}
      >
        <Resizable
          size={{ width: win.width, height: win.height }}
          onResizeStop={(_e, _dir, ref) => {
            resizeWindow(win.id, ref.offsetWidth, ref.offsetHeight);
          }}
          style={{ zIndex: win.zIndex }}
          minWidth={300}
          minHeight={200}
          className="absolute"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="w-full h-full"
          >
            {body}
          </motion.div>
        </Resizable>
      </Draggable>
    </AnimatePresence>
  );
};

const WindowControlButton: React.FC<{ label: string; color: string; onClick: () => void }> = ({ label, color, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    onMouseDown={(e) => e.stopPropagation()}
    aria-label={label}
    className={`h-3.5 w-3.5 rounded-full ${color} shadow-inner transition hover:scale-110`}
  />
);

export default Window;

