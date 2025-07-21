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
import EquipementsPopulaires from "@/pages/equipements-populaires";
import QuoteRequest from "@/pages/quote-request";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import SimpleAdmin from "@/pages/simple-admin";
import AdminReservations from "@/pages/admin-reservations-simple";
import AdminDashboardComplete from "@/pages/admin-dashboard-complete";
import AdminEquipment from "@/pages/admin-equipment";
import AdminNotifications from "@/pages/admin-notifications";
import AdminPartners from "@/pages/admin-partners";
import AdminPartnersAnalytics from "@/pages/admin-partners-analytics";
import PartnerLogin from "@/pages/partner-login";
import PartnerDashboard from "@/pages/partner-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/equipements" component={Equipment} />
      <Route path="/equipements/:id" component={EquipmentDetail} />
      <Route path="/equipements-populaires" component={EquipementsPopulaires} />
      <Route path="/services" component={Services} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/devis" component={QuoteRequest} />
      <Route path="/login" component={LoginPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/admin" component={SimpleAdmin} />
      <Route path="/admin/reservations" component={AdminReservations} />
      <Route path="/admin/equipment" component={AdminEquipment} />
      <Route path="/admin/notifications" component={AdminNotifications} />
      <Route path="/admin/partners" component={AdminPartners} />
      <Route path="/admin/partners/analytics" component={AdminPartnersAnalytics} />
      <Route path="/adminpartners" component={PartnerLogin} />
      <Route path="/adminpartners/dashboard" component={PartnerDashboard} />
      <Route path="/adminone" component={AdminDashboardComplete} />
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
