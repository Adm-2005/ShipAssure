import Navbar from '../components/Navbar';
import MobileNavbar from '../components/MobileNavbar';
import Footer from '../components/Footer';
import { useUser } from '../context/UserContext';

const Dashboard = () => {

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 700);
      };
      handleResize();
      window.addEventListener("resize", handleResize);
  
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    const { user } = useUser(); 
    return (
        <div className='flex flex-col justify-between min-h-screen'>
        {isMobile ? <MobileNavbar /> : <Navbar />}
            

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