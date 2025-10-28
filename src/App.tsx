import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Trace from "./pages/Trace";
import Dashboard from "./pages/Dashboard";
import ProductView from "./pages/ProductView";
import Auth from "./pages/Auth";
import Farmers from "./pages/Farmers";
import Manufacturers from "./pages/Manufacturers";
import ProtectedRoute from "./components/ProtectedRoute";
import Medicines from "./pages/Medicines";
import ProductDemo from "./pages/ProductDemo";
import Dev from "./pages/Dev";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/trace" element={<Trace />} />
          <Route path="/demo" element={<ProductDemo />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/medicines" element={<ProtectedRoute><Medicines /></ProtectedRoute>} />
          <Route path="/farmers" element={<ProtectedRoute><Farmers /></ProtectedRoute>} />
          <Route path="/manufacturers" element={<ProtectedRoute><Manufacturers /></ProtectedRoute>} />
          <Route path="/dev" element={<ProtectedRoute><Dev /></ProtectedRoute>} />
          <Route path="/product/:productId" element={<ProductView />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
