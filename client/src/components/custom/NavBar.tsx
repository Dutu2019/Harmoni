import { userContext } from '@/contexts/userContext';

import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, User, MessageSquare, Calendar, Menu, X } from "lucide-react";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/about", icon: User, label: "About" },
    { path: "/chat", icon: MessageSquare, label: "Chat" },
    { path: "/schedule", icon: Calendar, label: "Schedule" },
    { path: "/login", icon: User, label: "Login" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-[#221F26] text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold">Logo</span>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(path)
                    ? "text-[#1EAEDB] bg-[#2d2a33]"
                    : "text-[#C8C8C9] hover:text-[#1EAEDB] hover:bg-[#2d2a33]"
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      </nav>
  )};

export default NavBar;