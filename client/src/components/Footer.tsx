const Footer = () => {
  return (
    <footer
      id="footer"
      className="bg-gray-900 text-gray-200"
    >
            {/* <img src={FooterImage} alt="Hero Background" className="absolute inset-0 w-full h-full object-cover opacity-70 z-10" /> */}

      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">About ShipAssure</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-white">
                  Company
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white">
                  Careers
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white">
                  Press
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-white">
                  Ocean Freight
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white">
                  Air Freight
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white">
                  Land Transport
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white">
                  Customs Clearance
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Tools</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-white">
                  Rate Calculator
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white">
                  Tracking
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white">
                  Schedules
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white">
                  Documentation
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Connect</h3>
            <p className="text-sm text-gray-400">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>
              &copy; {new Date().getFullYear()} ShipAssure. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="/" className="hover:text-white">
                Privacy Policy
              </a>
              <a href="/" className="hover:text-white">
                Terms of Service
              </a>
              <a href="/" className="hover:text-white">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
