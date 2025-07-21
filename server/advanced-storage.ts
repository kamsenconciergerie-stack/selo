// Advanced storage implementation for all new features
import {
  users,
  partners,
  partnerDocuments,
  partnerFleet,
  partnerEarnings,
  partnerApplications,
  reviews,
  equipmentTracking,
  maintenanceSchedule,
  locations,
  equipmentInventory,
  notifications,
  analytics,
  type User,
  type InsertUser,
  type Partner,
  type InsertPartner,
  type PartnerDocument,
  type InsertPartnerDocument,
  type PartnerFleet,
  type InsertPartnerFleet,
  type PartnerEarnings,
  type InsertPartnerEarnings,
  type PartnerApplication,
  type InsertPartnerApplication,
  type Review,
  type InsertReview,
  type EquipmentTracking,
  type InsertTracking,
  type MaintenanceSchedule,
  type InsertMaintenance,
  type Location,
  type InsertLocation,
  type EquipmentInventory,
  type InsertInventory,
  type Notification,
  type InsertNotification,
} from "@shared/schema";
import { eq, and, gte, lte, desc, asc } from "drizzle-orm";
import { db } from "../shared/db";
import { Equipment, Booking } from "@shared/schema";

export class AdvancedStorage {
  // User methods
  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<void> {
    await db.update(users).set({
      ...userData,
      updatedAt: new Date(),
    }).where(eq(users.id, id));
  }

  // Partner methods
  async createPartner(partnerData: InsertPartner): Promise<Partner> {
    const [partner] = await db.insert(partners).values(partnerData).returning();
    return partner;
  }

  async getPartnerByUserId(userId: number): Promise<Partner | undefined> {
    const [partner] = await db.select().from(partners).where(eq(partners.userId, userId));
    return partner;
  }

  async getPartnerById(id: number): Promise<Partner | undefined> {
    const [partner] = await db.select().from(partners).where(eq(partners.id, id));
    return partner;
  }

