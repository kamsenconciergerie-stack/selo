import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema, insertInquirySchema } from "@shared/schema";
import { registerPaymentRoutes } from "./payment-routes";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Equipment routes
  app.get("/api/equipment", async (req, res) => {
    try {
      const { category, search, location } = req.query;
      
      let equipment;
      if (search) {
        equipment = await storage.searchEquipment(
          search as string, 
          location as string | undefined
        );
      } else if (category) {
        equipment = await storage.getEquipmentByCategory(category as string);
      } else {
        equipment = await storage.getAllEquipment();
      }
      
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des équipements" });
    }
  });

  app.get("/api/equipment/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const equipment = await storage.getEquipmentById(id);
      
      if (!equipment) {
        return res.status(404).json({ message: "Équipement non trouvé" });
      }
      
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération de l'équipement" });
    }
  });

  // Bookings routes
  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(validatedData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Données de réservation invalides", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Erreur lors de la création de la réservation" });
    }
  });

  // Inquiries routes
  app.post("/api/inquiries", async (req, res) => {
    try {
      const validatedData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(validatedData);
      res.status(201).json(inquiry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Données de demande invalides", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Erreur lors de l'envoi de la demande" });
    }
  });

  // Categories route
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = [
        "Outils à Main",
        "Engins de Chantier", 
        "Équipement Électrique",
        "Sécurité & EPI"
      ];
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des catégories" });
    }
  });

  // Register payment routes
  registerPaymentRoutes(app);

  // Register auth routes
  app.use('/api/auth', authRoutes);
  
  // Register partner routes
  app.use('/api/partners', partnerRoutes);

  const httpServer = createServer(app);
  return httpServer;
}
