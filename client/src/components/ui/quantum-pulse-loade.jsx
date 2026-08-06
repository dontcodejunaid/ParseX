import { cn } from "@/lib/utils";
import { useState } from "react";

export const Component = ({ className }) => {
  const [count, setCount] = useState(0);

  const text = "Parsing Resume...";

  return (
    <div className={cn("generating-loader-wrapper py-4 flex flex-col items-center justify-center gap-3", className)}>
      <div className="generating-loader-text flex items-center justify-center font-mono font-extrabold tracking-wider text-lg md:text-xl text-brand-600 dark:text-brand-400 drop-shadow-sm">
        {text.split("").map((letter, idx) => (
          <span
            key={idx}
            className="generating-loader-letter inline-block"
            style={{ animationDelay: `${idx * 0.12}s` }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </div>
      <div className="w-full max-w-xs h-2 bg-slate-200 dark:bg-slate-800/80 rounded-full overflow-hidden relative shadow-inner border border-slate-300/30 dark:border-slate-700/30">
        <div className="generating-loader-bar absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-500 rounded-full shadow-md shadow-brand-500/50"></div>
      </div>
    </div>
  );
};
