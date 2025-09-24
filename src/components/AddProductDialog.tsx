import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  category: z.enum(["herb", "powder", "oil", "capsule", "tablet", "tincture"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  originLocation: z.string().min(2, "Origin location is required"),
  cultivationMethod: z.string().min(2, "Cultivation method is required"),
  certifications: z.string().optional(),
});

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

const AddProductDialog = ({ open, onOpenChange, userId }: AddProductDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "herb" as const,
    description: "",
    originLocation: "",
    cultivationMethod: "",
    certifications: "",
  });

  const generateProductId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `HT-${timestamp}-${random}`.toUpperCase();
  };

  const generateBlockchainHash = (productData: any) => {
    // Simulate blockchain hash generation
    const dataString = JSON.stringify(productData);
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `0x${Math.abs(hash).toString(16).padStart(64, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validatedData = productSchema.parse(formData);
      const productId = generateProductId();
      
      const productData = {
        product_id: productId,
        name: validatedData.name,
        category: validatedData.category,
        description: validatedData.description,
        origin_location: validatedData.originLocation,
        cultivation_method: validatedData.cultivationMethod,
        certifications: validatedData.certifications ? validatedData.certifications.split(",").map(cert => cert.trim()) : [],
        created_by: userId,
        qr_code_data: JSON.stringify({
          productId,
          name: validatedData.name,
          category: validatedData.category,
          timestamp: new Date().toISOString(),
        }),
        blockchain_hash: generateBlockchainHash({
          productId,
          ...validatedData,
          timestamp: new Date().toISOString(),
        }),
      };

      const { error } = await supabase
        .from("products")
        .insert([productData]);

      if (error) {
        throw error;
      }

      // Create initial supply chain event for product creation
      const { error: eventError } = await supabase
        .from("supply_chain_events")
        .insert([{
          product_id: (await supabase.from("products").select("id").eq("product_id", productId).single()).data?.id,
          stage: "cultivation",
          actor_id: userId,
          actor_name: "Product Creator",
          location: validatedData.originLocation,
          notes: "Product registered in the system",
          verification_status: "verified",
          blockchain_hash: generateBlockchainHash({
            event: "product_creation",
            productId,
            timestamp: new Date().toISOString(),
          }),
        }]);

      if (eventError) {
        console.error("Error creating initial event:", eventError);
      }

      toast({
        title: "Product added successfully!",
        description: `Product ${productId} has been registered and assigned a blockchain hash.`,
      });

      // Reset form
      setFormData({
        name: "",
        category: "herb",
        description: "",
        originLocation: "",
        cultivationMethod: "",
        certifications: "",
      });
      
      onOpenChange(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error.errors[0].message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add product. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Register a new product in the blockchain traceability system
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Organic Turmeric"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="herb">Herb</option>
                <option value="powder">Powder</option>
                <option value="oil">Oil</option>
                <option value="capsule">Capsule</option>
                <option value="tablet">Tablet</option>
                <option value="tincture">Tincture</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of the product..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="originLocation">Origin Location</Label>
              <Input
                id="originLocation"
                value={formData.originLocation}
                onChange={(e) => setFormData({ ...formData, originLocation: e.target.value })}
                placeholder="e.g., Kerala, India"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cultivationMethod">Cultivation Method</Label>
              <Input
                id="cultivationMethod"
                value={formData.cultivationMethod}
                onChange={(e) => setFormData({ ...formData, cultivationMethod: e.target.value })}
                placeholder="e.g., Organic farming"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="certifications">Certifications (comma-separated)</Label>
            <Input
              id="certifications"
              value={formData.certifications}
              onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
              placeholder="e.g., Organic, Fair Trade, ISO 9001"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding Product..." : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;