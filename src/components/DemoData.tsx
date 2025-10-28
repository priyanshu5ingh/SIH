import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Calendar, Package, Shield } from "lucide-react";

// Simple demo seed tailored to the existing schema used by ProductView and SupplyChainTimeline
// Product ID used for trace demo and public view demo
const DEMO_PRODUCT_ID = "AYUR-DEMO-001";

async function seedDemoProduct() {
  // Check if already exists
  const { data: existing } = await supabase
    .from("products")
    .select("id")
    .eq("product_id", DEMO_PRODUCT_ID)
    .single();

  if (existing) {
    return existing.id as string;
  }

  const now = new Date();
  const { data: product, error } = await supabase
    .from("products")
    .insert([
      {
        product_id: DEMO_PRODUCT_ID,
        name: "Ashwagandha Root Powder",
        category: "powder",
        description: "Premium Ashwagandha root powder sourced from sustainable farms.",
        origin_location: "Nashik, IN",
        cultivation_method: "Organic-certified, shade-dried",
        certifications: ["GMP", "ISO 22000"],
        blockchain_hash: "0x2f1c6a5fd3b4a0d9b8e72a9c9c8e7f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e",
        created_at: now.toISOString(),
      },
    ])
    .select("id")
    .single();

  if (error || !product) throw error || new Error("Failed to create demo product");
  return product.id as string;
}

async function seedDemoEvents(productRowId: string) {
  // Create a simple linear journey with verification
  const base = Date.now();
  const times = [0, 2, 4, 6, 8].map((h) => new Date(base + h * 3600_000).toISOString());

  const records = [
    {
      product_id: productRowId,
      stage: "cultivation",
      actor_name: "Greenfield Farms",
      location: "Nashik, IN",
      timestamp: times[0],
      verification_status: "verified",
      notes: "Organic cultivation batch #GF-23",
      temperature: 24,
      humidity: 62,
      blockchain_hash: "0xabc...cult",
    },
    {
      product_id: productRowId,
      stage: "harvesting",
      actor_name: "Greenfield Farms",
      location: "Nashik, IN",
      timestamp: times[1],
      verification_status: "verified",
      notes: "Roots harvested and washed",
      temperature: 28,
      humidity: 55,
      blockchain_hash: "0xabc...harv",
    },
    {
      product_id: productRowId,
      stage: "processing",
      actor_name: "HerbPro Processing Unit",
      location: "Pune, IN",
      timestamp: times[2],
      verification_status: "verified",
      notes: "Shade-dried and milled",
      temperature: 32,
      humidity: 48,
      blockchain_hash: "0xabc...proc",
    },
    {
      product_id: productRowId,
      stage: "packaging",
      actor_name: "HerbPro Packaging",
      location: "Pune, IN",
      timestamp: times[3],
      verification_status: "verified",
      notes: "Nitrogen-flushed pouches",
      temperature: 26,
      humidity: 45,
      blockchain_hash: "0xabc...pack",
    },
    {
      product_id: productRowId,
      stage: "distribution",
      actor_name: "Ayur Logistics",
      location: "Mumbai, IN",
      timestamp: times[4],
      verification_status: "verified",
      notes: "Cold-chain maintained",
      temperature: 8,
      humidity: 40,
      blockchain_hash: "0xabc...dist",
    },
  ] as const satisfies ReadonlyArray<{
    product_id: string;
    stage: "cultivation" | "harvesting" | "processing" | "packaging" | "distribution" | "retail";
    actor_name: string;
    location: string;
    timestamp: string;
    verification_status: "pending" | "verified" | "completed";
    notes: string;
    temperature: number;
    humidity: number;
    blockchain_hash: string;
  }>;

  const { error } = await supabase.from("supply_chain_events").insert(records as any);
  if (error) throw error;
}

const DemoData = () => {
  const [busy, setBusy] = useState(false);
  const [seeded, setSeeded] = useState(false);

  const seed = async () => {
    setBusy(true);
    try {
      const productRowId = await seedDemoProduct();
      await seedDemoEvents(productRowId);
      setSeeded(true);
      toast({ title: "Demo data ready", description: `Product ID: ${DEMO_PRODUCT_ID}` });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Seeding failed", description: e?.message || "Error" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demo Data</CardTitle>
        <CardDescription>Seed a sample product and supply chain events for demos</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-3">
        <Button onClick={seed} disabled={busy}>
          <Shield className="w-4 h-4 mr-2" />
          {busy ? "Seeding..." : "Seed Demo Data"}
        </Button>
        {seeded && (
          <div className="flex items-center gap-2 text-sm">
            <Package className="w-4 h-4 text-muted-foreground" /> AYUR-DEMO-001
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-3 h-3" /> seeded
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { DEMO_PRODUCT_ID };
export default DemoData;
