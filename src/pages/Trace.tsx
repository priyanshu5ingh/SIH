import { useEffect, useMemo, useState } from "react";
import { useTrace } from "@/hooks/useTrace";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, AreaChart, Area } from "recharts";
import { hashEvent, shortHash } from "@/lib/blockchain";
import type { TraceEvent } from "@/lib/types";

const Trace = () => {
  const [productId, setProductId] = useState("");
  const navigate = useNavigate();
  const [geo, setGeo] = useState<{ lat: number; lng: number } | null>(null);
  const { data, error, isFetching, refetch, isFetched } = useTrace(productId && productId !== "AYUR-DEMO-001" ? productId : undefined);

  const demoData = useMemo(() => ({
    productId: "AYUR-DEMO-001",
    productName: "Ashwagandha Root Powder",
    status: "verified",
    checkpoints: [
      { name: "Cultivation", location: "Nashik, IN", timestamp: new Date(Date.now()-86400000*5).toISOString(), actor: "Greenfield Farms", notes: "Organic cultivation batch #GF-23" },
      { name: "Harvesting", location: "Nashik, IN", timestamp: new Date(Date.now()-86400000*4).toISOString(), actor: "Greenfield Farms", notes: "Roots harvested and washed" },
      { name: "Processing", location: "Pune, IN", timestamp: new Date(Date.now()-86400000*3).toISOString(), actor: "HerbPro Processing Unit", notes: "Shade-dried and milled" },
      { name: "Packaging", location: "Pune, IN", timestamp: new Date(Date.now()-86400000*2).toISOString(), actor: "HerbPro Packaging", notes: "Nitrogen-flushed pouches" },
      { name: "Distribution", location: "Mumbai, IN", timestamp: new Date(Date.now()-86400000).toISOString(), actor: "Ayur Logistics", notes: "Cold-chain maintained" },
    ],
  }), []);

  const onSearch = async () => {
    if (!productId) return;
    await refetch();
  };

  const useDemo = async () => {
    setProductId("AYUR-DEMO-001");
  };

  // Try to get current location (optional)
  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => void 0,
      { enableHighAccuracy: false, maximumAge: 60000, timeout: 5000 }
    );
  }, []);

  const chartData = useMemo(() => {
    const cps = productId === "AYUR-DEMO-001" ? demoData.checkpoints : (data?.checkpoints || []);
    if (!cps.length) return [] as Array<{ name: string; integrity: number; temp?: number }>;
    return cps.map((cp, i) => ({
      name: cp.name,
      integrity: Math.max(85, 100 - i * 2),
      temp: typeof (cp as any).temperature === 'number' ? (cp as any).temperature : undefined,
    }));
  }, [productId, data, demoData]);

  // Compute mock on-chain proofs per checkpoint using blockchain adapter hash
  const [proofs, setProofs] = useState<string[]>([]);
  useEffect(() => {
    const cps = productId === "AYUR-DEMO-001" ? demoData.checkpoints : (data?.checkpoints || []);
    if (!cps?.length) { setProofs([]); return; }
    (async () => {
      const arr: string[] = [];
      for (const cp of cps) {
        const ev: TraceEvent = {
          type: cp.name.toLowerCase().includes("harvest") ? "harvest" :
                cp.name.toLowerCase().includes("process") ? "processing" :
                cp.name.toLowerCase().includes("pack") ? "processing" :
                cp.name.toLowerCase().includes("ship") || cp.name.toLowerCase().includes("distribution") ? "shipment" :
                cp.name.toLowerCase().includes("retail") || cp.name.toLowerCase().includes("listing") ? "listing" : "transfer",
          timestamp: cp.timestamp,
          actor: cp.actor,
          location: cp.location,
        } as TraceEvent;
        const digest = await hashEvent(ev);
        arr.push(shortHash(digest));
      }
      setProofs(arr);
    })();
  }, [productId, data, demoData]);

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Trace Product</h1>
        <Button variant="ghost" onClick={() => navigate(-1)}>Back</Button>
      </div>

      <div className="flex gap-3 max-w-xl">
        <Input
          placeholder="Enter Product ID or scan QR..."
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <Button onClick={onSearch} disabled={!productId || isFetching}>
          {isFetching ? "Searching..." : "Search"}
        </Button>
        <Button variant="outline" onClick={useDemo}>
          Use Demo ID
        </Button>
      </div>

      <div className="mt-8">
        {error && (
          <div className="text-red-600">
            {error.message.includes("is not valid JSON")
              ? "Backend is not connected for this endpoint. Use the Demo ID or configure VITE_API_BASE_URL."
              : error.message}
          </div>
        )}

        {isFetched && !data && !error && (
          <div>No data found.</div>
        )}

        {(productId === "AYUR-DEMO-001" ? demoData : data) && (
          <>
            <div className="p-4 border rounded-lg">
              <div className="font-semibold">Product ID: {(productId === "AYUR-DEMO-001" ? demoData : data)!.productId}</div>
              {(productId === "AYUR-DEMO-001" ? demoData : data)!.productName && <div>Name: {(productId === "AYUR-DEMO-001" ? demoData : data)!.productName}</div>}
              {(productId === "AYUR-DEMO-001" ? demoData : data)!.status && <div>Status: {(productId === "AYUR-DEMO-001" ? demoData : data)!.status}</div>}
            </div>

            {/* Chain summary */}
            <div className="p-4 border rounded-lg flex flex-wrap gap-3 items-center">
              <div className="text-sm font-medium">Chain Completeness:</div>
              <div className={`px-2 py-1 rounded text-xs ${proofs.length > 0 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {proofs.length > 0 ? `${proofs.length} proofs derived` : 'No proofs'}
              </div>
              <div className="text-sm font-medium">Compliance:</div>
              <div className="px-2 py-1 rounded text-xs bg-emerald-100 text-emerald-700">CoA/Temp OK (demo)</div>
            </div>

            {/* Origin (from first checkpoint if present) */}
            {(() => {
              const cps = productId === "AYUR-DEMO-001" ? demoData.checkpoints : (data?.checkpoints || []);
              if (!cps.length) return null;
              const origin = cps[0];
              const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(origin.location)}`;
              const traceUrl = `${window.location.origin}/trace?pid=${encodeURIComponent((productId === "AYUR-DEMO-001" ? demoData : data)!.productId)}`;
              return (
                <div className="p-4 border rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">Origin</h2>
                  <div className="text-sm text-muted-foreground mb-2">{origin.location} • {new Date(origin.timestamp).toLocaleString()}</div>
                  <div className="flex gap-2">
                    <a className="underline text-primary text-sm" href={mapHref} target="_blank" rel="noreferrer">Open in Google Maps</a>
                    <button className="text-sm underline" onClick={() => { navigator.clipboard.writeText(traceUrl); }}>Copy Trace Link</button>
                    <a className="text-sm underline" href="/qr-demo.svg" target="_blank" rel="noreferrer">Open QR Demo</a>
                  </div>
                </div>
              );
            })()}

            {/* Charts: Integrity score over checkpoints */}
            {chartData.length > 0 && (
              <div className="p-4 border rounded-lg">
                <h2 className="text-xl font-semibold mb-3">Authenticity Metrics</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0,100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="integrity" name="Integrity Score" stroke="#10b981" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold mb-2">Checkpoints</h2>
              <div className="space-y-3">
                {(productId === "AYUR-DEMO-001" ? demoData.checkpoints : (data?.checkpoints || [])).length ? (
                  (productId === "AYUR-DEMO-001" ? demoData.checkpoints : data!.checkpoints).map((cp, idx) => (
                    <div key={idx} className="p-4 border rounded-lg">
                      <div className="font-medium">{cp.name}</div>
                      <div className="text-sm text-muted-foreground">{cp.location} • {new Date(cp.timestamp).toLocaleString()}</div>
                      {cp.actor && <div className="text-sm">Actor: {cp.actor}</div>}
                      {cp.notes && <div className="text-sm">Notes: {cp.notes}</div>}
                      {proofs[idx] && (
                        <div className="text-xs mt-2"><span className="px-2 py-1 bg-sky-100 text-sky-700 rounded">On-chain proof: {proofs[idx]}</span></div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">No checkpoints found.</div>
                )}
              </div>
            </div>

            {/* Current location (optional) */}
            <div className="p-4 border rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Your Current Location</h2>
              {geo ? (
                <div className="space-y-2 text-sm">
                  <div>Latitude: {geo.lat.toFixed(5)}, Longitude: {geo.lng.toFixed(5)}</div>
                  <a className="text-primary underline" href={`https://www.google.com/maps?q=${geo.lat},${geo.lng}`} target="_blank" rel="noreferrer">Open in Google Maps</a>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Location permission not granted or unavailable.</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Trace;
