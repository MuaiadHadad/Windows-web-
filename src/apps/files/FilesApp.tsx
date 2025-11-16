import React from 'react';

const files = [
  { name: 'Design assets', detail: 'Folder • Updated 2m ago', icon: '🗂️' },
  { name: 'Screenshots', detail: 'Folder • 128 items', icon: '🖼️' },
  { name: 'Downloads', detail: 'Folder • 2.4 GB', icon: '⬇️' },
  { name: 'Music', detail: 'Folder • 86 tracks', icon: '🎧' },
];

const FilesApp: React.FC = () => {
  return (
    <div className="flex h-full flex-col gap-4 p-6 text-sm text-white/80">
      <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-2">
        <span className="text-xl">🔎</span>
        <input
          readOnly
          placeholder="Search quick access"
          className="flex-1 bg-transparent text-white placeholder:text-white/50 focus:outline-none"
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {files.map((file) => (
          <button
            key={file.name}
            className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-left transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl">{file.icon}</div>
            <div>
              <div className="font-semibold text-white">{file.name}</div>
              <div className="text-xs text-white/60">{file.detail}</div>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-auto grid grid-cols-3 gap-3 text-xs">
        {['Desktop', 'Documents', 'Pictures'].map((quick) => (
          <div key={quick} className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-3 py-4 text-center text-white/70">
            {quick}
          </div>
        ))}
      </div>
    </div>
  );
};
export default FilesApp;

