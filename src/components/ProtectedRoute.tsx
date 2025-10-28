import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [checking, setChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const skipAuth = (import.meta as any).env?.VITE_SKIP_AUTH === 'true';

  useEffect(() => {
    let mounted = true;
    if (skipAuth) {
      setIsAuthed(true);
      setChecking(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setIsAuthed(!!session);
      setChecking(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setIsAuthed(!!session);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (checking) return null; // or a spinner
  if (!isAuthed) return <Navigate to="/auth" replace />;
  return children;
};

export default ProtectedRoute;
