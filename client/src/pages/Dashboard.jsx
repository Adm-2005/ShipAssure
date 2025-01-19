import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useUser } from '../context/UserContext';

const Dashboard = () => {
    const { user } = useUser(); 
    return (
        <div className='flex flex-col justify-between min-h-screen'>
            <Navbar />

            {user.role === 'shipper' && (
                <ShipperDashboard />
            )}

            {user.role === 'carrier' && (
                <CarrierDashboard />
            )}

            <Footer />
        </div>
    );
};

export default Dashboard;