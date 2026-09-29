import React from 'react';

interface NavbarProps {
  onMenuClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const handleOpenMenu = () => {
    if (onMenuClick) {
      onMenuClick();
    } else {
      window.dispatchEvent(new CustomEvent('open-toc'));
    }
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-40 flex items-center justify-end px-6 sm:px-10 lg:px-16 py-6 pointer-events-auto select-none">
      {/* Top Right: MENU only */}
      <button
        type="button"
        onClick={handleOpenMenu}
        data-cursor="MENU"
        className="group flex items-center gap-2 font-mono text-xs sm:text-sm tracking-[0.25em] font-bold text-black hover:text-[#E10600] transition-colors cursor-pointer uppercase"
      >
        <span className="w-2 h-2 rounded-full bg-[#E10600] transition-transform duration-300 group-hover:scale-125" />
        <span>MENU</span>
      </button>
    </header>
  );
};

export default Navbar;
