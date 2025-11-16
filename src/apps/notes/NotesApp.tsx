import React, { useState } from 'react';

const NotesApp: React.FC = () => {
  const [text, setText] = useState('');
  return (
    <div className="flex h-full flex-col gap-4 p-6 text-sm text-white/80">
      <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-amber-200/20 to-orange-500/10 p-4 text-slate-950">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-900/70">Notebook</p>
        <h2 className="text-2xl font-semibold text-slate-900">Capture your thoughts</h2>
        <p className="text-sm text-slate-900/80">Everything syncs instantly inside this window.</p>
      </div>
      <textarea
        className="min-h-[220px] flex-1 rounded-2xl border border-white/5 bg-white/5 p-4 text-base text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing your next bright idea..."
      />
      <div className="flex flex-wrap gap-2 text-xs">
        {['Research', 'To-do', 'Inspiration'].map((tag) => (
          <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-white/70">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};
export default NotesApp;

