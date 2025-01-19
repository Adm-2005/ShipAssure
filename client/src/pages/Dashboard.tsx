import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MobileNavbar from '../components/mobileNav';
import ShipperDashboard from '../sections/Dashboard/ShipperDashboard';
import CarrierDashboard from '../sections/Dashboard/CarrierDashboard';
import Footer from '../components/Footer';
import { useUser } from '../context/UserContext';

const Dashboard = () => {
  const navigate = useNavigate();
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

  const { user } = useUser();

  useEffect(() => {
    if(!user) {
      navigate('/sign-in');
    }
  }, [user, navigate]);


  return (
    <div className="flex flex-col justify-between min-h-screen bg-[#E4F3FC]">
      {isMobile ? <MobileNavbar /> : <Navbar />}
      {user?.role === 'shipper' && <ShipperDashboard />}
      {user?.role === 'carrier' && <CarrierDashboard />}
      <Footer />
    </div>
  );
};

export default Dashboard;
