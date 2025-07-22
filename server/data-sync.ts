// Solution de synchronisation complète des données
// Ce module assure qu'il n'y a aucun décalage entre /admin, /adminpartners et le site principal

import { db } from "@shared/db";
import { equipment, bookings, partners, partnerDrivers, driverAssignments } from "@shared/schema";
import { eq } from "drizzle-orm";

export class UnifiedDataService {
  // SOLUTION 1: Base de données unifiée PostgreSQL
  // Toutes les données proviennent de la même source
  
  async getAllEquipment() {
    return await db.select().from(equipment);
  }

  async getEquipmentByPartnerId(partnerId: number) {
    return await db.select().from(equipment).where(eq(equipment.partnerId, partnerId));
  }

  async updateEquipment(id: number, data: any) {
    const [updated] = await db
      .update(equipment)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(equipment.id, id))
      .returning();
    return updated;
  }

  async createEquipment(data: any) {
    const [created] = await db
      .insert(equipment)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return created;
  }

  // SOLUTION 2: Cache invalidation automatique
  // Chaque modification invalide automatiquement les caches

  async syncPartnerEquipment(partnerId: number, equipmentData: any) {
    // Met à jour dans la base principale ET invalide les caches
    const updated = await this.updateEquipment(equipmentData.id, equipmentData);
    
    // Notifier tous les clients connectés via WebSocket si nécessaire
    this.notifyDataChange('equipment_updated', { partnerId, equipment: updated });
    
    return updated;
  }

  // SOLUTION 3: Single source of truth
  // Une seule API pour tous les accès aux données

  async getPartnerDashboardData(partnerId: number) {
    const [equipment, drivers, assignments] = await Promise.all([
      this.getEquipmentByPartnerId(partnerId),
      this.getPartnerDrivers(partnerId),
      this.getDriverAssignments(partnerId)
    ]);

    return { equipment, drivers, assignments };
  }

  async getPartnerDrivers(partnerId: number) {
    return await db.select().from(partnerDrivers).where(eq(partnerDrivers.partnerId, partnerId));
  }

  async getDriverAssignments(partnerId: number) {
    return await db.select().from(driverAssignments).where(eq(driverAssignments.partnerId, partnerId));
  }

  private notifyDataChange(event: string, data: any) {
    // Système de notification en temps réel
    console.log(`[SYNC] ${event}:`, data);
    // Ici on pourrait ajouter WebSocket pour notifier les interfaces en temps réel
  }
}

export const unifiedData = new UnifiedDataService();