/* eslint-disable indent */
import React, { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowsStore } from '../../store/windowsStore';
import type { WindowInstance } from '../../types/window';
import dynamic from 'next/dynamic';
import { getAppMeta } from '../../apps/registry';
import interact from 'interactjs';

// Lazy-load app content to reduce initial bundle (RNF1.1)
const NotesApp = dynamic(() => import('../../apps/notes/NotesApp'), { ssr: false, loading: () => <div className="p-4 text-white/70">Loading…</div> });
const FilesApp = dynamic(() => import('../../apps/files/FilesApp'), { ssr: false, loading: () => <div className="p-4 text-white/70">Loading…</div> });
const SettingsApp = dynamic(() => import('../../apps/settings/SettingsApp'), { ssr: false, loading: () => <div className="p-4 text-white/70">Loading…</div> });

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

type ResizeDir = 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const Window: React.FC<{ win: WindowInstance }> = ({ win }) => {
  const closeWindow = useWindowsStore((s) => s.closeWindow);
  const minimizeWindow = useWindowsStore((s) => s.minimizeWindow);
  const maximizeWindow = useWindowsStore((s) => s.maximizeWindow);
  const moveWindow = useWindowsStore((s) => s.moveWindow);
  const resizeWindow = useWindowsStore((s) => s.resizeWindow);
  const focusWindow = useWindowsStore((s) => s.focusWindow);
  const meta = getAppMeta(win.appId);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Setup interact.js for drag & resize (RT4)
  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;

    if (win.maximized) {
      interact(node).unset();
      return;
    }

    interact(node)
      .draggable({
        listeners: {
          start: () => focusWindow(win.id),
          move: (event) => {
            const x = (win.x ?? 0) + event.dx;
            const y = (win.y ?? 0) + event.dy;
            moveWindow(win.id, x, y);
          },
        },
        inertia: false,
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          start: () => focusWindow(win.id),
          move: (event) => {
            const { width, height } = event.rect;
            // Clamp min size
            const newW = Math.max(MIN_WIDTH, Math.round(width));
            const newH = Math.max(MIN_HEIGHT, Math.round(height));
            // Adjust position when resizing from north/west
            const deltaLeft = event.deltaRect?.left ?? 0;
            const deltaTop = event.deltaRect?.top ?? 0;
            if (deltaLeft || deltaTop) {
              moveWindow(win.id, win.x + deltaLeft, win.y + deltaTop);
            }
            resizeWindow(win.id, newW, newH);
          },
        },
        inertia: false,
      });

    return () => {
      interact(node).unset();
    };
  }, [wrapperRef, win.id, win.x, win.y, win.width, win.height, win.maximized, moveWindow, resizeWindow, focusWindow]);

  const onClose = () => closeWindow(win.id);
  const onMinimize = () => minimizeWindow(win.id);
  const onToggleMax = () => maximizeWindow(win.id);

  if (win.minimized) return null;

  const Shell: React.FC = () => (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[18px] border border-white/15 bg-gradient-to-br from-slate-900/80 via-slate-900/70 to-slate-950/85 shadow-[0_30px_80px_rgba(2,6,23,0.65)] backdrop-blur-[20px] ring-1 ring-white/5">
      <div
        className="window-handle relative flex h-11 items-center justify-between gap-2 border-b border-white/10 bg-gradient-to-r from-white/15 via-white/5 to-transparent px-3 text-sm font-medium text-white select-none"
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
      <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-900/70 via-slate-950/60 to-slate-950/80" onMouseDown={() => focusWindow(win.id)} onTouchStart={() => focusWindow(win.id)}>
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
        className="absolute inset-0 pointer-events-auto"
        onMouseDown={() => focusWindow(win.id)}
        onTouchStart={() => focusWindow(win.id)}
        data-win-id={win.id}
      >
        <Shell />
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <div
        ref={wrapperRef}
        style={{ left: win.x, top: win.y, zIndex: win.zIndex, width: win.width, height: win.height }}
        className="absolute pointer-events-auto"
        onMouseDown={() => focusWindow(win.id)}
        onTouchStart={() => focusWindow(win.id)}
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
