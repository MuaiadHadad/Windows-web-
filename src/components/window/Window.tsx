/* eslint-disable indent */
import React, { useCallback } from 'react';
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
    className={`flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-xs font-semibold leading-none ${color} shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 active:scale-[0.95]`}
  >
    {glyph}
  </button>
);

const MIN_WIDTH = 300;
const MIN_HEIGHT = 200;

const Window: React.FC<{ win: WindowInstance }> = ({ win }) => {
  const closeWindow = useWindowsStore((s) => s.closeWindow);
  const minimizeWindow = useWindowsStore((s) => s.minimizeWindow);
  const maximizeWindow = useWindowsStore((s) => s.maximizeWindow);
  const moveWindow = useWindowsStore((s) => s.moveWindow);
  const resizeWindow = useWindowsStore((s) => s.resizeWindow);
  const focusWindow = useWindowsStore((s) => s.focusWindow);
  const meta = getAppMeta(win.appId);

  const onDragMouseDown = useCallback((e: React.MouseEvent) => {
    if (win.maximized) return; // skip dragging when maximized
    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = win.x;
    const initialY = win.y;
    focusWindow(win.id);

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      moveWindow(win.id, initialX + dx, initialY + dy);
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      document.body.style.userSelect = '';
    };
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [win.id, win.x, win.y, win.maximized, moveWindow, focusWindow]);

  const onResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (win.maximized) return; // skip resizing when maximized
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = win.width;
    const startH = win.height;
    focusWindow(win.id);

    const onMove = (ev: MouseEvent) => {
      let newW = startW + (ev.clientX - startX);
      let newH = startH + (ev.clientY - startY);
      if (newW < MIN_WIDTH) newW = MIN_WIDTH;
      if (newH < MIN_HEIGHT) newH = MIN_HEIGHT;
      resizeWindow(win.id, newW, newH);
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      document.body.style.userSelect = '';
    };
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [win.id, win.width, win.height, win.maximized, resizeWindow, focusWindow]);

  const onClose = () => {
    console.log('[Window] close clicked', win.id);
    closeWindow(win.id);
  };
  const onMinimize = () => {
    console.log('[Window] minimize toggle', win.id);
    minimizeWindow(win.id);
  };
  const onToggleMax = () => {
    console.log('[Window] maximize/restore', win.id);
    maximizeWindow(win.id);
  };

  const toggleMaximize = () => maximizeWindow(win.id);

  if (win.minimized) return null;

  const Shell: React.FC = () => (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[18px] border border-white/15 bg-gradient-to-br from-slate-900/80 via-slate-900/70 to-slate-950/85 shadow-[0_30px_80px_rgba(2,6,23,0.65)] backdrop-blur-[20px] ring-1 ring-white/5">
      <div
        className="window-handle relative flex h-11 items-center justify-between gap-2 border-b border-white/10 bg-gradient-to-r from-white/15 via-white/5 to-transparent px-3 text-sm font-medium text-white select-none"
        onMouseDown={onDragMouseDown}
        onDoubleClick={onToggleMax}
      >
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="flex min-w-0 items-center gap-2 overflow-hidden">
          <span className={`h-2 w-2 shrink-0 rounded-full ${meta.aura}`} aria-hidden />
          <span className="truncate tracking-tight drop-shadow" title={win.title}>{win.title}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <WindowControlButton label="Minimize" color="text-yellow-200" glyph="–" onClick={onMinimize} />
          <WindowControlButton label={win.maximized ? 'Restore' : 'Maximize'} color="text-emerald-200" glyph={win.maximized ? '❐' : '▢'} onClick={onToggleMax} />
          <WindowControlButton label="Close" color="text-rose-300" glyph="✕" onClick={onClose} />
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-900/70 via-slate-950/60 to-slate-950/80" onMouseDown={() => focusWindow(win.id)}>
        <AppContent appId={win.appId} />
      </div>
      {!win.maximized && (
        <div
          aria-label="Resize window"
          role="separator"
          onMouseDown={onResizeMouseDown}
          className="absolute bottom-2 right-2 h-4 w-4 cursor-se-resize rounded-md bg-white/20 hover:bg-white/30 active:bg-white/40"
        />
      )}
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
        className="absolute inset-0 pointer-events-auto"
        onMouseDown={() => focusWindow(win.id)}
        data-win-id={win.id}
      >
        <Shell />
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <div
        style={{ left: win.x, top: win.y, zIndex: win.zIndex, width: win.width, height: win.height }}
        className="absolute pointer-events-auto"
        onMouseDown={() => focusWindow(win.id)}
        data-win-id={win.id}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="w-full h-full"
        >
          <Shell />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Window;
