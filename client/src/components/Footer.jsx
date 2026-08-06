import React from 'react';
import { Heart, Github, FileCode } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#D6CC99]/40 dark:border-[#445D48]/40 bg-[#FAF4ED]/60 dark:bg-[#041624]/60 backdrop-blur-md py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#001524]/75 dark:text-[#FDE5D4]/75">
          <FileCode className="w-4 h-4 text-[#445D48] dark:text-[#D6CC99]" />
          <span>ParseX Resume Parser &copy; {new Date().getFullYear()}</span>
        </div>

        <div className="flex items-center gap-6 text-sm font-semibold text-[#001524]/75 dark:text-[#FDE5D4]/75">
          <span className="flex items-center gap-1.5">
            Built with <Heart className="w-4 h-4 text-[#5E3023] fill-[#5E3023] dark:text-[#D6CC99] dark:fill-[#D6CC99]" /> using Node.js & React
          </span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#445D48] dark:hover:text-white transition-colors flex items-center gap-1"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
