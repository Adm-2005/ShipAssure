import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { CustomSignUpData } from '../utils/typings';
import { useUser } from '../context/UserContext'; 

export default function SignUp() {
  const { setUser } = useUser();  
  const [formData, setFormData] = useState<CustomSignUpData>({
    first_name: '',
    last_name: '',
    email: '',
    role: 'shipper',
    country: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/auth/register`, formData, {
        withCredentials: true, 
      });

      if (response.status === 201) {
        const user = response.data.data;  
        setUser(user); 
        navigate('/onboarding-quiz');  
      }
    } catch (error: any) {
      const { message, error: errorDetails } = error.response?.data || {};
      if (message) {
        setError(message); 
      }
      if (errorDetails) {
        console.error('Error details:', errorDetails); 
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='flex flex-col justify-between min-h-screen'>
      <Navbar />

      <section className='flex flex-col gap-2 max-w-md lg:w-[500px] p-5 mx-auto my-[40px] rounded-md bg-[#DBEAFE]'>
        <div className='flex flex-col items-center gap-1 mx-auto'>
          <h2 className='text-2xl lg:text-3xl text-[#0E76FD] font-bold'>Sign Up</h2>
          <p className='text-md'>Create an account to get started.</p>
        </div>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          {error && <div className='text-red-500 text-sm'>{error}</div>}
          
          <div className='flex gap-4'>
            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor='first_name' className='text-md text-[#0E76FD] font-semibold'>
                First Name*
              </label>
              <input
                id='first_name'
                name='first_name'
                type='text'
                value={formData.first_name}
                onChange={handleChange}
                className='p-3 rounded-md focus:ring-2 ring-[#0E76FD] focus:outline-none w-full'
              />
            </div>

            <div className='flex flex-col gap-1 w-full'>
              <label htmlFor='last_name' className='text-md text-[#0E76FD] font-semibold'>
                Last Name*
              </label>
              <input
                id='last_name'
                name='last_name'
                type='text'
                value={formData.last_name}
                onChange={handleChange}
                className='p-3 rounded-md focus:ring-2 ring-[#0E76FD] focus:outline-none w-full'
              />
            </div>
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='email' className='text-md text-[#0E76FD] font-semibold'>
              Email Address*
            </label>
            <input
              id='email'
              name='email'
              type='email'
              value={formData.email}
              onChange={handleChange}
              className='p-3 rounded-md focus:ring-2 ring-[#0E76FD] focus:outline-none'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='country' className='text-md text-[#0E76FD] font-semibold'>
              Country*
            </label>
            <input
              id='country'
              name='country'
              type='text'
              value={formData.country}
              onChange={handleChange}
              className='p-3 rounded-md focus:ring-2 ring-[#0E76FD] focus:outline-none'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='password' className='text-md text-[#0E76FD] font-semibold'>
              Password*
            </label>
            <div className='relative'>
              <input
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                className='p-3 rounded-md focus:ring-2 ring-[#0E76FD] focus:outline-none w-full'
              />
              <button
                type='button'
                onClick={togglePasswordVisibility}
                className='absolute right-3 top-1/2 transform -translate-y-1/2'
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='role' className='text-md text-[#0E76FD] font-semibold'>
              Role*
            </label>
            <select
              id='role'
              name='role'
              value={formData.role}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFormData({
                  ...formData,
                  role: e.target.value as 'shipper' | 'carrier', 
                })
              }
              className='p-3 rounded-md focus:ring-2 ring-[#0E76FD] focus:outline-none w-full border-2 border-[#0E76FD]'
            >
              <option value='shipper'>Shipper</option>
              <option value='carrier'>Carrier</option>
            </select>

          </div>

          <div className='text-center mt-1'>
            <p className='text-md'>
              Already have an account?{' '}
              <Link to='/sign-in' className='text-[#0E76FD]'>
                Sign In
              </Link>
            </p>
          </div>

          <button
            type='submit'
            className='px-3 py-2 mt-2 rounded-md bg-[#0E76FD] hover:bg-[#3E76FD] w-[150px] lg:w-[200px] mx-auto text-white'
          >
            Sign Up
          </button>
        </form>
      </section>

      <Footer />
    </div>
  );
}
