import React, { useState, useEffect } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import { Link, useLocation } from "react-router-dom";
import LoginIcon from '@mui/icons-material/Login';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginActive, setIsLoginActive] = useState(!!localStorage.getItem('token'));
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const user = localStorage.getItem('token');
    setIsLoginActive(!!user);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);

    const handleStorageChange = () => {
      const user = localStorage.getItem('token');
      setIsLoginActive(!!user);
    };
    window.addEventListener("storage", handleStorageChange);

    const handleCustomStorageChange = () => {
      const user = localStorage.getItem('token');
      setIsLoginActive(!!user);
    };
    window.addEventListener("storageChange", handleCustomStorageChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("storageChange", handleCustomStorageChange);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md" : "bg-neutral-950"}`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          to="/"
          className={`text-2xl font-bold ${isScrolled ? "text-dark-600" : "text-white"}`}
        >
          Đinh Văn Thiện
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-10">
          {[
            { to: "/home", label: "Trang chủ" },
            { to: "/course", label: "Khóa Học" },
            { to: "/document", label: "Tài Liệu" }
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`text-lg font-medium hover:text-blue-400 transition-colors ${isScrolled ? "text-gray-700" : "text-white"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Contact Icons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/cart"
            className={`hover:text-blue-400 transition-colors ${isScrolled ? "text-gray-700" : "text-white"}`}
          >
            <div className="relative">
              <ShoppingCartIcon fontSize="medium" />
            </div>
          </Link>

          {!isLoginActive ? (
            <Link
              to="/login"
              className={`hover:text-blue-400 transition-colors ${isScrolled ? "text-gray-700" : "text-white"}`}
            >
              <LoginIcon fontSize="medium" />
            </Link>
          ) : (
            <Link
              to="/user/profile"
              className={`hover:text-blue-400 transition-colors ${isScrolled ? "text-gray-700" : "text-white"}`}
            >
              <PersonIcon fontSize="medium" />
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <svg
            className={`w-8 h-8 ${isScrolled ? "text-blue-600" : "text-white"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <nav className="container mx-auto px-4 py-6 flex flex-col space-y-4">
            {[
              { to: "/home", label: "Trang chủ" },
              { to: "/course", label: "Khóa Học" },
              { to: "/document", label: "Tài Liệu" },
               { to: "/login", label: "Đăng nhập" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors"
                onClick={toggleMenu}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;