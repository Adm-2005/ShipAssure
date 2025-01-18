import {Link} from "react-router-dom"
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

const Footer = () => {
  return (
    <footer id="footer" className="bg-gray-900 text-gray-200">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">About ShipAssure</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white">Company</Link></li>
              <li><Link to="/" className="hover:text-white">Careers</Link></li>
              <li><Link to="/" className="hover:text-white">Press</Link></li>
              <li><Link to="/" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white">Ocean Freight</Link></li>
              <li><Link to="/" className="hover:text-white">Air Freight</Link></li>
              <li><Link to="/" className="hover:text-white">Land Transport</Link></li>
              <li><Link to="/" className="hover:text-white">Customs Clearance</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Tools</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white">Rate Calculator</Link></li>
              <li><Link to="/" className="hover:text-white">Tracking</Link></li>
              <li><Link to="/" className="hover:text-white">Schedules</Link></li>
              <li><Link to="/" className="hover:text-white">Documentation</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <Link to="/" className="hover:text-white">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link to="/" className="hover:text-white">
                <Twitter className="h-6 w-6" />
              </Link>
              <Link to="/" className="hover:text-white">
                <Linkedin className="h-6 w-6" />
              </Link>
              <Link to="/" className="hover:text-white">
                <Instagram className="h-6 w-6" />
              </Link>
            </div>
            <p className="text-sm text-gray-400">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} ShipAssure. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/" className="hover:text-white">Privacy Policy</Link>
              <Link to="/" className="hover:text-white">Terms of Service</Link>
              <Link to="/" className="hover:text-white">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
 export default Footer
