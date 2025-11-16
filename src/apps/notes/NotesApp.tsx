import React, { useState } from 'react';

const NotesApp: React.FC = () => {
  const [text, setText] = useState('');
  return (
    <div className="p-2 text-xs">
      <h2 className="font-semibold mb-2">Notes</h2>
      <textarea
        className="w-full h-56 bg-slate-800 border border-slate-600 rounded p-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write something..."
      />
    </div>
  );
};
export default NotesApp;

