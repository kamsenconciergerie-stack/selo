import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBookingSchema, Booking } from "@shared/schema";
import { z } from "zod";
import { Equipment } from "@shared/schema";
import { formatPrice, formatPriceWithPrefix } from "@/lib/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { Calendar, MapPin, Clock, Truck } from "lucide-react";

interface BookingModalProps {
  equipment: Equipment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const bookingFormSchema = insertBookingSchema.pick({
  equipmentId: true,
  totalPrice: true,
  codeParrain: true,
  notes: true,
}).extend({
  customerName: z.string()
    .min(3, "Le nom doit contenir au moins 3 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères")
    .refine((name) => {
      const nameParts = name.trim().split(/\s+/);
      return nameParts.length >= 2;
    }, "Veuillez entrer votre nom complet (prénom et nom)")
    .refine((name) => {
      return /^[a-zA-ZÀ-ÿ\s'-]+$/.test(name);
    }, "Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets"),
  
  customerEmail: z.string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide")
    .toLowerCase()
    .refine((email) => {
      return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email);
    }, "Veuillez entrer une adresse email valide"),
  
  customerPhone: z.string()
    .min(1, "Le numéro de téléphone est requis")
    .refine((phone) => {
      const cleaned = phone.replace(/\s/g, '');
      return /^\+221[0-9]{9}$/.test(cleaned) || /^221[0-9]{9}$/.test(cleaned) || /^[0-9]{9}$/.test(cleaned);
    }, "Format invalide. Utilisez: +221XXXXXXXXX, 221XXXXXXXXX ou XXXXXXXXX (9 chiffres)"),
  
  startDate: z.string()
    .min(1, "Date de début requise")
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, "La date de début ne peut pas être antérieure à aujourd'hui"),
  
  endDate: z.string()
    .min(1, "Date de fin requise")
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, "La date de fin ne peut pas être antérieure à aujourd'hui"),
  
  paymentMethod: z.literal("delivery"),
}).refine((data) => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  return endDate > startDate;
}, {
  message: "La date de fin doit être après la date de début",
  path: ["endDate"],
}).refine((data) => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  return daysDiff >= 1;
}, {
  message: "La durée de location doit être d'au moins 1 jour",
  path: ["endDate"],
}).refine((data) => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  return daysDiff <= 365;
}, {
  message: "La durée de location ne peut pas dépasser 365 jours",
  path: ["endDate"],
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

export default function BookingModal({ equipment, open, onOpenChange }: BookingModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      equipmentId: equipment.id,
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      startDate: "",
      endDate: "",
      totalPrice: equipment.pricePerDay,
      paymentMethod: "delivery" as const,
      codeParrain: "",
      notes: "",
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      return await apiRequest("/api/bookings", {
        method: "POST",
        body: JSON.stringify(data)
      });
    },
    onSuccess: (booking: any) => {
      // Calculer la durée en jours
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      toast({
        title: "✅ Demande de réservation enregistrée !",
        description: (
          <div className="space-y-3 mt-2">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
              <p className="text-sm font-medium text-yellow-800">
                Votre demande est en cours de traitement
              </p>
            </div>
            
            <div className="space-y-2 text-sm">
              <p><strong>N° de réservation :</strong> <span className="text-kamsen-orange font-bold">#{booking.id}</span></p>
              <p><strong>Équipement :</strong> {equipment.name}</p>
              <p><strong>Durée :</strong> {days} jour{days > 1 ? 's' : ''}</p>
              <p><strong>Prix estimé :</strong> {formatPrice(booking.totalPrice)}</p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
              <p className="text-xs text-blue-800 font-medium mb-2">📧 Prochaines étapes :</p>
              <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc">
                <li>Vous recevrez un email de confirmation ou de rejet</li>
                <li>Vérifiez votre boîte mail régulièrement</li>
                <li>Pour toute urgence : +221 71 018 89 89</li>
              </ul>
            </div>
          </div>
        ),
        duration: 10000,
      });
      handleCloseBooking();
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la réservation.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingFormData) => {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = days * equipment.pricePerDay;

    createBookingMutation.mutate({
      ...data,
      totalPrice,
    });
  };

  const watchedDates = form.watch(["startDate", "endDate"]);
  const calculateTotal = () => {
    if (watchedDates[0] && watchedDates[1]) {
      const startDate = new Date(watchedDates[0]);
      const endDate = new Date(watchedDates[1]);
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      return days > 0 ? days * equipment.pricePerDay : equipment.pricePerDay;
    }
    return equipment.pricePerDay;
  };

  const handleCloseBooking = () => {
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleCloseBooking}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Réserver {equipment.name}
          </DialogTitle>
        </DialogHeader>

        {/* Information Paiement */}
        <div className="bg-kamsen-blue-light border border-kamsen-blue rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-kamsen-orange rounded flex items-center justify-center">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-sm font-medium text-kamsen-blue">Paiement à la livraison de l'équipement</span>
              <div className="text-xs text-green-600 font-medium">
                ✓ Payez directement au technicien lors de la réception
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Equipment Info */}
          <div className="space-y-4">
            <img 
              src={equipment.imageUrl} 
              alt={equipment.name}
              className="w-full h-32 object-cover rounded-lg"
            />
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-kamsen-gray">
                <MapPin className="mr-2 h-4 w-4" />
                {equipment.location}
              </div>
              <div className="flex items-center text-sm text-kamsen-gray">
                <Clock className="mr-2 h-4 w-4" />
                {formatPriceWithPrefix(equipment.pricePerDay)}/jour
              </div>
            </div>

            <div className="bg-kamsen-blue-light p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Total estimé</h4>
              <div className="text-2xl font-bold text-kamsen-blue">
                {formatPrice(calculateTotal())}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Amadou Diallo" 
                        {...field}
                        data-testid="input-customer-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="exemple@email.com" 
                        {...field}
                        data-testid="input-customer-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone *</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel"
                        placeholder="+221 77 123 45 67" 
                        {...field}
                        data-testid="input-customer-phone"
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500 mt-1">Format accepté: +221XXXXXXXXX ou XXXXXXXXX (9 chiffres)</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="codeParrain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code de parrainage (optionnel)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Code de la personne qui vous a recommandé Kamsen (optionnel)" 
                        {...field}
                        value={field.value || ""}
                        data-testid="input-code-parrain"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de début *</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          min={new Date().toISOString().split('T')[0]}
                          {...field}
                          data-testid="input-start-date"
                        />
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
                        <Input 
                          type="date" 
                          min={form.watch("startDate") || new Date().toISOString().split('T')[0]}
                          {...field}
                          data-testid="input-end-date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="paymentAgreement" 
                          checked={field.value === "delivery"}
                          onChange={(e) => field.onChange(e.target.checked ? "delivery" : "")}
                          className="text-kamsen-blue"
                        />
                        <label htmlFor="paymentAgreement" className="text-sm font-medium flex items-center">
                          <Truck className="w-4 h-4 mr-2 text-kamsen-blue" />
                          J'accepte de payer à la livraison de l'équipement
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (optionnel)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Informations supplémentaires sur votre projet..."
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={createBookingMutation.isPending || form.watch("paymentMethod") !== "delivery"}
                  className="flex-1 bg-kamsen-blue hover:bg-kamsen-blue/90 disabled:bg-gray-300"
                >
                  {createBookingMutation.isPending ? "Envoi..." : "Confirmer la réservation"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
