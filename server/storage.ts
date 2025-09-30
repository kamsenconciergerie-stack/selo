import { 
  Equipment, 
  Booking, 
  Payment, 
  Inquiry, 
  ChatbotQuote,
  User,
  Review,
  EquipmentTracking,
  MaintenanceSchedule,
  Location,
  EquipmentInventory,
  Notification,
  CommercialManager,
  UserSession,
  GpsTracking,
  DeliveryRoute,
  ServiceCity,
  PartnerEarnings,
  Partner,
  PartnerDriver,
  PartnerRequest,
  InsertEquipment, 
  InsertBooking, 
  InsertPayment, 
  InsertInquiry,
  InsertChatbotQuote,
  InsertUser,
  InsertReview,
  InsertTracking,
  InsertMaintenance,
  InsertLocation,
  InsertInventory,
  InsertNotification,
  InsertCommercialManager,
  InsertUserSession,
  InsertGpsTracking,
  InsertDeliveryRoute,
  InsertServiceCity,
  InsertPartnerEarnings,
  InsertPartner,
  InsertPartnerDriver,
  InsertPartnerRequest
} from "@shared/schema";
import bcrypt from "bcrypt";
import { 
  equipment, 
  bookings, 
  payments, 
  inquiries,
  chatbotQuotes,
  users,
  reviews,
  equipmentTracking,
  maintenanceSchedule,
  locations,
  equipmentInventory,
  notifications,
  analytics,
  commercialManagers,
  userSessions,
  partnerRequests,
  gpsTracking,
  deliveryRoutes,
  serviceCities,
  partnerEarnings,
  partners,
  partnerDrivers,
  driverAssignments
} from "../shared/schema";
import { eq, ilike, or, desc } from "drizzle-orm";
import { db } from "../shared/db";

export interface IStorage {
  // Equipment methods
  getAllEquipment(): Promise<Equipment[]>;
  getEquipmentById(id: number): Promise<Equipment | undefined>;
  getEquipmentByCategory(category: string): Promise<Equipment[]>;
  searchEquipment(query: string, location?: string): Promise<Equipment[]>;
  createEquipment(equipment: InsertEquipment): Promise<Equipment>;
  updateEquipment(id: number, equipment: Partial<InsertEquipment>): Promise<Equipment | undefined>;
  deleteEquipment(id: number): Promise<boolean>;
  updateEquipmentImages(id: number, imagePaths: string[]): Promise<Equipment | undefined>;
  
  // Booking methods
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingsByEquipment(equipmentId: number): Promise<Booking[]>;
  getBookingsByUser(userId: number): Promise<Booking[]>;
  getAllBookings(): Promise<Booking[]>;
  updateBooking(id: number, booking: Partial<InsertBooking>): Promise<Booking | undefined>;
  deleteBooking(id: number): Promise<boolean>;
  updateBookingPaymentStatus(bookingId: number, paymentStatus: string, paymentReference?: string): Promise<void>;

  // Partner earnings methods
  createPartnerEarning(earning: InsertPartnerEarnings): Promise<PartnerEarnings>;
  getPartnerEarningsByBooking(bookingId: number): Promise<PartnerEarnings | undefined>;
  getPartnerEarningsByPartnerId(partnerId: number): Promise<PartnerEarnings[]>;
  getPartnerTotalEarnings(partnerId: number): Promise<number>;
  
  // Payment methods
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentByBookingId(bookingId: number): Promise<Payment | undefined>;
  updatePaymentStatus(paymentId: number, status: string, transactionId?: string): Promise<void>;
  
  // Inquiry methods
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  
  // Chatbot Quote methods
  createChatbotQuote(quote: InsertChatbotQuote): Promise<ChatbotQuote>;
  getAllChatbotQuotes(): Promise<ChatbotQuote[]>;
  
  // User methods
  createUser(user: InsertUser): Promise<User>;
  getUserById(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  updateUser(id: number, user: Partial<User>): Promise<void>;
  verifyUserPassword(email: string, password: string): Promise<User | null>;
  
  // Commercial manager methods
  createCommercialManager(manager: InsertCommercialManager): Promise<CommercialManager>;
  getCommercialManagerById(id: number): Promise<CommercialManager | undefined>;
  getCommercialManagerByUserId(userId: number): Promise<CommercialManager | undefined>;
  
  // User session methods
  createUserSession(session: InsertUserSession): Promise<UserSession>;
  getUserBySessionToken(token: string): Promise<User | undefined>;
  getUserSession(token: string): Promise<UserSession | undefined>;
  deleteUserSession(token: string): Promise<void>;
  
  // User dashboard methods
  getUserBookings(userId: number): Promise<Booking[]>;
  updateBooking(bookingId: number, updates: Partial<Booking>): Promise<Booking | undefined>;
  cancelBooking(bookingId: number): Promise<void>;
  getUserPaymentHistory(userId: number): Promise<Payment[]>;
  getPersonalizedRecommendations(userId: number): Promise<Equipment[]>;
  
  // Admin methods
  getAllBookings(): Promise<Booking[]>;
  deleteBooking(bookingId: number): Promise<boolean>;
  
  // Review methods
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByEquipment(equipmentId: number): Promise<Review[]>;
  getReviewsByUser(userId: number): Promise<Review[]>;
  
  // Equipment tracking methods
  updateEquipmentTracking(tracking: InsertTracking): Promise<EquipmentTracking>;
  getEquipmentTracking(equipmentId: number): Promise<EquipmentTracking | undefined>;
  
  // Maintenance methods
  createMaintenanceSchedule(maintenance: InsertMaintenance): Promise<MaintenanceSchedule>;
  getMaintenanceByEquipment(equipmentId: number): Promise<MaintenanceSchedule[]>;
  updateMaintenanceStatus(id: number, status: string): Promise<void>;
  
  // Location methods
  createLocation(location: InsertLocation): Promise<Location>;
  getAllLocations(): Promise<Location[]>;
  getActiveLocations(): Promise<Location[]>;
  
  // Inventory methods
  createInventory(inventory: InsertInventory): Promise<EquipmentInventory>;
  getInventoryByLocation(locationId: number): Promise<EquipmentInventory[]>;
  updateInventoryQuantity(id: number, quantity: number): Promise<void>;
  
  // Notification methods
  createNotification(notification: InsertNotification): Promise<Notification>;
  getPendingNotifications(): Promise<Notification[]>;
  updateNotificationStatus(id: number, status: string): Promise<void>;
  
  // Analytics methods
  recordAnalytics(metric: string, value: number, metadata?: any): Promise<void>;
  getAnalytics(metric: string, startDate: Date, endDate: Date): Promise<any[]>;
  
  // Notification methods
  getAdminNotifications(): Promise<any[]>;
  markNotificationAsRead(id: number): Promise<void>;
  markAllNotificationsAsRead(): Promise<void>;
  deleteNotification(id: number): Promise<boolean>;
  createAdminNotification(notification: any): Promise<void>;
  
  // Booking history methods
  getBookingHistory(bookingId: number): Promise<any[]>;
  recordBookingChange(bookingId: number, field: string, oldValue: string, newValue: string, modifiedBy: string, reason?: string): Promise<void>;
  
  // Partner request methods
  createPartnerRequest(data: InsertPartnerRequest): Promise<PartnerRequest>;
  getAllPartnerRequests(): Promise<PartnerRequest[]>;
  updatePartnerRequestStatus(id: number, status: string, notes?: string): Promise<any>;
  
  // Partner equipment sync methods
  getEquipmentByPartnerId(partnerId: number): Promise<Equipment[]>;
  getPartnerDrivers(partnerId: number): Promise<PartnerDriver[]>;
  createPartnerDriver(driverData: InsertPartnerDriver): Promise<PartnerDriver>;
  updatePartnerDriver(driverId: number, updateData: Partial<InsertPartnerDriver>): Promise<PartnerDriver | null>;
  getDriverAssignmentsByPartner(partnerId: number): Promise<any[]>;
  getBookingsByEquipment(equipmentId: number): Promise<Booking[]>;
  
  // Admin stats methods
  getAdminStats(): Promise<any>;
  
  // Equipment unavailability management
  getEquipmentUnavailabilityByPartner(partnerId: number): Promise<any[]>;
  createEquipmentUnavailability(data: any): Promise<any>;
  updateEquipmentUnavailability(id: number, data: any): Promise<any>;
  deleteEquipmentUnavailability(id: number): Promise<boolean>;
  getUnavailabilityByEquipment(equipmentId: number): Promise<any[]>;
  getEquipmentPartnerInfo(equipmentId: number): Promise<any>;
  
  // GPS Tracking methods
  getAllServiceCities(): Promise<ServiceCity[]>;
  createServiceCity(cityData: InsertServiceCity): Promise<ServiceCity>;
  getServiceCityById(id: number): Promise<ServiceCity | undefined>;
  updateServiceCity(id: number, updates: Partial<InsertServiceCity>): Promise<ServiceCity | undefined>;
  deleteServiceCity(id: number): Promise<boolean>;
  
  createGpsTracking(trackingData: InsertGpsTracking): Promise<GpsTracking>;
  getAllGpsTracking(): Promise<GpsTracking[]>;
  getGpsTrackingByEquipment(equipmentId: number): Promise<GpsTracking[]>;
  getGpsTrackingByBooking(bookingId: number): Promise<GpsTracking[]>;
  updateGpsTracking(id: number, updates: Partial<InsertGpsTracking>): Promise<GpsTracking | undefined>;
  getGpsTrackingForUser(userId: number): Promise<GpsTracking[]>;
  getGpsTrackingForPartner(partnerId: number): Promise<GpsTracking[]>;
  getActiveGpsTracking(): Promise<GpsTracking[]>;
}

export class DbStorage implements IStorage {
  async getAllEquipment(): Promise<Equipment[]> {
    return await db.select().from(equipment);
  }

  async getEquipmentById(id: number): Promise<Equipment | undefined> {
    const result = await db.select().from(equipment).where(eq(equipment.id, id));
    return result[0];
  }

  async getEquipmentByPartnerId(partnerId: number): Promise<Equipment[]> {
    return await db.select().from(equipment).where(eq(equipment.partnerId, partnerId));
  }

  // Partner drivers management
  async getPartnerDrivers(partnerId: number): Promise<PartnerDriver[]> {
    return await db.select().from(partnerDrivers).where(eq(partnerDrivers.partnerId, partnerId));
  }

  async createPartnerDriver(driverData: InsertPartnerDriver): Promise<PartnerDriver> {
    const [driver] = await db.insert(partnerDrivers).values(driverData).returning();
    return driver;
  }

  async updatePartnerDriver(driverId: number, updateData: Partial<InsertPartnerDriver>): Promise<PartnerDriver | null> {
    const [driver] = await db
      .update(partnerDrivers)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(partnerDrivers.id, driverId))
      .returning();
    return driver || null;
  }

