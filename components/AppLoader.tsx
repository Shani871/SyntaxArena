import React from 'react';

interface AppLoaderProps {
  label?: string;
}

export const AppLoader: React.FC<AppLoaderProps> = ({ label = 'Loading workspace' }) => {
  return (
    <div className="flex h-full min-h-[320px] w-full items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 shadow-[0_20px_50px_rgba(14,165,233,0.28)]">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/35 border-t-white" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-sky-300">SyntaxArena</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">{label}</h2>
        <p className="mt-2 text-sm text-slate-400">Preparing the next module and syncing the client state.</p>
      </div>
    </div>
  );
};
