import { Tractor, FlaskConical, Factory, ShoppingCart } from "lucide-react";

const Stakeholders = () => {
  const stakeholders = [
    {
      icon: Tractor,
      title: "Farmers & Collectors",
      description: "Register herb collection with geo-tagging, timestamps, and sustainable practices documentation.",
      benefits: ["Premium pricing for certified herbs", "Proof of sustainable practices", "Direct market access"],
      color: "bg-emerald"
    },
    {
      icon: FlaskConical,
      title: "Testing Labs",
      description: "Add quality certificates, purity tests, and compliance data to the blockchain record.",
      benefits: ["Streamlined certification process", "Reduced fraud risk", "Digital compliance tracking"],
      color: "bg-emerald-light"
    },
    {
      icon: Factory,
      title: "Manufacturers",
      description: "Update formulation details, batch processing, and final product information securely.",
      benefits: ["Supply chain transparency", "Regulatory compliance", "Quality assurance"],
      color: "bg-accent"
    },
    {
      icon: ShoppingCart,
      title: "Consumers",
      description: "Scan QR codes to verify product authenticity, sourcing, and complete supply chain history.",
      benefits: ["Product authenticity verification", "Sustainable sourcing transparency", "Health & safety assurance"],
      color: "bg-gold"
    }
  ];

  return (
    <section id="stakeholders" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Multi-Stakeholder <span className="text-gradient">Ecosystem</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every participant in the Ayurvedic supply chain benefits from transparent, 
            secure, and verifiable blockchain-based traceability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {stakeholders.map((stakeholder, index) => (
            <div key={index} className="card-elegant p-8">
              <div className="flex items-start space-x-6">
                <div className={`w-16 h-16 ${stakeholder.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <stakeholder.icon className="h-8 w-8 text-white" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-foreground mb-3">
                    {stakeholder.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {stakeholder.description}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground text-sm uppercase tracking-wide">Key Benefits</h4>
                    <ul className="space-y-2">
                      {stakeholder.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-emerald rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-20 text-center">
          <div className="bg-sage rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-6">Built on Trust & Transparency</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald mb-2">100%</div>
                <div className="text-muted-foreground">Immutable Records</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald mb-2">Real-time</div>
                <div className="text-muted-foreground">Data Tracking</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald mb-2">FHIR</div>
                <div className="text-muted-foreground">Compliant Standards</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stakeholders;