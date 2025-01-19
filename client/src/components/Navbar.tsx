import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axios from 'axios';

const Navbar = () => {
  const { isLoggedIn, logout } = useUser();
  const navigate = useNavigate();

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBtnClick = async () => {
    if (isLoggedIn) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/users/auth/logout`,
          {},
          { withCredentials: true }
        );

        if (response.status === 200) {
          logout();
          navigate('/');
        }
      } catch (error) {
        console.error('Logout failed:', error);
      }
    } else {
      navigate('/sign-in');
    }
  };

  console.log('Current login state:', isLoggedIn);

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-sm">
      <div className="text-xl font-bold">
        ShipAssure
      </div>
      <div className="flex items-center space-x-6">
        <button
          onClick={() => handleScroll('home')}
          className="text-gray-600 hover:text-gray-900"
        >
          Home
        </button>

        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-600 hover:text-gray-900"
        >
          Dashboard
        </button>

        <button
          onClick={() => handleScroll('features')}
          className="text-gray-600 hover:text-gray-900"
        >
          About
        </button>

        <button
          onClick={() => handleScroll('footer')}
          className="text-gray-600 hover:text-gray-900"
        >
          Contact
        </button>
        
        <button 
          type="button" 
          onClick={handleBtnClick}
          className="px-3 py-2 bg-[#0E76FD] hover:bg-[#3E76FD] text-white rounded-md"
        >
          {isLoggedIn ? 'Sign Out' : 'Sign In'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;