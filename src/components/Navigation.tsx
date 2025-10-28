import { useEffect, useState } from "react";
import { Menu, X, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // initial check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setIsAuthed(!!session);
      if (session?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();
        setRole(data?.role ?? null);
      } else {
        setRole(null);
      }
    });
    // subscribe to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setIsAuthed(!!session);
      if (session?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();
        setRole(data?.role ?? null);
      } else {
        setRole(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const navItems = [
    { name: "How It Works", href: "#how-it-works" },
    { name: "Stakeholders", href: "#stakeholders" },
    { name: "Technology", href: "#technology" },
    { name: "Benefits", href: "#benefits" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">HerbTrace</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.name} to={item.href} className="text-foreground hover:text-emerald transition-colors duration-200 font-medium">
                {item.name}
              </Link>
            ))}
            <Button asChild variant="outline" size="sm" className="border-emerald text-emerald hover:bg-emerald hover:text-white">
              <Link to="/trace">Trace</Link>
            </Button>
            {isAuthed && (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/medicines">Medicines</Link>
                </Button>
                {role !== "consumer" && (
                  <>
                    <Button asChild variant="ghost" size="sm">
                      <Link to="/farmers">Farmers</Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <Link to="/manufacturers">Manufacturers</Link>
                    </Button>
                  </>
                )}
                <Button asChild size="sm" variant="secondary">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              </>
            )}
            {!isAuthed && (
              <Button asChild size="sm">
                <Link to="/auth">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-sage transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link key={item.name} to={item.href} className="px-4 py-2 text-foreground hover:text-emerald transition-colors duration-200 font-medium" onClick={() => setIsOpen(false)}>
                  {item.name}
                </Link>
              ))}
              <div className="px-4 pt-2 grid gap-3">
                <Link to="/trace" className="block text-center w-full rounded-md border border-emerald text-emerald px-3 py-2 text-sm font-medium transition-colors hover:bg-emerald hover:text-white">
                  Trace
                </Link>
                {isAuthed ? (
                  <>
                    <Link to="/medicines" className="block text-center w-full rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent" onClick={() => setIsOpen(false)}>
                      Medicines
                    </Link>
                    {role !== "consumer" && (
                      <>
                        <Link to="/farmers" className="block text-center w-full rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent" onClick={() => setIsOpen(false)}>
                          Farmers
                        </Link>
                        <Link to="/manufacturers" className="block text-center w-full rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent" onClick={() => setIsOpen(false)}>
                          Manufacturers
                        </Link>
                      </>
                    )}
                    <Link to="/dashboard" className="block text-center w-full rounded-md bg-secondary text-secondary-foreground px-3 py-2 text-sm font-medium hover:bg-secondary/80">
                      Dashboard
                    </Link>
                  </>
                ) : (
                  <Link to="/auth" className="block text-center w-full rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:bg-primary/90">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;