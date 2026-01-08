import Navbar from '../../components/Navbar/Navbar';
import Hero from '../../components/Hero/Hero';
import GamesSection from '../../components/GamesSection/GamesSection';
import ChatBot from '../../components/ChatBot/ChatBot';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <Navbar />
      <main>
        <Hero />
        <GamesSection />
      </main>
      <ChatBot />
    </div>
  );
};

export default HomePage;