  async updatePartnerStatus(userId: number, status: string, approvedBy: number): Promise<void> {
    await db.update(partners)
      .set({
        status,
        approvedBy,
        approvedAt: status === 'approved' ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(partners.userId, userId));
  }

  async getEquipmentByPartnerId(partnerId: number): Promise<Equipment[]> {
    // This would need to be implemented with proper relations
    // For now, returning empty array as placeholder
    return [];
  }

  async getPartnerBookings(partnerId: number, limit?: number): Promise<Booking[]> {
    // This would need to be implemented with proper relations
    // For now, returning empty array as placeholder
    return [];
  }

  async getPartnerEarnings(partnerId: number): Promise<PartnerEarnings[]> {
    return await db.select()
      .from(partnerEarnings)
      .where(eq(partnerEarnings.partnerId, partnerId))
      .orderBy(desc(partnerEarnings.createdAt));
  }

  // Partner application methods
  async createPartnerApplication(applicationData: InsertPartnerApplication): Promise<PartnerApplication> {
    const [application] = await db.insert(partnerApplications).values({
      ...applicationData,
      submittedAt: new Date(),
    }).returning();
    return application;
  }

  async getAllPartnerApplications(): Promise<PartnerApplication[]> {
    return await db.select()
      .from(partnerApplications)
      .orderBy(desc(partnerApplications.createdAt));
  }

  async getPartnerApplicationById(id: number): Promise<PartnerApplication | undefined> {
    const [application] = await db.select()
      .from(partnerApplications)
      .where(eq(partnerApplications.id, id));
    return application;
  }

  async updatePartnerApplicationStatus(id: number, status: string, notes: string, reviewedBy: number): Promise<void> {
    await db.update(partnerApplications)
      .set({
        status,
        reviewNotes: notes,
        reviewedBy,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(partnerApplications.id, id));
  }

  // Partner document methods
  async createPartnerDocument(documentData: InsertPartnerDocument): Promise<PartnerDocument> {
    const [document] = await db.insert(partnerDocuments).values(documentData).returning();
    return document;
  }

  async getPartnerDocuments(partnerId: number): Promise<PartnerDocument[]> {
    return await db.select()
      .from(partnerDocuments)
      .where(eq(partnerDocuments.partnerId, partnerId))
      .orderBy(desc(partnerDocuments.uploadedAt));
  }

  // Partner fleet methods
  async createPartnerFleet(fleetData: InsertPartnerFleet): Promise<PartnerFleet> {
    const [fleet] = await db.insert(partnerFleet).values(fleetData).returning();
    return fleet;
  }

  async getPartnerFleet(partnerId: number): Promise<PartnerFleet[]> {
    return await db.select()
      .from(partnerFleet)
      .where(eq(partnerFleet.partnerId, partnerId))
      .orderBy(desc(partnerFleet.createdAt));
  }

  // Review methods
  async createReview(reviewData: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(reviewData).returning();
    return review;
  }

  async getReviewsByEquipment(equipmentId: number): Promise<Review[]> {
    return await db.select()
      .from(reviews)
      .where(eq(reviews.equipmentId, equipmentId))
      .orderBy(desc(reviews.createdAt));
  }

  async getReviewsByUser(userId: number): Promise<Review[]> {
    return await db.select()
      .from(reviews)
      .where(eq(reviews.userId, userId))
      .orderBy(desc(reviews.createdAt));
  }

  // Equipment tracking methods
  async updateEquipmentTracking(trackingData: InsertTracking): Promise<EquipmentTracking> {
    const [existing] = await db.select()
      .from(equipmentTracking)
      .where(eq(equipmentTracking.equipmentId, trackingData.equipmentId));

    if (existing) {
      const [updated] = await db.update(equipmentTracking)
        .set({
          ...trackingData,
          lastUpdated: new Date(),
        })
        .where(eq(equipmentTracking.equipmentId, trackingData.equipmentId))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(equipmentTracking)
        .values(trackingData)
        .returning();
      return created;
    }
  }

  async getEquipmentTracking(equipmentId: number): Promise<EquipmentTracking | undefined> {
    const [tracking] = await db.select()
      .from(equipmentTracking)
      .where(eq(equipmentTracking.equipmentId, equipmentId));
    return tracking;
  }

  // Maintenance methods
  async createMaintenanceSchedule(maintenanceData: InsertMaintenance): Promise<MaintenanceSchedule> {
    const [maintenance] = await db.insert(maintenanceSchedule).values(maintenanceData).returning();
    return maintenance;
  }

  async getMaintenanceByEquipment(equipmentId: number): Promise<MaintenanceSchedule[]> {
    return await db.select()
      .from(maintenanceSchedule)
      .where(eq(maintenanceSchedule.equipmentId, equipmentId))
      .orderBy(asc(maintenanceSchedule.scheduledDate));
  }

  async updateMaintenanceStatus(id: number, status: string): Promise<void> {
    const updateData: any = { status };
    if (status === 'completed') {
      updateData.completedDate = new Date();
    }
    
    await db.update(maintenanceSchedule)
      .set(updateData)
      .where(eq(maintenanceSchedule.id, id));
  }

  // Location methods
  async createLocation(locationData: InsertLocation): Promise<Location> {
    const [location] = await db.insert(locations).values(locationData).returning();
    return location;
  }

  async getAllLocations(): Promise<Location[]> {
    return await db.select().from(locations);
  }

  async getActiveLocations(): Promise<Location[]> {
    return await db.select()
      .from(locations)
      .where(eq(locations.isActive, true));
  }

  // Inventory methods
  async createInventory(inventoryData: InsertInventory): Promise<EquipmentInventory> {
    const [inventory] = await db.insert(equipmentInventory).values(inventoryData).returning();
    return inventory;
  }

  async getInventoryByLocation(locationId: number): Promise<EquipmentInventory[]> {
    return await db.select()
      .from(equipmentInventory)
      .where(eq(equipmentInventory.locationId, locationId));
  }

  async updateInventoryQuantity(id: number, quantity: number): Promise<void> {
    await db.update(equipmentInventory)
      .set({
        availableQuantity: quantity,
      })
      .where(eq(equipmentInventory.id, id));
  }

  // Notification methods
  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const [notification] = await db.insert(notifications).values(notificationData).returning();
    return notification;
  }

  async getPendingNotifications(): Promise<Notification[]> {
    return await db.select()
      .from(notifications)
      .where(eq(notifications.status, 'pending'))
      .orderBy(asc(notifications.createdAt));
  }

  async updateNotificationStatus(id: number, status: string): Promise<void> {
    const updateData: any = { status };
    if (status === 'sent') {
      updateData.sentAt = new Date();
    }

    await db.update(notifications)
      .set(updateData)
      .where(eq(notifications.id, id));
  }

  // Analytics methods
  async recordAnalytics(metric: string, value: number, metadata?: any): Promise<void> {
    await db.insert(analytics).values({
      date: new Date(),
      metric,
      value,
      metadata,
    });
  }

  async getAnalytics(metric: string, startDate: Date, endDate: Date): Promise<any[]> {
    return await db.select()
      .from(analytics)
      .where(
        and(
          eq(analytics.metric, metric),
          gte(analytics.date, startDate),
          lte(analytics.date, endDate)
        )
      )
      .orderBy(asc(analytics.date));
  }
}

export const advancedStorage = new AdvancedStorage();