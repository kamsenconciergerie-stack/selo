import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, User, FileText, CreditCard } from "lucide-react";

const partnerRegisterSchema = z.object({
  // User account info
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(9, "Numéro de téléphone requis"),
  password: z.string().min(6, "Mot de passe minimum 6 caractères"),
  confirmPassword: z.string(),
  
  // Company info
  companyName: z.string().min(2, "Nom de l'entreprise requis"),
  businessRegistrationNumber: z.string().min(5, "Numéro d'enregistrement requis"),
  businessType: z.enum(["individual", "company", "cooperative"], {
    errorMap: () => ({ message: "Type d'entreprise requis" })
  }),
  taxNumber: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  description: z.string().min(20, "Description minimum 20 caractères"),
  
  // Financial info
  bankAccountName: z.string().min(2, "Nom du compte bancaire requis"),
  bankAccountNumber: z.string().min(10, "Numéro de compte requis"),
  bankName: z.string().min(2, "Nom de la banque requis"),
  orangeMoneyNumber: z.string().optional(),
  waveNumber: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type PartnerRegisterData = z.infer<typeof partnerRegisterSchema>;

interface PartnerRegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
}

export function PartnerRegisterModal({ open, onOpenChange, onSwitchToLogin }: PartnerRegisterModalProps) {
  const [currentStep, setCurrentStep] = useState("account");
  const { toast } = useToast();

  const form = useForm<PartnerRegisterData>({
    resolver: zodResolver(partnerRegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      businessRegistrationNumber: "",
      businessType: "individual",
      taxNumber: "",
      website: "",
      description: "",
      bankAccountName: "",
      bankAccountNumber: "",
      bankName: "",
      orangeMoneyNumber: "",
      waveNumber: "",
    },
  });

  const partnerRegisterMutation = useMutation({
    mutationFn: async (data: PartnerRegisterData) => {
      const { confirmPassword, orangeMoneyNumber, waveNumber, ...registerData } = data;
      
      // Prepare mobile money codes
      const mobileMoneyCodes = {};
      if (orangeMoneyNumber) {
        mobileMoneyCodes.orange_money = orangeMoneyNumber;
      }
      if (waveNumber) {
        mobileMoneyCodes.wave = waveNumber;
      }
      
      return await apiRequest('/api/partners/register', {
        method: 'POST',
        body: JSON.stringify({
          ...registerData,
          mobileMoneyCodes: Object.keys(mobileMoneyCodes).length > 0 ? mobileMoneyCodes : null,
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Demande soumise avec succès",
        description: "Votre demande de partenariat a été soumise. Nous vous contacterons sous 48h pour la vérification de vos documents.",
      });
      onOpenChange(false);
      form.reset();
      setCurrentStep("account");
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur lors de la soumission",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PartnerRegisterData) => {
    partnerRegisterMutation.mutate(data);
  };

  const nextStep = () => {
    if (currentStep === "account") setCurrentStep("company");
    else if (currentStep === "company") setCurrentStep("financial");
  };

  const prevStep = () => {
    if (currentStep === "financial") setCurrentStep("company");
    else if (currentStep === "company") setCurrentStep("account");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            Devenir Partenaire Aywa
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            Proposez vos équipements en location et développez votre activité
          </p>
        </DialogHeader>

        <Tabs value={currentStep} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account" className="text-xs">
              <User className="w-4 h-4 mr-1" />
              Compte
            </TabsTrigger>
            <TabsTrigger value="company" className="text-xs">
              <Building className="w-4 h-4 mr-1" />
              Entreprise
            </TabsTrigger>
            <TabsTrigger value="financial" className="text-xs">
              <CreditCard className="w-4 h-4 mr-1" />
              Financier
            </TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <TabsContent value="account" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom *</FormLabel>
                        <FormControl>
                          <Input placeholder="Prénom" {...field} />
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
                          <Input placeholder="Nom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email professionnel *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="contact@monentreprise.sn"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone *</FormLabel>
                      <FormControl>
                        <Input placeholder="77 123 45 67" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe *</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmer *</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="button" onClick={nextStep} className="w-full">
                  Continuer vers Entreprise
                </Button>
              </TabsContent>

              <TabsContent value="company" className="space-y-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l'entreprise *</FormLabel>
                      <FormControl>
                        <Input placeholder="Mon Entreprise SARL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type d'entreprise *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="individual">Personne physique</SelectItem>
                            <SelectItem value="company">Société</SelectItem>
                            <SelectItem value="cooperative">Coopérative</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="businessRegistrationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>N° Enregistrement *</FormLabel>
                        <FormControl>
                          <Input placeholder="SN-DKR-2024-B-12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="taxNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>N° Fiscal (optionnel)</FormLabel>
                        <FormControl>
                          <Input placeholder="12345678901" {...field} />
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
                        <FormLabel>Site Web (optionnel)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://monsite.sn" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description de l'activité *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Décrivez votre activité, les types d'équipements que vous proposez, votre expérience..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex space-x-2">
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                    Retour
                  </Button>
                  <Button type="button" onClick={nextStep} className="flex-1">
                    Continuer vers Financier
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="financial" className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Commission Aywa :</strong> 15% sur chaque location
                  </p>
                </div>
                
                <FormField
                  control={form.control}
                  name="bankAccountName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du compte bancaire *</FormLabel>
                      <FormControl>
                        <Input placeholder="Mon Entreprise SARL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banque *</FormLabel>
                        <FormControl>
                          <Input placeholder="Banque Atlantique" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bankAccountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>N° de compte *</FormLabel>
                        <FormControl>
                          <Input placeholder="12345678901234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Comptes Mobile Money (optionnel)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="orangeMoneyNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Orange Money</FormLabel>
                          <FormControl>
                            <Input placeholder="77 123 45 67" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="waveNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wave</FormLabel>
                          <FormControl>
                            <Input placeholder="78 123 45 67" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                    Retour
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={partnerRegisterMutation.isPending}
                  >
                    {partnerRegisterMutation.isPending ? "Soumission..." : "Soumettre la demande"}
                  </Button>
                </div>
              </TabsContent>
            </form>
          </Form>
        </Tabs>
        
        <div className="text-center">
          <Button
            type="button"
            variant="link"
            onClick={onSwitchToLogin}
            className="text-sm"
          >
            Déjà partenaire ? Se connecter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}