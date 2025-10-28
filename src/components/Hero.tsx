import { Shield, Leaf, Users, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-white/20 animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 rounded-full bg-white/15 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-20 h-20 rounded-full bg-white/10 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Blockchain-Powered
            <span className="block text-gold">Ayurvedic Traceability</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            From farm to formulation, track every Ayurvedic herb with immutable transparency.
            Ensuring authenticity, sustainability, and consumer trust through blockchain technology.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild className="btn-hero">
              <Link to="/auth">Start Tracking</Link>
            </Button>
            <Button asChild variant="outline" className="btn-outline-hero">
              <Link to="/trace">Learn More</Link>
            </Button>
            <Button asChild variant="secondary" className="btn-outline-hero">
              <Link to="/demo">View Demo</Link>
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <span className="text-white font-medium">Secure Blockchain</span>
            </div>
            
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <span className="text-white font-medium">Herb Tracking</span>
            </div>
            
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Users className="h-8 w-8 text-white" />
              </div>
              <span className="text-white font-medium">Multi-Stakeholder</span>
            </div>
            
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <QrCode className="h-8 w-8 text-white" />
              </div>
              <span className="text-white font-medium">QR Verification</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;