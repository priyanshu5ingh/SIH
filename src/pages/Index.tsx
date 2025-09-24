import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Stakeholders from "@/components/Stakeholders";
import Technology from "@/components/Technology";
import Benefits from "@/components/Benefits";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <HowItWorks />
      <Stakeholders />
      <Technology />
      <Benefits />
      <Footer />
    </div>
  );
};

export default Index;
