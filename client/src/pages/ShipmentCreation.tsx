import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FormSection from '../sections/Shipment/FormSection';
import Footer from '../components/Footer';
import MobileNavbar from '../components/mobileNav';
import { CustomShipmentFormData } from '../utils/typings';
import { useShipment } from '../context/ShipmentContext';

const ShipmentCreation = () => {
  const { setShipment, error, setError } = useShipment();
  const [formData, setFormData] = useState<CustomShipmentFormData>({
    origin_code: '',
    destination_code: '',
    cargo_load: 0.0,
  });

  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit = async () => {
    try {
      setError('');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/shipment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Something went wrong.');
        return;
      }

      const data = await response.json();
      console.log('Shipment created successfully:', data);

      setShipment(data.data.shipment);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while creating the shipment.');
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-screen">
      {isMobile ? <MobileNavbar /> : <Navbar />}

      <FormSection
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        error={error}
      />

      <Footer />
    </div>
  );
};

export default ShipmentCreation;
