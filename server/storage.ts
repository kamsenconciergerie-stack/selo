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
  updateEquipment(id: number, equipment: Partial<InsertEquipment>): Promise<Equipment | undefined>;
  deleteEquipment(id: number): Promise<boolean>;
  updateEquipmentImages(id: number, imagePaths: string[]): Promise<Equipment | undefined>;
  
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
        pricePerDay: 15000, // 10 000 FCFA/jour marché local + marge
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

export const storage = new MemStorage();
