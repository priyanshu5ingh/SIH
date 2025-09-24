import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Package, MapPin, Calendar, Shield, ExternalLink, QrCode } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProductData {
  id: string;
  product_id: string;
  name: string;
  category: string;
  description: string;
  origin_location: string;
  cultivation_method: string;
  certifications: string[];
  blockchain_hash: string;
  created_at: string;
  supply_chain_events: Array<{
    id: string;
    stage: string;
    actor_name: string;
    location: string;
    timestamp: string;
    verification_status: string;
    notes: string | null;
    temperature: number | null;
    humidity: number | null;
  }>;
}

const ProductView = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      fetchProductData();
      logScan();
    }
  }, [productId]);

  const fetchProductData = async () => {
    try {
      const { data: product, error } = await supabase
        .from("products")
        .select(`
          *,
          supply_chain_events(*)
        `)
        .eq("product_id", productId)
        .single();

      if (error || !product) {
        toast({
          variant: "destructive",
          title: "Product not found",
          description: `No product found with ID: ${productId}`,
        });
        return;
      }

      setProductData(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load product data",
      });
    } finally {
      setLoading(false);
    }
  };

  const logScan = async () => {
    try {
      // Get product ID first
      const { data: product } = await supabase
        .from("products")
        .select("id")
        .eq("product_id", productId)
        .single();

      if (product) {
        await supabase
          .from("qr_scans")
          .insert([{
            product_id: product.id,
            scanner_ip: "unknown",
            location: "Public View",
            user_agent: navigator.userAgent,
          }]);
      }
    } catch (error) {
      console.error("Error logging scan:", error);
    }
  };

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Blockchain hash copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading product information...</p>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <QrCode className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The product ID "{productId}" could not be found in our system.
          </p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return Home
          </Button>
        </div>
      </div>
    );
  }

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
              <p className="text-sm text-muted-foreground">Blockchain Verification</p>
            </div>
            <div className="w-20"></div> {/* Spacer for center alignment */}
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
                  {productData.name}
                </CardTitle>
                <CardDescription className="font-mono text-base mt-2">
                  Product ID: {productData.product_id}
                </CardDescription>
              </div>
              <Badge className={`${getCategoryColor(productData.category)} text-white text-sm px-3 py-1`}>
                {productData.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-base leading-relaxed">{productData.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Origin Location</p>
                    <p className="font-medium">{productData.origin_location}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date Created</p>
                    <p className="font-medium">{new Date(productData.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Cultivation Method</p>
                  <p className="font-medium">{productData.cultivation_method}</p>
                </div>

                {productData.certifications && productData.certifications.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Certifications</p>
                    <div className="flex flex-wrap gap-2">
                      {productData.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Blockchain Verification */}
            <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800 dark:text-green-400">
                    Blockchain Verified
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(productData.blockchain_hash)}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Copy Hash
                </Button>
              </div>
              <p className="text-sm font-mono text-green-700 dark:text-green-300 break-all">
                {productData.blockchain_hash}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Supply Chain Journey */}
        <Card>
          <CardHeader>
            <CardTitle>Supply Chain Journey</CardTitle>
            <CardDescription>
              Follow this product's verified journey through the supply chain
            </CardDescription>
          </CardHeader>
          <CardContent>
            {productData.supply_chain_events && productData.supply_chain_events.length > 0 ? (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
                
                {productData.supply_chain_events
                  .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                  .map((event, index) => (
                  <div key={event.id} className="relative flex items-start gap-6 pb-8">
                    {/* Timeline dot */}
                    <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-background border-2 border-border rounded-full text-xl">
                      {getStageIcon(event.stage)}
                    </div>
                    
                    {/* Event content */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-card border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg capitalize">{event.stage}</h3>
                          <Badge 
                            variant={event.verification_status === 'verified' ? 'default' : 'secondary'}
                          >
                            {event.verification_status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <p><span className="text-muted-foreground">Actor:</span> {event.actor_name}</p>
                          <p><span className="text-muted-foreground">Location:</span> {event.location}</p>
                          <p><span className="text-muted-foreground">Time:</span> {new Date(event.timestamp).toLocaleString()}</p>
                          
                          {(event.temperature || event.humidity) && (
                            <p>
                              <span className="text-muted-foreground">Conditions:</span>{" "}
                              {event.temperature && `${event.temperature}°C`}
                              {event.temperature && event.humidity && ", "}
                              {event.humidity && `${event.humidity}% RH`}
                            </p>
                          )}
                          
                          {event.notes && (
                            <p><span className="text-muted-foreground">Notes:</span> {event.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Journey Data</h3>
                <p className="text-muted-foreground">
                  No supply chain events have been recorded for this product yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProductView;