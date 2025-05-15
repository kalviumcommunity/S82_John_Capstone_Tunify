import React, { useState, useEffect } from 'react';
import { Home, Library, Download, Settings, Heart, Music2, Menu, X } from 'lucide-react';


const menuItems = [
  { icon: Home, label: 'Home' },
  { icon: Library, label: 'Library' },
  { icon: Heart, label: 'Liked Songs' },
  { icon: Download, label: 'Downloads' },
  { icon: Settings, label: 'Settings' },
];

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden p-4 flex justify-center items-center bg-[#F8F3D9] dark:bg-[#3B362C] border-b border-[#B9B28A] dark:border-[#7A745D] z-50 relative ">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-4 left-4 text-[#504B38] dark:text-[#F8F3D9]"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Panel */}
      <aside
        className={`fixed md:static top-0 left-0 bottom-0 w-64 min-h-screen space-y-8 bg-[#F8F3D9] dark:bg-[#3B362C] border-r border-[#B9B28A] dark:border-[#7A745D] p-4 z-50 transform transition-transform duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0 ' : '-translate-x-full '} md:translate-x-0 md:block`}
      >
        {/* Close button (mobile) */}
        <div className="flex justify-between items-center mb-6 md:hidden">
          <div className="flex items-center gap-2">
            <Music2 className="w-6 h-6 text-[#504B38] dark:text-[#F8F3D9]" />
            <h1 className="text-lg font-bold text-[#504B38] dark:text-[#F8F3D9]">Tunify</h1>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-[#504B38] dark:text-[#F8F3D9]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Logo (desktop) */}
        <div className="hidden md:flex items-center gap-2 mb-8">
          <Music2 className="w-8 h-8 text-[#504B38] dark:text-[#F8F3D9]" />
          <h1 className="text-xl font-bold text-[#504B38] dark:text-[#F8F3D9]">Tunify</h1>
        </div>

        {/* Menu items */}
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-[#504B38] dark:text-[#F8F3D9] hover:bg-[#EBE5C2] dark:hover:bg-[#7A745D] rounded-lg ">
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
