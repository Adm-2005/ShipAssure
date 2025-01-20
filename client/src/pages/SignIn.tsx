import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CustomSignInData } from '../utils/typings';
import MobileNavbar from '../components/mobileNav';
import { useUser } from '../context/UserContext.tsx';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<CustomSignInData>({
    email: '',
    password: '',
  });

  const { user, setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/users/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        setUser(data?.data);
        const token = data?.token;
        localStorage.setItem('access_token', token);
  
        navigate('/');
      } else {
        const errorData = await response.json();
        const message = errorData?.message || 'An error occurred. Please try again.';
        setError(message);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError(''); // Clear error on input change
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 700);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen justify-between">
      {isMobile ? <MobileNavbar /> : <Navbar />}

      <section className="flex flex-col gap-7 max-w-md lg:w-[500px] p-6 mx-auto my-[40px] rounded-md bg-[#DBEAFE]">
        <div className="flex flex-col items-center gap-1 mx-auto">
          <h2 className="text-2xl lg:text-3xl text-[#0E76FD] font-bold">Sign In</h2>
          <p className="text-md">Access your account to continue.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-md text-[#0E76FD] font-semibold">
              Email Address*
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="p-3 rounded-md focus:ring-2 ring-[#0E76FD] focus:outline-none"
              aria-label="Email Address"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-md text-[#0E76FD] font-semibold">
              Password*
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className="p-3 rounded-md focus:ring-2 ring-[#0E76FD] focus:outline-none w-full"
                aria-label="Password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`px-3 py-2 mt-4 rounded-md ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0E76FD] hover:bg-[#3E76FD]'
            } w-[150px] lg:w-[200px] mx-auto text-white`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="text-center mt-4">
            <p className="text-md">
              Don't have an account?{' '}
              <Link to="/sign-up" className="text-[#0E76FD]">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </section>

      <Footer />
    </div>
  );
};

export default SignIn;
