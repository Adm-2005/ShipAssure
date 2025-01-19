import { useUser } from '../../context/UserContext';

const CarrierDashboard = () => {
    const { user }  = useUser();

    return (
        <section>
            <h2>{user.first_name}{' '}{user.last_name}</h2>
            {user.type !== 'individual' && (
                <h3></h3>
            )}
        </section>
    );
};

export default CarrierDashboard;