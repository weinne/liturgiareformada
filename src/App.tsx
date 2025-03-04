
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LiturgyProvider } from "@/context/LiturgyContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LiturgyEditor from "./pages/LiturgyEditor";
import ViewLiturgy from "./pages/ViewLiturgy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LiturgyProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/edit" element={<LiturgyEditor />} />
            <Route path="/view/:liturgyId" element={<ViewLiturgy />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LiturgyProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
