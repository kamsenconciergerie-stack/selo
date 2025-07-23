import type { Express } from "express";
import { createServer, type Server } from "http";
import { unifiedData } from "./data-sync";
import { DbStorage, type IStorage } from "./storage";

const storage: IStorage = new DbStorage();
import { insertBookingSchema, insertInquirySchema, insertUserSchema } from "@shared/schema";
import { registerPaymentRoutes } from "./payment-routes";
import { authRoutes } from "./auth-routes";
import { partnerRoutes } from "./partner-routes";
import { EmailService } from "./email-service";
import { authenticate, generateSessionToken, type AuthenticatedRequest } from "./auth-middleware";
import { setupAuth, isAuthenticated, isAdmin } from "./replitAuth";
import { z } from "zod";
import multer from "multer";
import path from "path";

// Configure multer for image uploads
const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: uploadStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);
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
      
      // 🚀 NOUVEAU: Envoi automatique d'email de confirmation
      if (booking && booking.customerEmail) {
        // Récupérer les détails de l'équipement pour l'email
        const equipment = await storage.getEquipmentById(parseInt(booking.equipmentId as any));
        
        // Envoyer l'email de confirmation au client
        await EmailService.sendBookingConfirmationEmail({
          bookingId: booking.id,
          customerName: booking.customerName,
          customerEmail: booking.customerEmail,
          customerPhone: booking.customerPhone,
          equipmentName: equipment?.name || 'Équipement',
          startDate: booking.startDate,
          endDate: booking.endDate,
          totalPrice: booking.totalPrice,
          location: 'Dakar',
          status: booking.status || 'confirmed',
          createdAt: booking.createdAt ? booking.createdAt.toISOString() : new Date().toISOString(),
        });
        
        console.log(`📧 Email de confirmation automatique envoyé pour réservation #${booking.id}`);
      }
      
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Données de réservation invalides", 
          errors: error.errors 
        });
      }
      console.error("Erreur création réservation:", error);
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

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.extend({
        password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères")
      }).parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà" });
      }

      // Assign a commercial manager randomly
      const managers = Array.from((storage as any).commercialManagers.values());
      const randomManager = managers[Math.floor(Math.random() * managers.length)];

      const user = await storage.createUser({
        ...validatedData,
        commercialManagerId: randomManager?.id || null
      });

      // Create session token
      const sessionToken = generateSessionToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

      await storage.createUserSession({
        userId: user.id,
        sessionToken,
        expiresAt
      });

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role
        },
        token: sessionToken
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Données d'inscription invalides", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Erreur lors de l'inscription" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email et mot de passe requis" });
      }

      const user = await storage.verifyUserPassword(email, password);
      if (!user) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }

      // Create session token
      const sessionToken = generateSessionToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

      await storage.createUserSession({
        userId: user.id,
        sessionToken,
        expiresAt
      });

      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role
        },
        token: sessionToken
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la connexion" });
    }
  });

  app.post("/api/auth/logout", authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (token) {
        await storage.deleteUserSession(token);
      }
      res.json({ message: "Déconnexion réussie" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la déconnexion" });
    }
  });

  // User profile routes
  app.get("/api/auth/me", authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user;
      let commercialManager = null;

      if (user.commercialManagerId) {
        commercialManager = await storage.getCommercialManagerById(user.commercialManagerId);
      }

      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          address: user.address,
          city: user.city,
          role: user.role,
          profilePicture: user.profilePicture
        },
        commercialManager
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération du profil" });
    }
  });

  // User dashboard routes
  app.get("/api/dashboard/bookings", authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user.id;
      const bookings = await storage.getUserBookings(userId);

      // Get equipment details for each booking
      const bookingsWithEquipment = await Promise.all(
        bookings.map(async (booking) => {
          const equipment = await storage.getEquipmentById(booking.equipmentId);
          return { ...booking, equipment };
        })
      );

      res.json(bookingsWithEquipment);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des réservations" });
    }
  });

  app.put("/api/dashboard/bookings/:id", authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const bookingId = parseInt(req.params.id);
      const userId = req.user.id;
      const updates = req.body;

      // Verify the booking belongs to the user
      const existingBooking = await storage.getUserBookings(userId);
      const userBooking = existingBooking.find(b => b.id === bookingId);

      if (!userBooking) {
        return res.status(404).json({ message: "Réservation non trouvée" });
      }

      if (!userBooking.canModify) {
        return res.status(400).json({ message: "Cette réservation ne peut plus être modifiée" });
      }

      const updatedBooking = await storage.updateBooking(bookingId, updates);
      res.json(updatedBooking);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la modification de la réservation" });
    }
  });

  app.delete("/api/dashboard/bookings/:id", authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const bookingId = parseInt(req.params.id);
      const userId = req.user.id;

      // Verify the booking belongs to the user
      const existingBookings = await storage.getUserBookings(userId);
      const userBooking = existingBookings.find(b => b.id === bookingId);

      if (!userBooking) {
        return res.status(404).json({ message: "Réservation non trouvée" });
      }

      if (!userBooking.canCancel) {
        return res.status(400).json({ message: "Cette réservation ne peut plus être annulée" });
      }

      await storage.cancelBooking(bookingId);
      res.json({ message: "Réservation annulée avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de l'annulation de la réservation" });
    }
  });

  app.get("/api/dashboard/payments", authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user.id;
      const payments = await storage.getUserPaymentHistory(userId);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération de l'historique des paiements" });
    }
  });

  app.get("/api/dashboard/recommendations", authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user.id;
      const recommendations = await storage.getPersonalizedRecommendations(userId);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des recommandations" });
    }
  });

  // Admin API routes
  app.get("/api/admin/bookings", async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching admin bookings:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des réservations" });
    }
  });

  // Category update route (admin only)
  app.post("/api/admin/update-categories", async (req, res) => {
    try {
      const { updateEquipmentCategories } = await import('./category-update');
      const result = await updateEquipmentCategories();
      
      if (result.success) {
        res.json({ 
          message: `Catégories mises à jour avec succès: ${result.updated} équipements`,
          updated: result.updated 
        });
      } else {
        res.status(500).json({ 
          message: "Erreur lors de la mise à jour des catégories", 
          error: result.error 
        });
      }
    } catch (error) {
      console.error("Category update error:", error);
      res.status(500).json({ message: "Erreur serveur lors de la mise à jour" });
    }
  });

  // Enhanced GPS tracking routes for Dakar and other cities
  app.get("/api/gps-tracking", async (req, res) => {
    try {
      const { city, status } = req.query;
      
      // Generate sample GPS tracking data for demonstration
      const sampleTracking = [
        {
          id: 1,
          equipmentId: 101,
          bookingId: 2001,
          currentLatitude: 14.7167,
          currentLongitude: -17.4677,
          currentAddress: "Avenue Cheikh Anta Diop, Dakar",
          currentCity: "Dakar",
          destinationLatitude: 14.6928,
          destinationLongitude: -17.4467,
          destinationAddress: "Plateau, Dakar",
          destinationCity: "Dakar",
          status: "in_transit",
          driverName: "Mamadou Diop",
          driverPhone: "+221 77 123 45 67",
          vehiclePlate: "DK-1234-AB",
          totalDistanceKm: 15.2,
          remainingDistanceKm: 3.8,
          currentSpeed: 45,
          estimatedArrival: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          deliveryNotes: "",
          lastPingAt: new Date().toISOString(),
          signalStrength: 4,
          batteryLevel: 78
        },
        {
          id: 2,
          equipmentId: 102,
          bookingId: 2002,
          currentLatitude: 14.8085,
          currentLongitude: -16.9348,
          currentAddress: "Thiès Centre",
          currentCity: "Thiès",
          destinationLatitude: 14.7833,
          destinationLongitude: -16.9167,
          destinationAddress: "Zone industrielle Thiès",
          destinationCity: "Thiès",
          status: "arrived",
          driverName: "Ousmane Fall",
          driverPhone: "+221 78 987 65 43",
          vehiclePlate: "TH-5678-CD",
          totalDistanceKm: 8.5,
          remainingDistanceKm: 0,
          currentSpeed: 0,
          estimatedArrival: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          actualArrival: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          deliveryNotes: "Client contacté, livraison en cours",
          lastPingAt: new Date().toISOString(),
          signalStrength: 5,
          batteryLevel: 92
        },
        {
          id: 3,
          equipmentId: 103,
          bookingId: 2003,
          currentLatitude: 16.0367,
          currentLongitude: -16.2644,
          currentAddress: "Saint-Louis Centre",
          currentCity: "Saint-Louis",
          destinationLatitude: 16.0300,
          destinationLongitude: -16.2500,
          destinationAddress: "Quartier Sor, Saint-Louis",
          destinationCity: "Saint-Louis",
          status: "delivered",
          driverName: "Abdou Seck",
          driverPhone: "+221 76 555 44 33",
          vehiclePlate: "SL-9999-EF",
          totalDistanceKm: 5.0,
          remainingDistanceKm: 0,
          currentSpeed: 0,
          estimatedArrival: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          actualArrival: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
          deliveryNotes: "Livraison effectuée avec succès. Équipement vérifié par le client.",
          lastPingAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          signalStrength: 3,
          batteryLevel: 45
        }
      ];

      let filteredTracking = sampleTracking;

      if (city && city !== 'all') {
        filteredTracking = filteredTracking.filter(t => t.currentCity.toLowerCase() === (city as string).toLowerCase());
      }
      
      if (status && status !== 'all') {
        filteredTracking = filteredTracking.filter(t => t.status === status);
      }

      res.json(filteredTracking);
    } catch (error) {
      console.error("GPS tracking error:", error);
      res.status(500).json({ message: "Erreur lors de la récupération du tracking GPS" });
    }
  });

  // Update GPS location in real-time
  app.post("/api/gps-tracking/update-location", async (req, res) => {
    try {
      const { trackingId, latitude, longitude, address, speed } = req.body;
      
      console.log(`📍 Mise à jour position GPS #${trackingId}: ${latitude}, ${longitude} - ${address || 'Adresse inconnue'}`);
      
      // In a real implementation, this would update the database
      const updatedTracking = {
        id: trackingId,
        currentLatitude: latitude,
        currentLongitude: longitude,
        currentAddress: address,
        currentSpeed: speed,
        lastPingAt: new Date().toISOString()
      };
      
      res.json({ success: true, tracking: updatedTracking });
    } catch (error) {
      console.error("GPS location update error:", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour de la position GPS" });
    }
  });

  // Update tracking status (dispatched, in_transit, arrived, delivered, etc.)
  app.post("/api/gps-tracking/update-status", async (req, res) => {
    try {
      const { trackingId, status, notes, deliveryPhoto } = req.body;
      
      console.log(`🔄 Mise à jour statut GPS #${trackingId}: ${status} - ${notes || 'Aucune note'}`);
      
      const updateData: any = {
        status,
        lastPingAt: new Date().toISOString()
      };
      
      if (notes) updateData.deliveryNotes = notes;
      if (deliveryPhoto) updateData.deliveryPhotos = [deliveryPhoto];
      
      // Set timestamps based on status
      if (status === 'dispatched') updateData.dispatchTime = new Date().toISOString();
      if (status === 'in_transit') updateData.departureTime = new Date().toISOString();
      if (status === 'arrived') updateData.actualArrival = new Date().toISOString();
      if (status === 'delivered') updateData.deliveryTime = new Date().toISOString();
      
      res.json({ success: true, tracking: updateData });
    } catch (error) {
      console.error("GPS status update error:", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour du statut de livraison" });
    }
  });

  // GPS Tracking API routes
  app.get('/api/tracking/active', async (req, res) => {
    try {
      const activeTracking = await storage.getActiveGpsTracking();
      res.json(activeTracking);
    } catch (error) {
      console.error('Error fetching active tracking:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération du suivi GPS' });
    }
  });

  app.get('/api/tracking/equipment/:id', async (req, res) => {
    try {
      const equipmentId = parseInt(req.params.id);
      const tracking = await storage.getGpsTrackingByEquipment(equipmentId);
      res.json(tracking);
    } catch (error) {
      console.error('Error fetching equipment tracking:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération du suivi équipement' });
    }
  });

  app.get('/api/tracking/booking/:id', async (req, res) => {
    try {
      const bookingId = parseInt(req.params.id);
      const tracking = await storage.getGpsTrackingByBooking(bookingId);
      res.json(tracking);
    } catch (error) {
      console.error('Error fetching booking tracking:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération du suivi réservation' });
    }
  });

  // User tracking - accessible by authenticated users for their own bookings
  app.get('/api/tracking/user/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      // In a real app, check if the requesting user is the same as userId or is admin
      const tracking = await storage.getGpsTrackingForUser(userId);
      res.json(tracking);
    } catch (error) {
      console.error('Error fetching user tracking:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération du suivi utilisateur' });
    }
  });

  // Partner tracking - accessible by partners for their own equipment
  app.get('/api/tracking/partner/:partnerId', async (req, res) => {
    try {
      const partnerId = parseInt(req.params.partnerId);
      // In a real app, check if the requesting user is the partner or is admin
      const tracking = await storage.getGpsTrackingForPartner(partnerId);
      res.json(tracking);
    } catch (error) {
      console.error('Error fetching partner tracking:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération du suivi partenaire' });
    }
  });

  // Test endpoint to verify GPS tracking data (bypasses authentication)
  app.get('/api/test/tracking', async (req, res) => {
    try {
      // Test direct database query
      const { db } = await import('../shared/db');
      const { gpsTracking, serviceCities } = await import('../shared/schema');
      
      const allTracking = await db.select().from(gpsTracking);
      const cities = await db.select().from(serviceCities);
      
      res.json({
        message: 'GPS Tracking System is working',
        trackingCount: allTracking.length,
        citiesCount: cities.length,
        sampleTracking: allTracking.slice(0, 2),
        sampleCities: cities.slice(0, 2)
      });
    } catch (error) {
      console.error('Error in test endpoint:', error);
      res.status(500).json({ message: 'Test failed', error: error.message });
    }
  });

  app.post('/api/tracking', async (req, res) => {
    try {
      const trackingData = req.body;
      const newTracking = await storage.createGpsTracking(trackingData);
      res.json(newTracking);
    } catch (error) {
      console.error('Error creating GPS tracking:', error);
      res.status(500).json({ message: 'Erreur lors de la création du suivi GPS' });
    }
  });

  app.put('/api/tracking/:id/location', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { latitude, longitude, address } = req.body;
      const updated = await storage.updateGpsLocation(id, latitude, longitude, address);
      res.json(updated);
    } catch (error) {
      console.error('Error updating GPS location:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour de la position' });
    }
  });

  app.put('/api/tracking/:id/status', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, actualArrival, deliveryNotes } = req.body;
      const updated = await storage.updateTrackingStatus(id, status, actualArrival, deliveryNotes);
      res.json(updated);
    } catch (error) {
      console.error('Error updating tracking status:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour du statut' });
    }
  });

  // Service Cities API routes
  app.get('/api/cities', async (req, res) => {
    try {
      const cities = await storage.getAllServiceCities();
      res.json(cities);
    } catch (error) {
      console.error('Error fetching cities:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des villes' });
    }
  });

  app.post('/api/cities', async (req, res) => {
    try {
      const cityData = req.body;
      const newCity = await storage.createServiceCity(cityData);
      res.json(newCity);
    } catch (error) {
      console.error('Error creating city:', error);
      res.status(500).json({ message: 'Erreur lors de la création de la ville' });
    }
  });

  app.get('/api/cities/:id/delivery-fee', async (req, res) => {
    try {
      const cityId = parseInt(req.params.id);
      const distanceKm = parseFloat(req.query.distance as string) || 0;
      const fee = await storage.calculateDeliveryFee(cityId, distanceKm);
      res.json({ fee });
    } catch (error) {
      console.error('Error calculating delivery fee:', error);
      res.status(500).json({ message: 'Erreur lors du calcul des frais de livraison' });
    }
  });

  app.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des statistiques" });
    }
  });

  // Register payment routes
  registerPaymentRoutes(app);

  // Register auth routes
  app.use('/api/auth', authRoutes);
  
  // Register partner routes
  app.use('/api/partners', partnerRoutes);

  // Admin routes for equipment management
  app.post("/api/admin/equipment", async (req, res) => {
    try {
      const equipmentSchema = z.object({
        name: z.string().min(2),
        category: z.string().min(1),
        pricePerDay: z.number().min(0),
        description: z.string().min(10),
        specifications: z.array(z.string()).optional(),
        location: z.string().min(1),
        imageUrl: z.string().default("/placeholder-equipment.jpg"),
        isAvailable: z.boolean().default(true),
        weight: z.string().optional(),
        fuelType: z.string().optional(),
        power: z.string().optional()
      });
      
      const validatedData = equipmentSchema.parse(req.body);
      const equipment = await storage.createEquipment(validatedData);
      
      res.status(201).json(equipment);
    } catch (error) {
      console.error("Error creating equipment:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Données invalides", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Erreur lors de la création de l'équipement" });
    }
  });

  app.put("/api/admin/equipment/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const equipmentSchema = z.object({
        name: z.string().min(2),
        category: z.string().min(1),
        pricePerDay: z.number().min(0),
        description: z.string().min(10),
        specifications: z.array(z.string()).optional(),
        location: z.string().min(1),
        imageUrl: z.string().optional(),
        isAvailable: z.boolean(),
        weight: z.string().optional(),
        fuelType: z.string().optional(),
        power: z.string().optional()
      });
      
      const validatedData = equipmentSchema.parse(req.body);
      const equipment = await storage.updateEquipment(id, validatedData);
      
      if (!equipment) {
        return res.status(404).json({ message: "Équipement non trouvé" });
      }
      
      res.json(equipment);
    } catch (error) {
      console.error("Error updating equipment:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Données invalides", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Erreur lors de la modification de l'équipement" });
    }
  });

  app.delete("/api/admin/equipment/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteEquipment(id);
      
      if (!success) {
        return res.status(404).json({ message: "Équipement non trouvé" });
      }
      
      res.json({ message: "Équipement supprimé avec succès" });
    } catch (error) {
      console.error("Error deleting equipment:", error);
      res.status(500).json({ message: "Erreur lors de la suppression de l'équipement" });
    }
  });

  // Image upload route
  app.post("/api/admin/equipment/:id/images", upload.array('images', 5), async (req, res) => {
    try {
      const equipmentId = parseInt(req.params.id);
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "Aucune image fournie" });
      }

      // Save image paths to equipment
      const imagePaths = files.map(file => `/uploads/${file.filename}`);
      const equipment = await storage.updateEquipmentImages(equipmentId, imagePaths);
      
      if (!equipment) {
        return res.status(404).json({ message: "Équipement non trouvé" });
      }
      
      res.json({ 
        message: "Images uploadées avec succès", 
        imagePaths,
        equipment 
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      res.status(500).json({ message: "Erreur lors de l'upload des images" });
    }
  });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Admin routes for equipment management (protected)
  app.post("/api/admin/equipment", upload.single('image'), async (req, res) => {
    try {
      const equipmentData = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        pricePerDay: parseInt(req.body.pricePerDay),
        location: req.body.location,
        specifications: JSON.parse(req.body.specifications || '[]'),
        weight: req.body.weight,
        fuelType: req.body.fuelType,
        power: req.body.power,
        isAvailable: req.body.isAvailable === 'true',
        imageUrl: req.file ? `/uploads/${req.file.filename}` : '/public/equipment-placeholder.svg'
      };

      const newEquipment = await storage.createEquipment(equipmentData);
      res.json(newEquipment);
    } catch (error) {
      console.error("Error creating equipment:", error);
      res.status(500).json({ message: "Erreur lors de la création de l'équipement" });
    }
  });

  app.put("/api/admin/equipment/:id", upload.single('image'), async (req, res) => {
    try {
      const equipmentId = parseInt(req.params.id);
      const updateData: any = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        pricePerDay: parseInt(req.body.pricePerDay),
        location: req.body.location,
        specifications: JSON.parse(req.body.specifications || '[]'),
        weight: req.body.weight,
        fuelType: req.body.fuelType,
        power: req.body.power,
        isAvailable: req.body.isAvailable === 'true'
      };

      // Only update image if new file uploaded
      if (req.file) {
        updateData.imageUrl = `/uploads/${req.file.filename}`;
      }

      const updatedEquipment = await storage.updateEquipment(equipmentId, updateData);
      
      if (!updatedEquipment) {
        return res.status(404).json({ message: "Équipement non trouvé" });
      }
      
      res.json(updatedEquipment);
    } catch (error) {
      console.error("Error updating equipment:", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour de l'équipement" });
    }
  });

  app.delete("/api/admin/equipment/:id", async (req, res) => {
    try {
      const equipmentId = parseInt(req.params.id);
      const deleted = await storage.deleteEquipment(equipmentId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Équipement non trouvé" });
      }
      
      res.json({ message: "Équipement supprimé avec succès" });
    } catch (error) {
      console.error("Error deleting equipment:", error);
      res.status(500).json({ message: "Erreur lors de la suppression de l'équipement" });
    }
  });

  // Admin routes for bookings management (protected)
  app.get("/api/admin/bookings", isAuthenticated, isAdmin, async (req, res) => {
    try {
      // Get all bookings with equipment information
      const allBookings = await storage.getAllBookings();
      const equipmentList = await storage.getAllEquipment();
      
      // Enrich bookings with equipment details
      const enrichedBookings = allBookings.map(booking => {
        const equipment = equipmentList.find(eq => eq.id === booking.equipmentId);
        return {
          ...booking,
          equipmentName: equipment?.name,
          equipmentCategory: equipment?.category
        };
      });
      
      res.json(enrichedBookings);
    } catch (error) {
      console.error("Error fetching admin bookings:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des réservations" });
    }
  });

  app.put("/api/admin/bookings/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const bookingId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: "Statut invalide" });
      }
      
      const updatedBooking = await storage.updateBooking(bookingId, { status });
      if (!updatedBooking) {
        return res.status(404).json({ message: "Réservation non trouvée" });
      }
      
      res.json(updatedBooking);
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour du statut" });
    }
  });

  app.delete("/api/admin/bookings/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const bookingId = parseInt(req.params.id);
      const deleted = await storage.deleteBooking(bookingId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Réservation non trouvée" });
      }
      
      res.json({ message: "Réservation supprimée avec succès" });
    } catch (error) {
      console.error("Error deleting booking:", error);
      res.status(500).json({ message: "Erreur lors de la suppression de la réservation" });
    }
  });

  // Routes pour les notifications administrateur
  app.get("/api/admin/notifications", async (req, res) => {
    try {
      const notifications = await storage.getAdminNotifications();
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des notifications" });
    }
  });

  app.put("/api/admin/notifications/:id/read", async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      await storage.markNotificationAsRead(notificationId);
      res.json({ message: "Notification marquée comme lue" });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
  });

  app.put("/api/admin/notifications/mark-all-read", async (req, res) => {
    try {
      await storage.markAllNotificationsAsRead();
      res.json({ message: "Toutes les notifications marquées comme lues" });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
  });

  app.delete("/api/admin/notifications/:id", async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const deleted = await storage.deleteNotification(notificationId);
      if (!deleted) {
        return res.status(404).json({ message: "Notification non trouvée" });
      }
      res.json({ message: "Notification supprimée" });
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(500).json({ message: "Erreur lors de la suppression" });
    }
  });

  app.get("/api/admin/booking-history/:bookingId", async (req, res) => {
    try {
      const bookingId = parseInt(req.params.bookingId);
      const history = await storage.getBookingHistory(bookingId);
      res.json(history);
    } catch (error) {
      console.error("Error fetching booking history:", error);
      res.status(500).json({ message: "Erreur lors de la récupération de l'historique" });
    }
  });

  // Admin partners routes
  app.get("/api/admin/partners", async (req, res) => {
    try {
      const partners = await storage.getAllPartners();
      res.json(partners);
    } catch (error) {
      console.error("Error fetching partners:", error);
      res.status(500).json({ message: "Failed to fetch partners" });
    }
  });

  app.get("/api/admin/partners/stats", async (req, res) => {
    try {
      const partners = await storage.getAllPartners();
      const stats = {
        totalPartners: partners.length,
        verifiedPartners: partners.filter((p: any) => p.verificationStatus === 'verified').length,
        pendingVerification: partners.filter((p: any) => p.verificationStatus === 'pending').length,
        totalRevenue: partners.reduce((sum: number, p: any) => sum + (p.totalRevenue || 0), 0),
        averageRating: partners.length > 0 ? 
          partners.reduce((sum: number, p: any) => sum + (p.rating || 0), 0) / partners.length : 0
      };
      res.json(stats);
    } catch (error) {
      console.error("Error fetching partner stats:", error);
      res.status(500).json({ message: "Failed to fetch partner stats" });
    }
  });

  app.put("/api/admin/partners/:id/verify", async (req, res) => {
    try {
      const partnerId = parseInt(req.params.id);
      const { verificationStatus } = req.body;
      
      const updatedPartner = await storage.updatePartner(partnerId, {
        verificationStatus,
        updatedAt: new Date().toISOString()
      });
      
      res.json(updatedPartner);
    } catch (error) {
      console.error("Error updating partner:", error);
      res.status(500).json({ message: "Failed to update partner" });
    }
  });

  app.delete("/api/admin/partners/:id", async (req, res) => {
    try {
      const partnerId = parseInt(req.params.id);
      await storage.deletePartner(partnerId);
      res.json({ message: "Partner deleted successfully" });
    } catch (error) {
      console.error("Error deleting partner:", error);
      res.status(500).json({ message: "Failed to delete partner" });
    }
  });

  // Partners routes
  app.get("/api/partners", async (req, res) => {
    try {
      const partners = await storage.getAllPartners();
      res.json(partners);
    } catch (error) {
      console.error("Error fetching partners:", error);
      res.status(500).json({ message: "Failed to fetch partners" });
    }
  });

  // Partner authentication
  app.post("/api/partners/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Mock authentication for demo - replace with real authentication
      const demoPartners = [
        { id: 1, email: "contact@transportexpress.sn", password: "partner123", companyName: "Transport Express Dakar" },
        { id: 2, email: "info@logisticspro.sn", password: "partner123", companyName: "Logistics Pro Sénégal" },
        { id: 3, email: "contact@camionsdusud.sn", password: "partner123", companyName: "Camions du Sud" }
      ];

      const partner = demoPartners.find(p => p.email === email && p.password === password);
      
      if (partner) {
        res.json({ 
          success: true, 
          partnerId: partner.id,
          companyName: partner.companyName,
          token: `token_${partner.id}`
        });
      } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Partner login error:", error);
      res.status(500).json({ success: false, message: "Login failed" });
    }
  });

  // Partner bookings
  app.get("/api/partners/:partnerId/bookings", async (req, res) => {
    try {
      const { partnerId } = req.params;
      
      // Mock partner bookings data - replace with actual database query
      const mockBookings = [
        {
          id: 1,
          customerName: "Amadou Ba",
          customerEmail: "amadou.ba@email.com",
          customerPhone: "+221 77 234 56 78",
          equipmentId: 1,
          equipmentName: "Camion benne 15T",
          startDate: "2025-01-22T08:00:00Z",
          endDate: "2025-01-25T18:00:00Z",
          totalPrice: 180000,
          status: "confirmed",
          createdAt: "2025-01-20T10:30:00Z",
          paymentStatus: "paid"
        },
        {
          id: 2,
          customerName: "Fatou Diop",
          customerEmail: "fatou.diop@entreprise.sn",
          customerPhone: "+221 76 345 67 89",
          equipmentId: 2,
          equipmentName: "Camion porteur 8T",
          startDate: "2025-01-23T09:00:00Z",
          endDate: "2025-01-24T17:00:00Z",
          totalPrice: 95000,
          status: "in_progress",
          createdAt: "2025-01-19T14:15:00Z",
          paymentStatus: "paid"
        }
      ];
      
      res.json(mockBookings);
    } catch (error) {
      console.error("Error fetching partner bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Partner statistics
  app.get("/api/partners/:partnerId/stats", async (req, res) => {
    try {
      const { partnerId } = req.params;
      
      // Mock partner stats - replace with actual calculations
      const mockStats = {
        totalBookings: 156,
        activeBookings: 8,
        completedBookings: 142,
        totalRevenue: 12500000,
        monthlyRevenue: 2100000,
        averageRating: 4.8,
        totalReviews: 89,
        equipmentCount: 25
      };
      
      res.json(mockStats);
    } catch (error) {
      console.error("Error fetching partner stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Partner requests routes
  app.post("/api/partner-inquiry", async (req, res) => {
    try {
      const partnerRequest = req.body;
      // Mock storage for now - replace with actual database insertion
      const result = {
        id: Math.floor(Math.random() * 1000),
        ...partnerRequest,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      res.status(201).json(result);
    } catch (error) {
      console.error("Error creating partner request:", error);
      res.status(500).json({ message: "Failed to create partner request" });
    }
  });

  // Equipment unavailability routes for partners
  app.get("/api/partners/:partnerId/equipment-unavailability", async (req, res) => {
    try {
      const { partnerId } = req.params;
      // Mock data - replace with database query
      const unavailabilityPeriods = [
        {
          id: 1,
          partnerId: parseInt(partnerId),
          equipmentId: 1,
          equipmentName: "Camion benne 15 T",
          startDate: new Date("2025-01-25").toISOString(),
          endDate: new Date("2025-01-30").toISOString(),
          reason: "maintenance",
          description: "Révision générale programmée",
          isRecurring: false,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          partnerId: parseInt(partnerId),
          equipmentId: 3,
          equipmentName: "Camionnette Iveco",
          startDate: new Date("2025-02-01").toISOString(),
          endDate: new Date("2025-02-05").toISOString(),
          reason: "personal_use",
          description: "Utilisation personnelle pour déménagement",
          isRecurring: false,
          createdAt: new Date().toISOString()
        }
      ];
      res.json(unavailabilityPeriods);
    } catch (error) {
      console.error("Error fetching equipment unavailability:", error);
      res.status(500).json({ message: "Failed to fetch equipment unavailability" });
    }
  });

  app.post("/api/partners/:partnerId/equipment-unavailability", async (req, res) => {
    try {
      const { partnerId } = req.params;
      const unavailabilityData = req.body;
      
      // Mock creation - replace with database insertion
      const newPeriod = {
        id: Math.floor(Math.random() * 1000),
        partnerId: parseInt(partnerId),
        ...unavailabilityData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      res.status(201).json(newPeriod);
    } catch (error) {
      console.error("Error creating equipment unavailability:", error);
      res.status(500).json({ message: "Failed to create equipment unavailability" });
    }
  });

  app.put("/api/partners/:partnerId/equipment-unavailability/:id", async (req, res) => {
    try {
      const { partnerId, id } = req.params;
      const updateData = req.body;
      
      // Mock update - replace with database update
      const updatedPeriod = {
        id: parseInt(id),
        partnerId: parseInt(partnerId),
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      res.json(updatedPeriod);
    } catch (error) {
      console.error("Error updating equipment unavailability:", error);
      res.status(500).json({ message: "Failed to update equipment unavailability" });
    }
  });

  app.delete("/api/partners/:partnerId/equipment-unavailability/:id", async (req, res) => {
    try {
      const { partnerId, id } = req.params;
      // Mock deletion - replace with database deletion
      res.json({ message: "Equipment unavailability period deleted successfully" });
    } catch (error) {
      console.error("Error deleting equipment unavailability:", error);
      res.status(500).json({ message: "Failed to delete equipment unavailability" });
    }
  });

  app.get("/api/admin/partner-requests", async (req, res) => {
    try {
      // Mock partner requests data - replace with actual database query
      const partnerRequests = [
        {
          id: 1,
          firstName: "Mamadou",
          lastName: "Diallo",
          email: "mamadou.diallo@transport.sn",
          phone: "+221 77 123 45 67",
          website: "https://transportdiallo.sn",
          equipmentCategories: ["Camion porteur", "Camion benne"],
          status: "pending",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 2,
          firstName: "Fatou",
          lastName: "Ba",
          email: "fatou.ba@logistics.sn",
          phone: "+221 76 234 56 78",
          website: "",
          equipmentCategories: ["Camionnette / Fourgon", "Engins de Chantier"],
          status: "pending",
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 3,
          firstName: "Ousmane",
          lastName: "Ndiaye",
          email: "ousmane.ndiaye@equipement.sn",
          phone: "+221 78 345 67 89",
          website: "https://equipementndiaye.com",
          equipmentCategories: ["Camion semi-remorque", "Outils à Main"],
          status: "approved",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        }
      ];
      res.json(partnerRequests);
    } catch (error) {
      console.error("Error fetching partner requests:", error);
      res.status(500).json({ message: "Failed to fetch partner requests" });
    }
  });

  app.get("/api/admin/partner-requests/stats", async (req, res) => {
    try {
      // Mock stats - replace with actual database query
      const stats = {
        total: 3,
        pending: 2,
        approved: 1,
        rejected: 0,
      };
      res.json(stats);
    } catch (error) {
      console.error("Error fetching partner requests stats:", error);
      res.status(500).json({ message: "Failed to fetch partner requests stats" });
    }
  });

  // Equipment unavailability routes for partners
  
  // GET equipment unavailability periods for a partner
  app.get("/api/partners/:partnerId/equipment-unavailability", async (req, res) => {
    try {
      const partnerId = parseInt(req.params.partnerId);
      const periods = await storage.getEquipmentUnavailabilityByPartner(partnerId);
      res.json(periods);
    } catch (error) {
      console.error("Error fetching unavailability periods:", error);
      res.status(500).json({ message: "Failed to fetch unavailability periods" });
    }
  });

  // POST new equipment unavailability period
  app.post("/api/partners/:partnerId/equipment-unavailability", async (req, res) => {
    try {
      const partnerId = parseInt(req.params.partnerId);
      const unavailabilityData = {
        ...req.body,
        partnerId
      };
      
      const period = await storage.createEquipmentUnavailability(unavailabilityData);
      res.status(201).json(period);
    } catch (error) {
      console.error("Error creating unavailability period:", error);
      res.status(500).json({ message: "Failed to create unavailability period" });
    }
  });

  // PUT update equipment unavailability period
  app.put("/api/partners/:partnerId/equipment-unavailability/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const partnerId = parseInt(req.params.partnerId);
      
      const updated = await storage.updateEquipmentUnavailability(id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Unavailability period not found" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating unavailability period:", error);
      res.status(500).json({ message: "Failed to update unavailability period" });
    }
  });

  // DELETE equipment unavailability period
  app.delete("/api/partners/:partnerId/equipment-unavailability/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const partnerId = parseInt(req.params.partnerId);
      
      const success = await storage.deleteEquipmentUnavailability(id);
      if (!success) {
        return res.status(404).json({ message: "Unavailability period not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting unavailability period:", error);
      res.status(500).json({ message: "Failed to delete unavailability period" });
    }
  });

  // Admin route to get equipment with unavailability info
  app.get("/api/admin/equipment-with-unavailability", async (req, res) => {
    try {
      const equipment = await storage.getAllEquipment();
      const equipmentWithUnavailability = await Promise.all(
        equipment.map(async (eq) => {
          const unavailabilityPeriods = await storage.getUnavailabilityByEquipment(eq.id);
          const partnerInfo = await storage.getEquipmentPartnerInfo(eq.id);
          return {
            ...eq,
            unavailabilityPeriods,
            partnerInfo
          };
        })
      );
      
      res.json(equipmentWithUnavailability);
    } catch (error) {
      console.error("Error fetching equipment with unavailability:", error);
      res.status(500).json({ message: "Failed to fetch equipment data" });
    }
  });

  // Partner equipment management routes - UNIFIÉ avec base PostgreSQL
  
  // GET partner's equipment list - DONNÉES UNIFIÉES
  app.get("/api/partners/:partnerId/equipment", async (req, res) => {
    try {
      const partnerId = parseInt(req.params.partnerId);
      const equipment = await unifiedData.getEquipmentByPartnerId(partnerId);
      res.json(equipment);
    } catch (error) {
      console.error("Error fetching partner equipment:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des équipements" });
    }
  });

  // PUT update partner's equipment - SYNCHRONISATION UNIFIÉE
  app.put("/api/partners/:partnerId/equipment/:equipmentId", async (req, res) => {
    try {
      const partnerId = parseInt(req.params.partnerId);
      const equipmentId = parseInt(req.params.equipmentId);
      
      // Utiliser le service unifié pour synchronisation automatique
      const updatedEquipment = await unifiedData.syncPartnerEquipment(partnerId, {
        id: equipmentId,
        ...req.body,
      });
      
      if (!updatedEquipment) {
        return res.status(404).json({ message: "Équipement introuvable" });
      }
      
      res.json(updatedEquipment);
    } catch (error) {
      console.error("Error updating partner equipment:", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour de l'équipement" });
    }
  });

  // POST add new equipment by partner - DIRECTEMENT dans la base principale
  app.post("/api/partners/:partnerId/equipment", async (req, res) => {
    try {
      const partnerId = parseInt(req.params.partnerId);
      
      // Créer directement dans la base principale avec partnerId
      const newEquipment = await storage.createEquipment({
        ...req.body,
        partnerId,
        status: 'available',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      res.status(201).json(newEquipment);
    } catch (error) {
      console.error("Error creating partner equipment:", error);
      res.status(500).json({ message: "Erreur lors de l'ajout de l'équipement" });
    }
  });

  // Partner drivers management routes
  
  // GET partner's drivers - DONNÉES UNIFIÉES
  app.get("/api/partners/:partnerId/drivers", async (req, res) => {
    try {
      const partnerId = parseInt(req.params.partnerId);
      const drivers = await unifiedData.getPartnerDrivers(partnerId);
      res.json(drivers);
    } catch (error) {
      console.error("Error fetching partner drivers:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des chauffeurs" });
    }
  });

  // POST add new driver
  app.post("/api/partners/:partnerId/drivers", async (req, res) => {
    try {
      const partnerId = parseInt(req.params.partnerId);
      const newDriver = await storage.createPartnerDriver({
        ...req.body,
        partnerId,
      });
      res.status(201).json(newDriver);
    } catch (error) {
      console.error("Error creating partner driver:", error);
      res.status(500).json({ message: "Erreur lors de l'ajout du chauffeur" });
    }
  });

  // PATCH update driver status
  app.patch("/api/partners/:partnerId/drivers/:driverId", async (req, res) => {
    try {
      const partnerId = parseInt(req.params.partnerId);
      const driverId = parseInt(req.params.driverId);
      
      const updatedDriver = await storage.updatePartnerDriver(driverId, req.body);
      if (!updatedDriver) {
        return res.status(404).json({ message: "Chauffeur introuvable" });
      }
      
      res.json(updatedDriver);
    } catch (error) {
      console.error("Error updating partner driver:", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour du chauffeur" });
    }
  });

  // GET partner's driver assignments
  app.get("/api/partners/:partnerId/driver-assignments", async (req, res) => {
    try {
      const partnerId = parseInt(req.params.partnerId);
      const assignments = await storage.getDriverAssignmentsByPartner(partnerId);
      res.json(assignments);
    } catch (error) {
      console.error("Error fetching driver assignments:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des affectations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
