import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Calculator, Clock, FileText } from "lucide-react";

const quoteRequestSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(9, "Téléphone requis"),
  company: z.string().optional(),
  category: z.string().min(1, "Catégorie d'équipement requise"),
  equipment: z.string().min(2, "Description de l'équipement requise"),
  startDate: z.string().min(1, "Date de début requise"),
  duration: z.string().min(1, "Durée de location requise"),
  location: z.string().min(2, "Lieu de livraison requis"),
  message: z.string().min(10, "Message détaillé requis (minimum 10 caractères)")
});

type QuoteRequestData = z.infer<typeof quoteRequestSchema>;

export default function QuoteRequest() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<QuoteRequestData>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      category: "",
      equipment: "",
      startDate: "",
      duration: "",
      location: "",
      message: ""
    }
  });

  const equipmentCategories = [
    "Camion porteur",
    "Camion semi-remorque", 
    "Camionnette / Fourgon",
    "Camion benne",
    "Engins de Chantier",
    "Outils à Main",
    "Équipement Électrique",
    "Sécurité & EPI"
  ];

  const onSubmit = async (data: QuoteRequestData) => {
    setIsSubmitting(true);
    try {
      await apiRequest('/api/quote-request', 'POST', data);
      
      toast({
        title: "Demande de devis envoyée",
        description: "Nous vous contacterons sous 24h avec votre devis personnalisé.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-kamsen-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Demander un Devis
            </h1>
            <p className="text-xl text-orange-100 mb-8">
              Obtenez un devis personnalisé pour vos besoins en location d'équipement
            </p>
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <Card className="text-center">
              <CardContent className="p-6">
                <Calculator className="h-12 w-12 text-primary-orange mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Devis Gratuit</h3>
                <p className="text-gray-600">Obtenez un devis détaillé sans frais</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <Clock className="h-12 w-12 text-primary-orange mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Réponse Rapide</h3>
                <p className="text-gray-600">Réponse sous 24h ouvrées</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <FileText className="h-12 w-12 text-primary-orange mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Devis Détaillé</h3>
                <p className="text-gray-600">Prix transparents et conditions claires</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">Formulaire de Demande de Devis</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom complet *</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre nom complet" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="votre@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone *</FormLabel>
                          <FormControl>
                            <Input placeholder="+221 77 123 45 67" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Entreprise (facultatif)</FormLabel>
                          <FormControl>
                            <Input placeholder="Nom de votre entreprise" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Catégorie d'équipement *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une catégorie" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {equipmentCategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="equipment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Équipement spécifique *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Pelleteuse 15 tonnes, Groupe électrogène..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de début *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Durée de location *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: 3 jours, 1 semaine, 1 mois..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lieu de livraison *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Dakar, Thiès..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Détails du projet *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Décrivez votre projet, vos besoins spécifiques, contraintes techniques..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-primary-orange/10 rounded-lg p-6 border-l-4 border-primary-orange">
                    <p className="text-gray-700 font-medium mb-2">
                      📞 Besoin d'aide pour remplir ce formulaire ?
                    </p>
                    <p className="text-gray-600">
                      Contactez notre équipe commerciale au{" "}
                      <a href="tel:+221786067013" className="text-primary-orange font-bold hover:underline">
                        78 606 70 13
                      </a>
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1 bg-primary-orange hover:bg-primary-orange/90 text-lg py-3"
                    >
                      {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande de devis"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}