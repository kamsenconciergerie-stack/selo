import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Equipment from "@/pages/equipment";
import EquipmentDetail from "@/pages/equipment-detail";
import Contact from "@/pages/contact";
import Services from "@/pages/services";
import About from "@/pages/about";
import PopularEquipment from "@/pages/popular-equipment";
import QuoteRequest from "@/pages/quote-request";
import SimpleAdmin from "@/pages/simple-admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/equipements" component={Equipment} />
      <Route path="/equipements/:id" component={EquipmentDetail} />
      <Route path="/equipements-populaires" component={PopularEquipment} />
      <Route path="/services" component={Services} />
      <Route path="/a-propos" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/devis" component={QuoteRequest} />
      <Route path="/admin" component={SimpleAdmin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
