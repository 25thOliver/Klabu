import { NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import {
  FaChevronDown, FaChevronRight, FaBars, FaTimes,
  FaUsers, FaClipboardList, FaBell, FaCalendarAlt, FaCreditCard,
  FaTachometerAlt, FaBuilding, FaComments, FaSignOutAlt, FaUser,
  FaCog, FaHome
} from "react-icons/fa";

const DropdownMenu = ({ title, icon, links, isOpen, onToggle }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="flex items-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-xl font-bold shadow-md hover:bg-primary-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
        onClick={() => onToggle(!isOpen)}
      >
        <span className="text-lg">{icon}</span>
        <span>{title}</span>
        <FaChevronDown className={`text-sm transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-accent-200 py-2 z-50 animate-fadeIn">
          {links.map(({ to, label, icon: linkIcon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 text-sm transition-colors duration-200 rounded-lg font-semibold ${
                  isActive
                    ? "bg-primary-100 text-primary-700 border-l-4 border-primary-500"
                    : "text-dark-600 hover:bg-primary-50 hover:text-primary-700"
                }`
              }
              onClick={() => onToggle(false)}
            >
              {linkIcon && <span className="text-accent-500">{linkIcon}</span>}
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

const UserMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        className="flex items-center space-x-3 px-4 py-2 text-dark-700 hover:bg-accent-50 rounded-lg transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-dark-800">{user?.name || 'User'}</div>
          <div className="text-xs text-accent-600 capitalize">{user?.role || 'member'}</div>
        </div>
        <FaChevronDown className={`text-sm transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-accent-200 py-2 z-50 animate-fadeIn">
          <div className="px-4 py-3 border-b border-accent-200">
            <div className="text-sm font-medium text-dark-800">{user?.name || 'User'}</div>
            <div className="text-xs text-accent-600">{user?.email}</div>
          </div>
          
          <NavLink
            to="/profile"
            className="flex items-center space-x-3 px-4 py-3 text-sm text-dark-600 hover:bg-accent-50 hover:text-dark-800 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            <FaUser className="text-accent-500" />
            <span>Profile</span>
          </NavLink>
          
          <NavLink
            to="/dashboard"
            className="flex items-center space-x-3 px-4 py-3 text-sm text-dark-600 hover:bg-accent-50 hover:text-dark-800 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            <FaCog className="text-accent-500" />
            <span>Settings</span>
          </NavLink>
          
          <div className="border-t border-accent-200 mt-2 pt-2">
            <button 
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="flex items-center space-x-3 px-4 py-3 text-sm text-primary-600 hover:bg-primary-50 w-full transition-colors duration-200"
            >
              <FaSignOutAlt />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Navigation = ({ user }) => {
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleLogout = () => {
    logout();
  };

  const navigationItems = [
    {
      title: "Dashboard",
      icon: <FaTachometerAlt />,
      links: [
        { to: "/dashboard", label: "Overview", icon: <FaHome /> },
        { to: "/profile", label: "Profile", icon: <FaUser /> },
        { to: "/membership", label: "Membership", icon: <FaCreditCard /> },
        ...(user?.role === 'admin' ? [{ to: "/register", label: "Register User", icon: <FaUsers /> }] : [])
      ]
    },
    {
      title: "Events",
      icon: <FaCalendarAlt />,
      links: [
        ...(user?.role === 'admin' ? [{ to: "/admin/events", label: "Manage Events", icon: <FaClipboardList /> }] : []),
        { to: "/events", label: "All Events", icon: <FaCalendarAlt /> },
        { to: "/my-events", label: "My Events", icon: <FaUsers /> },
        { to: "/calendar", label: "Calendar", icon: <FaCalendarAlt /> }
      ]
    },
    {
      title: "Community",
      icon: <FaUsers />,
      links: [
        { to: "/teams", label: "Teams", icon: <FaUsers /> },
        { to: "/announcements", label: "Announcements", icon: <FaBell /> },
        ...(user?.role === 'admin' ? [{ to: "/admin/announcements/new", label: "New Announcement", icon: <FaBell /> }] : []),
        { to: "/forum", label: "Forum", icon: <FaComments /> },
        { to: "/forum/create", label: "Create Post", icon: <FaComments /> }
      ]
    },
    {
      title: "Facilities",
      icon: <FaBuilding />,
      links: [
        ...(user?.role === 'admin' ? [{ to: "/facilities/manage", label: "Manage Facilities", icon: <FaBuilding /> }] : []),
        { to: "/facilities/book", label: "Book Facilities", icon: <FaCalendarAlt /> },
        { to: "/facilities/my-bookings", label: "My Bookings", icon: <FaClipboardList /> }
      ]
    },
    {
      title: "Payments",
      icon: <FaCreditCard />,
      links: [
        { to: "/receipts", label: "My Receipts", icon: <FaCreditCard /> },
        ...(user?.role === "admin" ? [{ to: "/admin/payments", label: "All Payments", icon: <FaCreditCard /> }] : [])
      ]
    }
  ];

  return (
    <nav className="w-full bg-white sticky top-0 z-50 shadow-xl border-b-4 border-primary-500">
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center h-20">
        {/* Logo and Text - improved alignment */}
        <NavLink to="/dashboard" className="flex items-center space-x-4 group">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-white font-extrabold text-3xl">🏆</span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-2xl font-extrabold text-primary-700 leading-tight uppercase">Sports Club</span>
              <span className="text-xs text-accent-500 font-semibold uppercase tracking-widest leading-tight">Community Portal</span>
            </div>
          </div>
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navigationItems.map((item, index) => (
            <DropdownMenu
              key={index}
              title={item.title}
              icon={item.icon}
              links={item.links}
              isOpen={activeDropdown === index}
              onToggle={(isOpen) => setActiveDropdown(isOpen ? index : null)}
              buttonClass="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-bold shadow-md transition-all duration-200"
            />
          ))}
        </div>

        {/* User Menu & Quick Actions */}
        <div className="flex items-center space-x-6">
          {/* Example quick action icon (search) */}
          <button className="hidden md:inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent-50 hover:bg-accent-100 text-primary-600 shadow transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
          </button>
          <UserMenu user={user} onLogout={handleLogout} />
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-3 rounded-full text-primary-500 hover:bg-primary-50 transition-colors shadow-sm ml-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t-2 border-primary-500 animate-slideDown shadow-xl rounded-b-2xl">
          <div className="px-8 py-6 space-y-2">
            {navigationItems.map((item, index) => (
              <div key={index} className="mb-2">
                <div className="flex items-center gap-2 px-3 py-2 text-lg font-bold text-primary-700 bg-primary-50 rounded-xl mb-1 shadow-sm uppercase tracking-wide">
                  {item.icon} <span>{item.title}</span>
                </div>
                <div className="ml-4 space-y-1">
                  {item.links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-base rounded-full transition-all duration-200 font-semibold shadow-sm uppercase tracking-wide ${
                          isActive
                            ? "bg-primary-100 text-primary-700"
                            : "text-dark-600 hover:bg-accent-50 hover:text-primary-700"
                        }`
                      }
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
