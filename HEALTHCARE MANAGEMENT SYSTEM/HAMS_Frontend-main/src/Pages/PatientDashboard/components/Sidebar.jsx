import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { FaBars, FaCalendarAlt, FaHeartbeat, FaChevronLeft } from 'react-icons/fa';
import { MdLogout, MdSettings, MdMessage } from 'react-icons/md';
import { useState, useEffect } from 'react';

const navItems = [
  { label: 'Dashboard', path: '/dashboard/patient', icon: <FaCalendarAlt />, end: true },
  { label: 'Appointments', path: '/dashboard/patient/appointments', icon: <FaHeartbeat /> },
  { label: 'Reviews', path: '/dashboard/patient/reviews', icon: <MdMessage /> },
  { label: 'Settings', path: '/dashboard/patient/settings', icon: <MdSettings /> },
];

const Sidebar = ({ collapsed, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [internalCollapsed, setInternalCollapsed] = useState(collapsed);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      if (window.innerWidth >= 640) setDrawerOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setInternalCollapsed(collapsed);
  }, [collapsed]);

  const effectiveCollapse = isMobile || internalCollapsed;

  // Hamburger for mobile
  const Hamburger = () => (
    <button
      className="sm:hidden p-2 m-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white text-gray-700 shadow"
      onClick={() => setDrawerOpen(!drawerOpen)}
      aria-label="Toggle sidebar"
    >
      <FaBars size={22} />
    </button>
  );

  // Collapse/Expand button for desktop
  const CollapseButton = () => (
    <button
      className="hidden sm:flex items-center justify-center absolute top-4 right-2 w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-cyan-100 hover:bg-cyan-200 transition"
      onClick={() => setInternalCollapsed((prev) => !prev)}
      aria-label={internalCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      title={internalCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      tabIndex={0}
    >
      <span className={`transition-transform duration-300 ${internalCollapsed ? '' : 'rotate-180'}`}>
        <FaChevronLeft />
      </span>
    </button>
  );

  // Sidebar content
  const SidebarContent = () => (
    <aside
      className={`relative bg-cyan-50 border-r border-gray-200 shadow-lg transition-all duration-300 h-full flex flex-col ${
        effectiveCollapse ? 'w-20 pt-8' : 'w-64 pt-4'
      } p-4`}
    >
      {/* Collapse/Expand Button (desktop only) */}
      <CollapseButton />
      {/* Logo */}
      <h2
        className={`text-2xl font-bold text-cyan-600 mb-8 transition-opacity duration-300 ${
          effectiveCollapse ? 'opacity-0 hidden' : 'opacity-100'
        }`}
      >
        HAMS
      </h2>
      {/* Navigation */}
      <nav className="flex flex-col gap-3 flex-1 mt-5">
        {navItems.map(({ label, path, icon, end }) => (
          <NavLink
            key={label}
            to={path}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-2 rounded-lg text-gray-700 text-sm font-medium !no-underline transition-all duration-200 outline-none
               ${isActive ? 'bg-cyan-100 text-cyan-700 font-semibold border-l-4 border-cyan-600 shadow-sm' : 'hover:bg-cyan-100 hover:text-cyan-700 hover:border-cyan-300 border-l-4 border-transparent'}
               focus:ring-2 focus:ring-cyan-400`
            }
          >
            <div className="text-lg transition-transform duration-200 group-hover:scale-110">{icon}</div>
            {!effectiveCollapse && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
      {/* Divider above logout */}
      <hr className="my-4 border-gray-200" />
      {/* Logout */}
      <div
        onClick={() => { logout(); if (isMobile) setDrawerOpen(false); }}
        className="flex items-center gap-4 px-3 py-2 rounded-lg text-red-500 text-sm font-medium cursor-pointer hover:bg-red-50 transition-all duration-200 mt-2 focus:outline-none focus:ring-2 focus:ring-red-300"
        tabIndex={0}
        title="Logout"
      >
        <div className="text-lg">
          <MdLogout />
        </div>
        {!effectiveCollapse && <span>Logout</span>}
      </div>
    </aside>
  );

  // Drawer overlay for mobile
  if (isMobile) {
    return (
      <>
        <Hamburger />
        {drawerOpen && (
          <div className="fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-black bg-opacity-40" onClick={() => setDrawerOpen(false)} />
            <div className="relative z-50 h-full">
              <SidebarContent />
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop sidebar
  return <SidebarContent />;
};

export default Sidebar;
