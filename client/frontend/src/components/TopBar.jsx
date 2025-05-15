import React from 'react';
import { Sun, Moon, User } from 'lucide-react';

function TopBar({ onAuthClick, onThemeToggle }) {
  return (
    <div className="bg-[#F8F3D9]/50 dark:bg-[#3B362C]/50 backdrop-blur-lg border-b border-[#B9B28A] dark:border-[#7A745D]">
      <div className="flex items-center justify-end bg-[#F8F3D9] dark:bg-[#3B362C] p-2">
        <button
          onClick={onThemeToggle}
          className="p-2 hover:bg-[#EBE5C2] dark:hover:bg-[#504B38] rounded-full"
          aria-label="Toggle dark mode"
        >
          <Sun className="w-5 h-5 text-[#504B38] dark:text-[#F8F3D9] hidden dark:block" />
          <Moon className="w-5 h-5 text-[#504B38] dark:text-[#F8F3D9] block dark:hidden" />
        </button>
        <button
          onClick={onAuthClick}
          className="flex items-center gap-2 px-4 py-2 bg-[#7A745D] dark:bg-[#B9B28A] text-white dark:text-[#3B362C] rounded-full hover:bg-[#9B9477] dark:hover:bg-[#EBE5C2]"
          aria-label="Sign In"
        >
          <User className="w-4 h-4" />
          <span>Sign In</span>
        </button>
      </div>
    </div>
  );
}

export { TopBar };
