import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Leaf, Shield } from "lucide-react";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  companyName: z.string().optional(),
  role: z.string().min(1, "Please select a role"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    companyName: "",
    role: "consumer",
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) navigate("/dashboard");
    };
    checkUser();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validated = signupSchema.parse({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        companyName: formData.companyName || undefined,
        role: formData.role,
      });
      const { error } = await supabase.auth.signUp({
        email: validated.email,
        password: validated.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: validated.fullName,
            company_name: validated.companyName,
            role: validated.role,
          },
        },
      });
      if (error) {
        toast({ variant: "destructive", title: "Error", description: error.message });
      } else {
        toast({ title: "Success!", description: "Please check your email to confirm your account." });
      }
    } catch (err: any) {
      if (err?.issues?.[0]?.message) {
        toast({ variant: "destructive", title: "Validation", description: err.issues[0].message });
      } else {
        toast({ variant: "destructive", title: "Error", description: "Unexpected error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validated = loginSchema.parse({ email: formData.email, password: formData.password });
      const { error } = await supabase.auth.signInWithPassword({
        email: validated.email,
        password: validated.password,
      });
      if (error) {
        toast({ variant: "destructive", title: "Error", description: error.message });
      } else {
        toast({ title: "Welcome back!", description: "You have successfully signed in." });
        navigate("/dashboard");
      }
    } catch (err: any) {
      if (err?.issues?.[0]?.message) {
        toast({ variant: "destructive", title: "Validation", description: err.issues[0].message });
      } else {
        toast({ variant: "destructive", title: "Error", description: "Unexpected error" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">HerbTrace</h1>
          </div>
          <p className="text-muted-foreground">Blockchain-powered Ayurvedic traceability</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-primary" />
              <CardTitle>Secure Access</CardTitle>
            </div>
            <CardDescription>Join the transparent supply chain revolution</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name (Optional)</Label>
                    <Input id="companyName" type="text" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <select id="role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm" required>
                      <option value="consumer">Consumer</option>
                      <option value="farmer">Farmer</option>
                      <option value="manufacturer">Manufacturer</option>
                      <option value="processor">Processor</option>
                      <option value="distributor">Distributor</option>
                      <option value="retailer">Retailer</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating account..." : "Create Account"}</Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="text-sm">← Back to Home</Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;