  async getDriverAssignmentsByPartner(partnerId: number): Promise<any[]> {
    // Join with drivers, equipment, and bookings tables
    const assignments = await db
      .select({
        id: driverAssignments.id,
        bookingId: driverAssignments.bookingId,
        partnerId: driverAssignments.partnerId,
        driverId: driverAssignments.driverId,
        equipmentId: driverAssignments.equipmentId,
        assignedAt: driverAssignments.assignedAt,
        status: driverAssignments.status,
        deliveryInstructions: driverAssignments.deliveryInstructions,
        driverFirstName: partnerDrivers.firstName,
        driverLastName: partnerDrivers.lastName,
        equipmentName: equipment.name,
        equipmentCategory: equipment.category,
      })
      .from(driverAssignments)
      .leftJoin(partnerDrivers, eq(driverAssignments.driverId, partnerDrivers.id))
      .leftJoin(equipment, eq(driverAssignments.equipmentId, equipment.id))
      .where(eq(driverAssignments.partnerId, partnerId));

    return assignments.map(assignment => ({
      id: assignment.id,
      bookingId: assignment.bookingId,
      partnerId: assignment.partnerId,
      driverId: assignment.driverId,
      equipmentId: assignment.equipmentId,
      assignedAt: assignment.assignedAt,
      status: assignment.status,
      deliveryInstructions: assignment.deliveryInstructions,
      driver: {
        firstName: assignment.driverFirstName,
        lastName: assignment.driverLastName,
      },
      equipment: {
        id: assignment.equipmentId,
        name: assignment.equipmentName,
        category: assignment.equipmentCategory,
      },
    }));
  }

