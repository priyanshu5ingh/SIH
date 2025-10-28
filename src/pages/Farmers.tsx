import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmitHarvest } from "@/hooks/useFarmers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { anchorToChain, shortHash } from "@/lib/blockchain";
import type { GeoPoint, HarvestEvent } from "@/lib/types";

const Schema = z.object({
  herbName: z.string().min(1, "Required"),
  quantity: z.coerce.number().positive("Must be > 0"),
  unit: z.string().min(1, "Required"),
  harvestDate: z.string().min(1, "Required"),
  location: z.string().min(1, "Required"),
  farmerId: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof Schema>;

const Farmers = () => {
  const form = useForm<FormValues>({ resolver: zodResolver(Schema), defaultValues: { unit: "kg" } });
  const { mutateAsync, isPending } = useSubmitHarvest();
  const [geo, setGeo] = useState<GeoPoint | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  const captureLocation = () => {
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation not supported in this browser");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracyMeters: pos.coords.accuracy });
        setGeoLoading(false);
      },
      (err) => {
        toast.error(err.message || "Failed to get location");
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const payload = {
        herbName: values.herbName,
        quantity: values.quantity,
        unit: values.unit,
        harvestDate: values.harvestDate,
        location: values.location,
        farmerId: values.farmerId || undefined,
        notes: values.notes || undefined,
        geo: geo || undefined,
      } satisfies import("@/lib/types").HarvestSubmission;

      const res = await mutateAsync(payload);

      // Anchor a HARVEST_EVENT to the (mock) blockchain adapter
      const ev: HarvestEvent = {
        type: "harvest",
        timestamp: new Date(values.harvestDate).toISOString(),
        actor: values.farmerId || "Farmer",
        location: values.location,
        geo: geo || undefined,
        lotId: res.harvestId,
        herbName: values.herbName,
        quantity: values.quantity,
        unit: values.unit,
      };
      const proof = await anchorToChain(ev);

      toast.success(`Harvest submitted • On-chain: ${shortHash(proof.txHash)}`);
      form.reset();
      setGeo(null);
    } catch (e: any) {
      toast.error(e?.message || "Failed to submit harvest");
    }
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Farmer Harvest Submission</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 max-w-xl">
          <FormField
            control={form.control}
            name="herbName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Herb Name</FormLabel>
                <FormControl>
                  <Input placeholder="Ashwagandha" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <Input placeholder="kg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="harvestDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Harvest Date (ISO)</FormLabel>
                <FormControl>
                  <Input placeholder="2025-09-24" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Nashik, IN" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="farmerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Farmer ID (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="FARM-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Any remarks..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={captureLocation} disabled={geoLoading}>
              {geoLoading ? "Getting location..." : "Use my location"}
            </Button>
            {geo && (
              <div className="text-xs text-muted-foreground">
                Lat {geo.lat.toFixed(5)}, Lng {geo.lng.toFixed(5)}{geo.accuracyMeters ? ` • ±${Math.round(geo.accuracyMeters)}m` : ""}
              </div>
            )}
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit Harvest"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Farmers;
