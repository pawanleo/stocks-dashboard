import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 mb-4 pt-4 flex flex-col items-center justify-center text-center">
      <div className="flex space-x-4 mb-2 text-xs">
        <a href="#" className="text-textMuted hover:text-text transition-colors">About</a>
        <span className="text-border">•</span>
        <a href="#" className="text-textMuted hover:text-text transition-colors">Terms</a>
        <span className="text-border">•</span>
        <a href="#" className="text-textMuted hover:text-text transition-colors">Privacy</a>
      </div>
      <p className="text-[10px] text-textMuted/60 font-mono">
        © {new Date().getFullYear()} SleekTrader
      </p>
    </footer>
  );
};

export default Footer;
