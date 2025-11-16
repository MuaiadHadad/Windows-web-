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
    <div className="flex flex-col w-full h-full bg-slate-800 rounded shadow-lg border border-slate-600 overflow-hidden">
      <div className="flex items-center justify-between bg-slate-700 px-2 h-8 cursor-move select-none" onMouseDown={() => focusWindow(win.id)}>
        <span className="text-sm font-medium">{win.title}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => minimizeWindow(win.id)}
            className="w-4 h-4 bg-yellow-500 rounded text-[10px] flex items-center justify-center"
            title="Minimize"
          />
          <button
            onClick={() => maximizeWindow(win.id)}
            className="w-4 h-4 bg-green-500 rounded text-[10px] flex items-center justify-center"
            title="Maximize"
          />
          <button
            onClick={() => closeWindow(win.id)}
            className="w-4 h-4 bg-red-600 rounded text-[10px] flex items-center justify-center"
            title="Close"
          />
        </div>
      </div>
      <div className="flex-1 bg-slate-900 overflow-auto" onMouseDown={() => focusWindow(win.id)}>
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
        handle=".cursor-move"
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

export default Window;

