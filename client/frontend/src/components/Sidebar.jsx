import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  Library,
  Download,
  Settings,
  UploadIcon,
  Heart,
  Music2,
  Menu,
  X
} from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Library, label: 'Library', path: '/library' },
  { icon: Heart, label: 'Liked Songs', path: '/likedsongs' },
  { icon: Download, label: 'Downloads', path: '/downloads' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: UploadIcon, label: 'Upload', path: '/upload' }

];

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

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
      <div className="md:hidden p-4 flex justify-center items-center bg-[#F8F3D9] dark:bg-[#3B362C] border-b border-[#B9B28A] dark:border-[#7A745D] z-50 relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-4 left-4 text-[#504B38] dark:text-[#F8F3D9]"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Panel */}
      <aside
        className={`fixed md:static top-0 left-0 bottom-0 w-64 h-screen space-y-8 bg-[#F8F3D9] dark:bg-[#3B362C] border-r border-[#B9B28A] dark:border-[#7A745D] p-4 z-50 transform transition-transform duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:block`}
      >
        {/* Mobile Header */}
        <div className="flex justify-between items-center mb-6 md:hidden">
          <div className="flex items-center gap-2">
            <Music2 className="w-6 h-6 text-[#504B38] dark:text-[#F8F3D9]" />
            <h1 className="text-lg font-bold text-[#504B38] dark:text-[#F8F3D9]">Tunify</h1>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-[#504B38] dark:text-[#F8F3D9]">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Desktop Logo */}
        <div className="hidden md:flex items-center gap-2 mb-8">
          <Music2 className="w-8 h-8 text-[#504B38] dark:text-[#F8F3D9]" />
          <h1 className="text-xl font-bold text-[#504B38] dark:text-[#F8F3D9]">Tunify</h1>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link to={item.path}>
                  <button className="w-full flex items-center gap-3 px-4 py-2 rounded-md hover:bg-[#EBE5C2] dark:hover:bg-[#504B38] text-[#504B38] dark:text-[#F8F3D9]">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
