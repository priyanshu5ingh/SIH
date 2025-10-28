import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmitBatch } from "@/hooks/useManufacturers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { createTraceLink, createQrImageUrl } from "@/lib/qr";

const Schema = z.object({
  batchId: z.string().min(1, "Required"),
  inputHarvestIds: z.string().min(1, "Required"), // comma-separated
  processDate: z.string().min(1, "Required"),
  facilityId: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof Schema>;

const Manufacturers = () => {
  const form = useForm<FormValues>({ resolver: zodResolver(Schema) });
  const { mutateAsync, isPending } = useSubmitBatch();
  const [pid, setPid] = useState("");
  const [bid, setBid] = useState("");
  const [qrLink, setQrLink] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  const onSubmit = async (values: FormValues) => {
    try {
      const payload = {
        batchId: values.batchId,
        inputHarvestIds: values.inputHarvestIds.split(",").map((s) => s.trim()).filter(Boolean),
        processDate: values.processDate,
        facilityId: values.facilityId || undefined,
        notes: values.notes || undefined,
      };
      const res = await mutateAsync(payload);
      toast.success(`Batch submitted. ID: ${res.batchId}`);
      form.reset();
    } catch (e: any) {
      toast.error(e?.message || "Failed to submit batch");
    }
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Manufacturer Batch Submission</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 max-w-xl">
          <FormField
            control={form.control}
            name="batchId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Batch ID</FormLabel>
                <FormControl>
                  <Input placeholder="BATCH-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="inputHarvestIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Input Harvest IDs (comma-separated)</FormLabel>
                <FormControl>
                  <Input placeholder="HARV-001, HARV-002" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="processDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Process Date (ISO)</FormLabel>
                <FormControl>
                  <Input placeholder="2025-09-24" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="facilityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facility ID (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="FAC-001" {...field} />
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
          <Button type="submit" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit Batch"}
          </Button>
        </form>
      </Form>

      {/* QR Generator */}
      <div className="mt-10 max-w-xl p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Generate Trace QR</h2>
        <div className="grid gap-3">
          <div>
            <label className="block text-sm mb-1">Product ID</label>
            <Input placeholder="AYUR-123" value={pid} onChange={(e) => setPid(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Batch ID (optional)</label>
            <Input placeholder="BATCH-001" value={bid} onChange={(e) => setBid(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={() => {
              if (!pid) { toast.error("Enter Product ID"); return; }
              const link = createTraceLink(pid, bid || undefined);
              const img = createQrImageUrl(link, 240);
              setQrLink(link);
              setQrUrl(img);
            }}>Generate</Button>
            {qrLink && (
              <Button type="button" variant="outline" onClick={() => window.open(qrLink, "_blank")}>Open Trace Link</Button>
            )}
            {qrUrl && (
              <Button type="button" variant="outline" onClick={() => window.print()}>Print</Button>
            )}
          </div>
          {qrUrl && (
            <div className="mt-4 flex items-center gap-4">
              <img src={qrUrl} alt="Trace QR" className="border rounded" />
              <div className="text-xs break-all">{qrLink}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Manufacturers;
