import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema, insertInquirySchema } from "@shared/schema";
import { registerPaymentRoutes } from "./payment-routes";
import { authRoutes } from "./auth-routes";
import { partnerRoutes } from "./partner-routes";
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

  // Partner inquiry submission
  app.post("/api/partner-inquiry", async (req, res) => {
    try {
      const partnerInquirySchema = z.object({
        firstName: z.string().min(2),
        lastName: z.string().min(2),
        phone: z.string().min(9),
        email: z.string().email(),
        website: z.string().optional(),
        equipmentCategories: z.array(z.string()).min(1)
      });
      
      const validatedData = partnerInquirySchema.parse(req.body);
      
      // Store as a special inquiry type for partners
      const inquiry = await storage.createInquiry({
        name: `${validatedData.firstName} ${validatedData.lastName}`,
        email: validatedData.email,
        phone: validatedData.phone,
        category: "Partenariat",
        message: `Demande de partenariat pour les catégories: ${validatedData.equipmentCategories.join(", ")}${validatedData.website ? `. Site web: ${validatedData.website}` : ''}`
      });
      
      res.status(201).json({ message: "Demande de partenariat reçue avec succès", inquiry });
    } catch (error) {
      console.error("Error creating partner inquiry:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Données invalides", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Erreur lors de l'envoi de la demande" });
    }
  });

  // Quote request submission
  app.post("/api/quote-request", async (req, res) => {
    try {
      const quoteRequestSchema = z.object({
        name: z.string().min(2),
        email: z.string().email(),
        phone: z.string().min(9),
        company: z.string().optional(),
        category: z.string().min(1),
        equipment: z.string().min(2),
        startDate: z.string().min(1),
        duration: z.string().min(1),
        location: z.string().min(2),
        message: z.string().min(10)
      });
      
      const validatedData = quoteRequestSchema.parse(req.body);
      
      // Store as a special inquiry type for quote requests
      const inquiry = await storage.createInquiry({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        category: "Demande de devis",
        message: `Demande de devis pour ${validatedData.equipment} (${validatedData.category})
        
Entreprise: ${validatedData.company || 'Non spécifiée'}
Date de début: ${validatedData.startDate}
Durée: ${validatedData.duration}
Lieu: ${validatedData.location}

Détails du projet:
${validatedData.message}`
      });
      
      res.status(201).json({ message: "Demande de devis reçue avec succès", inquiry });
    } catch (error) {
      console.error("Error creating quote request:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Données invalides", 
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
        "Camion porteur",
        "Camion semi-remorque", 
        "Camionnette / Fourgon",
        "Camion benne",
        "Engins de Chantier",
        "Outils à Main",
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
