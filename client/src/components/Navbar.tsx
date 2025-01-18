import { Link } from 'react-router-dom';
import { navLinks } from '../utils/information';
import { navLink } from '../utils/typings';
import WalletConnection from '../components/walletConnection';


const Navbar = () => {
  return (
    <nav>
      {/* example */}
      {navLinks.map((link: navLink, index: number) => (
        <Link key={index} to={link.href}>
          {link.name}
        </Link>
      ))}
      <WalletConnection />
    </nav>
  );
};

export default Navbar;
