/* eslint-disable indent */
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowsStore } from '../../store/windowsStore';
import type { WindowInstance } from '../../types/window';
import dynamic from 'next/dynamic';
import { getAppMeta } from '../../apps/registry';
import interact from 'interactjs';
import { Icon, IconName } from '../icons/Icons';

// Lazy-load app content to reduce initial bundle (RNF1.1)
const NotesApp = dynamic(() => import('../../apps/notes/NotesApp'), { ssr: false });
const FilesApp = dynamic(() => import('../../apps/files/FilesApp'), { ssr: false });
const SettingsApp = dynamic(() => import('../../apps/settings/SettingsApp'), { ssr: false });

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

const WindowControlButton: React.FC<{ label: string; color: string; glyph: IconName; onClick: () => void }> = React.memo(({
  label,
  color,
  glyph,
  onClick,
}) => (
  <motion.button
    type="button"
    onClick={onClick}
    onMouseDown={(e) => e.stopPropagation()}
    aria-label={label}
    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.25)' }}
    whileTap={{ scale: 0.95 }}
    transition={{ duration: 0.15 }}
    className={`flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-xs font-semibold leading-none ${color} shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40`}
  >
    <Icon name={glyph} />
  </motion.button>
));

const MIN_WIDTH = 300;
const MIN_HEIGHT = 200;
// Taskbar safe area: bottom-4 (16px) + h-16 (64px)
const SAFE_BOTTOM = 16 + 64; // 80px

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

