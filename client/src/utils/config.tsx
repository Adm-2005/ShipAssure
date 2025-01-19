import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import Error from '../pages/Error';
import SignUp from '../pages/SignUp';
import SignIn from '../pages/SignIn';
import ShipmentCreation from '../pages/ShipmentCreation';
import Onboarding from '../pages/Onboarding';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <Error />,
  },
  {
    path: '/sign-up',
    element: <SignUp />,
  },
  {
    path: '/sign-in',
    element: <SignIn />,
  },
  {
    path: '/create-shipment',
    element: <ShipmentCreation />    
  },
  {
    path: '/onboarding-quiz',
    element: <Onboarding />
  }
]);
