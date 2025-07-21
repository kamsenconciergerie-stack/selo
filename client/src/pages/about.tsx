import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, MapPin, Clock, Award, Target, Heart } from "lucide-react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const partnerFormSchema = z.object({
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"), 
  phone: z.string().min(9, "Téléphone requis"),
  email: z.string().email("Email invalide"),
  website: z.string().optional(),
  equipmentCategories: z.array(z.string()).min(1, "Sélectionnez au moins une catégorie d'équipement")
});

type PartnerFormData = z.infer<typeof partnerFormSchema>;

export default function About() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  
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
  
  const form = useForm<PartnerFormData>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      website: "",
      equipmentCategories: []
    }
  });

  const onSubmit = async (data: PartnerFormData) => {
    setIsSubmitting(true);
    try {
      await apiRequest('/api/partner-inquiry', 'POST', data);
      
      toast({
        title: "Demande envoyée",
        description: "Nous vous contacterons sous 24h pour discuter de votre partenariat.",
      });
      
      form.reset();
      setDialogOpen(false);
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

  const values = [
    {
      icon: Target,
      title: "Excellence",
      description: "Nous nous engageons à fournir des équipements de la plus haute qualité et un service irréprochable."
    },
    {
      icon: Heart,
      title: "Confiance",
      description: "La transparence et l'honnêteté sont au cœur de toutes nos relations avec nos clients."
    },
    {
      icon: Users,
      title: "Proximité",
      description: "Nous privilégions une approche personnalisée et un contact direct avec nos clients."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Rejoignez-nous Section - En haut */}
      <section className="bg-hero-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Rejoignez le réseau Aywa
            </h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              Développez votre activité de location d'équipements en rejoignant la première plateforme du Sénégal
            </p>
          </div>
          


          <div className="text-center">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-primary-orange hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                  Devenir Partenaire Aywa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Rejoindre le réseau de partenaires Aywa</DialogTitle>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prénom</FormLabel>
                            <FormControl>
                              <Input placeholder="Votre prénom" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                              <Input placeholder="Votre nom" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Téléphone</FormLabel>
                            <FormControl>
                              <Input placeholder="+221 XX XXX XX XX" {...field} />
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
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="votre.email@exemple.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site web (optionnel)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://votre-site.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="equipmentCategories"
                      render={() => (
                        <FormItem>
                          <FormLabel>Catégories d'équipements disponibles</FormLabel>
                          <div className="grid grid-cols-2 gap-3">
                            {equipmentCategories.map((category) => (
                              <FormField
                                key={category}
                                control={form.control}
                                name="equipmentCategories"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={category}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(category)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, category])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== category
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">
                                        {category}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-primary-orange hover:bg-primary-orange/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* À Propos Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
                À Propos d'Aywa
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Aywa vise à accompagner les professionnels et les particuliers dans leurs projets en fournissant des moyens de transport de colis et équipements de qualité et un service personnalisé partout au Sénégal.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-orange rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">📞</span>
                  </div>
                  <span className="text-gray-700">+221 78 606 70 13</span>
                </div>
              </div>
              <Link href="/contact">
                <Button className="bg-primary-orange hover:bg-primary-orange/90 text-white px-8 py-3 text-lg mt-6">
                  Formulaire de contact
                </Button>
              </Link>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                alt="Équipe Aywa"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                alt="Mission Aywa"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Notre Mission
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Aywa vise à accompagner les professionnels et les particuliers dans leurs projets en fournissant des moyens de transport de colis et équipements de qualité et un service personnalisé partout au Sénégal.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Nous nous engageons à offrir des solutions de transport fiables, 
                des prix compétitifs et un accompagnement personnalisé pour garantir 
                la réussite de vos projets.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {values.map((value) => {
                  const Icon = value.icon;
                  return (
                    <div key={value.title} className="text-center">
                      <div className="bg-aywa-blue/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Icon className="h-6 w-6 text-aywa-blue" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {value.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {value.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}