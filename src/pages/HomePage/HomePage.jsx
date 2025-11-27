import Navbar from '../../components/Navbar/Navbar';
import Hero from '../../components/Hero/Hero';
import GamesSection from '../../components/GamesSection/GamesSection';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <Navbar />
      <main>
        <Hero />
        <GamesSection />
      </main>
    </div>
  );
};

export default HomePage;
