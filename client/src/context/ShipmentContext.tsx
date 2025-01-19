import React, { createContext, useContext, useState } from 'react';

// Enum for cargo types (optional, based on your requirements)
export enum CargoType {
  Fragile = 'fragile',
  Perishable = 'perishable',
  Electronics = 'electronics',
  General = 'general'
}

interface Shipment {
  id?: string;
  status: string;
  origin: Record<string, any>;
  destination: Record<string, any>;
  cargo_load: number;
  price?: number;
  created_at: string;
  estimated_delivery_date: string;  
  distance: number;                
  cargo_type: CargoType | string;  
}

interface ShipmentContextProps {
  shipments: Shipment[];
  activeStatus: string;
  loading: boolean;
  error: string;
  fetchShipments: (status: string, url: string) => Promise<void>;
  setShipment: (shipment: Shipment) => void;
  setError: (error: string) => void;
}

const ShipmentContext = createContext<ShipmentContextProps | undefined>(undefined);

export const ShipmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [activeStatus, setActiveStatus] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetchShipments = async (status: string, url: string) => {
    setLoading(true);
    setActiveStatus(status);
    setError('');

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch shipments.');
        return;
      }
      const responseData = await response.json();
      setShipments(responseData.data);
    } catch (err) {
      setError((err as Error).message || 'An error occurred while fetching shipments.');
    } finally {
      setLoading(false);
    }
  };

  const setShipment = (shipment: Shipment) => {
    setShipments((prevShipments) => [...prevShipments, shipment]);
  };

  return (
    <ShipmentContext.Provider value={{ shipments, activeStatus, loading, error, fetchShipments, setShipment, setError }}>
      {children}
    </ShipmentContext.Provider>
  );
};

export const useShipment = () => {
  const context = useContext(ShipmentContext);
  if (!context) {
    throw new Error('useShipment must be used within a ShipmentProvider');
  }
  return context;
};
