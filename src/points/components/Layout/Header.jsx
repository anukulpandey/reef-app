import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import headerLogo from "../../assets/header-logo-reef.png";
import ReefIcon from "../../assets/reef-icon-32.png";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import Uik from "@reef-chain/ui-kit";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { HiCog } from "react-icons/hi";
import SettingsPopup from "../Popup/settingPopup";
import { useAuth } from "../../contexts/AuthContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { selectedAccount } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu or settings popup is open
  useEffect(() => {
    if (mobileMenuOpen || (isSettingsOpen && window.innerWidth >= 768)) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen, isSettingsOpen]);

  const toggleSettingsPopup = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const navItems = [
    { name: "Points", path: "/points", active: true, external: false },
    {
      name: "Tokens",
      path: "https://app.reefswap.com/dashboard",
      active: true,
      external: true,
    },
    { name: "Pools", path: "https://app.reefswap.com/pools", active: true, external: true },
    {
      name: "Creator",
      path: "https://app.reefswap.com/create-token",
      active: true,
      external: true,
    },
  ];

  return (
    <>
      <header
        className={`w-full sticky top-0 bg-[#F7F5FB] py-3 z-50 transition-all duration-300 ease-in-out ${
          scrolled
            ? "shadow-[0_8px_30px_rgba(172,138,199,0.20)] backdrop-blur-md bg-[#F7F5FB]/95"
            : "shadow-[0_8px_20px_rgba(172,138,199,0.12)]"
        }`}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          {/* Logo Section with hover animation */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <img
              src={headerLogo}
              alt="Reef-swap"
              className="w-20 cursor-pointer h-auto sm:w-32 transition-transform duration-300 hover:scale-105"
              width={131}
              height={44}
            />
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Navigation with staggered animation */}
            <nav className="hidden lg:flex items-center space-x-6 font-poppins text-[16px] font-semibold">
              {navItems.map((item, index) => {
                const isActive =
                  item.path === "/points"
                    ? location.pathname === "/points" ||
                      location.pathname.startsWith("/points/")
                    : location.pathname === item.path && item.active;
                const baseClassName = `relative transition-all duration-300 hover:scale-105 ${
                  isActive
                    ? "bg-gradient-to-r from-[#A93185] to-[#5D3BAD] bg-clip-text text-transparent"
                    : item.active
                    ? "text-[#000000] hover:text-[#A93185]"
                    : "text-gray-400 hover:text-[#A93185]"
                }`;

                return item.external ? (
                  <a
                    key={item.name}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={baseClassName}
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {item.name}
                    {/* Animated underline */}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#A93185] to-[#5D3BAD] transition-all duration-300 hover:w-full"></span>
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={baseClassName}
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {item.name}
                    {/* Animated underline */}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#A93185] to-[#5D3BAD] transition-all duration-300 hover:w-full"></span>
                  </Link>
                );
              })}
            </nav>
            {/* REEF Badge with enhanced animation */}
            {selectedAccount && (
              <div className="flex w-fit overflow-hidden bg-gradient-to-br from-[#F4F1FC] to-[#F7F6FC] shadow-lg rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="flex items-center gap-2 pl-3 pr-4 py-2.5">
                  <img
                    src={ReefIcon}
                    alt=""
                    width={20}
                    height={20}
                    className="animate-pulse"
                  />
                  <span className="text-[16px] font-extrabold bg-gradient-to-r from-[#A93185] to-[#5D3BAD] bg-clip-text text-transparent tracking-tight">
                    {selectedAccount?.balance
                      ? `${selectedAccount.balance} REEF`
                      : "1151495 REEF"}
                  </span>
                </div>
                <div className="flex items-center bg-gradient-to-r from-[#A93185] to-[#5D3BAD] px-4 py-2.5 rounded-full">
                  <span className="text-white text-[16px] font-medium">
                    {selectedAccount?.meta?.name || "Anon 1"}
                  </span>
                </div>
              </div>
            )}
            {/* Connect Button with animation  */}
            {!selectedAccount && (
              <div className="text-white py-3 px-6 rounded-2xl bg-gradient-to-br from-[#ae27a5] to-[#742cb2] shadow-[0_5px_20px_-10px_#742cb2] transition-all duration-300 hover:shadow-[0_8px_25px_-10px_#742cb2] hover:scale-105">
                <button
                  className="font-medium cursor-pointer"
                  onClick={toggleSettingsPopup}
                >
                  Connect
                </button>
              </div>
            )}
            {/* Settings Icon with animation */}
            {selectedAccount && (
              <div className="w-10 h-10 flex items-center cursor-pointer justify-center shadow-lg rounded-full bg-[#F4F1FC] transition-all duration-300 hover:shadow-xl hover:scale-110 hover:bg-[#E4DFF0]">
                <button
                  className="flex items-center justify-center cursor-pointer text-[#A93185] hover:text-black transition-all duration-300 w-full h-full"
                  onClick={toggleSettingsPopup}
                >
                  <Uik.Icon
                    icon={faCog}
                    className="w-5 h-5 transition-transform duration-300 hover:rotate-90"
                  />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Right Section */}
          <div className="flex md:hidden items-center space-x-3">
            {/* Mobile REEF Badge */}
            {selectedAccount && (
              <div className="flex w-fit overflow-hidden bg-gradient-to-br from-[#F4F1FC] to-[#F7F6FC] shadow-lg rounded-full transform transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-1.5 pl-2 pr-3 py-2">
                  <img
                    src={ReefIcon}
                    alt=""
                    width={16}
                    height={16}
                    className="animate-pulse"
                  />
                  <span className="text-[12px] font-extrabold bg-gradient-to-r from-[#A93185] to-[#5D3BAD] bg-clip-text text-transparent tracking-tight">
                    {selectedAccount?.balance
                      ? selectedAccount.balance
                      : "0.0000"}
                  </span>
                </div>
                <div className="flex items-center bg-gradient-to-r from-[#A93185] to-[#5D3BAD] px-3 py-2 rounded-full">
                  <span className="text-white text-[12px] font-medium">
                    {(selectedAccount?.meta?.name || "Anon 1").split(" ")[0]}
                  </span>
                </div>
              </div>
            )}

            {/* Connect Button */}
            {!selectedAccount && (
              <div className="text-white py-1 px-4 rounded-2xl bg-gradient-to-br from-[#ae27a5] to-[#742cb2] shadow-[0_5px_20px_-10px_#742cb2] transition-all duration-300 hover:shadow-[0_8px_25px_-10px_#742cb2] hover:scale-105">
                <button
                  className="font-medium cursor-pointer text-sm"
                  onClick={toggleSettingsPopup}
                >
                  Connect
                </button>
              </div>
            )}

            {/* Settings Icon */}
            {selectedAccount && (
              <div className="w-8 h-8 flex items-center justify-center shadow-lg rounded-full bg-[#F4F1FC] transition-all duration-300 hover:scale-110">
                <button
                  className="flex items-center justify-center text-[#A93185] hover:text-black transition-all duration-300 w-full h-full"
                  onClick={toggleSettingsPopup}
                >
                  <HiCog className="w-5 h-5 transition-transform duration-300 hover:rotate-90" />
                </button>
              </div>
            )}

            {/* Mobile Menu Button with animation */}
            <button
              className="p-2 cursor-pointer text-gray-500 hover:text-black transition-all duration-300 hover:scale-110"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="relative w-6 h-6">
                <HiMenu
                  className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                    mobileMenuOpen
                      ? "opacity-0 rotate-90"
                      : "opacity-100 rotate-0"
                  }`}
                />
                <HiX
                  className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                    mobileMenuOpen
                      ? "opacity-100 rotate-0"
                      : "opacity-0 -rotate-90"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ease-in-out ${
          mobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        style={{
          background: mobileMenuOpen ? "rgba(44, 34, 60, 0.4)" : "transparent",
          backdropFilter: mobileMenuOpen ? "blur(8px)" : "none",
        }}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`absolute right-0 top-0 h-full w-4/5 max-w-sm bg-gradient-to-br from-[#EEEBF6] to-[#F4F1FC] shadow-2xl border-l border-purple-200/50 transform transition-all duration-500 ease-out ${
            mobileMenuOpen
              ? "translate-x-0 scale-100"
              : "translate-x-full scale-95"
          } flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header section */}
          <div className="flex items-center justify-between p-6 border-b border-purple-200/30">
            <div className="flex items-center space-x-2">
              <img src={ReefIcon} alt="" width={24} height={24} />
              <span className="text-lg font-bold bg-gradient-to-r from-[#A93185] to-[#5D3BAD] bg-clip-text text-transparent">
                Menu
              </span>
            </div>
            <button
              className="p-2 rounded-full bg-white/80 shadow-lg hover:bg-white hover:scale-110 transition-all duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              <HiX className="w-6 h-6 text-[#A93185]" />
            </button>
          </div>

          {/* Connect Button */}

          {/* Navigation */}
          <nav className="flex-1 py-6 px-6">
            <div className="space-y-2">
              {navItems.map((item, index) => {
                const isActive =
                  item.path === "/points"
                    ? location.pathname === "/points" ||
                      location.pathname.startsWith("/points/")
                    : location.pathname === item.path && item.active;
                const baseClassName = `block w-full text-left py-4 px-6 rounded-xl font-poppins text-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isActive
                    ? "bg-gradient-to-r from-[#A93185] to-[#5D3BAD] text-white shadow-lg"
                    : item.active
                    ? "text-[#000000] hover:bg-white/60 hover:shadow-md"
                    : "text-gray-400 hover:bg-white/40 hover:text-gray-600"
                }`;

                return item.external ? (
                  <a
                    key={item.name}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={baseClassName}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: mobileMenuOpen
                        ? `slideInFromRight 0.5s ease-out ${index * 100}ms both`
                        : "none",
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.name}</span>
                      <div className="w-2 h-2 rounded-full bg-current opacity-20"></div>
                    </div>
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={baseClassName}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: mobileMenuOpen
                        ? `slideInFromRight 0.5s ease-out ${index * 100}ms both`
                        : "none",
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.name}</span>
                      <div className="w-2 h-2 rounded-full bg-current opacity-20"></div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-purple-200/30">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <span>Powered by</span>
              <img src={ReefIcon} alt="" width={16} height={16} />
              <span className="font-semibold bg-gradient-to-r from-[#A93185] to-[#5D3BAD] bg-clip-text text-transparent">
                Reef Chain
              </span>
            </div>
          </div>
        </div>
      </div>

      <SettingsPopup isOpen={isSettingsOpen} onClose={toggleSettingsPopup} />

      <style>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
