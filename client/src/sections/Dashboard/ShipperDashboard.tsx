import { useUser } from '../../context/UserContext';

const ShipperDashboard = () => {
    const { user } = useUser(); 
    
    return (
        <section>
            <h3>{user.first_name}{' '}{user.last_name}</h3>
            
        </section>
    );
};

export default ShipperDashboard;