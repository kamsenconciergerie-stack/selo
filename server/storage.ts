import { 
  Equipment, 
  Booking, 
  Payment, 
  Inquiry, 
  User,
  Review,
  EquipmentTracking,
  MaintenanceSchedule,
  Location,
  EquipmentInventory,
  Notification,
  InsertEquipment, 
  InsertBooking, 
  InsertPayment, 
  InsertInquiry,
  InsertUser,
  InsertReview,
  InsertTracking,
  InsertMaintenance,
  InsertLocation,
  InsertInventory,
  InsertNotification
} from "@shared/schema";
import { 
  equipment, 
  bookings, 
  payments, 
  inquiries,
  users,
  reviews,
  equipmentTracking,
  maintenanceSchedule,
  locations,
  equipmentInventory,
  notifications,
  analytics
} from "../shared/schema";
import { eq, ilike, or } from "drizzle-orm";
import { db } from "../shared/db";

export interface IStorage {
  // Equipment methods
  getAllEquipment(): Promise<Equipment[]>;
  getEquipmentById(id: number): Promise<Equipment | undefined>;
  getEquipmentByCategory(category: string): Promise<Equipment[]>;
  searchEquipment(query: string, location?: string): Promise<Equipment[]>;
  createEquipment(equipment: InsertEquipment): Promise<Equipment>;
  
  // Booking methods
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingsByEquipment(equipmentId: number): Promise<Booking[]>;
  getBookingsByUser(userId: number): Promise<Booking[]>;
  updateBookingPaymentStatus(bookingId: number, paymentStatus: string, paymentReference?: string): Promise<void>;
  
  // Payment methods
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentByBookingId(bookingId: number): Promise<Payment | undefined>;
  updatePaymentStatus(paymentId: number, status: string, transactionId?: string): Promise<void>;
  
  // Inquiry methods
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  
  // User methods
  createUser(user: InsertUser): Promise<User>;
  getUserById(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUser(id: number, user: Partial<User>): Promise<void>;

  // Partner methods
  createPartner(partner: InsertPartner): Promise<Partner>;
  getPartnerByUserId(userId: number): Promise<Partner | undefined>;
  getPartnerById(id: number): Promise<Partner | undefined>;
  updatePartnerStatus(userId: number, status: string, approvedBy: number): Promise<void>;
  getEquipmentByPartnerId(partnerId: number): Promise<Equipment[]>;
  getPartnerBookings(partnerId: number, limit?: number): Promise<Booking[]>;
  getPartnerEarnings(partnerId: number): Promise<PartnerEarnings[]>;

  // Partner application methods
  createPartnerApplication(application: InsertPartnerApplication): Promise<PartnerApplication>;
  getAllPartnerApplications(): Promise<PartnerApplication[]>;
  getPartnerApplicationById(id: number): Promise<PartnerApplication | undefined>;
  updatePartnerApplicationStatus(id: number, status: string, notes: string, reviewedBy: number): Promise<void>;

  // Partner document methods
  createPartnerDocument(document: InsertPartnerDocument): Promise<PartnerDocument>;
  getPartnerDocuments(partnerId: number): Promise<PartnerDocument[]>;

  // Partner fleet methods
  createPartnerFleet(fleet: InsertPartnerFleet): Promise<PartnerFleet>;
  getPartnerFleet(partnerId: number): Promise<PartnerFleet[]>;
  
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
}

export class DbStorage implements IStorage {
  async getAllEquipment(): Promise<Equipment[]> {
    return await db.select().from(equipment);
  }

  async getEquipmentById(id: number): Promise<Equipment | undefined> {
    const result = await db.select().from(equipment).where(eq(equipment.id, id));
    return result[0];
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
      ).where(eq(equipment.location, location));
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

  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const result = await db.insert(bookings).values(bookingData).returning();
    return result[0];
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

  async getBookingsByEquipment(equipmentId: number): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.equipmentId, equipmentId));
  }

  async createInquiry(inquiryData: InsertInquiry): Promise<Inquiry> {
    const inquiryWithDate = {
      ...inquiryData,
      createdAt: new Date().toISOString(),
    };
    const result = await db.insert(inquiries).values(inquiryWithDate).returning();
    return result[0];
  }
}

