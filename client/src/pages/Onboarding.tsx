import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useUser } from '../context/UserContext';

type OrganizationDetails = {
  org_name: string;
  type: 'individual' | 'small business' | 'large business';
  address: string;
  modes?: string[];
  industry?: string;
};

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, setUser } = useUser();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [organizationDetails, setOrganizationDetails] = useState<OrganizationDetails>({
    org_name: '',
    type: 'small business',
    address: '',
    modes: [],
    industry: '',
  });

  const handleModeToggle = (mode: string) => {
    const updatedModes = organizationDetails.modes?.includes(mode)
      ? organizationDetails.modes.filter((m) => m !== mode)
      : [...(organizationDetails.modes || []), mode];
    setOrganizationDetails({ ...organizationDetails, modes: updatedModes });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.log('Access Token missing.');
      }
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/update`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(organizationDetails),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Something went wrong!');
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/sign-in');
    }
  }, [isLoggedIn, navigate]);

  const transportModes = ['Air', 'Water', 'Railway', 'Road'];

  return (
    <div className="flex flex-col justify-between min-h-screen bg-gray-50">
      <Navbar />
      <section className="flex flex-col items-center py-8 px-4">
        <div className="text-center mb-6">
          <h3 className="text-2xl md:text-3xl lg:text-5xl text-[#0E76FD] font-bold">User Quiz</h3>
          <p className="text-slate-700">Help us cater to your needs better.</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md flex flex-col gap-6"
        >
          <div>
            <label htmlFor="org_name" className="block text-sm font-medium text-gray-700">
              Organization Name
            </label>
            <input
              type="text"
              id="org_name"
              name="org_name"
              value={organizationDetails.org_name}
              onChange={(e) =>
                setOrganizationDetails({ ...organizationDetails, org_name: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              placeholder="Enter your organization name"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Organization Type
            </label>
            <select
              id="type"
              name="type"
              value={organizationDetails.type}
              onChange={(e) =>
                setOrganizationDetails({
                  ...organizationDetails,
                  type: e.target.value as 'individual' | 'small business' | 'large business',
                })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
            >
              <option value="individual">Individual</option>
              <option value="small business">Small Business</option>
              <option value="large business">Large Business</option>
            </select>
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={organizationDetails.address}
              onChange={(e) =>
                setOrganizationDetails({ ...organizationDetails, address: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              placeholder="Enter your address"
            />
          </div>
          <div>
            {user?.role === 'shipper' ? (
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                  Industry
                </label>
                <input
                  type="text"
                  id="industry"
                  name="industry"
                  value={organizationDetails.industry || ''}
                  onChange={(e) =>
                    setOrganizationDetails({ ...organizationDetails, industry: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                  placeholder="Enter your industry"
                />
              </div>
            ) : (
              <div>
                <label htmlFor="modes" className="block text-sm font-medium text-gray-700">
                  Modes of Transport
                </label>
                <div className="flex flex-wrap gap-4 mt-2">
                  {transportModes.map((mode) => (
                    <div key={mode} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={mode}
                        checked={organizationDetails.modes?.includes(mode)}
                        onChange={() => handleModeToggle(mode)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 p-2"
                      />
                      <label htmlFor={mode} className="text-sm text-gray-700">
                        {mode}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
              loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </section>
      <Footer />
    </div>
  );
};

export default OnboardingFlow;
