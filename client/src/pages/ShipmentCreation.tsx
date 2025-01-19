import { useState } from 'react';
import Navbar from '../components/Navbar';
import FormSection from '../sections/Shipment/FormSection';
import Footer from '../components/Footer';
import { CustomShipmentFormData } from '../utils/typings';

const ShipmentCreation = () => {
  const [formData, setFormData] = useState<CustomShipmentFormData>({
    origin_code: '',
    destination_code: '',
    cargo_load: 0.0
  });

  const [error, setError] = useState<string>('48');

  return (
    <div className='flex flex-col justify-between min-h-screen'>
        <Navbar />

        <FormSection
            formData={formData}
            setFormData={setFormData}
            setError={setError}
        />

        {error && (
            <span className='text-red-700'>
                {error}
            </span>
        )}

        <Footer />
    </div>
  );
};

export default ShipmentCreation;