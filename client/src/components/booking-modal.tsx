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
import PaymentModal from "./payment-modal";
import { Calendar, MapPin, Clock, Smartphone, CreditCard, Truck } from "lucide-react";

interface BookingModalProps {
  equipment: Equipment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const bookingFormSchema = insertBookingSchema.extend({
  startDate: z.string().min(1, "Date de début requise"),
  endDate: z.string().min(1, "Date de fin requise"),
  paymentMethod: z.enum(["delivery", "mobile"], {
    required_error: "Veuillez sélectionner un mode de paiement",
  }),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

export default function BookingModal({ equipment, open, onOpenChange }: BookingModalProps) {
  const [showPayment, setShowPayment] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
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
      paymentMethod: "delivery",
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
    onSuccess: (booking) => {
      const formData = form.getValues();
      if (formData.paymentMethod === "delivery") {
        toast({
          title: "Réservation confirmée",
          description: "Votre réservation est confirmée. Vous paierez à la réception de l'équipement.",
        });
        handleCloseBooking();
      } else {
        toast({
          title: "Réservation créée",
          description: "Procédez maintenant au paiement mobile pour confirmer votre réservation.",
        });
        setCreatedBooking(booking);
        setShowPayment(true);
      }
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
    setCreatedBooking(null);
    setShowPayment(false);
  };

  const handlePaymentClose = () => {
    setShowPayment(false);
    handleCloseBooking();
  };

  return (
    <>
    <Dialog open={open && !showPayment} onOpenChange={handleCloseBooking}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Réserver {equipment.name}
          </DialogTitle>
        </DialogHeader>

        {/* Options de Paiement */}
        <div className="bg-kamsen-blue-light border border-kamsen-blue rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-kamsen-blue mb-3 flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Options de Paiement Disponibles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-kamsen-orange rounded flex items-center justify-center">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-sm font-medium text-kamsen-blue">Paiement à la livraison</span>
                <div className="text-xs text-green-600 font-medium">
                  ✓ Payez quand vous recevez l'équipement
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-kamsen-blue rounded flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-sm font-medium text-kamsen-blue">Mobile Money</span>
                <div className="text-xs text-green-600 font-medium">
                  ✓ Paiement immédiat et sécurisé
                </div>
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
                    <FormLabel>Nom complet</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre nom complet" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="votre@email.com" {...field} />
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
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="+221 XX XXX XXXX" {...field} />
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
                      <FormLabel>Date de début</FormLabel>
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
                      <FormLabel>Date de fin</FormLabel>
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
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode de paiement</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="delivery" 
                            name="paymentMethod"
                            value="delivery"
                            checked={field.value === "delivery"}
                            onChange={() => field.onChange("delivery")}
                            className="text-kamsen-blue"
                          />
                          <label htmlFor="delivery" className="text-sm font-medium flex items-center">
                            <Truck className="w-4 h-4 mr-2 text-kamsen-blue" />
                            Paiement à la réception de l'équipement
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="mobile" 
                            name="paymentMethod"
                            value="mobile"
                            checked={field.value === "mobile"}
                            onChange={() => field.onChange("mobile")}
                            className="text-kamsen-blue"
                          />
                          <label htmlFor="mobile" className="text-sm font-medium flex items-center">
                            <Smartphone className="w-4 h-4 mr-2 text-kamsen-blue" />
                            Paiement mobile immédiat
                          </label>
                        </div>
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
                  disabled={createBookingMutation.isPending}
                  className="flex-1 bg-kamsen-blue hover:bg-kamsen-blue/90"
                >
                  {createBookingMutation.isPending ? "Envoi..." : 
                    form.watch("paymentMethod") === "delivery" ? "Confirmer la réservation" : "Réserver et payer"
                  }
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
    
    {/* Payment Modal */}
    {createdBooking && (
      <PaymentModal
        booking={createdBooking}
        open={showPayment}
        onOpenChange={handlePaymentClose}
      />
    )}
    </>
  );
}
