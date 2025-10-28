import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, MapPin, Calendar, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const demoProduct = {
  product_id: "AYUR-DEMO-001",
  name: "Ashwagandha Root Powder",
  category: "powder",
  description:
    "Premium Ashwagandha root powder sourced from sustainable farms.",
  origin_location: "Nashik, IN",
  cultivation_method: "Organic-certified, shade-dried",
  certifications: ["GMP", "ISO 22000"],
  blockchain_hash:
    "0x2f1c6a5fd3b4a0d9b8e72a9c9c8e7f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e",
  created_at: new Date().toISOString(),
};

const demoEvents = [
  {
    id: "1",
    stage: "cultivation",
    actor_name: "Greenfield Farms",
    location: "Nashik, IN",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    verification_status: "verified",
    notes: "Organic cultivation batch #GF-23",
  },
  {
    id: "2",
    stage: "harvesting",
    actor_name: "Greenfield Farms",
    location: "Nashik, IN",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    verification_status: "verified",
    notes: "Roots harvested and washed",
  },
  {
    id: "3",
    stage: "processing",
    actor_name: "HerbPro Processing Unit",
    location: "Pune, IN",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    verification_status: "verified",
    notes: "Shade-dried and milled",
  },
  {
    id: "4",
    stage: "packaging",
    actor_name: "HerbPro Packaging",
    location: "Pune, IN",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    verification_status: "verified",
    notes: "Nitrogen-flushed pouches",
  },
  {
    id: "5",
    stage: "distribution",
    actor_name: "Ayur Logistics",
    location: "Mumbai, IN",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    verification_status: "verified",
    notes: "Cold-chain maintained",
  },
] as const;

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    herb: "bg-green-500",
    powder: "bg-yellow-500",
    oil: "bg-blue-500",
    capsule: "bg-purple-500",
    tablet: "bg-red-500",
    tincture: "bg-indigo-500",
  };
  return colors[category] || "bg-gray-500";
};

const getStageIcon = (stage: string) => {
  const icons: Record<string, string> = {
    cultivation: "🌱",
    harvesting: "🌾",
    processing: "⚙️",
    packaging: "📦",
    distribution: "🚛",
    retail: "🏪",
  };
  return icons[stage] || "📍";
};

const ProductDemo = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate("/")}> 
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div className="text-center">
              <h1 className="text-lg font-semibold">HerbTrace</h1>
              <p className="text-sm text-muted-foreground">Blockchain Verification (Demo)</p>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Product Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Package className="w-6 h-6" />
                  {demoProduct.name}
                </CardTitle>
                <CardDescription className="font-mono text-base mt-2">
                  Product ID: {demoProduct.product_id}
                </CardDescription>
              </div>
              <Badge className={`${getCategoryColor(demoProduct.category)} text-white text-sm px-3 py-1`}>
                {demoProduct.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-base leading-relaxed">{demoProduct.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Origin Location</p>
                    <p className="font-medium">{demoProduct.origin_location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date Created</p>
                    <p className="font-medium">{new Date(demoProduct.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Cultivation Method</p>
                  <p className="font-medium">{demoProduct.cultivation_method}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {demoProduct.certifications.map((c) => (
                    <Badge key={c} variant="outline">{c}</Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Blockchain Verification */}
            <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950/20">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800 dark:text-green-400">Blockchain Verified</span>
              </div>
              <p className="text-sm font-mono text-green-700 dark:text-green-300 break-all">
                {demoProduct.blockchain_hash}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Supply Chain Journey */}
        <Card>
          <CardHeader>
            <CardTitle>Supply Chain Journey</CardTitle>
            <CardDescription>Follow this product's verified journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
              {demoEvents.map((event) => (
                <div key={event.id} className="relative flex items-start gap-6 pb-8">
                  <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-background border-2 border-border rounded-full text-xl">
                    {getStageIcon(event.stage)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-card border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg capitalize">{event.stage}</h3>
                        <Badge>{event.verification_status}</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">Actor:</span> {event.actor_name}</p>
                        <p><span className="text-muted-foreground">Location:</span> {event.location}</p>
                        <p><span className="text-muted-foreground">Time:</span> {new Date(event.timestamp).toLocaleString()}</p>
                        {event.notes && (
                          <p><span className="text-muted-foreground">Notes:</span> {event.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProductDemo;
