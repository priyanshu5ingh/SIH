import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, QrCode, Package, MapPin, Calendar, Shield, ExternalLink } from "lucide-react";

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
    stage: string;
    actor_name: string;
    location: string;
    timestamp: string;
    verification_status: string;
  }>;
}

const QRScanner = () => {
  const [productId, setProductId] = useState("");
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [scanCount, setScanCount] = useState(0);

  const handleSearch = async () => {
    if (!productId.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a product ID",
      });
      return;
    }

    setLoading(true);
    try {
      // Fetch product data
      const { data: product, error: productError } = await supabase
        .from("products")
        .select(`
          *,
          supply_chain_events(stage, actor_name, location, timestamp, verification_status)
        `)
        .eq("product_id", productId.trim())
        .single();

      if (productError || !product) {
        toast({
          variant: "destructive",
          title: "Product not found",
          description: `No product found with ID: ${productId}`,
        });
        setProductData(null);
        return;
      }

      // Log the scan for analytics
      const { error: scanError } = await supabase
        .from("qr_scans")
        .insert([{
          product_id: product.id,
          scanner_ip: "unknown", // In a real app, you'd get this from the request
          location: "Web App",
          user_agent: navigator.userAgent,
        }]);

      if (scanError) {
        console.error("Error logging scan:", scanError);
      }

      setProductData(product);
      setScanCount(prev => prev + 1);
      
      toast({
        title: "Product found!",
        description: `Successfully loaded ${product.name}`,
      });

    } catch (error) {
      console.error("Error searching product:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to search for product",
      });
    } finally {
      setLoading(false);
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

  return (
    <div className="space-y-6">
      {/* Scanner Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Product Scanner
          </CardTitle>
          <CardDescription>
            Enter a product ID to view its blockchain-verified information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="productId" className="sr-only">Product ID</Label>
              <Input
                id="productId"
                placeholder="Enter product ID (e.g., HT-ABC123-XYZ)"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
          
          {scanCount > 0 && (
            <div className="text-sm text-muted-foreground">
              Total scans this session: {scanCount}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Information */}
      {productData && (
        <div className="space-y-6">
          {/* Product Details */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    {productData.name}
                  </CardTitle>
                  <CardDescription className="font-mono">
                    {productData.product_id}
                  </CardDescription>
                </div>
                <Badge className={`${getCategoryColor(productData.category)} text-white`}>
                  {productData.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{productData.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Origin:</span> {productData.origin_location}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Created:</span> {new Date(productData.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Cultivation Method:</p>
                <p className="text-sm">{productData.cultivation_method}</p>
              </div>

              {productData.certifications && productData.certifications.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Certifications:</p>
                  <div className="flex flex-wrap gap-1">
                    {productData.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Blockchain Verified</span>
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
                <p className="text-xs font-mono text-muted-foreground mt-2 break-all">
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
                Track this product's journey through the supply chain
              </CardDescription>
            </CardHeader>
            <CardContent>
              {productData.supply_chain_events && productData.supply_chain_events.length > 0 ? (
                <div className="space-y-4">
                  {productData.supply_chain_events
                    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                    .map((event, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 rounded-lg border">
                      <div className="text-2xl">{getStageIcon(event.stage)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium capitalize">{event.stage}</h4>
                          <Badge 
                            variant={event.verification_status === 'verified' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {event.verification_status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.actor_name}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span>📍 {event.location}</span>
                          <span>🕒 {new Date(event.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No supply chain events recorded yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default QRScanner;