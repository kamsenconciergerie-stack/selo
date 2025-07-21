import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, MapPin, Clock, Award, Target, Heart } from "lucide-react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
// Import removed - we'll define categories locally

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

  const stats = [
    {
      icon: Users,
      number: "500+",
      label: "Clients satisfaits",
      description: "Entreprises et particuliers nous font confiance"
    },
    {
      icon: MapPin,
      number: "8",
      label: "Villes couvertes",
      description: "Présence dans tout le Sénégal"
    },
    {
      icon: Clock,
      number: "5+",
      label: "Années d'expérience",
      description: "Expertise dans la location d'équipement"
    },
    {
      icon: Award,
      number: "98%",
      label: "Taux de satisfaction",
      description: "Clients recommandent nos services"
    }
  ];

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
      
      {/* Hero Section */}
      <section className="bg-hero-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                À Propos d'Aywa
              </h1>
              <p className="text-xl text-orange-100 mb-8">
                Aywa vise à accompagner les professionnels et les particuliers dans leurs projets en fournissant des moyens de transport de colis et équipements de qualité et un service personnalisé partout au Sénégal.
              </p>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white mb-4">Nous contacter</h3>
                <div className="space-y-2 text-orange-100">
                  <p>📞 Téléphone: +221 78 606 70 13</p>
                  <p>📧 Email: aywa@aywa.com</p>
                </div>
                <Link href="/contact">
                  <Button className="bg-primary-orange hover:bg-primary-orange/90 text-white px-8 py-3 text-lg mt-4">
                    Formulaire de contact
                  </Button>
                </Link>
              </div>
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

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="text-center">
                  <CardContent className="p-6">
                    <div className="bg-primary-orange/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary-orange" />
                    </div>
                    <div className="text-3xl font-bold text-aywa-blue mb-2">
                      {stat.number}
                    </div>
                    <div className="text-lg font-semibold text-gray-900 mb-1">
                      {stat.label}
                    </div>
                    <p className="text-sm text-gray-600">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
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



      {/* Partner CTA Section */}
      <section className="py-16 bg-aywa-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Rejoignez notre réseau de partenaires
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Vous possédez des équipements à louer ? Rejoignez notre plateforme et développez votre activité
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary-orange hover:bg-primary-orange/90 text-white px-8 py-3 text-lg">
                  Devenir partenaire d'Aywa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Rejoignez notre réseau de partenaires</DialogTitle>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prénom *</FormLabel>
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
                            <FormLabel>Nom *</FormLabel>
                            <FormControl>
                              <Input placeholder="Votre nom" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone *</FormLabel>
                          <FormControl>
                            <Input placeholder="ex: +221 77 123 45 67" {...field} />
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

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Internet (facultatif)</FormLabel>
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
                          <div className="mb-4">
                            <FormLabel className="text-base font-semibold">
                              Équipements que vous souhaitez louer *
                            </FormLabel>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {equipmentCategories.map((category: string) => (
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

                    <div className="flex gap-4">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="flex-1 bg-primary-orange hover:bg-primary-orange/90"
                      >
                        {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setDialogOpen(false)}
                        className="flex-1"
                      >
                        Annuler
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            
            <Link href="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-aywa-blue px-8 py-3 text-lg">
                Nous contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}