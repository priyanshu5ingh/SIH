import { Shield, Database, Smartphone, Globe, Zap, Lock } from "lucide-react";

const Technology = () => {
  const techFeatures = [
    {
      icon: Shield,
      title: "Hyperledger Fabric",
      description: "Permissioned blockchain network ensuring scalability, privacy, and enterprise-grade security for all stakeholders."
    },
    {
      icon: Database,
      title: "FHIR Standards",
      description: "Healthcare interoperability standards adapted for botanical data, ensuring consistent and standardized information exchange."
    },
    {
      icon: Smartphone,
      title: "Low-Bandwidth Solutions",
      description: "SMS gateways and lightweight mobile apps designed for rural areas with limited internet connectivity."
    },
    {
      icon: Globe,
      title: "IoT Integration",
      description: "GPS sensors, environmental monitoring, and automated data capture for real-time supply chain visibility."
    },
    {
      icon: Zap,
      title: "Smart Contracts",
      description: "Automated enforcement of sustainability rules, geo-fencing validation, and quality gate compliance."
    },
    {
      icon: Lock,
      title: "Data Security",
      description: "End-to-end encryption, multi-signature transactions, and role-based access control for data protection."
    }
  ];

  return (
    <section id="technology" className="py-20 bg-forest text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-40 h-40 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 border border-white/15 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-white/10 rounded-full"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Cutting-Edge <span className="text-gold">Technology Stack</span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Built with enterprise-grade blockchain technology, IoT integration, 
            and healthcare-standard data protocols for maximum reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {techFeatures.map((feature, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-gold rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-forest" />
              </div>
              
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-white/80 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Architecture diagram */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center mb-12">System Architecture</h3>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/10 rounded-lg p-4 text-center border border-white/20">
                <div className="font-semibold mb-2">Data Layer</div>
                <div className="text-sm text-white/80">GPS • IoT • Mobile</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center border border-white/20">
                <div className="font-semibold mb-2">Blockchain</div>
                <div className="text-sm text-white/80">Hyperledger Fabric</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center border border-white/20">
                <div className="font-semibold mb-2">Smart Contracts</div>
                <div className="text-sm text-white/80">Validation • Rules</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center border border-white/20">
                <div className="font-semibold mb-2">Interface</div>
                <div className="text-sm text-white/80">Web • Mobile • QR</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-gold text-forest px-6 py-3 rounded-full font-semibold">
                <Shield className="h-5 w-5" />
                <span>End-to-End Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Technology;