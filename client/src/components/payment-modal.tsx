import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Loader2, CreditCard, Smartphone, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { apiRequest } from "../lib/queryClient";
import { Booking } from "../../shared/schema";

interface PaymentModalProps {
  booking: Booking;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  logo: string;
  available: boolean;
}

export default function PaymentModal({ booking, open, onOpenChange }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [transactionId, setTransactionId] = useState<string>("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get available payment methods
  const { data: paymentMethods, isLoading: methodsLoading } = useQuery<PaymentMethod[]>({
    queryKey: ["/api/payment/methods"],
    enabled: open,
  });

  // Initiate payment mutation
  const initializePayment = useMutation({
    mutationFn: async (data: { bookingId: number; paymentMethod: string; phoneNumber: string }) => {
      const response = await apiRequest({
        url: "/api/payment/initiate",
        method: "POST",
        body: data,
      });
      return response;
    },
    onSuccess: (data) => {
      if (data.success) {
        setTransactionId(data.transactionId);
        setPaymentStatus("processing");
        toast({
          title: "Paiement initié",
          description: "Vérifiez votre téléphone pour confirmer le paiement",
        });
        
        // Check payment status periodically
        checkPaymentStatus(data.transactionId);
      } else {
        setPaymentStatus("error");
        toast({
          title: "Erreur de paiement",
          description: data.message,
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      setPaymentStatus("error");
      toast({
        title: "Erreur de paiement",
        description: "Une erreur est survenue lors de l'initialisation du paiement",
        variant: "destructive",
      });
    },
  });

  // Check payment status
  const checkPaymentStatus = async (txId: string) => {
    let attempts = 0;
    const maxAttempts = 20; // 2 minutes total (6s * 20)
    
    const checkStatus = async () => {
      try {
        const response = await apiRequest({
          url: `/api/payment/status/${txId}?method=${selectedMethod}`,
          method: "GET",
        });

        if (response.status === "completed") {
          setPaymentStatus("success");
          toast({
            title: "Paiement réussi",
            description: "Votre réservation a été confirmée",
          });
          queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
          return;
        } else if (response.status === "failed") {
          setPaymentStatus("error");
          toast({
            title: "Paiement échoué",
            description: "Le paiement n'a pas pu être traité",
            variant: "destructive",
          });
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 6000); // Check every 6 seconds
        } else {
          setPaymentStatus("error");
          toast({
            title: "Délai d'attente dépassé",
            description: "Le paiement prend plus de temps que prévu",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        setPaymentStatus("error");
      }
    };

    setTimeout(checkStatus, 3000); // First check after 3 seconds
  };

  const handlePayment = () => {
    if (!selectedMethod || !phoneNumber) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez sélectionner une méthode de paiement et saisir votre numéro",
        variant: "destructive",
      });
      return;
    }

    // Validate Senegalese phone number
    const phoneRegex = /^(\+221|221)?[0-9]{9}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ""))) {
      toast({
        title: "Numéro invalide",
        description: "Veuillez saisir un numéro de téléphone sénégalais valide",
        variant: "destructive",
      });
      return;
    }

    initializePayment.mutate({
      bookingId: booking.id,
      paymentMethod: selectedMethod,
      phoneNumber: phoneNumber.replace(/\s/g, ""),
    });
  };

  const handleClose = () => {
    if (paymentStatus !== "processing") {
      onOpenChange(false);
      setPaymentStatus("idle");
      setSelectedMethod("");
      setPhoneNumber("");
      setTransactionId("");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-SN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Paiement de la réservation</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-kamsen-gray">Équipement:</span>
                <span className="font-medium">{booking.equipmentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-kamsen-gray">Client:</span>
                <span className="font-medium">{booking.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-kamsen-gray">Période:</span>
                <span className="font-medium">{booking.startDate} - {booking.endDate}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span className="text-kamsen-blue">{formatPrice(booking.totalPrice)} XOF</span>
              </div>
            </CardContent>
          </Card>

          {paymentStatus === "idle" && (
            <>
              {/* Payment Methods */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Méthode de paiement</Label>
                {methodsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                    {paymentMethods?.filter(method => method.available).map((method) => (
                      <div key={method.id} className="flex items-center space-x-3 border rounded-lg p-3">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <Label htmlFor={method.id} className="flex items-center space-x-3 cursor-pointer flex-1">
                          <div className="w-8 h-8 bg-kamsen-blue-light rounded flex items-center justify-center">
                            {method.id === "orange_money" ? (
                              <Smartphone className="h-5 w-5 text-orange-500" />
                            ) : (
                              <CreditCard className="h-5 w-5 text-blue-500" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{method.name}</div>
                            <div className="text-sm text-kamsen-gray">{method.description}</div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="77 123 45 67"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <p className="text-xs text-kamsen-gray">
                  Saisissez le numéro associé à votre compte {selectedMethod === "orange_money" ? "Orange Money" : "Wave"}
                </p>
              </div>

              {/* Action Button */}
              <Button 
                onClick={handlePayment} 
                className="w-full" 
                size="lg"
                disabled={!selectedMethod || !phoneNumber || initializePayment.isPending}
              >
                {initializePayment.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Initialisation...
                  </>
                ) : (
                  `Payer ${formatPrice(booking.totalPrice)} XOF`
                )}
              </Button>
            </>
          )}

          {/* Payment Processing */}
          {paymentStatus === "processing" && (
            <div className="text-center space-y-4 py-8">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-kamsen-blue" />
              <div>
                <h3 className="font-medium text-lg">Paiement en cours...</h3>
                <p className="text-kamsen-gray mt-2">
                  Vérifiez votre téléphone et confirmez la transaction
                </p>
                <p className="text-sm text-kamsen-gray mt-2">
                  Transaction ID: {transactionId}
                </p>
              </div>
            </div>
          )}

          {/* Payment Success */}
          {paymentStatus === "success" && (
            <div className="text-center space-y-4 py-8">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
              <div>
                <h3 className="font-medium text-lg text-green-700">Paiement réussi!</h3>
                <p className="text-kamsen-gray mt-2">
                  Votre réservation a été confirmée
                </p>
              </div>
              <Button onClick={handleClose} className="w-full">
                Fermer
              </Button>
            </div>
          )}

          {/* Payment Error */}
          {paymentStatus === "error" && (
            <div className="text-center space-y-4 py-8">
              <XCircle className="h-12 w-12 mx-auto text-red-500" />
              <div>
                <h3 className="font-medium text-lg text-red-700">Paiement échoué</h3>
                <p className="text-kamsen-gray mt-2">
                  Une erreur est survenue lors du paiement
                </p>
              </div>
              <div className="space-y-2">
                <Button onClick={() => setPaymentStatus("idle")} variant="outline" className="w-full">
                  Réessayer
                </Button>
                <Button onClick={handleClose} variant="ghost" className="w-full">
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}