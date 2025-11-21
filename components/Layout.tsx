import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-mondi-red rounded-md flex items-center justify-center text-white font-bold shadow-sm">
              M
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              Playwright<span className="text-mondi-red">Gen</span>
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-xs font-medium text-slate-500 border border-slate-200">
              For Mondi UFP
            </span>
          </div>
          <nav className="flex gap-4">
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-mondi-red transition-colors">Documentation</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-mondi-red transition-colors">API Reference</a>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Playwright Generator. Not affiliated with Mondi Group.
        </div>
      </footer>
    </div>
  );
};