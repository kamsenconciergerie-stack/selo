import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInquirySchema } from "@shared/schema";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

type InquiryFormData = z.infer<typeof insertInquirySchema>;

export default function Contact() {
  const { toast } = useToast();

  const inquiryFormSchema = insertInquirySchema.extend({
    firstName: z.string().min(1, "Le prénom est obligatoire"),
    lastName: z.string().min(1, "Le nom est obligatoire"),
    phone: z.string().min(1, "Le téléphone est obligatoire"),
    deliveryCity: z.string().min(1, "La ville de livraison est obligatoire"),
    startDate: z.string().min(1, "La date de début est obligatoire"),
    endDate: z.string().min(1, "La date de fin est obligatoire"),
    equipmentCategories: z.array(z.string()).min(1, "Sélectionnez au moins une catégorie d'équipement"),
    email: z.string().email("Email invalide").optional().or(z.literal("")),
    message: z.string().optional(),
  });

  type InquiryFormData = z.infer<typeof inquiryFormSchema>;

  const form = useForm<InquiryFormData>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      deliveryCity: "",
      startDate: "",
      endDate: "",
      equipmentCategories: [],
      message: "",
    },
  });

  const createInquiryMutation = useMutation({
    mutationFn: async (data: InquiryFormData) => {
      const response = await apiRequest("POST", "/api/inquiries", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Demande de devis envoyée",
        description: "Votre demande de devis a été envoyée avec succès. Nous vous recontacterons sous 24h avec votre devis personnalisé.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre demande de devis.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InquiryFormData) => {
    createInquiryMutation.mutate(data);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Téléphone",
      value: "+221 78 606 70 13",
      description: "Disponible 24h/7j",
    },
    {
      icon: Mail,
      title: "Contact Général",
      value: "contact@kamsenlogistic.com",
      description: "Réponse sous 24h",
    },
    {
      icon: Mail,
      title: "Réservations",
      value: "reservation@kamsenlogistic.com",
      description: "Pour vos demandes de location",
    },
    {
      icon: Mail,
      title: "Partenaires",
      value: "partenaires@kamsenlogistic.com",
      description: "Rejoignez notre réseau",
    },
    {
      icon: MapPin,
      title: "Adresse",
      value: "Zone Industrielle, Dakar",
      description: "Sénégal",
    },
    {
      icon: Clock,
      title: "Horaires",
      value: "Lun-Ven: 8h-18h",
      description: "Sam: 8h-12h",
    },
  ];

  return (
    <div className="min-h-screen bg-kamsen-blue-light">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-kamsen-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Contactez-nous
          </h1>
          <p className="text-xl text-orange-100">
            Notre équipe est là pour vous aider à trouver l'équipement parfait
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-kamsen-blue mb-6">
                Parlons de votre projet
              </h2>
              <p className="text-lg text-kamsen-gray mb-8">
                Que vous ayez besoin d'un équipement spécifique ou de conseils pour votre projet, 
                notre équipe d'experts est là pour vous accompagner.
              </p>
            </div>

            {/* Section emails spécialisés */}
            <div className="bg-kamsen-blue/5 p-6 rounded-lg border border-aywa-blue/20 mb-8">
              <h3 className="text-xl font-semibold text-kamsen-blue mb-4">
                📧 Contactez le bon service directement
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl mb-2">📞</div>
                  <h4 className="font-semibold text-kamsen-blue">Support Client</h4>
                  <p className="text-kamsen-blue font-medium">contact@kamsenlogistic.com</p>
                  <p className="text-sm text-kamsen-gray">Questions générales</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl mb-2">📋</div>
                  <h4 className="font-semibold text-kamsen-blue">Réservations</h4>
                  <p className="text-kamsen-blue font-medium">reservation@kamsenlogistic.com</p>
                  <p className="text-sm text-kamsen-gray">Location d'équipements</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl mb-2">🤝</div>
                  <h4 className="font-semibold text-kamsen-blue">Partenaires</h4>
                  <p className="text-kamsen-blue font-medium">partenaires@kamsenlogistic.com</p>
                  <p className="text-sm text-kamsen-gray">Rejoignez notre réseau</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((info) => {
                const Icon = info.icon;
                return (
                  <Card key={info.title}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-kamsen-blue/10 p-3 rounded-lg">
                          <Icon className="h-6 w-6 text-kamsen-blue" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-kamsen-blue mb-1">
                            {info.title}
                          </h3>
                          <p className="text-kamsen-blue font-medium">
                            {info.value}
                          </p>
                          <p className="text-sm text-kamsen-gray">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Map placeholder */}
            <Card>
              <CardContent className="p-6">
                <img 
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=300"
                  alt="Localisation"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="text-center text-kamsen-gray mt-4">
                  Zone Industrielle de Dakar - Facile d'accès depuis toute la région
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-kamsen-blue mb-6">
                Demande de devis gratuit
              </h3>
              <p className="text-kamsen-gray mb-6">
                Remplissez ce formulaire pour recevoir un devis personnalisé. 
                Les champs marqués d'un * sont obligatoires.
              </p>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone *</FormLabel>
                          <FormControl>
                            <Input placeholder="+221 XX XXX XXXX" {...field} />
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
                          <FormLabel>Email (optionnel)</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="votre@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="deliveryCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ville de livraison *</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez votre ville" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dakar">Dakar</SelectItem>
                              <SelectItem value="thies">Thiès</SelectItem>
                              <SelectItem value="saint-louis">Saint-Louis</SelectItem>
                              <SelectItem value="kaolack">Kaolack</SelectItem>
                              <SelectItem value="ziguinchor">Ziguinchor</SelectItem>
                              <SelectItem value="louga">Louga</SelectItem>
                              <SelectItem value="fatick">Fatick</SelectItem>
                              <SelectItem value="kolda">Kolda</SelectItem>
                              <SelectItem value="tambacounda">Tambacounda</SelectItem>
                              <SelectItem value="matam">Matam</SelectItem>
                              <SelectItem value="kaffrine">Kaffrine</SelectItem>
                              <SelectItem value="kedougou">Kédougou</SelectItem>
                              <SelectItem value="sedhiou">Sédhiou</SelectItem>
                              <SelectItem value="diourbel">Diourbel</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de fin *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="equipmentCategories"
                    render={() => (
                      <FormItem>
                        <FormLabel>Catégories d'équipements recherchés *</FormLabel>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                          {CATEGORIES.map((category) => (
                            <FormField
                              key={category.id}
                              control={form.control}
                              name="equipmentCategories"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={category.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(category.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, category.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== category.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {category.name}
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

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Informations complémentaires (optionnel)</FormLabel>
                        <FormControl>
                          <Textarea 
                            rows={4}
                            placeholder="Décrivez votre projet, contraintes particulières, besoins spécifiques..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={createInquiryMutation.isPending}
                    className="w-full bg-kamsen-blue hover:bg-kamsen-blue/90 text-white py-3 text-lg"
                  >
                    {createInquiryMutation.isPending ? "Envoi en cours..." : "Demander un devis gratuit"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-kamsen-blue-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-kamsen-blue" />
              </div>
              <h3 className="font-semibold text-kamsen-blue mb-2">Réponse rapide</h3>
              <p className="text-kamsen-gray">
                Nous nous engageons à vous répondre dans les 2 heures ouvrables
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-kamsen-blue-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-kamsen-blue" />
              </div>
              <h3 className="font-semibold text-kamsen-blue mb-2">Support expert</h3>
              <p className="text-kamsen-gray">
                Nos techniciens vous conseillent sur le choix de vos équipements
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="bg-kamsen-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-kamsen-blue" />
              </div>
              <h3 className="font-semibold text-kamsen-blue mb-2">Service local</h3>
              <p className="text-kamsen-gray">
                Présents dans toutes les grandes villes du Sénégal
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
