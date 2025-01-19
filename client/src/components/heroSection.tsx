import { useState } from 'react';
import Hero2 from '../assets/hero2.svg'; // Update the path to the actual location of your Hero image
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { MapPin, ArrowRight } from 'lucide-react';
// /user/update  -> PUT
const HeroSection = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (from.trim() && to.trim()) {
      if (isLoggedIn) {
        navigate('/create-shipment');
      } else {
        alert('Please log in to create a shipment.');
        navigate('/sign-in');
      }
    } else {
      alert("Please fill in both the 'From' and 'To' fields.");
    }
  };

  return (
    <section className="relative min-h-[80vh] px-8 py-16 bg-gradient-to-r from-gray-50 via-white to-gray-100">
      {/* Background Image */}
      <img src={Hero2} alt="Hero Background" className="absolute inset-0 w-full h-full object-cover opacity-70" />

      {/* Subtle overlay pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] opacity-90" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-8 text-center">
        {/* Badge */}
        <div className="animate__animated animate__fadeIn">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-50 text-blue-600">
            Global Logistics Solutions
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-gray-800 animate__animated animate__fadeInDown">
          Where <span className="text-blue-600 relative">
            Quality
            <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-200 transform -skew-x-12"></span>
          </span> and{' '}
          <span className="text-blue-600 relative">
            Security
            <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-200 transform -skew-x-12"></span>
          </span> Converge for
          <br /> Enterprise Excellence
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-600 max-w-xl animate__animated animate__fadeIn">
          Streamline your logistics operations with innovative solutions
          tailored for your business needs.
        </p>

        {/* Form */}
        <div className="w-full max-w-2xl animate__animated animate__fadeIn">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="From"
                  className="w-full pl-10 p-4 border rounded-lg shadow-sm bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  required
                />
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="To"
                  className="w-full pl-10 p-4 border rounded-lg shadow-sm bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition duration-300 ease-in-out transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Create Shipment
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="flex justify-center gap-6 mt-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>Real-time Tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>Global Coverage</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
