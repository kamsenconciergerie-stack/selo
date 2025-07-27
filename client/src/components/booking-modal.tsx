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
import { Calendar, MapPin, Clock, Smartphone, CreditCard } from "lucide-react";

interface BookingModalProps {
  equipment: Equipment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const bookingFormSchema = insertBookingSchema.extend({
  startDate: z.string().min(1, "Date de début requise"),
  endDate: z.string().min(1, "Date de fin requise"),
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
      notes: "",
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      return await apiRequest("POST", "/api/bookings", data);
    },
    onSuccess: (booking) => {
      toast({
        title: "Réservation créée",
        description: "Procédez maintenant au paiement pour confirmer votre réservation.",
      });
      setCreatedBooking(booking);
      setShowPayment(true);
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

        {/* Moyens de Paiement Acceptés */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
            <Smartphone className="h-5 w-5 mr-2" />
            Moyens de Paiement Acceptés
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Orange Money</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Wave</span>
            </div>
            <span className="text-xs text-green-600 font-medium ml-auto">
              ✓ Paiement sécurisé
            </span>
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
                  {createBookingMutation.isPending ? "Envoi..." : "Confirmer la réservation"}
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