export class MemStorage implements IStorage {
  private equipment: Map<number, Equipment>;
  private bookings: Map<number, Booking>;
  private payments: Map<number, Payment>;
  private inquiries: Map<number, Inquiry>;
  private currentEquipmentId: number;
  private currentBookingId: number;
  private currentPaymentId: number;
  private currentInquiryId: number;

  constructor() {
    this.equipment = new Map();
    this.bookings = new Map();
    this.payments = new Map();
    this.inquiries = new Map();
    this.currentEquipmentId = 1;
    this.currentBookingId = 1;
    this.currentPaymentId = 1;
    this.currentInquiryId = 1;
    
    // Initialize with sample equipment data for Senegal
    this.initializeData();
  }

  private initializeData() {
    const sampleEquipment: InsertEquipment[] = [
      // Équipements les plus demandés au Sénégal
      {
        name: "Groupe Électrogène 100 KVA",
        description: "Générateur diesel haute performance - très demandé pour les coupures d'électricité fréquentes",
        category: "Équipement Électrique",
        pricePerDay: 45000,
        location: "Dakar",
        imageUrl: "/attached_assets/Screenshot_20250624_164242_Canva_1750807696182.jpg",
        specifications: ["100 KVA", "65 dB", "Diesel", "Démarrage automatique"],
        isAvailable: true,
        weight: "2.5 tonnes",
        fuelType: "Diesel",
        power: "100 KVA"
      },
      {
        name: "Pelleteuse 20 Tonnes",
        description: "Pelleteuse hydraulique pour infrastructure - essentielle pour les grands projets du PSE",
        category: "Engins de Chantier",
        pricePerDay: 85000,
        location: "Dakar",
        imageUrl: "/attached_assets/Screenshot_20250624_164242_Canva_1750807696182.jpg",
        specifications: ["20 tonnes", "Diesel", "Chenilles", "GPS"],
        isAvailable: true,
        weight: "20 tonnes",
        fuelType: "Diesel",
        power: "140 CV"
      },
      {
        name: "Camion-Citerne 10 000L",
        description: "Transport d'eau potable - crucial pour l'approvisionnement en zones rurales",
        category: "Engins de Chantier",
        pricePerDay: 95000,
        location: "Thiès",
        imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        specifications: ["10 000L", "Inox alimentaire", "Pompe intégrée"],
        isAvailable: true,
        weight: "15 tonnes",
        fuelType: "Diesel",
        power: "250 CV"
      },
      {
        name: "Motopompe Haute Pression",
        description: "Pompe d'irrigation pour agriculture - soutient la sécurité alimentaire",
        category: "Équipement Électrique",
        pricePerDay: 35000,
        location: "Kaolack",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        specifications: ["500 m³/h", "Diesel", "Auto-amorçante"],
        isAvailable: true,
        weight: "800 kg",
        fuelType: "Diesel",
        power: "75 CV"
      },
      {
        name: "Compresseur 500L",
        description: "Compresseur d'air haute pression pour outils pneumatiques",
        category: "Équipement Électrique",
        pricePerDay: 25000,
        location: "Kaolack",
        imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        specifications: ["12 bar", "500L", "Électrique"],
        isAvailable: true,
        weight: "150 kg",
        fuelType: "Électrique",
        power: "12 bar"
      },
      {
        name: "Échafaudage Mobile Aluminium",
        description: "Échafaudage pour construction - très demandé avec le boom immobilier",
        category: "Sécurité & EPI",
        pricePerDay: 25000,
        location: "Dakar",
        imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        specifications: ["8m hauteur", "Aluminium", "Roulettes", "Sécurisé"],
        isAvailable: true,
        weight: "150 kg",
        fuelType: "N/A",
        power: "N/A"
      },
      {
        name: "Compresseur d'Air 500L",
        description: "Compresseur mobile - indispensable pour les ateliers mécaniques",
        category: "Équipement Électrique",
        pricePerDay: 28000,
        location: "Dakar",
        imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        specifications: ["500L", "12 bar", "Portable", "Silencieux"],
        isAvailable: true,
        weight: "180 kg",
        fuelType: "Électrique",
        power: "5.5 kW"
      },
      {
        name: "Chargeuse sur Pneus",
        description: "Chargeuse compacte pour manutention et chargement",
        category: "Engins de Chantier",
        pricePerDay: 75000,
        location: "Saint-Louis",
        imageUrl: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        specifications: ["15 tonnes", "Pneus", "Hydraulique"],
        isAvailable: true,
        weight: "15 tonnes",
        fuelType: "Diesel",
        power: "120 CV"
      },
      {
        name: "Bétonnière 350L Professionnelle",
        description: "Bétonnière robuste - très utilisée dans la construction résidentielle",
        category: "Outils à Main",
        pricePerDay: 15000,
        location: "Dakar",
        imageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        specifications: ["350L", "Moteur thermique", "Mobile", "Robuste"],
        isAvailable: true,
        weight: "120 kg",
        fuelType: "Essence",
        power: "5.5 CV"
      },
      {
        name: "Foreuse à Eau Mobile",
        description: "Foreuse pour puits - vitale pour l'accès à l'eau en zones rurales",
        category: "Engins de Chantier",
        pricePerDay: 120000,
        location: "Thiès",
        imageUrl: "/attached_assets/Screenshot_20250624_164242_Canva_1750807696182.jpg",
        specifications: ["100m profondeur", "Diesel", "Chenillée", "GPS"],
        isAvailable: true,
        weight: "8 tonnes",
        fuelType: "Diesel",
        power: "180 CV"
      },
      {
        name: "Camion Grue 25 Tonnes",
        description: "Grue mobile - essentielle pour les projets d'infrastructure urbaine",
        category: "Engins de Chantier",
        pricePerDay: 150000,
        location: "Dakar",
        imageUrl: "/attached_assets/Screenshot_20250624_164242_Canva_1750807696182.jpg",
        specifications: ["25 tonnes", "30m portée", "Diesel", "Stabilisateurs"],
        isAvailable: true,
        weight: "35 tonnes",
        fuelType: "Diesel",
        power: "350 CV"
      },
      {
        name: "Groupe Électrogène Solaire 50 KVA",
        description: "Générateur hybride solaire-diesel - innovation pour l'énergie durable",
        category: "Équipement Électrique",
        pricePerDay: 65000,
        location: "Saint-Louis",
        imageUrl: "/attached_assets/Screenshot_20250624_164242_Canva_1750807696182.jpg",
        specifications: ["50 KVA", "Panneaux solaires", "Batterie lithium", "Hybride"],
        isAvailable: true,
        weight: "2 tonnes",
        fuelType: "Hybride",
        power: "50 KVA"
      },
      {
        name: "Tracteur Agricole 85 CV",
        description: "Tracteur polyvalent - soutient la modernisation agricole sénégalaise",
        category: "Engins de Chantier",
        pricePerDay: 75000,
        location: "Diourbel",
        imageUrl: "/attached_assets/Screenshot_20250624_164242_Canva_1750807696182.jpg",
        specifications: ["85 CV", "4x4", "Relevage hydraulique", "Climatisé"],
        isAvailable: true,
        weight: "4.5 tonnes",
        fuelType: "Diesel",
        power: "85 CV"
      },
      {
        name: "Système de Sonorisation 5000W",
        description: "Sonorisation professionnelle - très demandée pour événements et cérémonies",
        category: "Équipement Électrique",
        pricePerDay: 45000,
        location: "Dakar",
        imageUrl: "/attached_assets/Screenshot_20250624_164242_Canva_1750807696182.jpg",
        specifications: ["5000W", "Sans fil", "Microphones", "Éclairage LED"],
        isAvailable: true,
        weight: "150 kg",
        fuelType: "Électrique",
        power: "5000W"
      },
      {
        name: "Station de Lavage Mobile",
        description: "Unité de lavage haute pression - populaire pour l'entrepreneuriat local",
        category: "Équipement Électrique",
        pricePerDay: 35000,
        location: "Thiès",
        imageUrl: "/attached_assets/Screenshot_20250624_164242_Canva_1750807696182.jpg",
        specifications: ["200 bar", "Récupération d'eau", "Mobile", "Écologique"],
        isAvailable: true,
        weight: "500 kg",
        fuelType: "Électrique",
        power: "15 kW"
      }
    ];

    sampleEquipment.forEach(eq => this.createEquipment(eq));
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
}

export const storage = new DbStorage();
