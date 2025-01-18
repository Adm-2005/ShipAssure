import { Link } from 'react-router-dom';
import { navLinks } from '../utils/information';
import { navLink } from '../utils/typings';

const Navbar = () => {
  return (
    <nav>
      {/* example */}
      {navLinks.map((link: navLink, index: number) => (
        <Link key={index} to={link.href}>
          {link.name}
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;
