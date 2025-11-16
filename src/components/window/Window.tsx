import React from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowsStore } from '../../store/windowsStore';
import type { WindowInstance } from '../../types/window';
import NotesApp from '../../apps/notes/NotesApp';
import FilesApp from '../../apps/files/FilesApp';
import SettingsApp from '../../apps/settings/SettingsApp';
import { getAppMeta } from '../../apps/registry';

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
  const meta = getAppMeta(win.appId);

  if (win.minimized) return null;

  const onDragStop = (_: any, data: any) => {
    moveWindow(win.id, data.x, data.y);
  };

  const body = (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[28px] border border-white/12 bg-gradient-to-br from-slate-900/80 via-slate-900/70 to-slate-950/85 shadow-[0_30px_80px_rgba(2,6,23,0.65)] backdrop-blur-[20px] ring-1 ring-white/5">
      <div
        className="window-handle relative flex h-12 items-center justify-between border-b border-white/10 bg-gradient-to-r from-white/15 via-white/5 to-transparent px-4 text-sm font-medium text-white"
        onMouseDown={() => focusWindow(win.id)}
      >
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${meta.aura}`} aria-hidden />
          <span className="select-none tracking-tight drop-shadow">{win.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <WindowControlButton label="Minimize" color="text-yellow-200" glyph="–" onClick={() => minimizeWindow(win.id)} />
          <WindowControlButton label="Maximize" color="text-emerald-200" glyph="▢" onClick={() => maximizeWindow(win.id)} />
          <WindowControlButton label="Close" color="text-rose-300" glyph="✕" onClick={() => closeWindow(win.id)} />
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-900/70 via-slate-950/60 to-slate-950/80" onMouseDown={() => focusWindow(win.id)}>
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

const WindowControlButton: React.FC<{ label: string; color: string; glyph: string; onClick: () => void }> = ({
  label,
  color,
  glyph,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    onMouseDown={(e) => e.stopPropagation()}
    aria-label={label}
    className={`flex h-7 w-7 items-center justify-center rounded-xl bg-white/10 text-[11px] font-semibold ${color} shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] transition hover:bg-white/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)]`}
  >
    {glyph}
  </button>
);

export default Window;

