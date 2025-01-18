import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { FeaturesSection } from '../sections/Hero/FeaturesSection';
import Hero from '../assets/hero.jpg';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [from, setFrom] = useState(''); // State to store "From" input value
  const [to, setTo] = useState(''); // State to store "To" input value
  const navigate = useNavigate(); // Hook to handle navigation

  // Handle the form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form default submission

    // Validate if both "From" and "To" fields are filled
    if (from.trim() && to.trim()) {
      navigate('/pages/CreateShipmentForm'); // Navigate to CreateShipmentForm page (adjust path accordingly)
    } else {
      alert("Please fill in both the 'From' and 'To' fields."); // Alert if required fields are not filled
    }
  };

  return (
    <div className="flex flex-col min-h-screen justify-between">
      {/* Hero Section */}
      <section className="grid md:grid-cols-2 gap-8 px-8 py-16 bg-gradient-to-r from-gray-50 via-white to-gray-100 relative">
        {/* Left Content */}
        <div className="flex flex-col justify-center space-y-6 z-10">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-gray-800">
            Where <span className="text-blue-600">Quality</span> and{' '}
            <span className="text-blue-600">Security</span> Converge for
            <br /> Enterprise Excellence
          </h1>
          <p className="text-lg text-gray-600 max-w-xl">
            Streamline your logistics operations with innovative solutions
            tailored for your business needs.
          </p>
          <div className="space-y-4">
            {/* Inputs */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="From"
                  className="w-full p-4 border rounded-lg shadow-sm bg-gray-100 focus:ring focus:ring-blue-500 focus:outline-none"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)} // Handle input change for "From"
                  required
                />
                <input
                  type="text"
                  placeholder="To"
                  className="w-full p-4 border rounded-lg shadow-sm bg-gray-100 focus:ring focus:ring-blue-500 focus:outline-none"
                  value={to}
                  onChange={(e) => setTo(e.target.value)} // Handle input change for "To"
                  required
                />
              </div>
              {/* CTA Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
              >
                Check Availability
              </button>
            </form>
          </div>
        </div>

        {/* Right Image Section (No overlay as per your request) */}
        <div className="relative flex items-center justify-center">
          <img
            src={Hero}
            alt="Shipping Container"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Footer CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
            Ready to Ship?
          </h2>
          <p className="mb-8 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Get started with SeaRates today and experience seamless shipping
            solutions for your business
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pages/signin">
              <Button variant="secondary" size="lg">
                Get Started
              </Button>
            </Link>
            <Button variant="secondary" size="lg">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
