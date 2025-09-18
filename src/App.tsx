import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Titulos from "./pages/Titulos";
import NovoTitulo from "./pages/NovoTitulo";
import ImportarCSV from "./pages/ImportarCSV";
import Relatorios from "./pages/Relatorios";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          } />
          <Route path="/titulos" element={
            <AppLayout>
              <Titulos />
            </AppLayout>
          } />
          <Route path="/titulos/novo" element={
            <AppLayout>
              <NovoTitulo />
            </AppLayout>
          } />
          <Route path="/importar" element={
            <AppLayout>
              <ImportarCSV />
            </AppLayout>
          } />
          <Route path="/relatorios" element={
            <AppLayout>
              <Relatorios />
            </AppLayout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