  async getBookingsByEquipment(equipmentId: number): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.equipmentId, equipmentId));
  }

  async getEquipmentByCategory(category: string): Promise<Equipment[]> {
    return await db.select().from(equipment).where(eq(equipment.category, category));
  }

  async searchEquipment(query: string, location?: string): Promise<Equipment[]> {
    let queryBuilder = db.select().from(equipment);
    
    if (query && location) {
      queryBuilder = queryBuilder.where(
        or(
          ilike(equipment.name, `%${query}%`),
          ilike(equipment.description, `%${query}%`)
        )
      );
    } else if (query) {
      queryBuilder = queryBuilder.where(
        or(
          ilike(equipment.name, `%${query}%`),
          ilike(equipment.description, `%${query}%`)
        )
      );
    } else if (location) {
      queryBuilder = queryBuilder.where(eq(equipment.location, location));
    }
    
    return await queryBuilder;
  }

  async createEquipment(equipmentData: InsertEquipment): Promise<Equipment> {
    const result = await db.insert(equipment).values(equipmentData).returning();
    return result[0];
  }

  async updateEquipment(id: number, equipmentData: Partial<InsertEquipment>): Promise<Equipment | undefined> {
    const result = await db
      .update(equipment)
      .set(equipmentData)
      .where(eq(equipment.id, id))
      .returning();
    return result[0];
  }

  async deleteEquipment(id: number): Promise<boolean> {
    const result = await db.delete(equipment).where(eq(equipment.id, id));
    return (result.rowCount || 0) > 0;
  }

  async updateEquipmentImages(id: number, imagePaths: string[]): Promise<Equipment | undefined> {
    const result = await db
      .update(equipment)
      .set({ imageUrl: imagePaths[0] }) // For now, use the first image as main image
      .where(eq(equipment.id, id))
      .returning();
    return result[0];
  }

  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const result = await db.insert(bookings).values(bookingData).returning();
    const newBooking = result[0];
    
    // 🎯 AUTOMATIQUE: Créer les gains partenaires à 85% du montant total (15% commission Kamsen)
    if (newBooking && newBooking.totalPrice && newBooking.id) {
      await this.createPartnerEarning({
        partnerId: 1, // ID du partenaire assigné (pour l'instant, partenaire par défaut)
        bookingId: newBooking.id,
        rentalAmount: newBooking.totalPrice,
        commissionRate: 0.15, // 15% pour Kamsen
        commissionAmount: Math.round(newBooking.totalPrice * 0.15), // 15% commission Kamsen
        partnerAmount: Math.round(newBooking.totalPrice * 0.85), // 85% pour le partenaire
        status: "pending", // En attente de paiement
        payoutMethod: "mobile_money"
      });
      
      console.log(`💰 Gains partenaires créés automatiquement: 85% de ${newBooking.totalPrice} XOF = ${Math.round(newBooking.totalPrice * 0.85)} XOF`);
    }
    
    return newBooking;
  }

  async updateBookingPaymentStatus(bookingId: number, paymentStatus: string, paymentReference?: string): Promise<void> {
    await db.update(bookings)
      .set({ 
        paymentStatus, 
        paymentReference,
        status: paymentStatus === 'completed' ? 'confirmed' : 'pending'
      })
      .where(eq(bookings.id, bookingId));
  }

  // Admin methods  
  async getAllBookings(): Promise<Booking[]> {
    const result = await db.select().from(bookings).orderBy(desc(bookings.createdAt));
    return result;
  }

  // 💰 METHODES GAINS PARTENAIRES - 75% du montant pour les partenaires
  async createPartnerEarning(earningData: InsertPartnerEarnings): Promise<PartnerEarnings> {
    const result = await db.insert(partnerEarnings).values(earningData).returning();
    return result[0];
  }

  async getPartnerEarningsByBooking(bookingId: number): Promise<PartnerEarnings | undefined> {
    const result = await db.select().from(partnerEarnings).where(eq(partnerEarnings.bookingId, bookingId));
    return result[0];
  }

  async getPartnerEarningsByPartnerId(partnerId: number): Promise<PartnerEarnings[]> {
    return await db.select().from(partnerEarnings).where(eq(partnerEarnings.partnerId, partnerId)).orderBy(desc(partnerEarnings.createdAt));
  }

  async getPartnerTotalEarnings(partnerId: number): Promise<number> {
    const earnings = await db.select().from(partnerEarnings).where(eq(partnerEarnings.partnerId, partnerId));
    return earnings.reduce((sum, earning) => sum + earning.partnerAmount, 0);
  }

  async createPayment(paymentData: InsertPayment): Promise<Payment> {
    const now = new Date().toISOString();
    const [payment] = await db.insert(payments).values({
      ...paymentData,
      createdAt: now,
      updatedAt: now
    }).returning();
    return payment;
  }

  async getPaymentByBookingId(bookingId: number): Promise<Payment | undefined> {
    const result = await db.select().from(payments).where(eq(payments.bookingId, bookingId));
    return result[0];
  }

  async updatePaymentStatus(paymentId: number, status: string, transactionId?: string): Promise<void> {
    const updateData: any = { 
      status, 
      updatedAt: new Date().toISOString() 
    };
    if (transactionId) {
      updateData.transactionId = transactionId;
    }
    await db.update(payments).set(updateData).where(eq(payments.id, paymentId));
  }

  async createInquiry(inquiryData: InsertInquiry): Promise<Inquiry> {
    const inquiryWithDate = {
      ...inquiryData,
      createdAt: new Date().toISOString(),
    };
    const result = await db.insert(inquiries).values(inquiryWithDate).returning();
    return result[0];
  }

  // Chatbot Quote methods
  async createChatbotQuote(quoteData: InsertChatbotQuote): Promise<ChatbotQuote> {
    const result = await db.insert(chatbotQuotes).values(quoteData).returning();
    return result[0];
  }

  async getAllChatbotQuotes(): Promise<ChatbotQuote[]> {
    return await db.select().from(chatbotQuotes).orderBy(desc(chatbotQuotes.createdAt));
  }

  async getBookingsByUser(userId: number): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.userId, userId));
  }

  // User methods
  async createUser(userData: InsertUser): Promise<User> {
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  }

  async getUserById(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.googleId, googleId));
    return result[0];
  }

  async updateUser(id: number, userData: Partial<User>): Promise<void> {
    await db.update(users).set(userData).where(eq(users.id, id));
  }

  async verifyUserPassword(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user || !user.password) return null;
    
    // Use bcrypt to verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      return user;
    }
    return null;
  }

  // Commercial manager methods
  async createCommercialManager(managerData: InsertCommercialManager): Promise<CommercialManager> {
    const result = await db.insert(commercialManagers).values(managerData).returning();
    return result[0];
  }

  async getCommercialManagerById(id: number): Promise<CommercialManager | undefined> {
    const result = await db.select().from(commercialManagers).where(eq(commercialManagers.id, id));
    return result[0];
  }

  async getCommercialManagerByUserId(userId: number): Promise<CommercialManager | undefined> {
    const result = await db.select().from(commercialManagers).where(eq(commercialManagers.userId, userId));
    return result[0];
  }

  // User session methods
  async createUserSession(sessionData: InsertUserSession): Promise<UserSession> {
    const result = await db.insert(userSessions).values(sessionData).returning();
    return result[0];
  }

  async getUserBySessionToken(token: string): Promise<User | undefined> {
    const result = await db.select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      phone: users.phone,
      address: users.address,
      city: users.city,
      role: users.role,
      isVerified: users.isVerified,
      authProvider: users.authProvider,
      googleId: users.googleId,
      profilePicture: users.profilePicture,
      commercialManagerId: users.commercialManagerId,
      preferences: users.preferences,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      password: users.password
    })
      .from(users)
      .innerJoin(userSessions, eq(users.id, userSessions.userId))
      .where(eq(userSessions.sessionToken, token))
      .where(eq(userSessions.expiresAt, userSessions.expiresAt)); // Check if session is still valid
    
    return result[0];
  }

  async deleteUserSession(token: string): Promise<void> {
    await db.delete(userSessions).where(eq(userSessions.sessionToken, token));
  }

  // User dashboard methods
  async getUserBookings(userId: number): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.userId, userId));
  }

  async updateBooking(bookingId: number, updates: Partial<Booking>): Promise<Booking | undefined> {
    // Get current booking for comparison
    const currentBooking = await db.select().from(bookings).where(eq(bookings.id, bookingId));
    const current = currentBooking[0];
    
    if (!current) {
      return undefined;
    }

    const [updatedBooking] = await db
      .update(bookings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(bookings.id, bookingId))
      .returning();

    // Record changes and create notifications/emails
    const changes = [];
    for (const [field, newValue] of Object.entries(updates)) {
      if (field !== 'updatedAt' && current[field as keyof typeof current] !== newValue) {
        const oldValue = current[field as keyof typeof current];
        changes.push({ field, oldValue: String(oldValue), newValue: String(newValue) });
        
        await this.recordBookingChange(
          bookingId,
          field,
          String(oldValue),
          String(newValue),
          'client' // Assume client modification unless specified
        );

        // Create admin notification for important changes
        if (['startDate', 'endDate', 'status'].includes(field)) {
          await this.createAdminNotification({
            type: 'reservation_modified',
            title: `Réservation #${bookingId} modifiée`,
            message: `${field === 'startDate' ? 'Date de début' : 
                      field === 'endDate' ? 'Date de fin' : 
                      field === 'status' ? 'Statut' : field} 
                      modifié de "${oldValue}" à "${newValue}"`,
            bookingId: bookingId,
            priority: field === 'status' ? 'high' : 'normal'
          });
        }
      }
    }

    // Trigger email notification if there are significant changes
    if (changes.length > 0) {
      // Get equipment name for email
      const equipmentResult = await db.select({ name: equipment.name })
        .from(equipment)
        .where(eq(equipment.id, current.equipmentId));
      
      const equipmentName = equipmentResult[0]?.name || `Équipement #${current.equipmentId}`;
      
      // Import and use EmailService dynamically to avoid circular dependency
      try {
        const { EmailService } = await import('./email-service');
        await EmailService.sendBookingModificationAlert({
          bookingId,
          customerName: current.customerName,
          customerEmail: current.customerEmail,
          customerPhone: current.customerPhone,
          equipmentName,
          changes,
          modificationDate: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error sending email notification:', error);
      }
    }

    return updatedBooking;
  }

  async cancelBooking(bookingId: number): Promise<void> {
    await db.update(bookings)
      .set({ 
        status: 'cancelled',
        canModify: false,
        canCancel: false 
      })
      .where(eq(bookings.id, bookingId));
  }

  async getUserPaymentHistory(userId: number): Promise<Payment[]> {
    const result = await db.select({
      id: payments.id,
      bookingId: payments.bookingId,
      amount: payments.amount,
      paymentMethod: payments.paymentMethod,
      phoneNumber: payments.phoneNumber,
      transactionId: payments.transactionId,
      status: payments.status,
      createdAt: payments.createdAt,
      updatedAt: payments.updatedAt
    })
      .from(payments)
      .innerJoin(bookings, eq(payments.bookingId, bookings.id))
      .where(eq(bookings.userId, userId));
    
    return result;
  }

  async getPersonalizedRecommendations(userId: number): Promise<Equipment[]> {
    // Get user's booking history to understand preferences
    const userBookings = await this.getUserBookings(userId);
    
    if (userBookings.length === 0) {
      // If no history, return popular equipment
      return this.getAllEquipment();
    }

    // Get equipment categories from user's previous bookings
    const bookedEquipmentIds = userBookings.map(b => b.equipmentId);
    const bookedEquipment = await db.select()
      .from(equipment)
      .where(
        or(...bookedEquipmentIds.map(id => eq(equipment.id, id)))
      );

    const preferredCategories = [...new Set(bookedEquipment.map(e => e.category))];

    // Recommend similar equipment from preferred categories
    if (preferredCategories.length > 0) {
      return await db.select()
        .from(equipment)
        .where(
          or(...preferredCategories.map(cat => eq(equipment.category, cat)))
        )
        .limit(12);
    }

    return this.getAllEquipment();
  }

  // Equipment management implementations - kept only one set

  async createReview(reviewData: InsertReview): Promise<Review> {
    const result = await db.insert(reviews).values(reviewData).returning();
    return result[0];
  }

  async getReviewsByEquipment(equipmentId: number): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.equipmentId, equipmentId));
  }

  async getReviewsByUser(userId: number): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.userId, userId));
  }

  async updateEquipmentTracking(trackingData: InsertTracking): Promise<EquipmentTracking> {
    const result = await db.insert(equipmentTracking).values(trackingData).returning();
    return result[0];
  }

  async getEquipmentTracking(equipmentId: number): Promise<EquipmentTracking | undefined> {
    const result = await db.select().from(equipmentTracking).where(eq(equipmentTracking.equipmentId, equipmentId));
    return result[0];
  }

  async createMaintenanceSchedule(maintenanceData: InsertMaintenance): Promise<MaintenanceSchedule> {
    const result = await db.insert(maintenanceSchedule).values(maintenanceData).returning();
    return result[0];
  }

  async getMaintenanceByEquipment(equipmentId: number): Promise<MaintenanceSchedule[]> {
    return await db.select().from(maintenanceSchedule).where(eq(maintenanceSchedule.equipmentId, equipmentId));
  }

  async updateMaintenanceStatus(id: number, status: string): Promise<void> {
    await db.update(maintenanceSchedule).set({ status }).where(eq(maintenanceSchedule.id, id));
  }

  async createLocation(locationData: InsertLocation): Promise<Location> {
    const result = await db.insert(locations).values(locationData).returning();
    return result[0];
  }

  async getAllLocations(): Promise<Location[]> {
    return await db.select().from(locations);
  }

  async getActiveLocations(): Promise<Location[]> {
    return await db.select().from(locations).where(eq(locations.isActive, true));
  }

  async createInventory(inventoryData: InsertInventory): Promise<EquipmentInventory> {
    const result = await db.insert(equipmentInventory).values(inventoryData).returning();
    return result[0];
  }

  async getInventoryByLocation(locationId: number): Promise<EquipmentInventory[]> {
    return await db.select().from(equipmentInventory).where(eq(equipmentInventory.locationId, locationId));
  }

  async updateInventoryQuantity(id: number, quantity: number): Promise<void> {
    await db.update(equipmentInventory).set({ quantity }).where(eq(equipmentInventory.id, id));
  }

  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const result = await db.insert(notifications).values(notificationData).returning();
    return result[0];
  }

  async getPendingNotifications(): Promise<Notification[]> {
    return await db.select().from(notifications).where(eq(notifications.status, 'pending'));
  }

  async updateNotificationStatus(id: number, status: string): Promise<void> {
    await db.update(notifications).set({ status }).where(eq(notifications.id, id));
  }

  async recordAnalytics(metric: string, value: number, metadata?: any): Promise<void> {
    await db.insert(analytics).values({
      date: new Date(),
      metric,
      value,
      metadata
    });
  }

  async getAnalytics(metric: string, startDate: Date, endDate: Date): Promise<any[]> {
    return await db.select().from(analytics)
      .where(eq(analytics.metric, metric));
  }

  // Notification methods implementation
  async getAdminNotifications(): Promise<any[]> {
    // Mock implementation - return empty array for now
    return [];
  }

  async markNotificationAsRead(id: number): Promise<void> {
    // Mock implementation
    console.log(`Marking notification ${id} as read`);
  }

  async markAllNotificationsAsRead(): Promise<void> {
    // Mock implementation
    console.log("Marking all notifications as read");
  }

  async deleteNotification(id: number): Promise<boolean> {
    // Mock implementation
    console.log(`Deleting notification ${id}`);
    return true;
  }

  async createAdminNotification(notification: any): Promise<void> {
    // Mock implementation - log notification for now
    console.log("Creating admin notification:", notification);
  }

  // Booking history methods implementation
  async getBookingHistory(bookingId: number): Promise<any[]> {
    // Mock implementation - return empty array for now
    return [];
  }

  async recordBookingChange(bookingId: number, field: string, oldValue: string, newValue: string, modifiedBy: string, reason?: string): Promise<void> {
    // Mock implementation - log change for now
    console.log(`Booking ${bookingId} change: ${field} from ${oldValue} to ${newValue} by ${modifiedBy}`, reason);
  }

  // Partner request methods
  async createPartnerRequest(data: InsertPartnerRequest): Promise<PartnerRequest> {
    const [partnerRequest] = await db.insert(partnerRequests).values(data).returning();
    return partnerRequest;
  }

  async getAllPartnerRequests(): Promise<PartnerRequest[]> {
    return await db.select().from(partnerRequests).orderBy(desc(partnerRequests.createdAt));
  }

  async updatePartnerRequestStatus(id: number, status: string, notes?: string): Promise<any> {
    const [updated] = await db.update(partnerRequests)
      .set({ 
        status, 
        notes,
        processedAt: new Date(),
        processedBy: 'admin'
      })
      .where(eq(partnerRequests.id, id))
      .returning();
    return updated;
  }

  // GPS Tracking methods
  async createGpsTracking(trackingData: InsertGpsTracking): Promise<GpsTracking> {
    const result = await db.insert(gpsTracking).values(trackingData).returning();
    return result[0];
  }

  async getGpsTrackingByEquipment(equipmentId: number): Promise<GpsTracking[]> {
    return await db.select().from(gpsTracking)
      .where(eq(gpsTracking.equipmentId, equipmentId))
      .orderBy(desc(gpsTracking.createdAt));
  }

  async getGpsTrackingByBooking(bookingId: number): Promise<GpsTracking[]> {
    return await db.select().from(gpsTracking)
      .where(eq(gpsTracking.bookingId, bookingId))
      .orderBy(desc(gpsTracking.createdAt));
  }

  async getGpsTrackingForUser(userId: number): Promise<GpsTracking[]> {
    // Get tracking for all bookings made by this user
    const userBookings = await db.select().from(bookings)
      .where(eq(bookings.userId, userId));
    
    const bookingIds = userBookings.map(b => b.id);
    
    if (bookingIds.length === 0) return [];
    
    return await db.select().from(gpsTracking)
      .where(or(...bookingIds.map(id => eq(gpsTracking.bookingId, id))))
      .orderBy(desc(gpsTracking.createdAt));
  }

  async getGpsTrackingForPartner(partnerId: number): Promise<GpsTracking[]> {
    // Get tracking for all equipment owned by this partner
    const partnerEquipment = await db.select().from(equipment)
      .where(eq(equipment.partnerId, partnerId));
    
    const equipmentIds = partnerEquipment.map(e => e.id);
    
    if (equipmentIds.length === 0) return [];
    
    return await db.select().from(gpsTracking)
      .where(or(...equipmentIds.map(id => eq(gpsTracking.equipmentId, id))))
      .orderBy(desc(gpsTracking.createdAt));
  }

  async updateGpsLocation(id: number, latitude: number, longitude: number, address?: string): Promise<GpsTracking | undefined> {
    const [updated] = await db.update(gpsTracking)
      .set({ 
        latitude, 
        longitude, 
        address,
        updatedAt: new Date() 
      })
      .where(eq(gpsTracking.id, id))
      .returning();
    return updated;
  }

  async updateTrackingStatus(id: number, status: string, actualArrival?: Date, deliveryNotes?: string): Promise<GpsTracking | undefined> {
    const updateData: any = { 
      status,
      updatedAt: new Date() 
    };
    
    if (actualArrival) updateData.actualArrival = actualArrival;
    if (deliveryNotes) updateData.deliveryNotes = deliveryNotes;

    const [updated] = await db.update(gpsTracking)
      .set(updateData)
      .where(eq(gpsTracking.id, id))
      .returning();
    return updated;
  }

  async getAllActiveTracking(): Promise<GpsTracking[]> {
    return await db.select().from(gpsTracking)
      .where(eq(gpsTracking.status, 'in_transit'))
      .orderBy(desc(gpsTracking.createdAt));
  }

  async getTrackingByCity(city: string): Promise<GpsTracking[]> {
    return await db.select().from(gpsTracking)
      .where(eq(gpsTracking.city, city))
      .orderBy(desc(gpsTracking.createdAt));
  }

  // Service Cities methods
  async createServiceCity(cityData: InsertServiceCity): Promise<ServiceCity> {
    const result = await db.insert(serviceCities).values(cityData).returning();
    return result[0];
  }

  async getAllServiceCities(): Promise<ServiceCity[]> {
    try {
      return await db.select().from(serviceCities)
        .where(eq(serviceCities.isActive, true))
        .orderBy(serviceCities.name);
    } catch (error) {
      console.error('Error fetching service cities:', error);
      return [];
    }
  }

  // Interface methods for GPS Tracking (kept optimized versions only)

  async getActiveGpsTracking(): Promise<GpsTracking[]> {
    try {
      return await db.select().from(gpsTracking)
        .where(or(
          eq(gpsTracking.status, 'in_transit'),
          eq(gpsTracking.status, 'delivered')
        ))
        .orderBy(desc(gpsTracking.createdAt));
    } catch (error) {
      console.error('Error fetching active GPS tracking:', error);
      return [];
    }
  }

  async getAllGpsTracking(): Promise<GpsTracking[]> {
    try {
      return await db.select().from(gpsTracking).orderBy(desc(gpsTracking.createdAt));
    } catch (error) {
      console.error('Error fetching all GPS tracking:', error);
      return [];
    }
  }

  async getServiceCityById(id: number): Promise<ServiceCity | undefined> {
    const result = await db.select().from(serviceCities)
      .where(eq(serviceCities.id, id));
    return result[0];
  }

  async calculateDeliveryFee(cityId: number, distanceKm: number): Promise<number> {
    const city = await this.getServiceCityById(cityId);
    if (!city) return 0;
    
    return city.deliveryFeeBase + (city.deliveryFeePerKm * distanceKm);
  }

  // Delivery Routes methods
  async createDeliveryRoute(routeData: InsertDeliveryRoute): Promise<DeliveryRoute> {
    const result = await db.insert(deliveryRoutes).values(routeData).returning();
    return result[0];
  }

  async getDeliveryRoutesByTracking(trackingId: number): Promise<DeliveryRoute[]> {
    return await db.select().from(deliveryRoutes)
      .where(eq(deliveryRoutes.trackingId, trackingId))
      .orderBy(deliveryRoutes.waypointOrder);
  }

  async updateRouteWaypoint(id: number, status: string, actualTime?: Date): Promise<DeliveryRoute | undefined> {
    const updateData: any = { status };
    if (actualTime) updateData.actualTime = actualTime;

    const [updated] = await db.update(deliveryRoutes)
      .set(updateData)
      .where(eq(deliveryRoutes.id, id))
      .returning();
    return updated;
  }

  // Admin stats methods
  async getAdminStats(): Promise<any> {
    try {
      const totalBookings = await db.select().from(bookings);
      const totalEquipment = await db.select().from(equipment);
      const pendingBookings = totalBookings.filter(b => b.status === 'pending').length;
      const confirmedBookings = totalBookings.filter(b => b.status === 'confirmed').length;
      const totalRevenue = totalBookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.totalPrice, 0);

      // Kamsen earnings - 15% de commission sur toutes les réservations
      let kamsenEarnings = 0;
      try {
        const earningsData = await db.select().from(partnerEarnings);
        kamsenEarnings = earningsData.reduce((sum, earning) => sum + earning.commissionAmount, 0);
      } catch (earningsError) {
        console.log("Partner earnings table not accessible, using default stats");
      }

      // Partner stats - use try/catch in case table doesn't exist
      let partnerRequestsStats = { total: 0, pending: 0, approved: 0 };
      try {
        const partnerRequestsData = await db.select().from(partnerRequests);
        partnerRequestsStats = {
          total: partnerRequestsData.length,
          pending: partnerRequestsData.filter(p => p.status === 'pending').length,
          approved: partnerRequestsData.filter(p => p.status === 'approved').length
        };
      } catch (partnerError) {
        console.log("Partner requests table not accessible, using default stats");
      }
      
      return {
        totalBookings: totalBookings.length,
        totalRevenue,
        kamsenEarnings, // 💰 Gains totaux de Kamsen (15% de commission)
        pendingBookings,
        confirmedBookings,
        totalEquipment: totalEquipment.length,
        availableEquipment: totalEquipment.filter(e => e.isAvailable).length,
        partnerRequests: partnerRequestsStats
      };
    } catch (error) {
      console.error("Error in getAdminStats:", error);
      // Return default stats in case of error
      return {
        totalBookings: 0,
        totalRevenue: 0,
        kamsenEarnings: 0, // 💰 Gains totaux de Kamsen (15% de commission)
        pendingBookings: 0,
        confirmedBookings: 0,
        totalEquipment: 0,
        availableEquipment: 0,
        partnerRequests: { total: 0, pending: 0, approved: 0 }
      };
    }
  }

  // User authentication methods (duplicates removed)

  async getUserSession(token: string): Promise<UserSession | undefined> {
    const result = await db.select().from(userSessions).where(eq(userSessions.sessionToken, token));
    return result[0];
  }

  async deleteUserSession(token: string): Promise<void> {
    await db.delete(userSessions).where(eq(userSessions.sessionToken, token));
  }

  async getUserBookings(userId: number): Promise<any[]> {
    const userBookings = await db.select().from(bookings).where(eq(bookings.userId, userId));
    return userBookings.map(booking => ({
      ...booking,
      canModify: new Date(booking.startDate) > new Date(),
      canCancel: new Date(booking.startDate) > new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h before
    }));
  }

  async updateBooking(id: number, updates: Partial<InsertBooking>): Promise<Booking> {
    const result = await db.update(bookings).set(updates).where(eq(bookings.id, id)).returning();
    return result[0];
  }

  async cancelBooking(id: number): Promise<void> {
    await db.update(bookings).set({ status: 'cancelled' }).where(eq(bookings.id, id));
  }

  async getUserPaymentHistory(userId: number): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.userId, userId));
  }

  async getPersonalizedRecommendations(userId: number): Promise<Equipment[]> {
    // Simple recommendation based on user's booking history
    const userBookings = await db.select().from(bookings).where(eq(bookings.userId, userId));
    if (userBookings.length === 0) {
      // Return popular equipment for new users
      return await db.select().from(equipment).limit(6);
    }
    
    // Get similar equipment based on categories used before
    const categories = [...new Set(userBookings.map(b => b.category || ''))];
    if (categories.length > 0) {
      return await db.select().from(equipment)
        .where(or(...categories.map(cat => eq(equipment.category, cat))))
        .limit(6);
    }
    
    return await db.select().from(equipment).limit(6);
  }

  async getCommercialManagerById(id: number): Promise<CommercialManager | undefined> {
    const result = await db.select().from(commercialManagers).where(eq(commercialManagers.id, id));
    return result[0];
  }

  // Partner operations
  async getAllPartners(): Promise<any[]> {
    try {
      const result = await db.select().from(partners);
      // Add mock data for demo purposes
      const mockPartners = [
        {
          id: 1,
          userId: 1,
          companyName: "Transport Express Dakar",
          businessType: "Transport routier",
          businessDescription: "Spécialisé dans le transport de marchandises au Sénégal",
          taxId: "SN123456789",
          businessLicense: "TRP2024001",
          address: "Route de Rufisque, Dakar",
          city: "Dakar",
          phone: "+221 77 123 45 67",
          email: "contact@transportexpress.sn",
          websiteUrl: "https://transportexpress.sn",
          fleetSize: 25,
          experienceYears: 8,
          serviceAreas: ["Dakar", "Thiès", "Kaolack"],
          equipmentTypes: ["Camion benne", "Camion porteur", "Semi-remorque"],
          isVerified: true,
          verificationStatus: "verified",
          rating: 4.8,
          totalBookings: 156,
          joinedAt: "2023-03-15T10:00:00Z",
          lastActive: "2025-01-20T15:30:00Z",
          documents: [
            { type: "license", name: "licence_commerciale.pdf" },
            { type: "insurance", name: "assurance_vehicules.pdf" }
          ],
          bankDetails: {
            bankName: "CBAO",
            accountNumber: "****1234"
          },
          emergencyContact: {
            name: "Ousmane Diallo",
            phone: "+221 76 987 65 43"
          }
        },
        {
          id: 2,
          userId: 2,
          companyName: "Logistics Pro Sénégal",
          businessType: "Logistique",
          businessDescription: "Solutions logistiques complètes pour entreprises",
          taxId: "SN987654321",
          businessLicense: "LOG2024002",
          address: "Zone industrielle, Thiès",
          city: "Thiès",
          phone: "+221 78 234 56 78",
          email: "info@logisticspro.sn",
          fleetSize: 18,
          experienceYears: 6,
          serviceAreas: ["Thiès", "Diourbel", "Fatick"],
          equipmentTypes: ["Camionnette", "Camion porteur"],
          isVerified: true,
          verificationStatus: "verified",
          rating: 4.6,
          totalBookings: 124,
          joinedAt: "2023-06-20T14:30:00Z",
          lastActive: "2025-01-19T11:20:00Z",
          documents: [
            { type: "license", name: "licence_transport.pdf" }
          ],
          bankDetails: {
            bankName: "UBA",
            accountNumber: "****5678"
          },
          emergencyContact: {
            name: "Fatou Seck",
            phone: "+221 77 345 67 89"
          }
        },
        {
          id: 3,
          userId: 3,
          companyName: "Camions du Sud",
          businessType: "Transport lourd",
          businessDescription: "Transport de matériaux de construction",
          taxId: "SN456789123",
          businessLicense: "TRP2024003",
          address: "Quartier Kandialang, Ziguinchor",
          city: "Ziguinchor",
          phone: "+221 77 456 78 90",
          email: "contact@camionsdusud.sn",
          fleetSize: 12,
          experienceYears: 4,
          serviceAreas: ["Ziguinchor", "Kolda", "Sédhiou"],
          equipmentTypes: ["Camion benne", "Engins de chantier"],
          isVerified: false,
          verificationStatus: "pending",
          rating: 4.2,
          totalBookings: 67,
          joinedAt: "2024-01-10T09:15:00Z",
          lastActive: "2025-01-18T16:45:00Z",
          documents: [],
          bankDetails: null,
          emergencyContact: {
            name: "Mamadou Baldé",
            phone: "+221 76 567 89 01"
          }
        }
      ];
      
      return [...result, ...mockPartners];
    } catch (error) {
      console.error('Error fetching partners:', error);
      // Return mock data even if DB fails
      return [
        {
          id: 1,
          companyName: "Transport Express Dakar",
          city: "Dakar",
          verificationStatus: "verified",
          rating: 4.8
        }
      ];
    }
  }

  async getPartnerById(id: number): Promise<any | undefined> {
    try {
      const [partner] = await db.select().from(partners).where(eq(partners.id, id));
      return partner;
    } catch (error) {
      console.error('Error fetching partner:', error);
      return undefined;
    }
  }

  async updatePartner(id: number, updates: any): Promise<any> {
    try {
      const [updated] = await db
        .update(partners)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(partners.id, id))
        .returning();
      return updated;
    } catch (error) {
      console.error('Error updating partner:', error);
      throw error;
    }
  }

  async deletePartner(id: number): Promise<boolean> {
    try {
      await db.delete(partners).where(eq(partners.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting partner:', error);
      return false;
    }
  }
}

export class MemStorage implements IStorage {
  private equipment: Map<number, Equipment>;
  private bookings: Map<number, Booking>;
  private payments: Map<number, Payment>;
  private inquiries: Map<number, Inquiry>;
  private users: Map<number, User>;
  private commercialManagers: Map<number, CommercialManager>;
  private userSessions: Map<string, UserSession>;
  private partnerEarnings: Map<number, PartnerEarnings>;
  private currentEquipmentId: number;
  private currentBookingId: number;
  private currentPaymentId: number;
  private currentInquiryId: number;
  private currentUserId: number;
  private currentManagerId: number;
  private currentEarningId: number;

  constructor() {
    this.equipment = new Map();
    this.bookings = new Map();
    this.payments = new Map();
    this.inquiries = new Map();
    this.users = new Map();
    this.commercialManagers = new Map();
    this.userSessions = new Map();
    this.partnerEarnings = new Map();
    this.currentEquipmentId = 1;
    this.currentBookingId = 1;
    this.currentPaymentId = 1;
    this.currentInquiryId = 1;
    this.currentUserId = 1;
    this.currentManagerId = 1;
    this.currentEarningId = 1;
    
    // Initialize with sample equipment data for Senegal
    this.initializeData();
    this.initializeCommercialManagers();
    this.initializeSampleBookings();
  }

  private initializeCommercialManagers() {
    const managers: InsertCommercialManager[] = [
      {
        userId: 1, // Will be created later
        name: "Mamadou Diallo",
        phone: "+221 77 123 45 67",
        email: "mamadou.diallo@kamsenlogistic.com",
        specialization: "trucks",
        isActive: true
      },
      {
        userId: 2,
        name: "Fatou Seck",
        phone: "+221 76 234 56 78",
        email: "fatou.seck@kamsenlogistic.com",
        specialization: "agricultural",
        isActive: true
      },
      {
        userId: 3,
        name: "Ousmane Fall",
        phone: "+221 78 345 67 89",
        email: "ousmane.fall@kamsenlogistic.com",
        specialization: "industrial",
        isActive: true
      }
    ];

    managers.forEach(manager => {
      const id = this.currentManagerId++;
      this.commercialManagers.set(id, {
        id,
        ...manager,
        createdAt: new Date()
      });
    });
  }

  private initializeData() {
    const sampleEquipment: InsertEquipment[] = [
      // Camions benne - Prix ajustés marché africain
      {
        name: "Camion benne 15 T",
        description: "Camion benne 15 tonnes pour transport de matériaux",
        category: "Camion benne",
        pricePerDay: 185000, // ~300€/jour marché Sénégal
        location: "Dakar",
        imageUrl: "/images/camion-benne.svg",
        specifications: ["15 tonnes", "Benne basculante", "Diesel", "Avec chauffeur"],
        isAvailable: true,
        weight: "15 tonnes",
        fuelType: "Diesel",
        power: "200 CV"
      },
      {
        name: "Camion benne 20 T",
        description: "Camion benne 20 tonnes pour transport de matériaux",
        category: "Camion benne",
        pricePerDay: 245000, // ~400€/jour marché Sénégal
        location: "Thiès",
        imageUrl: "/images/camion-benne.svg",
        specifications: ["20 tonnes", "Benne basculante", "Diesel", "Avec chauffeur"],
        isAvailable: true,
        weight: "20 tonnes",
        fuelType: "Diesel",
        power: "250 CV"
      },
      {
        name: "Camion benne 30 T",
        description: "Camion benne 30 tonnes pour grands chantiers",
        category: "Camion benne",
        pricePerDay: 310000, // ~500€/jour marché Sénégal
        location: "Dakar",
        imageUrl: "/images/camion-benne.svg",
        specifications: ["30 tonnes", "Benne basculante", "Diesel", "Avec chauffeur"],
        isAvailable: true,
        weight: "30 tonnes",
        fuelType: "Diesel",
        power: "350 CV"
      },
      {
        name: "Camion benne 40 T",
        description: "Camion benne 40 tonnes pour très grands projets",
        category: "Camion benne",
        pricePerDay: 370000, // ~600€/jour marché Sénégal
        location: "Saint-Louis",
        imageUrl: "/images/camion-benne.svg",
        specifications: ["40 tonnes", "Benne basculante", "Diesel", "Avec chauffeur"],
        isAvailable: true,
        weight: "40 tonnes",
        fuelType: "Diesel",
        power: "400 CV"
      },
      // Tracteurs - Prix ajustés marché africain
      {
        name: "Tracteur 50 CV",
        description: "Tracteur agricole 50 CV pour petites exploitations",
        category: "Tracteur",
        pricePerDay: 75000, // ~125€/jour marché Sénégal
        location: "Kaolack",
        imageUrl: "/images/tracteur.svg",
        specifications: ["50 CV", "4x4", "Relevage hydraulique", "Carburant inclus"],
        isAvailable: true,
        weight: "3.5 tonnes",
        fuelType: "Diesel",
        power: "50 CV"
      },
      {
        name: "Tracteur 75 CV",
        description: "Tracteur agricole 75 CV polyvalent",
        category: "Tracteur",
        pricePerDay: 95000, // ~155€/jour marché Sénégal
        location: "Diourbel",
        imageUrl: "/images/tracteur.svg",
        specifications: ["75 CV", "4x4", "Relevage hydraulique", "Carburant inclus"],
        isAvailable: true,
        weight: "4.2 tonnes",
        fuelType: "Diesel",
        power: "75 CV"
      },
      {
        name: "Tracteur 90 CV",
        description: "Tracteur agricole 90 CV pour moyennes exploitations",
        category: "Tracteur",
        pricePerDay: 110000, // ~180€/jour marché Sénégal
        location: "Kolda",
        imageUrl: "/images/tracteur.svg",
        specifications: ["90 CV", "4x4", "Relevage hydraulique", "Climatisé", "Carburant inclus"],
        isAvailable: true,
        weight: "5 tonnes",
        fuelType: "Diesel",
        power: "90 CV"
      },
      {
        name: "Tracteur 120 CV",
        description: "Tracteur agricole 120 CV pour grandes exploitations",
        category: "Tracteur",
        pricePerDay: 140000, // ~230€/jour marché Sénégal
        location: "Tambacounda",
        imageUrl: "/images/tracteur.svg",
        specifications: ["120 CV", "4x4", "Relevage hydraulique", "Climatisé", "Carburant inclus"],
        isAvailable: true,
        weight: "6.5 tonnes",
        fuelType: "Diesel",
        power: "120 CV"
      },
      // Équipements de semis et plantation - Prix ajustés
      {
        name: "Semoir mécanique",
        description: "Semoir mécanique pour céréales",
        category: "Équipement Agricole",
        pricePerDay: 35000, // Prix réaliste pour équipement spécialisé
        location: "Kaolack",
        imageUrl: "/images/semoir.svg",
        specifications: ["Mécanique", "Largeur 3m", "Céréales", "Formation incluse"],
        isAvailable: true,
        weight: "800 kg",
        fuelType: "N/A",
        power: "N/A"
      },
      {
        name: "Semoir pneumatique",
        description: "Semoir pneumatique haute précision",
        category: "Équipement Agricole",
        pricePerDay: 55000, // Technologie avancée
        location: "Diourbel",
        imageUrl: "/images/semoir.svg",
        specifications: ["Pneumatique", "Largeur 4m", "Haute précision", "GPS optionnel"],
        isAvailable: true,
        weight: "1.2 tonnes",
        fuelType: "N/A",
        power: "N/A"
      },
      {
        name: "Billonneuse",
        description: "Billonneuse pour formation de billons",
        category: "Équipement Agricole",
        pricePerDay: 25000,
        location: "Kaolack",
        imageUrl: "/images/semoir.svg",
        specifications: ["Formation billons", "Largeur 2m", "Hydraulique", "Réglages multiples"],
        isAvailable: true,
        weight: "600 kg",
        fuelType: "N/A",
        power: "N/A"
      },
      {
        name: "Butteuse",
        description: "Butteuse pour buttage des cultures",
        category: "Équipement Agricole",
        pricePerDay: 22000,
        location: "Kolda",
        imageUrl: "/images/charrue.svg",
        specifications: ["Buttage", "Largeur 1.5m", "Réglable", "Multi-cultures"],
        isAvailable: true,
        weight: "400 kg",
        fuelType: "N/A",
        power: "N/A"
      },
      // Équipements de récolte - Équipement rare et spécialisé
      {
        name: "Moissonneuse-batteuse",
        description: "Moissonneuse-batteuse pour céréales",
        category: "Équipement Agricole",
        pricePerDay: 450000, // Équipement très rare au Sénégal, prix premium
        location: "Tambacounda",
        imageUrl: "/images/decortiqueuse.svg",
        specifications: ["Céréales", "Largeur 4.5m", "Trémie 8000L", "Opérateur inclus"],
        isAvailable: true,
        weight: "15 tonnes",
        fuelType: "Diesel",
        power: "300 CV"
      },
      // Pulvérisateurs - Prix ajustés
      {
        name: "Pulvérisateur motorisé",
        description: "Pulvérisateur motorisé pour traitements",
        category: "Équipement Agricole",
        pricePerDay: 45000, // Prix réaliste pour équipement motorisé
        location: "Dakar",
        imageUrl: "/images/pulverisateur.svg",
        specifications: ["1000L", "Motorisé", "Rampe 12m", "Calibrage inclus"],
        isAvailable: true,
        weight: "1.5 tonnes",
        fuelType: "Diesel",
        power: "25 CV"
      },
      {
        name: "Pulvérisateur à dos",
        description: "Pulvérisateur à dos pour petites surfaces",
        category: "Équipement Agricole",
        pricePerDay: 5000, // Prix très accessible pour petits producteurs
        location: "Kaolack",
        imageUrl: "/images/pulverisateur.svg",
        specifications: ["20L", "Manuel", "Portable", "Kit de buses"],
        isAvailable: true,
        weight: "25 kg",
        fuelType: "N/A",
        power: "N/A"
      },
      // Motopompes - Prix ajustés marché africain
      {
        name: "Motopompe thermique",
        description: "Motopompe thermique pour irrigation",
        category: "Irrigation",
        pricePerDay: 15000, // 10 000 XOF/jour marché local + marge
        location: "Saint-Louis",
        imageUrl: "/images/motopompe.svg",
        specifications: ["500 m³/h", "Diesel", "Auto-amorçante", "Formation incluse"],
        isAvailable: true,
        weight: "800 kg",
        fuelType: "Diesel",
        power: "75 CV"
      },
      {
        name: "Motopompe solaire",
        description: "Motopompe solaire écologique",
        category: "Irrigation",
        pricePerDay: 25000, // Prix premium pour technologie solaire
        location: "Matam",
        imageUrl: "/images/motopompe.svg",
        specifications: ["200 m³/h", "Solaire", "Écologique", "Maintenance incluse"],
        isAvailable: true,
        weight: "500 kg",
        fuelType: "Solaire",
        power: "15 kW"
      },
      // Équipements de transformation - Prix adaptés marché local
      {
        name: "Broyeur de fourrage",
        description: "Broyeur de fourrage pour alimentation animale",
        category: "Transformation",
        pricePerDay: 30000, // Prix adapté aux éleveurs locaux
        location: "Kolda",
        imageUrl: "/images/decortiqueuse.svg",
        specifications: ["2000 kg/h", "Diesel", "Mobile", "Formation incluse"],
        isAvailable: true,
        weight: "1.2 tonnes",
        fuelType: "Diesel",
        power: "15 CV"
      },
      {
        name: "Décortiqueuse à riz",
        description: "Décortiqueuse à riz haute capacité",
        category: "Transformation",
        pricePerDay: 25000, // Prix accessible pour riziculteurs
        location: "Saint-Louis",
        imageUrl: "/images/decortiqueuse.svg",
        specifications: ["1000 kg/h", "Diesel", "Automatique", "Maintenance incluse"],
        isAvailable: true,
        weight: "800 kg",
        fuelType: "Diesel",
        power: "10 CV"
      },
      {
        name: "Décortiqueuse à arachide",
        description: "Décortiqueuse à arachide professionnelle",
        category: "Transformation",
        pricePerDay: 20000, // Prix spécial pour l'arachide (culture principale)
        location: "Kaolack",
        imageUrl: "/images/decortiqueuse.svg",
        specifications: ["800 kg/h", "Diesel", "Professionnelle", "Support technique"],
        isAvailable: true,
        weight: "600 kg",
        fuelType: "Diesel",
        power: "8 CV"
      },
      {
        name: "Égreneuse de maïs",
        description: "Égreneuse de maïs mécanisée",
        category: "Transformation",
        pricePerDay: 18000, // Prix abordable pour petits producteurs
        location: "Tambacounda",
        imageUrl: "/images/decortiqueuse.svg",
        specifications: ["500 kg/h", "Manuel/Diesel", "Mécanisée", "Facilité d'usage"],
        isAvailable: true,
        weight: "400 kg",
        fuelType: "Diesel",
        power: "5 CV"
      },
      // Équipements de labour - Prix réalistes
      {
        name: "Charrue 2 socs",
        description: "Charrue 2 socs pour labour léger",
        category: "Équipement Agricole",
        pricePerDay: 12000, // Prix accessible pour petites exploitations
        location: "Kaolack",
        imageUrl: "/images/charrue.svg",
        specifications: ["2 socs", "Réversible", "Hydraulique", "Tous sols"],
        isAvailable: true,
        weight: "600 kg",
        fuelType: "N/A",
        power: "N/A"
      },
      {
        name: "Charrue 3 socs",
        description: "Charrue 3 socs pour labour moyen",
        category: "Équipement Agricole",
        pricePerDay: 18000, // Prix adapté moyennes exploitations
        location: "Diourbel",
        imageUrl: "/images/charrue.svg",
        specifications: ["3 socs", "Réversible", "Hydraulique", "Labour profond"],
        isAvailable: true,
        weight: "850 kg",
        fuelType: "N/A",
        power: "N/A"
      },
      {
        name: "Charrue 4 socs",
        description: "Charrue 4 socs pour labour intensif",
        category: "Équipement Agricole",
        pricePerDay: 28000, // Prix pour grandes exploitations
        location: "Tambacounda",
        imageUrl: "/images/charrue.svg",
        specifications: ["4 socs", "Réversible", "Hydraulique", "Haute productivité"],
        isAvailable: true,
        weight: "1.1 tonnes",
        fuelType: "N/A",
        power: "N/A"
      },
      // Camions plateau - Prix ajustés marché transport
      {
        name: "Camion plateau 10 T",
        description: "Camion plateau 10 tonnes pour transport général",
        category: "Camion plateau",
        pricePerDay: 155000, // ~250€/jour marché Sénégal
        location: "Dakar",
        imageUrl: "/images/pickup.svg",
        specifications: ["10 tonnes", "Plateau fixe", "Ridelles", "Avec chauffeur"],
        isAvailable: true,
        weight: "10 tonnes",
        fuelType: "Diesel",
        power: "180 CV"
      },
      {
        name: "Camion plateau 20 T",
        description: "Camion plateau 20 tonnes pour gros transport",
        category: "Camion plateau",
        pricePerDay: 200000, // ~325€/jour marché Sénégal
        location: "Thiès",
        imageUrl: "/images/pickup.svg",
        specifications: ["20 tonnes", "Plateau fixe", "Grue auxiliaire", "Avec chauffeur"],
        isAvailable: true,
        weight: "20 tonnes",
        fuelType: "Diesel",
        power: "250 CV"
      },
      // Pick-up - Prix ajustés marché africain
      {
        name: "Pick-up 4x4",
        description: "Pick-up 4x4 pour transport léger et supervision",
        category: "Véhicule léger",
        pricePerDay: 45000, // Prix compétitif marché local
        location: "Dakar",
        imageUrl: "/images/pickup.svg",
        specifications: ["4x4", "Climatisé", "GPS", "Assurance incluse"],
        isAvailable: true,
        weight: "2.5 tonnes",
        fuelType: "Diesel",
        power: "150 CV"
      },
      {
        name: "Pick-up simple cabine",
        description: "Pick-up utilitaire pour transport matériel",
        category: "Véhicule léger",
        pricePerDay: 35000,
        location: "Thiès",
        imageUrl: "/images/pickup.svg",
        specifications: ["2x4", "Benne 1T", "Économique", "Assurance incluse"],
        isAvailable: true,
        weight: "2 tonnes",
        fuelType: "Diesel",
        power: "120 CV"
      },
      // Fin des équipements
      {
        name: "Pick-up 4x4 double cabine",
        description: "Pick-up 4x4 double cabine tout terrain",
        category: "Véhicule Utilitaire",
        pricePerDay: 45000,
        location: "Dakar",
        imageUrl: "/images/pickup.svg",
        specifications: ["4x4", "Double cabine", "1.2T charge utile"],
        isAvailable: true,
        weight: "2.5 tonnes",
        fuelType: "Diesel",
        power: "140 CV"
      },
      // Autres équipements manquants
      {
        name: "Pailleuse",
        description: "Pailleuse pour épandage de paille",
        category: "Équipement Agricole",
        pricePerDay: 22000,
        location: "Kolda",
        imageUrl: "/attached_assets/image_1753108301083.png",
        specifications: ["Épandage paille", "Largeur 3m", "Hydraulique"],
        isAvailable: true,
        weight: "800 kg",
        fuelType: "N/A",
        power: "N/A"
      },
      {
        name: "Batteuse manuelle",
        description: "Batteuse manuelle pour céréales",
        category: "Transformation",
        pricePerDay: 12000,
        location: "Tambacounda",
        imageUrl: "/attached_assets/image_1753108301083.png",
        specifications: ["Manuel", "Céréales", "Portable"],
        isAvailable: true,
        weight: "150 kg",
        fuelType: "N/A",
        power: "N/A"
      },
      {
        name: "Faucheuse",
        description: "Faucheuse pour coupe de fourrage",
        category: "Équipement Agricole",
        pricePerDay: 35000,
        location: "Saint-Louis",
        imageUrl: "/attached_assets/image_1753108301083.png",
        specifications: ["Largeur 2m", "Hydraulique", "Fourrage"],
        isAvailable: true,
        weight: "900 kg",
        fuelType: "N/A",
        power: "N/A"
      }
    ];

    // Clear existing equipment first to ensure fresh data
    this.equipment.clear();
    this.currentEquipmentId = 1;
    
    // Add all new equipment with cache-busting timestamp
    console.log('[STORAGE] Loading fresh equipment data with new SVG images...');
    sampleEquipment.forEach(eq => this.createEquipment(eq));
    console.log(`[STORAGE] Loaded ${sampleEquipment.length} equipment items`);
  }

  async getAllEquipment(): Promise<Equipment[]> {
    return Array.from(this.equipment.values());
  }

  async getEquipmentById(id: number): Promise<Equipment | undefined> {
    return this.equipment.get(id);
  }

  async getEquipmentByCategory(category: string): Promise<Equipment[]> {
    return Array.from(this.equipment.values()).filter(eq => eq.category === category);
  }

  async searchEquipment(query: string, location?: string): Promise<Equipment[]> {
    const allEquipment = Array.from(this.equipment.values());
    return allEquipment.filter(eq => {
      const matchesQuery = !query || 
        eq.name.toLowerCase().includes(query.toLowerCase()) ||
        eq.description.toLowerCase().includes(query.toLowerCase()) ||
        eq.category.toLowerCase().includes(query.toLowerCase());
      
      const matchesLocation = !location || eq.location === location;
      
      return matchesQuery && matchesLocation;
    });
  }

  async createEquipment(insertEquipment: InsertEquipment): Promise<Equipment> {
    const id = this.currentEquipmentId++;
    const equipment: Equipment = { 
      ...insertEquipment, 
      id,
      specifications: insertEquipment.specifications || null,
      weight: insertEquipment.weight || null,
      fuelType: insertEquipment.fuelType || null,
      power: insertEquipment.power || null,
      isAvailable: insertEquipment.isAvailable ?? true
    };
    this.equipment.set(id, equipment);
    return equipment;
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const booking: Booking = { 
      ...insertBooking, 
      id, 
      status: "pending",
      paymentMethod: null,
      paymentStatus: "pending",
      paymentReference: null,
      notes: insertBooking.notes || null
    };
    this.bookings.set(id, booking);
    
    // 🎯 AUTOMATIQUE: Créer les gains partenaires à 85% du montant total (15% commission Kamsen)
    if (booking.totalPrice) {
      await this.createPartnerEarning({
        partnerId: 1, // ID du partenaire assigné (pour l'instant, partenaire par défaut)
        bookingId: booking.id,
        rentalAmount: booking.totalPrice,
        commissionRate: 0.15, // 15% pour Kamsen
        commissionAmount: Math.round(booking.totalPrice * 0.15), // 15% commission Kamsen
        partnerAmount: Math.round(booking.totalPrice * 0.85), // 85% pour le partenaire
        status: "pending", // En attente de paiement
        payoutMethod: "mobile_money"
      });
      
      console.log(`💰 [MemStorage] Gains partenaires créés automatiquement: 85% de ${booking.totalPrice} XOF = ${Math.round(booking.totalPrice * 0.85)} XOF`);
    }
    
    return booking;
  }

  async getBookingsByEquipment(equipmentId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(b => b.equipmentId === equipmentId);
  }

  async updateBookingPaymentStatus(bookingId: number, paymentStatus: string, paymentReference?: string): Promise<void> {
    const booking = this.bookings.get(bookingId);
    if (booking) {
      booking.paymentStatus = paymentStatus;
      booking.paymentReference = paymentReference || null;
      booking.status = paymentStatus === 'completed' ? 'confirmed' : 'pending';
      this.bookings.set(bookingId, booking);
    }
  }

  // 💰 METHODES GAINS PARTENAIRES - 75% du montant pour les partenaires
  async createPartnerEarning(earningData: InsertPartnerEarnings): Promise<PartnerEarnings> {
    const id = this.currentEarningId++;
    const earning: PartnerEarnings = {
      id,
      ...earningData,
      createdAt: new Date(),
      paidAt: null
    };
    this.partnerEarnings.set(id, earning);
    return earning;
  }

  async getPartnerEarningsByBooking(bookingId: number): Promise<PartnerEarnings | undefined> {
    return Array.from(this.partnerEarnings.values()).find(earning => earning.bookingId === bookingId);
  }

  async getPartnerEarningsByPartnerId(partnerId: number): Promise<PartnerEarnings[]> {
    return Array.from(this.partnerEarnings.values())
      .filter(earning => earning.partnerId === partnerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getPartnerTotalEarnings(partnerId: number): Promise<number> {
    return Array.from(this.partnerEarnings.values())
      .filter(earning => earning.partnerId === partnerId)
      .reduce((sum, earning) => sum + earning.partnerAmount, 0);
  }

  async createPayment(paymentData: InsertPayment): Promise<Payment> {
    this.currentPaymentId++;
    const now = new Date().toISOString();
    const payment: Payment = {
      id: this.currentPaymentId,
      ...paymentData,
      createdAt: now,
      updatedAt: now
    };
    this.payments.set(this.currentPaymentId, payment);
    return payment;
  }

  async getPaymentByBookingId(bookingId: number): Promise<Payment | undefined> {
    return Array.from(this.payments.values()).find(payment => payment.bookingId === bookingId);
  }

  async updatePaymentStatus(paymentId: number, status: string, transactionId?: string): Promise<void> {
    const payment = this.payments.get(paymentId);
    if (payment) {
      payment.status = status;
      payment.updatedAt = new Date().toISOString();
      if (transactionId) {
        payment.transactionId = transactionId;
      }
      this.payments.set(paymentId, payment);
    }
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = this.currentInquiryId++;
    const inquiry: Inquiry = { 
      ...insertInquiry, 
      id, 
      createdAt: new Date().toISOString(),
      equipmentCategory: insertInquiry.equipmentCategory || null
    };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }

  // User authentication and management methods
  async createUser(userData: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      id,
      ...userData,
      password: userData.password || null,
      phone: userData.phone || null,
      address: userData.address || null,
      city: userData.city || null,
      isVerified: userData.isVerified || false,
      authProvider: userData.authProvider || "local",
      googleId: userData.googleId || null,
      profilePicture: userData.profilePicture || null,
      commercialManagerId: userData.commercialManagerId || null,
      preferences: userData.preferences || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.googleId === googleId);
  }

  async updateUser(id: number, userData: Partial<User>): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, ...userData, updatedAt: new Date() };
      this.users.set(id, updatedUser);
    }
  }

  async verifyUserPassword(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user || !user.password) return null;
    
    // Simple password verification (use bcrypt in production)
    if (user.password === password) {
      return user;
    }
    return null;
  }

  async getBookingsByUser(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(b => b.userId === userId);
  }

  // Commercial manager methods
  async createCommercialManager(managerData: InsertCommercialManager): Promise<CommercialManager> {
    const id = this.currentManagerId++;
    const manager: CommercialManager = {
      id,
      ...managerData,
      createdAt: new Date()
    };
    this.commercialManagers.set(id, manager);
    return manager;
  }

  async getCommercialManagerById(id: number): Promise<CommercialManager | undefined> {
    return this.commercialManagers.get(id);
  }

  async getCommercialManagerByUserId(userId: number): Promise<CommercialManager | undefined> {
    return Array.from(this.commercialManagers.values()).find(m => m.userId === userId);
  }

  // User session methods
  async createUserSession(sessionData: InsertUserSession): Promise<UserSession> {
    const session: UserSession = {
      id: Math.floor(Math.random() * 1000000),
      ...sessionData,
      createdAt: new Date()
    };
    this.userSessions.set(sessionData.sessionToken, session);
    return session;
  }

  async getUserBySessionToken(token: string): Promise<User | undefined> {
    const session = this.userSessions.get(token);
    if (!session || session.expiresAt < new Date()) {
      return undefined;
    }
    return this.getUserById(session.userId);
  }

  async getUserSession(token: string): Promise<UserSession | undefined> {
    const session = this.userSessions.get(token);
    if (!session || session.expiresAt < new Date()) {
      return undefined;
    }
    return session;
  }

  async deleteUserSession(token: string): Promise<void> {
    this.userSessions.delete(token);
  }

  // Dashboard methods
  async getUserBookings(userId: number): Promise<any[]> {
    const userBookings = Array.from(this.bookings.values()).filter(b => b.userId === userId);
    return userBookings.map(booking => ({
      ...booking,
      canModify: new Date(booking.startDate) > new Date(),
      canCancel: new Date(booking.startDate) > new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h before
    }));
  }

  async updateBooking(bookingId: number, updates: Partial<Booking>): Promise<Booking | undefined> {
    const booking = this.bookings.get(bookingId);
    if (booking) {
      const updatedBooking = { ...booking, ...updates, updatedAt: new Date().toISOString() };
      this.bookings.set(bookingId, updatedBooking);
      return updatedBooking;
    }
    return undefined;
  }

  async cancelBooking(bookingId: number): Promise<void> {
    const booking = this.bookings.get(bookingId);
    if (booking) {
      booking.status = 'cancelled';
      this.bookings.set(bookingId, booking);
    }
  }

  async getUserPaymentHistory(userId: number): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(p => p.userId === userId);
  }

  async getPersonalizedRecommendations(userId: number): Promise<Equipment[]> {
    // Simple recommendation based on user's booking history
    const userBookings = await this.getUserBookings(userId);
    if (userBookings.length === 0) {
      // Return popular equipment for new users (first 6)
      return Array.from(this.equipment.values()).slice(0, 6);
    }
    
    // Get similar equipment based on categories used before
    const categories = [...new Set(userBookings.map(b => b.category || ''))].filter(Boolean);
    if (categories.length > 0) {
      const recommendations = Array.from(this.equipment.values())
        .filter(eq => categories.includes(eq.category))
        .slice(0, 6);
      
      // If not enough recommendations, fill with popular equipment
      if (recommendations.length < 6) {
        const additionalEquipment = Array.from(this.equipment.values())
          .filter(eq => !recommendations.find(r => r.id === eq.id))
          .slice(0, 6 - recommendations.length);
        recommendations.push(...additionalEquipment);
      }
      
      return recommendations;
    }
    
    return Array.from(this.equipment.values()).slice(0, 6);
  }

  // Admin methods
  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async deleteBooking(bookingId: number): Promise<boolean> {
    return this.bookings.delete(bookingId);
  }

  private initializeSampleBookings() {
    const sampleBookings = [
      {
        equipmentId: 1, // Camion benne 15 T
        customerName: "Amadou Ba",
        customerEmail: "amadou.ba@gmail.com", 
        customerPhone: "+221 77 123 45 67",
        startDate: "2025-01-25",
        endDate: "2025-01-27",
        totalPrice: 370000, // 2 jours * 185000
        status: "confirmed" as const,
        paymentStatus: "completed",
        notes: "Transport de sable pour construction",
        createdAt: new Date().toISOString()
      },
      {
        equipmentId: 5, // Tracteur 75 CV
        customerName: "Fatou Diop",
        customerEmail: "fatou.diop@yahoo.fr",
        customerPhone: "+221 76 234 56 78", 
        startDate: "2025-01-28",
        endDate: "2025-01-30",
        totalPrice: 180000, // 2 jours * 90000
        status: "pending" as const,
        paymentStatus: "pending",
        notes: "Labour des champs d'arachide",
        createdAt: new Date().toISOString()
      },
      {
        equipmentId: 10, // Motopompe thermique
        customerName: "Ousmane Sow",
        customerEmail: "ousmane.sow@hotmail.com",
        customerPhone: "+221 78 345 67 89",
        startDate: "2025-01-22",
        endDate: "2025-01-24", 
        totalPrice: 45000, // 3 jours * 15000
        status: "completed" as const,
        paymentStatus: "completed",
        notes: "Irrigation des rizières",
        createdAt: new Date("2025-01-20").toISOString()
      },
      {
        equipmentId: 2, // Camion benne 20 T
        customerName: "Maimouna Kane",
        customerEmail: "maimouna.kane@gmail.com",
        customerPhone: "+221 70 456 78 90",
        startDate: "2025-02-01",
        endDate: "2025-02-03",
        totalPrice: 462000, // 2 jours * 231000
        status: "pending" as const,
        paymentStatus: "pending",
        notes: "Transport de matériaux de construction",
        createdAt: new Date().toISOString()
      },
      {
        equipmentId: 7, // Semoir
        customerName: "Ibrahima Fall",
        customerEmail: "ibrahima.fall@gmail.com",
        customerPhone: "+221 77 567 89 01",
        startDate: "2025-01-20",
        endDate: "2025-01-21",
        totalPrice: 40000, // 1 jour * 40000
        status: "cancelled" as const,
        paymentStatus: "cancelled",
        notes: "Annulé - météo défavorable",
        createdAt: new Date("2025-01-18").toISOString()
      }
    ];

    sampleBookings.forEach(booking => {
      const id = this.currentBookingId++;
      this.bookings.set(id, {
        id,
        userId: null, // Pas d'utilisateur connecté pour ces réservations
        ...booking,
        canModify: new Date(booking.startDate) > new Date(),
        canCancel: new Date(booking.startDate) > new Date(Date.now() + 24 * 60 * 60 * 1000)
      });
    });

    console.log(`[STORAGE] Loaded ${sampleBookings.length} sample bookings`);
  }

  async deleteUserSession(token: string): Promise<void> {
    this.userSessions.delete(token);
  }

  // User dashboard methods
  async getUserBookings(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(b => b.userId === userId);
  }

  async updateBooking(bookingId: number, updates: Partial<Booking>): Promise<Booking | undefined> {
    const booking = this.bookings.get(bookingId);
    if (booking) {
      const updatedBooking = { ...booking, ...updates, updatedAt: new Date() };
      this.bookings.set(bookingId, updatedBooking);
      return updatedBooking;
    }
    return undefined;
  }

  async cancelBooking(bookingId: number): Promise<void> {
    const booking = this.bookings.get(bookingId);
    if (booking) {
      booking.status = 'cancelled';
      booking.canModify = false;
      booking.canCancel = false;
      this.bookings.set(bookingId, booking);
    }
  }

  async getUserPaymentHistory(userId: number): Promise<Payment[]> {
    const userBookings = await this.getUserBookings(userId);
    const bookingIds = userBookings.map(b => b.id);
    return Array.from(this.payments.values()).filter(p => bookingIds.includes(p.bookingId));
  }

  async getPersonalizedRecommendations(userId: number): Promise<Equipment[]> {
    const userBookings = await this.getUserBookings(userId);
    
    if (userBookings.length === 0) {
      return this.getAllEquipment();
    }

    // Get categories from user's booking history
    const bookedEquipmentIds = userBookings.map(b => b.equipmentId);
    const bookedEquipment = Array.from(this.equipment.values()).filter(e => 
      bookedEquipmentIds.includes(e.id)
    );
    
    const preferredCategories = [...new Set(bookedEquipment.map(e => e.category))];

    // Return equipment from preferred categories
    const recommendations = Array.from(this.equipment.values()).filter(e => 
      preferredCategories.includes(e.category)
    );

    return recommendations.slice(0, 12);
  }

  // Missing interface methods - stub implementations
  async updateEquipment(id: number, equipmentData: Partial<InsertEquipment>): Promise<Equipment | undefined> {
    const equipment = this.equipment.get(id);
    if (equipment) {
      const updated = { ...equipment, ...equipmentData };
      this.equipment.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async deleteEquipment(id: number): Promise<boolean> {
    return this.equipment.delete(id);
  }

  async updateEquipmentImages(id: number, imagePaths: string[]): Promise<Equipment | undefined> {
    const equipment = this.equipment.get(id);
    if (equipment && imagePaths.length > 0) {
      equipment.imageUrl = imagePaths[0];
      this.equipment.set(id, equipment);
      return equipment;
    }
    return undefined;
  }

  // Stub implementations for other missing methods
  async createReview(reviewData: InsertReview): Promise<Review> {
    return { id: 1, ...reviewData, createdAt: new Date() };
  }

  async getReviewsByEquipment(equipmentId: number): Promise<Review[]> {
    return [];
  }

  async getReviewsByUser(userId: number): Promise<Review[]> {
    return [];
  }

  async updateEquipmentTracking(trackingData: InsertTracking): Promise<EquipmentTracking> {
    return { id: 1, ...trackingData, lastUpdated: new Date() };
  }

  async getEquipmentTracking(equipmentId: number): Promise<EquipmentTracking | undefined> {
    return undefined;
  }

  async createMaintenanceSchedule(maintenanceData: InsertMaintenance): Promise<MaintenanceSchedule> {
    return { id: 1, ...maintenanceData, createdAt: new Date() };
  }

  async getMaintenanceByEquipment(equipmentId: number): Promise<MaintenanceSchedule[]> {
    return [];
  }

  async updateMaintenanceStatus(id: number, status: string): Promise<void> {
    // Stub implementation
  }

  async createLocation(locationData: InsertLocation): Promise<Location> {
    return { id: 1, ...locationData };
  }

  async getAllLocations(): Promise<Location[]> {
    return [];
  }

  async getActiveLocations(): Promise<Location[]> {
    return [];
  }

  async createInventory(inventoryData: InsertInventory): Promise<EquipmentInventory> {
    return { id: 1, ...inventoryData };
  }

  async getInventoryByLocation(locationId: number): Promise<EquipmentInventory[]> {
    return [];
  }

  async updateInventoryQuantity(id: number, quantity: number): Promise<void> {
    // Stub implementation
  }

  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    return { id: 1, ...notificationData, createdAt: new Date() };
  }

  async getPendingNotifications(): Promise<Notification[]> {
    return [];
  }

  async updateNotificationStatus(id: number, status: string): Promise<void> {
    // Stub implementation
  }

  async recordAnalytics(metric: string, value: number, metadata?: any): Promise<void> {
    // Stub implementation
  }

  async getAnalytics(metric: string, startDate: Date, endDate: Date): Promise<any[]> {
    return [];
  }

  // Equipment unavailability management methods
  async getEquipmentUnavailabilityByPartner(partnerId: number): Promise<any[]> {
    try {
      // Mock data for demo purposes
      const mockPeriods = [
        {
          id: 1,
          partnerId: partnerId,
          equipmentId: 1,
          equipmentName: "Camion benne 15 T",
          startDate: "2025-01-25T00:00:00.000Z",
          endDate: "2025-01-27T00:00:00.000Z",
          reason: "maintenance",
          description: "Révision générale programmée",
          isRecurring: false,
          recurringPattern: null,
          createdAt: "2025-01-21T00:00:00.000Z"
        },
        {
          id: 2,
          partnerId: partnerId,
          equipmentId: 2,
          equipmentName: "Camion benne 20 T",
          startDate: "2025-02-01T00:00:00.000Z",
          endDate: "2025-02-03T00:00:00.000Z",
          reason: "rented_externally",
          description: "Location directe client habituel",
          isRecurring: false,
          recurringPattern: null,
          createdAt: "2025-01-21T00:00:00.000Z"
        }
      ];
      
      return mockPeriods.filter(p => p.partnerId === partnerId);
    } catch (error) {
      console.error("Error fetching unavailability periods:", error);
      throw error;
    }
  }

  async createEquipmentUnavailability(data: any): Promise<any> {
    try {
      // Mock creation - in real implementation would insert into database
      const newPeriod = {
        id: Math.floor(Math.random() * 10000),
        partnerId: data.partnerId,
        equipmentId: data.equipmentId,
        equipmentName: data.equipmentName,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
        description: data.description,
        isRecurring: data.isRecurring || false,
        recurringPattern: data.recurringPattern || null,
        createdAt: new Date().toISOString()
      };
      
      return newPeriod;
    } catch (error) {
      console.error("Error creating unavailability period:", error);
      throw error;
    }
  }

  async updateEquipmentUnavailability(id: number, data: any): Promise<any> {
    try {
      // Mock update - in real implementation would update database record
      const updatedPeriod = {
        id: id,
        partnerId: data.partnerId,
        equipmentId: data.equipmentId,
        equipmentName: data.equipmentName,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
        description: data.description,
        isRecurring: data.isRecurring || false,
        recurringPattern: data.recurringPattern || null,
        createdAt: data.createdAt,
        updatedAt: new Date().toISOString()
      };
      
      return updatedPeriod;
    } catch (error) {
      console.error("Error updating unavailability period:", error);
      throw error;
    }
  }

  async deleteEquipmentUnavailability(id: number): Promise<boolean> {
    try {
      // Mock deletion - in real implementation would delete from database
      console.log(`Deleting unavailability period ${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting unavailability period:", error);
      return false;
    }
  }

  async getUnavailabilityByEquipment(equipmentId: number): Promise<any[]> {
    try {
      // Mock data for equipment unavailability periods
      const allPeriods = [
        {
          id: 1,
          partnerId: 1,
          equipmentId: 1,
          equipmentName: "Camion benne 15 T",
          startDate: "2025-01-25T00:00:00.000Z",
          endDate: "2025-01-27T00:00:00.000Z",
          reason: "maintenance",
          description: "Révision générale programmée",
          partnerName: "Transport Express Dakar",
          createdAt: "2025-01-21T00:00:00.000Z"
        },
        {
          id: 2,
          partnerId: 2,
          equipmentId: 2,
          equipmentName: "Camion benne 20 T",
          startDate: "2025-02-01T00:00:00.000Z",
          endDate: "2025-02-03T00:00:00.000Z",
          reason: "rented_externally",
          description: "Location directe client habituel",
          partnerName: "Logistics Pro Sénégal",
          createdAt: "2025-01-21T00:00:00.000Z"
        },
        {
          id: 3,
          partnerId: 1,
          equipmentId: 5,
          equipmentName: "Tracteur 75 CV",
          startDate: "2025-02-10T00:00:00.000Z",
          endDate: "2025-02-15T00:00:00.000Z",
          reason: "repair",
          description: "Réparation du système hydraulique",
          partnerName: "Transport Express Dakar",
          createdAt: "2025-01-22T00:00:00.000Z"
        }
      ];
      
      return allPeriods.filter(p => p.equipmentId === equipmentId);
    } catch (error) {
      console.error("Error fetching unavailability by equipment:", error);
      return [];
    }
  }

  async getEquipmentPartnerInfo(equipmentId: number): Promise<any> {
    try {
      // Mock partner information mapping
      const partnerMapping = {
        1: { partnerId: 1, partnerName: "Transport Express Dakar", lastUpdate: "2025-01-21T14:30:00.000Z" },
        2: { partnerId: 2, partnerName: "Logistics Pro Sénégal", lastUpdate: "2025-01-20T09:15:00.000Z" },
        3: { partnerId: 1, partnerName: "Transport Express Dakar", lastUpdate: "2025-01-19T16:45:00.000Z" },
        4: { partnerId: 3, partnerName: "Camions du Sud", lastUpdate: "2025-01-18T11:20:00.000Z" },
        5: { partnerId: 1, partnerName: "Transport Express Dakar", lastUpdate: "2025-01-22T08:10:00.000Z" },
        6: { partnerId: 2, partnerName: "Logistics Pro Sénégal", lastUpdate: "2025-01-17T13:25:00.000Z" },
        7: { partnerId: 3, partnerName: "Camions du Sud", lastUpdate: "2025-01-16T10:30:00.000Z" },
        8: { partnerId: 1, partnerName: "Transport Express Dakar", lastUpdate: "2025-01-15T15:45:00.000Z" }
      };
      
      return partnerMapping[equipmentId as keyof typeof partnerMapping] || null;
    } catch (error) {
      console.error("Error fetching partner info:", error);
      return null;
    }
  }

  async getEquipmentOwners(): Promise<any[]> {
    try {
      // For MemStorage, return mock data based on the view structure
      // In real DbStorage, this would query the equipment_owners view
      return [
        // Équipements avec propriétaires
        {
          equipment_id: 29,
          equipment_name: "Camion benne 15 T",
          category: "Camions et Transport",
          price_per_day: 185000,
          location: "Dakar",
          is_available: true,
          partner_id: 1,
          partner_name: "Sample Transport Company",
          ownership_type: "owned",
          registration_number: "DK-2024-001",
          fleet_active: true,
          total_partners: 1,
          partner_rank: 1
        },
        {
          equipment_id: 30,
          equipment_name: "Camion benne 20 T",
          category: "Camions et Transport",
          price_per_day: 245000,
          location: "Thiès",
          is_available: true,
          partner_id: 1,
          partner_name: "Sample Transport Company",
          ownership_type: "owned",
          registration_number: "DK-2024-002",
          fleet_active: true,
          total_partners: 1,
          partner_rank: 1
        },
        {
          equipment_id: 31,
          equipment_name: "Camion benne 30 T",
          category: "Camions et Transport",
          price_per_day: 310000,
          location: "Dakar",
          is_available: true,
          partner_id: 2,
          partner_name: "Moussa Transport SARL",
          ownership_type: "owned",
          registration_number: "TH-2024-001",
          fleet_active: true,
          total_partners: 1,
          partner_rank: 1
        },
        {
          equipment_id: 32,
          equipment_name: "Camion benne 40 T",
          category: "Camions et Transport",
          price_per_day: 370000,
          location: "Saint-Louis",
          is_available: true,
          partner_id: 2,
          partner_name: "Moussa Transport SARL",
          ownership_type: "owned",
          registration_number: "TH-2024-002",
          fleet_active: true,
          total_partners: 1,
          partner_rank: 1
        },
        {
          equipment_id: 33,
          equipment_name: "Tracteur 50 CV",
          category: "BTP et Construction",
          price_per_day: 75000,
          location: "Kaolack",
          is_available: true,
          partner_id: 2,
          partner_name: "Moussa Transport SARL",
          ownership_type: "leased",
          registration_number: "TH-2024-003",
          fleet_active: true,
          total_partners: 2,
          partner_rank: 1
        },
        {
          equipment_id: 33,
          equipment_name: "Tracteur 50 CV",
          category: "BTP et Construction",
          price_per_day: 75000,
          location: "Kaolack",
          is_available: true,
          partner_id: 1,
          partner_name: "Sample Transport Company",
          ownership_type: "leased",
          registration_number: "DK-2024-003",
          fleet_active: true,
          total_partners: 2,
          partner_rank: 2
        },
        {
          equipment_id: 34,
          equipment_name: "Tracteur 75 CV",
          category: "BTP et Construction",
          price_per_day: 95000,
          location: "Diourbel",
          is_available: true,
          partner_id: 2,
          partner_name: "Moussa Transport SARL",
          ownership_type: "owned",
          registration_number: "TH-2024-004",
          fleet_active: true,
          total_partners: 1,
          partner_rank: 1
        },
        {
          equipment_id: 36,
          equipment_name: "Générateur 10 KVA",
          category: "Électricité et Énergie",
          price_per_day: 45000,
          location: "Dakar",
          is_available: true,
          partner_id: 3,
          partner_name: "Fatou Equipment Services",
          ownership_type: "owned",
          registration_number: "FE-2024-001",
          fleet_active: true,
          total_partners: 1,
          partner_rank: 1
        },
        {
          equipment_id: 37,
          equipment_name: "Générateur 20 KVA",
          category: "Électricité et Énergie",
          price_per_day: 65000,
          location: "Thiès",
          is_available: true,
          partner_id: 3,
          partner_name: "Fatou Equipment Services",
          ownership_type: "owned",
          registration_number: "FE-2024-002",
          fleet_active: true,
          total_partners: 2,
          partner_rank: 1
        },
        {
          equipment_id: 37,
          equipment_name: "Générateur 20 KVA",
          category: "Électricité et Énergie",
          price_per_day: 65000,
          location: "Thiès",
          is_available: true,
          partner_id: 1,
          partner_name: "Sample Transport Company",
          ownership_type: "owned",
          registration_number: "DK-2024-004",
          fleet_active: true,
          total_partners: 2,
          partner_rank: 2
        },
        {
          equipment_id: 38,
          equipment_name: "Générateur 50 KVA",
          category: "Électricité et Énergie",
          price_per_day: 125000,
          location: "Dakar",
          is_available: true,
          partner_id: 3,
          partner_name: "Fatou Equipment Services",
          ownership_type: "owned",
          registration_number: "FE-2024-003",
          fleet_active: true,
          total_partners: 1,
          partner_rank: 1
        },
        {
          equipment_id: 39,
          equipment_name: "Générateur 100 KVA",
          category: "Électricité et Énergie",
          price_per_day: 185000,
          location: "Saint-Louis",
          is_available: true,
          partner_id: 3,
          partner_name: "Fatou Equipment Services",
          ownership_type: "leased",
          registration_number: "FE-2024-004",
          fleet_active: true,
          total_partners: 1,
          partner_rank: 1
        },
        // Équipements sans propriétaires (Kamsen Direct)
        {
          equipment_id: 35,
          equipment_name: "Tracteur 120 CV",
          category: "BTP et Construction",
          price_per_day: 140000,
          location: "Tambacounda",
          is_available: true,
          partner_id: null,
          partner_name: null,
          ownership_type: null,
          registration_number: null,
          fleet_active: null,
          total_partners: 0,
          partner_rank: 1
        },
        {
          equipment_id: 40,
          equipment_name: "Compresseur 200L mobile",
          category: "Électricité et Énergie",
          price_per_day: 35000,
          location: "Dakar",
          is_available: true,
          partner_id: null,
          partner_name: null,
          ownership_type: null,
          registration_number: null,
          fleet_active: null,
          total_partners: 0,
          partner_rank: 1
        }
      ];
    } catch (error) {
      console.error("Error fetching equipment owners:", error);
      return [];
    }
  }
}

export const storage = new MemStorage();
