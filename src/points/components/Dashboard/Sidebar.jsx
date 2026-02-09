import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import {
  LayoutDashboard,
  Megaphone,
  Users,
  BarChart3,
  Settings,
  Coins,
  Waves,
} from "lucide-react";
import headerLogo from "../../assets/header-logo-reef.png";

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Campaigns",
      path: "/dashboard/campaigns",
      icon: Megaphone,
    },
    {
      name: "Users",
      path: "#",
      icon: Users,
    },
    {
      name: "Analytics",
      path: "#",
      icon: BarChart3,
    },
    {
      name: "Tokens",
      path: "#",
      icon: Coins,
    },
    {
      name: "Pools",
      path: "#",
      icon: Waves,
    },
    {
      name: "Settings",
      path: "#",
      icon: Settings,
    },
  ];

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  const handleLinkClick = () => {
    // Close mobile menu when a link is clicked
    if (setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block bg-white h-screen w-64 shadow-lg  fixed left-0 top-0 z-40">
        <SidebarContent
          menuItems={menuItems}
          isActive={isActive}
          onLinkClick={handleLinkClick}
        />
      </div>

      {/* Mobile Sidebar & Blur Overlay */}
      {/* Blur overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-white/30 backdrop-blur-[4px] transition-all duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      {/* Sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Reef
            </div>
            <div className="text-lg font-semibold text-gray-700 ml-1">SWAP</div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <SidebarContent
          menuItems={menuItems}
          isActive={isActive}
          onLinkClick={handleLinkClick}
          isMobile={true}
        />
      </div>
    </>
  );
};

// Shared sidebar content component
const SidebarContent = ({
  menuItems,
  isActive,
  onLinkClick,
  isMobile = false,
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Logo Section - Only show on desktop */}
      {!isMobile && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2 flex-shrink-0">
            <img
              src={headerLogo}
              alt="Reef-swap"
              className="w-20 h-auto sm:w-32"
              width={131}
              height={44}
            />
          </div>

          <p className="text-sm text-gray-500 mt-1">Admin Dashboard</p>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className={`${isMobile ? "mt-4" : "mt-6"} flex-1`}>
        <div className="px-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Main Menu
          </p>
          <ul className="space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onLinkClick}
                    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? "text-white py-3 px-4 rounded-2xl bg-gradient-to-br from-[#ae27a5] to-[#742cb2] shadow-[0_5px_20px_-10px_#742cb2]"
                        : "text-gray-700 hover:bg-gray-100 hover:text-purple-600"
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
