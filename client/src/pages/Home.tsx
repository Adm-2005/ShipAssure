import Hero from '../sections/Home/Hero';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <Navbar />

      <Hero />

      <Footer />
    </div>
  );
};

export default Home;
