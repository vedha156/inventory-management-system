"use client";

import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  
  // Format pathname into title
  const title = pathname === '/' 
    ? 'Home' 
    : pathname.split('/').filter(Boolean).map(segment => 
        segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ')
      ).join(' / ');

  return (
    <nav className="h-16 px-8 flex items-center justify-between bg-slate-900/50 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-20">
      <h1 className="text-xl font-semibold text-white tracking-tight">
        {title}
      </h1>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-xs font-medium text-slate-300">System Online</span>
        </div>
        
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-slate-900"></span>
        </button>
      </div>
    </nav>
  );
}
