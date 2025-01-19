import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link as ScrollLink } from "react-scroll";

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 right-0 w-full h-16 bg-blue-100 shadow-lg z-50">
      <div className="flex justify-between items-center h-full px-6">
        <p></p>
        <button
          className="text-2xl text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={toggleMenu}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Slide-in Menu */}
      <div
        className={`fixed top-0 right-0 h-full bg-blue-50 text-blue-900 z-40 w-2/3 sm:w-2/3 lg:w-1/3 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          className="absolute top-5 right-5 text-2xl text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out"
          onClick={toggleMenu}
          aria-label="Close menu"
        >
          <FaTimes />
        </button>

        {/* Logo Container */}
        <div className="px-8 pt-6">
          <a href="/">
            <img src="/logo.svg" alt="nav-logo" width={120} height={25} />
          </a>
        </div>

        {/* Navigation Links */}
        <ul className="flex flex-col px-8 mt-10 space-y-6">
          {/* Home Link */}
          <li className="w-full">
            <a href="/" className="block">
              <p className="text-blue-700 text-lg font-semibold tracking-wide hover:text-blue-900 transition-all duration-300">
                Home
              </p>
            </a>
            <div className="border-t border-blue-200 w-full mt-3" />
          </li>

          {/* Shipments Link */}
          <li className="w-full">
            <a
              href="/shipments"  
              className="block cursor-pointer"
            >
              <p className="text-blue-700 text-lg font-semibold tracking-wide hover:text-blue-900 transition-all duration-300">
                Shipments
              </p>
            </a>
            <div className="border-t border-blue-200 w-full mt-3" />
          </li>

          <li className="w-full">
              <p className="text-blue-700 text-lg font-semibold tracking-wide hover:text-blue-900 transition-all duration-300">
                About
              </p>
            <div className="border-t border-blue-200 w-full mt-3" />
          </li>

          <li className="w-full">
            <ScrollLink 
              to="Contact" 
              smooth={true} 
              duration={800} 
              className="block cursor-pointer"
            >
              <p className="text-blue-700 text-lg font-semibold tracking-wide hover:text-blue-900 transition-all duration-300">
                Contact
              </p>
            </ScrollLink>
            <div className="border-t border-blue-200 w-full mt-3" />
          </li>

          {/* Sign In Button */}
          <li className="w-full pt-4">
            <a href='/sign-in'>
            <button className="w-full bg-black text-white font-semibold rounded-lg px-6 py-3 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition duration-300">
              Sign In
            </button>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default MobileNavbar;