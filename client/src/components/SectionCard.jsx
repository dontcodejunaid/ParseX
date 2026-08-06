import React from 'react';

export default function SectionCard({ title, icon: Icon, children, badgeCount }) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-[#D6CC99]/50 dark:border-[#445D48]/40 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#D6CC99]/40 dark:border-[#445D48]/40">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-[#FDE5D4] dark:bg-[#445D48]/40 text-[#445D48] dark:text-[#D6CC99] flex items-center justify-center border border-[#D6CC99]/40">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <h3 className="text-lg font-extrabold text-[#001524] dark:text-[#FDE5D4]">
            {title}
          </h3>
        </div>
        {badgeCount !== undefined && badgeCount !== null && (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#445D48] text-[#FDE5D4] dark:bg-[#D6CC99] dark:text-[#001524]">
            {badgeCount}
          </span>
        )}
      </div>

      <div className="text-sm font-medium text-[#001524]/85 dark:text-[#FDE5D4]/85">
        {children}
      </div>
    </div>
  );
}
