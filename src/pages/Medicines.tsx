import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Demo catalogue of Ayurvedic medicines
// In a real app, fetch from backend or Supabase
const useCatalogue = () =>
  useMemo(
    () => [
      {
        id: "ashwagandha",
        name: "Ashwagandha",
        latin: "Withania somnifera",
        image: "https://images.unsplash.com/photo-1615485737651-6a4b9537f60a?q=80&w=1200&auto=format&fit=crop",
        description:
          "Adaptogenic herb traditionally used to reduce stress, improve sleep quality, and support vitality.",
        details:
          "Ashwagandha is an adaptogen known for supporting the body's resilience to stress. It is often used to promote calm energy, improve sleep quality, and support cognitive function. Traditionally used in Rasayana therapy, it may help modulate cortisol and support endocrine balance. Quality depends on cultivation, drying, and processing methods, and verified supply chain reduces adulteration risk.",
      },
      {
        id: "giloy",
        name: "Giloy",
        latin: "Tinospora cordifolia",
        image: "https://images.unsplash.com/photo-1583340649750-86cf8f0ae3c4?q=80&w=1200&auto=format&fit=crop",
        description:
          "Known for immune support and detoxification, commonly used in fever and metabolic balance.",
        details:
          "Giloy (Guduchi) is used in Ayurveda to support immunity, reduce fever, and balance metabolism. It is considered a 'Rasayana' with hepatoprotective and antioxidant roles. Traceability helps confirm genuine sourcing as morphology can overlap with related species.",
      },
      {
        id: "turmeric",
        name: "Turmeric",
        latin: "Curcuma longa",
        image: "https://images.unsplash.com/photo-1615485290343-48bf95c8d62c?q=80&w=1200&auto=format&fit=crop",
        description:
          "Rich in curcuminoids; supports joint health, digestion, and antioxidant defense.",
        details:
          "Turmeric contains curcumin and related curcuminoids with anti-inflammatory and antioxidant properties. Bioavailability varies by formulation (e.g., piperine co-administration). Verified sourcing ensures low contamination (heavy metals, adulterants) and proper post-harvest handling.",
      },
      {
        id: "amla",
        name: "Amla",
        latin: "Phyllanthus emblica",
        image: "https://images.unsplash.com/photo-1629115913848-4b4790c6900a?q=80&w=1200&auto=format&fit=crop",
        description:
          "Vitamin C-rich Rasayana fruit; supports digestion, skin health, and hair vitality.",
        details:
          "Amla (Amalaki) is a potent source of vitamin C and polyphenols. Used in chyawanprash and tonics, it supports digestion, dermal health, and hair vitality. Supply chain verification preserves nutritional value and authenticity across harvest, drying, and storage.",
      },
      {
        id: "brahmi",
        name: "Brahmi",
        latin: "Bacopa monnieri",
        image: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1200&auto=format&fit=crop",
        description:
          "Memory and cognition support; used traditionally for learning and focus.",
        details:
          "Brahmi supports cognitive function and learning. Verified supply chain helps avoid substitution with Centella species; drying and storage affect bacoside profile.",
      },
      {
        id: "shatavari",
        name: "Shatavari",
        latin: "Asparagus racemosus",
        image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1200&auto=format&fit=crop",
        description:
          "Women’s health adaptogen; supports vitality and hormonal balance.",
        details:
          "Roots used in tonics; quality depends on proper collection and drying. Traceability mitigates adulteration and overharvesting concerns.",
      },
      {
        id: "tulsi",
        name: "Tulsi",
        latin: "Ocimum sanctum",
        image: "https://images.unsplash.com/photo-1524592514086-0f0654e20314?q=80&w=1200&auto=format&fit=crop",
        description:
          "Holy basil used for respiratory and stress support; aromatic adaptogen.",
        details:
          "Tulsi contains eugenol and other actives; freshness and drying affect aromatic profile. Verified farms ensure chemotype consistency.",
      },
      {
        id: "neem",
        name: "Neem",
        latin: "Azadirachta indica",
        image: "https://images.unsplash.com/photo-1621456944516-c3b7e4fb3c38?q=80&w=1200&auto=format&fit=crop",
        description:
          "Traditionally used for skin, oral health, and purification.",
        details:
          "Neem leaves and oil are used in multiple preparations. Chain-of-custody helps validate pesticide-free cultivation and correct part usage.",
      },
    ],
    [],
  );

const summarize = (text: string) => {
  // Lightweight on-device summary heuristic (no external API)
  // Picks key sentences and trims length
  const sentences = text.split(/(?<=[.!?])\s+/).slice(0, 2);
  let s = sentences.join(" ");
  if (s.length > 280) s = s.slice(0, 277) + "...";
  return s;
};

const Medicines = () => {
  const navigate = useNavigate();
  const catalogue = useCatalogue();
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [summaries, setSummaries] = useState<Record<string, string>>({});

  const toggleSummary = (id: string, details: string) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
    // Generate on first open
    setSummaries((prev) => {
      if (prev[id]) return prev; // already generated
      return { ...prev, [id]: summarize(details) };
    });
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Ayurvedic Medicines</h1>
          <p className="text-muted-foreground mt-1">Explore key herbs and formulations with verified supply-chain integrity.</p>
        </div>
        <Button variant="ghost" onClick={() => navigate(-1)}>Back</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalogue.map((item) => (
          <Card key={item.id} className="overflow-hidden group">
            <div className="aspect-video bg-muted overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.svg"; }}
              />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{item.name}</span>
                <Badge variant="outline" className="font-normal">{item.latin}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground min-h-[40px]">{item.description}</p>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => toggleSummary(item.id, item.details)}>
                  {open[item.id] ? "Hide AI Summary" : "AI Summary"}
                </Button>
                <Button size="sm" variant="outline">
                  Learn More
                </Button>
              </div>
              {open[item.id] && (
                <div className="mt-2 p-3 rounded-md border bg-card/50">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">AI Summary</div>
                  <p className="text-sm leading-relaxed">{summaries[item.id]}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Medicines;
