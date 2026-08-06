import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Upload, Code2, Info, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import SkyToggle from './SkyToggle';
import logoImg from '../assets/logo.png';
import { HoverButton } from './ui/hover-glow-button';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home', icon: FileText },
    { path: '/upload', label: 'Upload PDF', icon: Upload },
    { path: '/result', label: 'Parsed Results', icon: Code2 },
    { path: '/about', label: 'About', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-[#D6CC99]/40 dark:border-[#445D48]/40 shadow-md backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-[#071E2E] border border-[#D6CC99]/60 dark:border-[#445D48]/60 p-0.5 flex items-center justify-center shadow-md shadow-[#445D48]/20 group-hover:scale-105 transition-transform duration-200 overflow-hidden shrink-0">
            <img src={logoImg} alt="ParseX Logo" className="w-full h-full object-cover rounded-xl" />
          </div>
          <div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-[#445D48] via-[#5E3023] to-[#001524] dark:from-[#FDE5D4] dark:via-[#D6CC99] dark:to-[#FDE5D4] bg-clip-text text-transparent">
              ParseX
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase font-extrabold tracking-widest text-[#445D48] dark:text-[#D6CC99] block -mt-1">
              Resume Parser
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Items */}
        <nav className="hidden md:flex items-center gap-1 bg-[#FDE5D4]/40 dark:bg-[#071E2E]/80 p-1 rounded-full border border-[#D6CC99]/50 dark:border-[#445D48]/40 shadow-inner">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#445D48] text-[#FDE5D4] dark:bg-[#D6CC99] dark:text-[#001524] shadow-sm'
                    : 'text-[#001524]/80 dark:text-[#FDE5D4]/80 hover:text-[#5E3023] dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <SkyToggle checked={isDark} onChange={toggleTheme} />

          <Link to="/upload" className="hidden sm:inline-block">
            <HoverButton
              glowColor={isDark ? '#445D48' : '#D6CC99'}
              backgroundColor={isDark ? '#D6CC99' : '#445D48'}
              textColor={isDark ? '#001524' : '#FDE5D4'}
              hoverTextColor={isDark ? '#001524' : '#FFFFFF'}
              className="!px-4 !py-2 !text-xs !rounded-xl shadow-md hover:scale-105 transition-transform"
            >
              <Upload className="w-4 h-4 shrink-0" />
              <span>Parse Resume</span>
            </HoverButton>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-[#FDE5D4]/50 dark:bg-[#071E2E] border border-[#D6CC99]/50 dark:border-[#445D48]/50 text-[#001524] dark:text-[#FDE5D4] hover:bg-[#445D48] hover:text-[#FDE5D4] dark:hover:bg-[#D6CC99] dark:hover:text-[#001524] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#D6CC99]/40 dark:border-[#445D48]/40 bg-[#FAF4ED]/95 dark:bg-[#001524]/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all ${
                  isActive
                    ? 'bg-[#445D48] text-[#FDE5D4] dark:bg-[#D6CC99] dark:text-[#001524] shadow-md'
                    : 'text-[#001524]/85 dark:text-[#FDE5D4]/85 hover:bg-[#FDE5D4]/60 dark:hover:bg-[#071E2E]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-2">
            <Link to="/upload" onClick={() => setMobileMenuOpen(false)}>
              <HoverButton
                glowColor={isDark ? '#445D48' : '#D6CC99'}
                backgroundColor={isDark ? '#D6CC99' : '#445D48'}
                textColor={isDark ? '#001524' : '#FDE5D4'}
                hoverTextColor={isDark ? '#001524' : '#FFFFFF'}
                className="w-full justify-center !py-3 !text-sm !rounded-2xl shadow-md"
              >
                <Upload className="w-4 h-4 shrink-0" />
                <span>Parse Resume PDF</span>
              </HoverButton>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
