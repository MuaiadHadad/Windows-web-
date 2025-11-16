import React from 'react';
import Taskbar from '../taskbar/Taskbar';
import Window from '../window/Window';
import { useWindowsStore } from '../../store/windowsStore';
import StartMenu from '../taskbar/StartMenu';

const Desktop: React.FC = () => {
  const windows = useWindowsStore((s) => s.windows);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-800 to-slate-900 text-white overflow-hidden select-none">
      <div className="p-4 flex flex-col gap-4">
        <DesktopIcon appId="notes" title="Notes" />
        <DesktopIcon appId="files" title="Files" />
        <DesktopIcon appId="settings" title="Settings" />
      </div>
      {windows.map((w) => (
        <Window key={w.id} win={w} />
      ))}
      <Taskbar />
      <StartMenu />
    </div>
  );
};

const DesktopIcon: React.FC<{ appId: string; title: string }> = ({ appId, title }) => {
  const openWindow = useWindowsStore((s) => s.openWindow);
  return (
    <button
      onDoubleClick={() => openWindow(appId, title)}
      className="flex flex-col items-center w-20 text-xs hover:brightness-125"
    >
      <div className="w-12 h-12 bg-slate-700 rounded shadow-inner" />
      <span className="mt-1 text-center drop-shadow-sm">{title}</span>
    </button>
  );
};

export default Desktop;

