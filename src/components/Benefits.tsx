import { TrendingUp, Award, Heart, Leaf } from "lucide-react";

const Benefits = () => {
  const benefits = [
    {
      icon: Award,
      title: "Consumer Trust",
      description: "Build unshakeable consumer confidence with complete transparency and verified authenticity of every Ayurvedic product.",
      stats: "95% increase in consumer confidence"
    },
    {
      icon: TrendingUp,
      title: "Market Premium",
      description: "Certified sustainable and traceable herbs command premium pricing, directly benefiting farmers and collectors.",
      stats: "20-30% premium pricing potential"
    },
    {
      icon: Heart,
      title: "Health Assurance",
      description: "Guarantee product safety and purity through comprehensive testing records and quality certifications.",
      stats: "100% quality compliance tracking"
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "Prevent over-harvesting and promote biodiversity conservation through transparent sourcing practices.",
      stats: "NMPB guidelines compliance"
    }
  ];

  const impactMetrics = [
    { label: "Supply Chain Transparency", value: "100%", color: "text-emerald" },
    { label: "Fraud Reduction", value: "85%", color: "text-gold" },
    { label: "Farmer Income Increase", value: "25%", color: "text-emerald-light" },
    { label: "Consumer Satisfaction", value: "95%", color: "text-accent" }
  ];

  return (
    <section id="benefits" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Transformative <span className="text-gradient">Impact</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            HerbTrace delivers measurable benefits across the entire Ayurvedic ecosystem, 
            from farmers to consumers, while supporting environmental sustainability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {benefits.map((benefit, index) => (
            <div key={index} className="card-elegant p-8">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-emerald rounded-xl flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-foreground mb-3">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {benefit.description}
                  </p>
                  
                  <div className="inline-flex items-center px-3 py-1 bg-sage rounded-full">
                    <span className="text-sm font-medium text-emerald">{benefit.stats}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Impact metrics */}
        <div className="bg-white rounded-2xl p-8 shadow-soft">
          <h3 className="text-2xl font-bold text-foreground text-center mb-12">Measurable Impact</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className={`text-4xl font-bold ${metric.color} mb-2`}>
                  {metric.value}
                </div>
                <div className="text-muted-foreground text-sm">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-20 text-center">
          <div className="bg-emerald rounded-2xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Supply Chain?</h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join the future of Ayurvedic traceability with blockchain-powered transparency and consumer trust.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-emerald px-8 py-4 rounded-lg font-semibold hover:bg-white/90 transition-colors">
                Request Demo
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-emerald transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;