const Window: React.FC<{ win: WindowInstance }> = ({ win }) => {
  const closeWindow = useWindowsStore((s) => s.closeWindow);
  const minimizeWindow = useWindowsStore((s) => s.minimizeWindow);
  const maximizeWindow = useWindowsStore((s) => s.maximizeWindow);
  const moveWindow = useWindowsStore((s) => s.moveWindow);
  const resizeWindow = useWindowsStore((s) => s.resizeWindow);
  const focusWindow = useWindowsStore((s) => s.focusWindow);
  const meta = useMemo(() => getAppMeta(win.appId), [win.appId]);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  // Track live position during drag to avoid relying on possibly stale props
  const posRef = useRef<{ x: number; y: number }>({ x: win.x, y: win.y });
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    posRef.current = { x: win.x, y: win.y };
  }, [win.x, win.y]);

  // Memoize callbacks
  const onClose = useCallback(() => closeWindow(win.id), [closeWindow, win.id]);
  const onMinimize = useCallback(() => minimizeWindow(win.id), [minimizeWindow, win.id]);
  const onToggleMax = useCallback(() => maximizeWindow(win.id), [maximizeWindow, win.id]);
  const onFocus = useCallback(() => focusWindow(win.id), [focusWindow, win.id]);

  // Setup interact.js for drag & resize with explicit handle and bounds
  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;

    if (win.maximized) {
      interact(node).unset();
      return;
    }

    interact(node)
      .draggable({
        inertia: false,
        allowFrom: '.window-handle',
        listeners: {
          start: () => {
            setIsDragging(true);
            focusWindow(win.id);
            posRef.current = { x: win.x, y: win.y };
          },
          move: (event) => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const next = { x: posRef.current.x + event.dx, y: posRef.current.y + event.dy };
            const maxX = Math.max(0, vw - win.width);
            const maxY = Math.max(0, vh - SAFE_BOTTOM - win.height);
            const clamped = { x: clamp(next.x, 0, maxX), y: clamp(next.y, 0, maxY) };
            posRef.current = clamped;
            moveWindow(win.id, clamped.x, clamped.y);
          },
          end: () => {
            setIsDragging(false);
          },
        },
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        inertia: false,
        listeners: {
          start: () => {
            setIsResizing(true);
            focusWindow(win.id);
          },
          move: (event) => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            let newW = Math.max(MIN_WIDTH, Math.round(event.rect.width));
            let newH = Math.max(MIN_HEIGHT, Math.round(event.rect.height));
            const deltaLeft = event.deltaRect?.left ?? 0;
            const deltaTop = event.deltaRect?.top ?? 0;

            // Candidate new position
            let nx = (posRef.current?.x ?? win.x) + deltaLeft;
            let ny = (posRef.current?.y ?? win.y) + deltaTop;

            // Clamp position first
            nx = clamp(nx, 0, Math.max(0, vw - newW));
            ny = clamp(ny, 0, Math.max(0, vh - SAFE_BOTTOM - newH));

            // Clamp size so that it stays inside bounds given position
            const maxW = Math.max(MIN_WIDTH, vw - nx);
            const maxH = Math.max(MIN_HEIGHT, vh - SAFE_BOTTOM - ny);
            newW = clamp(newW, MIN_WIDTH, maxW);
            newH = clamp(newH, MIN_HEIGHT, maxH);

            if (deltaLeft || deltaTop) {
              posRef.current = { x: nx, y: ny };
              moveWindow(win.id, nx, ny);
            }
            resizeWindow(win.id, newW, newH);
          },
          end: () => {
            setIsResizing(false);
          },
        },
      });

    return () => {
      interact(node).unset();
    };
  }, [wrapperRef, win.id, win.maximized, moveWindow, resizeWindow, focusWindow, win.width, win.height]);

  if (win.minimized) return null;

  // Enhanced visual feedback during drag/resize
  const windowClassName = useMemo(() => {
    const baseClasses = 'flex h-full w-full flex-col overflow-hidden rounded-[18px] border border-white/15 bg-gradient-to-br from-slate-900/80 via-slate-900/70 to-slate-950/85 shadow-[0_30px_80px_rgba(2,6,23,0.65)] backdrop-blur-[20px] ring-1 ring-white/5 transition-shadow duration-200';
    if (isDragging || isResizing) {
      return `${baseClasses} shadow-[0_40px_100px_rgba(139,92,246,0.4)] ring-2 ring-violet-400/40`;
    }
    return baseClasses;
  }, [isDragging, isResizing]);

  const Shell: React.FC = () => (
    <div className={windowClassName}>
      <div
        className="window-handle relative flex h-11 items-center justify-between gap-2 border-b border-white/10 bg-gradient-to-r from-white/15 via-white/5 to-transparent px-3 text-sm font-medium text-white select-none"
        onDoubleClick={onToggleMax}
        style={{ cursor: win.maximized ? 'default' : isDragging ? 'grabbing' : 'grab' }}
      >
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="flex min-w-0 items-center gap-2 overflow-hidden">
          <motion.span
            className={`h-2 w-2 shrink-0 rounded-full ${meta.aura}`}
            animate={{ scale: isDragging || isResizing ? [1, 1.2, 1] : 1 }}
            transition={{ repeat: isDragging || isResizing ? Infinity : 0, duration: 1 }}
            aria-hidden
          />
          <span className="truncate tracking-tight drop-shadow" title={win.title}>{win.title}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <WindowControlButton label="Minimize" color="text-yellow-200" glyph="minimize" onClick={onMinimize} />
          <WindowControlButton label={win.maximized ? 'Restore' : 'Maximize'} color="text-emerald-200" glyph={win.maximized ? 'restore' : 'maximize'} onClick={onToggleMax} />
          <WindowControlButton label="Close" color="text-rose-300" glyph="close" onClick={onClose} />
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-900/70 via-slate-950/60 to-slate-950/80" onMouseDown={onFocus} onTouchStart={onFocus}>
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
        style={{ zIndex: win.zIndex, left: 0, right: 0, top: 0, bottom: SAFE_BOTTOM, position: 'absolute' }}
        className="pointer-events-auto"
        onMouseDown={onFocus}
        onTouchStart={onFocus}
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
        onMouseDown={onFocus}
        onTouchStart={onFocus}
        data-win-id={win.id}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="w-full h-full"
        >
          <Shell />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

Window.displayName = 'Window';

export default React.memo(Window, (prev, next) => {
  // Custom comparison for better performance
  return (
    prev.win.id === next.win.id &&
    prev.win.x === next.win.x &&
    prev.win.y === next.win.y &&
    prev.win.width === next.win.width &&
    prev.win.height === next.win.height &&
    prev.win.minimized === next.win.minimized &&
    prev.win.maximized === next.win.maximized &&
    prev.win.zIndex === next.win.zIndex &&
    prev.win.title === next.win.title
  );
});
