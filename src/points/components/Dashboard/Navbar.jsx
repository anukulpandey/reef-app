import { Bell, Search, User, ChevronDown, Menu } from "lucide-react";
import headerLogo from "../../assets/header-logo-reef.png";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = ({ setIsMobileMenuOpen }) => {
  const { user } = useAuth();
  console.log("🚀 ~ Navbar ~ user:", user);
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 right-0 left-0 lg:left-64 z-40 overflow-x-hidden">
      <div className="px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 cursor-pointer" />
            </button>
            <div className="lg:hidden flex items-center">
              <div className="flex items-center space-x-2 flex-shrink-0">
                <img
                  src={headerLogo}
                  alt="Reef-swap"
                  className="w-20 h-auto sm:w-32"
                  width={131}
                  height={44}
                />
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Mobile Search Button */}

            {/* User Profile */}
            <div className="flex items-center space-x-2 lg:space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.username || "Admin User"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || "admin@reefswap.com"}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
