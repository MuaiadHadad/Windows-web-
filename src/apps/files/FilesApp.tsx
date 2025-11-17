import React, { useState } from 'react';

const files = [
	{ name: 'Design assets', detail: 'Folder • Updated 2m ago', icon: '🗂️', type: 'Folder', size: '—' },
	{ name: 'Screenshots', detail: 'Folder • 128 items', icon: '🖼️', type: 'Folder', size: '—' },
	{ name: 'Downloads', detail: 'Folder • 2.4 GB', icon: '⬇️', type: 'Folder', size: '—' },
	{ name: 'Music', detail: 'Folder • 86 tracks', icon: '🎧', type: 'Folder', size: '—' },
];

const FilesApp: React.FC = () => {
	const [selected, setSelected] = useState<typeof files[number] | null>(null);
	return (
		<div className="flex h-full flex-col gap-4 bg-gradient-to-br from-white/5 via-white/0 to-white/5 p-6 text-sm text-white/80">
			<div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
				<span className="text-xl drop-shadow">🔎</span>
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
						onClick={() => setSelected(file)}
						className={`flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-left transition hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-[0_12px_30px_rgba(56,189,248,0.2)] ${
							selected?.name === file.name ? 'ring-2 ring-sky-300/60 bg-white/20' : ''
						}`}
					>
						<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300/20 via-white/10 to-white/5 text-xl shadow-inner">
							{file.icon}
						</div>
						<div>
							<div className="font-semibold text-white">{file.name}</div>
							<div className="text-xs text-white/60">{file.detail}</div>
						</div>
					</button>
				))}
			</div>
			{selected && (
				<div className="mt-2 rounded-2xl border border-white/10 bg-white/10 p-4 text-white/80">
					<div className="mb-2 text-xs uppercase tracking-widest text-white/60">Details</div>
					<div className="flex items-center gap-3">
						<div
							className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl shadow-inner"
							aria-hidden
						>
							{selected.icon}
						</div>
						<div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
							<div className="text-white/60">Name</div>
							<div className="text-white">{selected.name}</div>
							<div className="text-white/60">Type</div>
							<div className="text-white">{selected.type}</div>
							<div className="text-white/60">Size</div>
							<div className="text-white">{selected.size}</div>
							<div className="text-white/60">Modified</div>
							<div className="text-white">2 minutes ago</div>
						</div>
					</div>
				</div>
			)}
			<div className="mt-auto grid grid-cols-3 gap-3 text-xs">
				{['Desktop', 'Documents', 'Pictures'].map((quick) => (
					<div
						key={quick}
						className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-3 py-4 text-center text-white/70 backdrop-blur-sm"
					>
						{quick}
					</div>
				))}
			</div>
		</div>
	);
};
export default FilesApp;

