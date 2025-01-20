import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useShipment } from '../../context/ShipmentContext';
import WalletConnection from '../../components/walletConnection';
import { useUser } from '../../context/UserContext';

const ShipperDashboard = () => {
  const { shipments, activeStatus, loading, error, fetchShipments } = useShipment();
  const { user } = useUser();

  const statusTabs = user?.shipper_id
    ? [
        { name: 'All', url: `${import.meta.env.VITE_BACKEND_URL}/shipments/shipper/${user.shipper_id}` },
        { name: 'Waiting', url: `${import.meta.env.VITE_BACKEND_URL}/shipments/shipper/${user.shipper_id}/waiting` },
        { name: 'Active', url: `${import.meta.env.VITE_BACKEND_URL}/shipments/shipper/${user.shipper_id}/active` },
        { name: 'Delayed', url: `${import.meta.env.VITE_BACKEND_URL}/shipments/shipper/${user.shipper_id}/delayed` },
        { name: 'Delivered', url: `${import.meta.env.VITE_BACKEND_URL}/shipments/shipper/${user.shipper_id}/delivered` },
      ]
    : [];

  useEffect(() => {
    if (user?.shipper_id && statusTabs.length > 0) {
      fetchShipments(statusTabs[0].name, statusTabs[0].url);
    }
  }, [user?.shipper_id]);

  const handleTabChange = (name: string, url: string) => {
    fetchShipments(name, url);
  };

  return (
    <section className="flex flex-col gap-8 w-full lg:w-[90vw] px-4 py-[40px] lg:px-[5vw] mx-auto">
      <div className="flex justify-between items-center border p-8 rounded-md bg-[#C5E3F7]">
        <div className="flex flex-col max-w-2xl gap-2">
          <h2 className="text-3xl text-[#0E76FD] font-bold">{user.first_name} {user.last_name}</h2>
          <h3 className="text-xl">{user.org_name}</h3>
          <p>{user.address}</p>
        </div>
        <WalletConnection />
      </div>

      <div className="flex flex-col">
        <div className="flex w-full justify-center items-center">
          {statusTabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => handleTabChange(tab.name, tab.url)}
              className={`${
                activeStatus === tab.name ? 'bg-[#0E76FD] text-white' : 'bg-[#C5E3F7] text-slate-800'
              } md:w-[90px] px-3 py-2 first-of-type:rounded-l-md last-of-type:rounded-r-md`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center mt-5 gap-2">
            <div className="rounded-full h-[35px] w-[35px] bg-transparent border-l-2 border-[#0E76FD] animate-spin"></div>
            <p>Loading...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col gap-2">
            <p className="text-red-500 mx-auto mt-5">{error}</p>
            <Link to="/create-shipment" className="mx-auto">
              <button className="bg-[#0E76FD] w-[180px] mx-auto px-3 py-2 text-white rounded-md">
                Add +
              </button>
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shipments.length === 0 ? (
              <p className="text-black-500 mx-auto mt-5">No shipments added yet.</p>
            ) : (
              shipments.map((shipment) => (
                <div key={shipment.id} className="border p-4 rounded shadow">
                  <h3 className="text-lg font-semibold">{shipment.cargo_type}</h3>
                  <p>Status: {shipment.status}</p>
                  <p>Origin: {shipment.origin.city}, {shipment.origin.country}</p>
                  <p>Destination: {shipment.destination.city}, {shipment.destination.country}</p>
                  <p>Distance: {shipment.distance} km</p>
                  <p>Estimated Delivery: {new Date(shipment.estimated_delivery_date).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ShipperDashboard;
