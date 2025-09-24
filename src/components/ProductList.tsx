import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { QrCode, Package, MapPin, Calendar, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import QRCodeGenerator from "./QRCodeGenerator";

interface Product {
  id: string;
  product_id: string;
  name: string;
  category: string;
  description: string;
  origin_location: string;
  cultivation_method: string;
  certifications: string[];
  qr_code_data: string;
  blockchain_hash: string;
  created_at: string;
}

interface ProductListProps {
  userId: string;
}

const ProductList = ({ userId }: ProductListProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [userId]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("created_by", userId)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch products",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Package className="w-8 h-8 text-muted-foreground mx-auto mb-2 animate-pulse" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center p-8">
        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No products yet</h3>
        <p className="text-muted-foreground">
          Start by adding your first product to the blockchain traceability system
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="font-mono text-xs">
                    {product.product_id}
                  </CardDescription>
                </div>
                <Badge className={`${getCategoryColor(product.category)} text-white`}>
                  {product.category}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Origin:</span>
                  <span>{product.origin_location}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(product.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {product.certifications && product.certifications.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {product.certifications.map((cert, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setSelectedProduct(product)}
                  className="flex-1"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Code
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(product.blockchain_hash, "Blockchain hash")}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                <span className="font-mono break-all">
                  Hash: {product.blockchain_hash.substring(0, 20)}...
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedProduct && (
        <QRCodeGenerator
          product={selectedProduct}
          open={!!selectedProduct}
          onOpenChange={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductList;