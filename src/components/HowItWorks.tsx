import { MapPin, TestTube, Package, Smartphone } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: MapPin,
      title: "Geo-Tagged Collection",
      description: "Farmers and wild collectors register herb collection with precise GPS coordinates and timestamps on the blockchain.",
      color: "emerald"
    },
    {
      icon: TestTube,
      title: "Lab Testing & Verification",
      description: "Quality labs add test results, purity certificates, and compliance data to the immutable blockchain record.",
      color: "emerald-light"
    },
    {
      icon: Package,
      title: "Processing & Manufacturing", 
      description: "Processors and manufacturers update formulation details, batch information, and regulatory compliance data.",
      color: "accent"
    },
    {
      icon: Smartphone,
      title: "Consumer Verification",
      description: "End consumers scan QR codes to access complete provenance history, ensuring authenticity and sustainability.",
      color: "gold"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How <span className="text-gradient">HerbTrace</span> Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A complete end-to-end traceability solution powered by blockchain technology, 
            smart contracts, and FHIR-compliant data standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-emerald to-emerald-light transform -translate-x-4 z-0"></div>
              )}
              
              <div className="card-elegant p-8 text-center relative z-10 h-full">
                <div className="relative mb-6">
                  <div className={`w-20 h-20 mx-auto rounded-full bg-${step.color} flex items-center justify-center mb-4 animate-pulse-glow`}>
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gold rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Blockchain visualization */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-8">Powered by Blockchain Technology</h3>
          <div className="flex justify-center items-center space-x-4 flex-wrap">
            {[1, 2, 3, 4, 5].map((block) => (
              <div key={block} className="flex items-center">
                <div className="w-16 h-16 bg-emerald rounded-lg flex items-center justify-center text-white font-bold shadow-soft">
                  {block}
                </div>
                {block < 5 && (
                  <div className="w-8 h-0.5 bg-emerald-light"></div>
                )}
              </div>
            ))}
          </div>
          <p className="text-muted-foreground mt-4">Immutable • Transparent • Secure</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;