import { Equipment, Booking, Inquiry, InsertEquipment, InsertBooking, InsertInquiry } from "@shared/schema";

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
  
  // Inquiry methods
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
}

export class MemStorage implements IStorage {
  private equipment: Map<number, Equipment>;
  private bookings: Map<number, Booking>;
  private inquiries: Map<number, Inquiry>;
  private currentEquipmentId: number;
  private currentBookingId: number;
  private currentInquiryId: number;

  constructor() {
    this.equipment = new Map();
    this.bookings = new Map();
    this.inquiries = new Map();
    this.currentEquipmentId = 1;
    this.currentBookingId = 1;
    this.currentInquiryId = 1;
    
    // Initialize with sample equipment data for Senegal
    this.initializeData();
  }

  private initializeData() {
    const sampleEquipment: InsertEquipment[] = [
      {
        name: "Pelleteuse 20 Tonnes",
        description: "Pelleteuse hydraulique idéale pour travaux de terrassement et excavation",
        category: "Engins de Chantier",
        pricePerDay: 85000,
        location: "Dakar",
        imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        specifications: ["20 tonnes", "Diesel", "Chenilles"],
        isAvailable: true,
        weight: "20 tonnes",
        fuelType: "Diesel",
        power: "140 CV"
      },
      {
        name: "Générateur 100 KVA",
        description: "Générateur électrique haute performance pour événements et chantiers",
        category: "Équipement Électrique",
        pricePerDay: 45000,
        location: "Thiès",
        imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        specifications: ["100 KVA", "65 dB", "Diesel"],
        isAvailable: true,
        weight: "2.5 tonnes",
        fuelType: "Diesel",
        power: "100 KVA"
      },
      {
        name: "Compresseur 500L",
        description: "Compresseur d'air haute pression pour outils pneumatiques",
        category: "Équipement Électrique",
        pricePerDay: 25000,
        location: "Kaolack",
        imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        specifications: ["12 bar", "500L", "Électrique"],
        isAvailable: false,
        weight: "150 kg",
        fuelType: "Électrique",
        power: "12 bar"
      },
      {
        name: "Marteau-Piqueur",
        description: "Marteau-piqueur pneumatique pour démolition",
        category: "Outils à Main",
        pricePerDay: 8000,
        location: "Dakar",
        imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        specifications: ["Pneumatique", "25 kg", "Portable"],
        isAvailable: true,
        weight: "25 kg",
        fuelType: "Pneumatique",
        power: "2000 W"
      },
      {
        name: "Casques de Sécurité (Lot de 10)",
        description: "Casques de protection conformes aux normes internationales",
        category: "Sécurité & EPI",
        pricePerDay: 3000,
        location: "Dakar",
        imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        specifications: ["CE certifié", "Lot de 10", "Plastique ABS"],
        isAvailable: true,
        weight: "5 kg",
        fuelType: "N/A",
        power: "N/A"
      },
      {
        name: "Chargeuse sur Pneus",
        description: "Chargeuse compacte pour manutention et chargement",
        category: "Engins de Chantier",
        pricePerDay: 75000,
        location: "Saint-Louis",
        imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        specifications: ["15 tonnes", "Pneus", "Hydraulique"],
        isAvailable: true,
        weight: "15 tonnes",
        fuelType: "Diesel",
        power: "120 CV"
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
      notes: insertBooking.notes || null
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async getBookingsByEquipment(equipmentId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(b => b.equipmentId === equipmentId);
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
