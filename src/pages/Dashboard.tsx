import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Leaf, Package, QrCode, BarChart3, LogOut, Plus } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart as RBarChart, Bar } from "recharts";
import AddProductDialog from "@/components/AddProductDialog";
import ProductList from "@/components/ProductList";
import SupplyChainTimeline from "@/components/SupplyChainTimeline";
import QRScanner from "@/components/QRScanner";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  company_name: string | null;
  role: string;
  phone: string | null;
  address: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const allowRoleSwitch = (import.meta as any).env?.VITE_ALLOW_ROLE_SWITCH === 'true';
  const [switching, setSwitching] = useState(false);
  const [newRole, setNewRole] = useState<string>('consumer');

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  // After profile loads, choose default tab based on role
  useEffect(() => {
    if (profile) {
      setActiveTab("tracking");
    }
  }, [profile]);

  // Keep role switcher UI in sync with loaded profile
  useEffect(() => {
    if (profile?.role) {
      setNewRole(profile.role);
    }
  }, [profile?.role]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error || !data) {
        // If profile does not exist yet, create it from auth metadata
        const meta = user?.user_metadata as { full_name?: string; company_name?: string; role?: string } | undefined;
        const newProfile: Profile = {
          id: user!.id,
          user_id: user!.id,
          full_name: meta?.full_name ?? null,
          company_name: meta?.company_name ?? null,
          role: meta?.role || "consumer",
          phone: null,
          address: null,
        };
        const { data: upserted, error: upErr } = await supabase
          .from("profiles")
          .upsert({
            user_id: newProfile.user_id,
            full_name: newProfile.full_name,
            company_name: newProfile.company_name,
            role: newProfile.role,
            phone: newProfile.phone,
            address: newProfile.address,
          })
          .select("*")
          .single();
        if (upErr) {
          console.error("Error upserting profile:", upErr);
        }
        setProfile(upserted || newProfile);
      } else {
        // If profile exists but role is missing, try to update from metadata
        if (!data.role) {
          const meta = user?.user_metadata as { role?: string } | undefined;
          if (meta?.role) {
            const { data: updated } = await supabase
              .from("profiles")
              .update({ role: meta.role })
              .eq("user_id", user!.id)
              .select("*")
              .single();
            setProfile(updated || data);
            return;
          }
        }
        setProfile(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } else {
        toast({
          title: "Signed out",
          description: "You have been successfully signed out.",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Leaf className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // In demo mode, user can be null. Only require profile to render.
  if (!profile) {
    return null;
  }

  const isConsumer = !profile.role || profile.role === "consumer";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold">HerbTrace</h1>
              </div>
              <div className="hidden md:block">
                <p className="text-sm text-muted-foreground">
                  Welcome back, {profile.full_name || "User"}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {profile.role} {profile.company_name && `• ${profile.company_name}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {allowRoleSwitch && (
                <div className="hidden md:flex items-center gap-2 mr-2">
                  <select
                    className="border rounded px-2 py-1 text-sm capitalize"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                  >
                    {['consumer','farmer','manufacturer','processor','distributor','retailer'].map(r => (
                      <option key={r} value={r} className="capitalize">{r}</option>
                    ))}
                  </select>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={switching || newRole === profile.role}
                    onClick={async () => {
                      try {
                        setSwitching(true);
                        const { data: updated, error } = await supabase
                          .from('profiles')
                          .update({ role: newRole })
                          .eq('user_id', user!.id)
                          .select('*')
                          .single();
                        if (error) throw error;
                        setProfile(updated as any);
                        toast({ title: 'Role updated', description: `Role switched to ${newRole}` });
                      } catch (e: any) {
                        toast({ variant: 'destructive', title: 'Failed to switch role', description: e?.message || 'Unknown error' });
                      } finally {
                        setSwitching(false);
                      }
                    }}
                  >
                    {switching ? 'Switching...' : 'Switch Role (dev)'}
                  </Button>
                </div>
              )}
              <Button onClick={() => navigate("/")} variant="ghost" size="sm">
                Home
              </Button>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products Tracked</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">QR Scans</CardTitle>
              <QrCode className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">348</div>
              <p className="text-xs text-muted-foreground">+12% from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Supply Chain Events</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">84</div>
              <p className="text-xs text-muted-foreground">Active tracking</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blockchain Transactions</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">Verified on chain</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              {!isConsumer && <TabsTrigger value="products">Products</TabsTrigger>}
              <TabsTrigger value="tracking">Tracking</TabsTrigger>
              <TabsTrigger value="scanner">QR Scanner</TabsTrigger>
            </TabsList>

            {!isConsumer && activeTab === "products" && (
              <Button onClick={() => setShowAddProduct(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            )}
          </div>

          {!isConsumer && (
            <TabsContent value="products" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Products</CardTitle>
                  <CardDescription>
                    Manage and track your products in the supply chain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProductList userId={user.id} />
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="tracking" className="space-y-4">
            {/* Role-specific dashboards */}
            {profile.role === "farmer" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Farmer Dashboard</CardTitle>
                    <CardDescription>Overview of your cultivations and sales</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Simple filters */}
                    <div className="flex flex-col md:flex-row gap-3 mb-4">
                      <select className="border rounded px-3 py-2 text-sm">
                        <option>All Herbs</option>
                        <option>Ashwagandha</option>
                        <option>Amla</option>
                        <option>Turmeric</option>
                      </select>
                      <select className="border rounded px-3 py-2 text-sm">
                        <option>Last 6 months</option>
                        <option>Last 3 months</option>
                        <option>Last 12 months</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="p-4 border rounded-lg"><div className="text-xs text-muted-foreground">Total Cultivations</div><div className="text-2xl font-semibold">28</div></div>
                      <div className="p-4 border rounded-lg"><div className="text-xs text-muted-foreground">Active Lots</div><div className="text-2xl font-semibold">6</div></div>
                      <div className="p-4 border rounded-lg"><div className="text-xs text-muted-foreground">Avg. Price/kg</div><div className="text-2xl font-semibold">₹420</div></div>
                      <div className="p-4 border rounded-lg"><div className="text-xs text-muted-foreground">Revenue (YTD)</div><div className="text-2xl font-semibold">₹3.6L</div></div>
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RBarChart data={[
                          { month: 'Apr', kg: 220, price: 380 },
                          { month: 'May', kg: 260, price: 400 },
                          { month: 'Jun', kg: 280, price: 420 },
                          { month: 'Jul', kg: 240, price: 410 },
                          { month: 'Aug', kg: 300, price: 430 },
                          { month: 'Sep', kg: 320, price: 440 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Bar yAxisId="left" dataKey="kg" fill="#10b981" name="Yield (kg)" />
                        </RBarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-6">
                      <div className="text-sm font-medium mb-2">Recent Cultivations</div>
                      <div className="border rounded-lg divide-y">
                        {[
                          { id: 'GF-23-0912', herb: 'Ashwagandha', qty: '120 kg', price: '₹430/kg' },
                          { id: 'GF-23-0901', herb: 'Amla', qty: '95 kg', price: '₹220/kg' },
                          { id: 'GF-23-0825', herb: 'Turmeric', qty: '150 kg', price: '₹180/kg' },
                        ].map((r) => (
                          <div key={r.id} className="flex items-center justify-between px-4 py-3 text-sm">
                            <div className="font-medium">{r.herb} • {r.qty}</div>
                            <div className="text-muted-foreground">Lot {r.id}</div>
                            <div className="font-medium">{r.price}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
              </>
            )}

            {(profile.role === "manufacturer" || profile.role === "processor") && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>{profile.role === 'manufacturer' ? 'Manufacturer' : 'Processor'} Dashboard</CardTitle>
                    <CardDescription>Production, batches, and stock status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="p-4 border rounded-lg"><div className="text-xs text-muted-foreground">Batches Produced</div><div className="text-2xl font-semibold">42</div></div>
                      <div className="p-4 border rounded-lg"><div className="text-xs text-muted-foreground">Units This Month</div><div className="text-2xl font-semibold">18,400</div></div>
                      <div className="p-4 border rounded-lg"><div className="text-xs text-muted-foreground">Defect Rate</div><div className="text-2xl font-semibold">0.3%</div></div>
                      <div className="p-4 border rounded-lg"><div className="text-xs text-muted-foreground">On-chain Hashes</div><div className="text-2xl font-semibold">42</div></div>
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                          { name: 'Wk1', units: 3200 },
                          { name: 'Wk2', units: 2800 },
                          { name: 'Wk3', units: 3600 },
                          { name: 'Wk4', units: 4800 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="units" name="Units Produced" stroke="#6366f1" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-6">
                      <div className="text-sm font-medium mb-2">Recent Batches</div>
                      <div className="border rounded-lg divide-y text-sm">
                        {[
                          { batch: 'B-AX-1029', product: 'Turmeric Capsules', qty: 5200, hash: '0x9fd...a23' },
                          { batch: 'B-AX-1028', product: 'Ashwagandha Powder', qty: 3400, hash: '0x71b...c92' },
                          { batch: 'B-AX-1027', product: 'Amla Powder', qty: 4800, hash: '0x18d...1f0' },
                        ].map(b => (
                          <div key={b.batch} className="flex items-center justify-between px-4 py-3">
                            <div className="font-medium">{b.product}</div>
                            <div className="text-muted-foreground">Batch {b.batch}</div>
                            <div className="font-medium">{b.qty.toLocaleString()} units</div>
                            <div className="font-mono text-xs bg-muted px-2 py-1 rounded">{b.hash}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {(profile.role === "distributor" || profile.role === "retailer") && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="capitalize">{profile.role} Dashboard</CardTitle>
                    <CardDescription>Orders, inventory and verifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="p-4 border rounded-lg"><div className="text-xs text-muted-foreground">Orders Fulfilled</div><div className="text-2xl font-semibold">1,248</div></div>
                      <div className="p-4 border rounded-lg"><div className="text-xs text-muted-foreground">Returns</div><div className="text-2xl font-semibold">1.1%</div></div>
                      <div className="p-4 border rounded-lg"><div className="text-xs text-muted-foreground">Inventory (units)</div><div className="text-2xl font-semibold">8,760</div></div>
                      <div className="p-4 border rounded-lg"><div className="text-xs text-muted-foreground">Authenticity Checks</div><div className="text-2xl font-semibold">642</div></div>
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RBarChart data={[
                          { name: 'Mon', orders: 180, checks: 70 },
                          { name: 'Tue', orders: 210, checks: 88 },
                          { name: 'Wed', orders: 190, checks: 76 },
                          { name: 'Thu', orders: 230, checks: 92 },
                          { name: 'Fri', orders: 260, checks: 104 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="orders" fill="#0ea5e9" name="Orders" />
                          <Bar dataKey="checks" fill="#10b981" name="Authenticity Checks" />
                        </RBarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {isConsumer && (
              <>
                {/* Recent Orders (demo-only, static data) */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Your latest purchases and delivery status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="divide-y">
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <div className="font-medium">Ashwagandha Root Powder</div>
                          <div className="text-xs text-muted-foreground">Order #HT-2025-001 • Placed {new Date(Date.now()-86400000*3).toLocaleDateString()}</div>
                        </div>
                        <div className="text-sm font-medium text-green-600">Delivered</div>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <div className="font-medium">Turmeric Extract Capsules</div>
                          <div className="text-xs text-muted-foreground">Order #HT-2025-002 • Placed {new Date(Date.now()-86400000*2).toLocaleDateString()}</div>
                        </div>
                        <div className="text-sm font-medium text-yellow-600">Out for delivery</div>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <div className="font-medium">Amla Powder</div>
                          <div className="text-xs text-muted-foreground">Order #HT-2025-003 • Placed {new Date(Date.now()-86400000).toLocaleDateString()}</div>
                        </div>
                        <div className="text-sm font-medium text-blue-600">Processing</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Demo Supply Chain Journey (static) */}
                <Card>
                  <CardHeader>
                    <CardTitle>Demo Supply Chain Journey</CardTitle>
                    <CardDescription>Example of a verified, tamper-evident timeline</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
                      {[
                        { id: '1', stage: 'cultivation', actor: 'Greenfield Farms', loc: 'Nashik, IN', t: new Date(Date.now()-86400000*5).toLocaleString(), notes: 'Organic cultivation batch #GF-23', status: 'Verified' },
                        { id: '2', stage: 'harvesting', actor: 'Greenfield Farms', loc: 'Nashik, IN', t: new Date(Date.now()-86400000*4).toLocaleString(), notes: 'Roots harvested and washed', status: 'Verified' },
                        { id: '3', stage: 'processing', actor: 'HerbPro Processing Unit', loc: 'Pune, IN', t: new Date(Date.now()-86400000*3).toLocaleString(), notes: 'Shade-dried and milled', status: 'Verified' },
                        { id: '4', stage: 'packaging', actor: 'HerbPro Packaging', loc: 'Pune, IN', t: new Date(Date.now()-86400000*2).toLocaleString(), notes: 'Nitrogen-flushed pouches', status: 'Verified' },
                        { id: '5', stage: 'distribution', actor: 'Ayur Logistics', loc: 'Mumbai, IN', t: new Date(Date.now()-86400000).toLocaleString(), notes: 'Cold-chain maintained', status: 'Verified' },
                      ].map(ev => (
                        <div key={ev.id} className="relative flex items-start gap-6 pb-8">
                          <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-background border-2 border-border rounded-full text-xl">
                            {ev.stage === 'cultivation' ? '🌱' : ev.stage === 'harvesting' ? '🌾' : ev.stage === 'processing' ? '⚙️' : ev.stage === 'packaging' ? '📦' : '🚛'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="bg-card border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-lg capitalize">{ev.stage}</h3>
                                <span className="text-xs px-2 py-1 rounded bg-green-500 text-white">{ev.status}</span>
                              </div>
                              <div className="space-y-1 text-sm">
                                <p><span className="text-muted-foreground">Actor:</span> {ev.actor}</p>
                                <p><span className="text-muted-foreground">Location:</span> {ev.loc}</p>
                                <p><span className="text-muted-foreground">Time:</span> {ev.t}</p>
                                <p><span className="text-muted-foreground">Notes:</span> {ev.notes}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Authenticity Insights (Demo) */}
                <Card>
                  <CardHeader>
                    <CardTitle>Authenticity Insights (Demo)</CardTitle>
                    <CardDescription>Verified vs. flagged records over the last 6 checkpoints</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RBarChart data={[
                          { name: 'CULT', verified: 12, flagged: 0 },
                          { name: 'HARV', verified: 11, flagged: 1 },
                          { name: 'PROC', verified: 12, flagged: 0 },
                          { name: 'PACK', verified: 12, flagged: 0 },
                          { name: 'DIST', verified: 12, flagged: 0 },
                          { name: 'RETL', verified: 10, flagged: 2 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="verified" fill="#10b981" name="Verified" />
                          <Bar dataKey="flagged" fill="#ef4444" name="Flagged" />
                        </RBarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            <Card>
              <CardHeader>
                <CardTitle>Supply Chain Timeline</CardTitle>
                <CardDescription>
                  Track the journey of products through the supply chain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SupplyChainTimeline />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scanner" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>QR Code Scanner</CardTitle>
                <CardDescription>
                  Scan QR codes to view product information and track supply chain events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QRScanner />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <AddProductDialog
        open={showAddProduct}
        onOpenChange={setShowAddProduct}
        userId={user.id}
      />
    </div>
  );
};

export default Dashboard;