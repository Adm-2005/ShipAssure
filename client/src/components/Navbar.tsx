import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import WalletConnection from './WalletConnection';

const Navbar = () => {
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center font-bold space-x-2">
          ShipAssure
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-8">
          <button
            className="text-gray-800 hover:text-blue-600 transition-colors"
            onClick={() => handleScroll('home')}
          >
            Home
          </button>
          <Link
            to="/shipments"
            className="text-gray-800 hover:text-blue-600 transition-colors"
          >
            Shipments
          </Link>
          <button
            className="text-gray-800 hover:text-blue-600 transition-colors"
            onClick={() => handleScroll('features')}
          >
            About
          </button>
          <button
            className="text-gray-800 hover:text-blue-600 transition-colors"
            onClick={() => handleScroll('footer')}
          >
            Contact
          </button>
          {/* Sign-In Button */}
          <Link to="/pages/signin">
            <Button variant="default" size="sm">
              SIGN IN
            </Button>
          </Link>
          <WalletConnection />
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
