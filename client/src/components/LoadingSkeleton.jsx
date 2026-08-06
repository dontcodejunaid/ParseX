import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6 w-full max-w-7xl mx-auto py-8">
      <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    </div>
  );
}
