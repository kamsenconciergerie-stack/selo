import { useState } from "react";
import { Building, Lock, Mail, Eye, EyeOff, LogIn } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function PartnerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Mock partner credentials for demo
  const demoPartners = [
    {
      id: 1,
      email: "contact@transportexpress.sn",
      password: "partner123",
      companyName: "Transport Express Dakar"
    },
    {
      id: 2,
      email: "info@logisticspro.sn",
      password: "partner123",
      companyName: "Logistics Pro Sénégal"
    },
    {
      id: 3,
      email: "contact@camionsdusud.sn",
      password: "partner123",
      companyName: "Camions du Sud"
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock authentication - replace with actual API call
      const partner = demoPartners.find(p => p.email === email && p.password === password);
      
      if (partner) {
        // Store partner session data
        sessionStorage.setItem("partnerId", partner.id.toString());
        sessionStorage.setItem("partnerToken", `token_${partner.id}`);
        sessionStorage.setItem("partnerName", partner.companyName);
        
        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${partner.companyName}`,
        });
        
        // Redirect to partner dashboard
        setTimeout(() => {
          window.location.href = "/adminpartners/dashboard";
        }, 1000);
      } else {
        toast({
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Problème de connexion au serveur",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-kamsen-blue-light flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-kamsen-blue rounded-full mb-4">
            <Building className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-kamsen-blue mb-2">Espace Partenaire</h1>
          <p className="text-kamsen-gray">Plateforme Kamsen Logistics</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Connexion</CardTitle>
            <p className="text-sm text-kamsen-gray text-center">
              Accédez à votre tableau de bord partenaire
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email professionnel</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-kamsen-gray" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre-email@entreprise.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-kamsen-gray" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-kamsen-blue hover:bg-orange-600" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Connexion...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    <span>Se connecter</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Demo credentials info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Comptes de démonstration :</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <div>
                  <strong>Transport Express:</strong><br />
                  Email: contact@transportexpress.sn<br />
                  Mot de passe: partner123
                </div>
                <div>
                  <strong>Logistics Pro:</strong><br />
                  Email: info@logisticspro.sn<br />
                  Mot de passe: partner123
                </div>
                <div>
                  <strong>Camions du Sud:</strong><br />
                  Email: contact@camionsdusud.sn<br />
                  Mot de passe: partner123
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-kamsen-gray">
              <p>Pas encore partenaire ?</p>
              <Button variant="link" className="text-kamsen-blue" onClick={() => window.location.href = "/contact"}>
                Devenir partenaire Kamsen
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button variant="link" className="text-kamsen-gray" onClick={() => window.location.href = "/"}>
            ← Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
}