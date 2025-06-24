import { Request, Response, Express } from "express";
import { z } from "zod";
import { storage } from "./storage.js";
import { paymentService } from "./payment-service.js";
import { insertPaymentSchema } from "../shared/schema.js";

const initiatePaymentSchema = z.object({
  bookingId: z.number(),
  paymentMethod: z.enum(["orange_money", "wave"]),
  phoneNumber: z.string().min(8),
});

const webhookSchema = z.object({
  transaction_id: z.string(),
  status: z.string(),
  amount: z.number().optional(),
  reference: z.string().optional(),
});

export function registerPaymentRoutes(app: Express) {
  // Initiate payment
  app.post("/api/payment/initiate", async (req: Request, res: Response) => {
    try {
      const { bookingId, paymentMethod, phoneNumber } = initiatePaymentSchema.parse(req.body);

      // Get booking details
      const booking = await storage.getBookingsByEquipment(0).then(bookings => 
        bookings.find(b => b.id === bookingId)
      );

      if (!booking) {
        return res.status(404).json({ error: "Réservation non trouvée" });
      }

      if (booking.paymentStatus === "completed") {
        return res.status(400).json({ error: "Cette réservation est déjà payée" });
      }

      // Create payment record
      const payment = await storage.createPayment({
        bookingId,
        amount: booking.totalPrice,
        paymentMethod,
        phoneNumber,
        status: "pending"
      });

      // Initiate payment with provider
      const paymentResponse = await paymentService.initiatePayment(
        paymentMethod,
        booking.totalPrice,
        phoneNumber,
        `booking-${bookingId}`
      );

      if (paymentResponse.success && paymentResponse.transactionId) {
        // Update payment with transaction ID
        await storage.updatePaymentStatus(
          payment.id,
          "initiated",
          paymentResponse.transactionId
        );

        // Update booking payment reference
        await storage.updateBookingPaymentStatus(
          bookingId,
          "initiated",
          paymentResponse.transactionId
        );

        res.json({
          success: true,
          paymentId: payment.id,
          transactionId: paymentResponse.transactionId,
          paymentUrl: paymentResponse.paymentUrl,
          message: "Paiement initié avec succès"
        });
      } else {
        // Update payment status to failed
        await storage.updatePaymentStatus(payment.id, "failed");
        
        res.status(400).json({
          success: false,
          message: paymentResponse.message
        });
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      res.status(500).json({ error: "Erreur lors de l'initialisation du paiement" });
    }
  });

  // Check payment status
  app.get("/api/payment/status/:transactionId", async (req: Request, res: Response) => {
    try {
      const { transactionId } = req.params;
      const { method } = req.query;

      if (!method || typeof method !== "string") {
        return res.status(400).json({ error: "Méthode de paiement requise" });
      }

      const statusResponse = await paymentService.checkPaymentStatus(method, transactionId);
      
      // Find payment by transaction ID
      const allBookings = await storage.getBookingsByEquipment(0);
      const booking = allBookings.find(b => b.paymentReference === transactionId);
      
      if (booking) {
        const payment = await storage.getPaymentByBookingId(booking.id);
        
        if (payment && statusResponse.status === "completed") {
          // Update payment and booking status
          await storage.updatePaymentStatus(payment.id, "completed");
          await storage.updateBookingPaymentStatus(booking.id, "completed", transactionId);
        } else if (payment && statusResponse.status === "failed") {
          await storage.updatePaymentStatus(payment.id, "failed");
          await storage.updateBookingPaymentStatus(booking.id, "failed", transactionId);
        }
      }

      res.json({
        status: statusResponse.status,
        transactionId,
        message: statusResponse.message
      });
    } catch (error) {
      console.error("Payment status check error:", error);
      res.status(500).json({ error: "Erreur lors de la vérification du statut" });
    }
  });

  // Orange Money webhook
  app.post("/api/payment/webhook/orange", async (req: Request, res: Response) => {
    try {
      const webhookData = webhookSchema.parse(req.body);
      
      // Find booking by transaction reference
      const allBookings = await storage.getBookingsByEquipment(0);
      const booking = allBookings.find(b => b.paymentReference === webhookData.transaction_id);
      
      if (booking) {
        const payment = await storage.getPaymentByBookingId(booking.id);
        
        if (payment) {
          const status = webhookData.status === "SUCCESS" ? "completed" : "failed";
          await storage.updatePaymentStatus(payment.id, status);
          await storage.updateBookingPaymentStatus(booking.id, status, webhookData.transaction_id);
        }
      }

      res.json({ status: "ok" });
    } catch (error) {
      console.error("Orange Money webhook error:", error);
      res.status(500).json({ error: "Erreur webhook" });
    }
  });

  // Wave webhook
  app.post("/api/payment/webhook/wave", async (req: Request, res: Response) => {
    try {
      const webhookData = webhookSchema.parse(req.body);
      
      // Find booking by transaction reference
      const allBookings = await storage.getBookingsByEquipment(0);
      const booking = allBookings.find(b => b.paymentReference === webhookData.transaction_id);
      
      if (booking) {
        const payment = await storage.getPaymentByBookingId(booking.id);
        
        if (payment) {
          const status = webhookData.status === "completed" ? "completed" : "failed";
          await storage.updatePaymentStatus(payment.id, status);
          await storage.updateBookingPaymentStatus(booking.id, status, webhookData.transaction_id);
        }
      }

      res.json({ status: "ok" });
    } catch (error) {
      console.error("Wave webhook error:", error);
      res.status(500).json({ error: "Erreur webhook" });
    }
  });

  // Get payment methods
  app.get("/api/payment/methods", async (req: Request, res: Response) => {
    try {
      const availableMethods = paymentService.getAvailableProviders();
      
      const methods = [
        {
          id: "orange_money",
          name: "Orange Money",
          description: "Paiement via Orange Money",
          logo: "/images/orange-money-logo.png",
          available: availableMethods.includes("orange_money")
        },
        {
          id: "wave",
          name: "Wave",
          description: "Paiement via Wave",
          logo: "/images/wave-logo.png",
          available: availableMethods.includes("wave")
        }
      ];

      res.json(methods);
    } catch (error) {
      console.error("Get payment methods error:", error);
      res.status(500).json({ error: "Erreur lors de la récupération des méthodes de paiement" });
    }
  });
}