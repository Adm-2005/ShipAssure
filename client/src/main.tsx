import './index.css';
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import  Footer  from './components/Footer'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Onboarding from './pages/Onboarding';
import CreateShipmentForm from './pages/CreateShipmentForm';

const Main = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pages/signin" element={<SignIn />} />
            <Route path="/pages/signup" element={<SignUp />} />
            <Route path="/pages/onboarding" element={<Onboarding />} />
            <Route path="/pages/CreateShipmentForm" element={<CreateShipmentForm />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
)

