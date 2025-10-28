import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const ROLES = ["consumer","farmer","manufacturer","processor","distributor","retailer"] as const;

type Role = typeof ROLES[number];

const Dev = () => {
  const [role, setRole] = useState<Role>("consumer");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [sessionInfo, setSessionInfo] = useState<{ id: string; email?: string | null } | null>(null);
  const [profileInfo, setProfileInfo] = useState<{ role?: string | null } | null>(null);

  const refreshSession = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSessionInfo(null);
      setProfileInfo(null);
      return;
    }
    setSessionInfo({ id: user.id, email: (user.user_metadata as any)?.email || user.email });
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();
    setProfileInfo({ role: data?.role ?? null });
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const applyRole = async () => {
    try {
      setLoading(true);
      // Determine current user if not provided
      let uid = userId;
      if (!uid) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error("No session. Enable VITE_SKIP_AUTH or login.");
          return;
        }
        uid = user.id;
      }
      const { error } = await supabase
        .from("profiles")
        .update({ role })
        .eq("user_id", uid);
      if (error) throw error;
      toast.success(`Role set to ${role}`);
    } catch (e: any) {
      toast.error(e?.message || "Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Developer Shortcuts</CardTitle>
          <CardDescription>Quick links and role tools for demo/testing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Session Debug</div>
              <Button size="sm" variant="outline" onClick={refreshSession}>Refresh</Button>
            </div>
            {sessionInfo ? (
              <div className="text-sm space-y-1">
                <div><span className="text-muted-foreground">User ID:</span> <span className="font-mono">{sessionInfo.id}</span></div>
                <div><span className="text-muted-foreground">Email:</span> {sessionInfo.email || "-"}</div>
                <div><span className="text-muted-foreground">Profile Role:</span> <span className="capitalize">{profileInfo?.role || "(none)"}</span></div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No active session</div>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Button asChild variant="outline"><Link to="/">Home</Link></Button>
            <Button asChild variant="outline"><Link to="/auth">Auth</Link></Button>
            <Button asChild variant="outline"><Link to="/dashboard">Dashboard</Link></Button>
            <Button asChild variant="outline"><Link to="/trace">Trace</Link></Button>
            <Button asChild variant="outline"><Link to="/farmers">Farmers</Link></Button>
            <Button asChild variant="outline"><Link to="/manufacturers">Manufacturers</Link></Button>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm font-medium mb-2">Set Role</div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <select className="border rounded px-2 py-1 text-sm capitalize" value={role} onChange={(e) => setRole(e.target.value as Role)}>
                {ROLES.map(r => <option key={r} value={r} className="capitalize">{r}</option>)}
              </select>
              <Input placeholder="User ID (optional)" value={userId} onChange={(e) => setUserId(e.target.value)} />
              <Button onClick={applyRole} disabled={loading}>{loading ? "Updating..." : "Apply Role"}</Button>
            </div>
            <div className="text-xs text-muted-foreground">If User ID is empty, current session user will be used.</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dev;
