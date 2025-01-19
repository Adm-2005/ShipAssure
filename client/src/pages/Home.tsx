import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { FeaturesSection } from '../sections/Hero/FeaturesSection';
import HeroSection from '../components/heroSection';
import Navbar from '../components/Navbar';
import MobileNavbar from '../components/mobileNav';
import Footer from '../components/Footer';

const Home = () => {

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

  return (
    <div 
    className="flex flex-col min-h-screen justify-between"
    >
        {isMobile ? <MobileNavbar /> : <Navbar />}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Footer CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
            Ready to Ship?
          </h2>
          <p className="mb-8 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Get started with SeaRates today and experience seamless shipping
            solutions for your business
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pages/signin">
              <Button variant="secondary" size="lg">
                Get Started
              </Button>
            </Link>
            <Button variant="secondary" size="lg">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
