import { pgTable, text, serial, integer, boolean, decimal, timestamp, real, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const equipment = pgTable("equipment", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  pricePerDay: integer("price_per_day").notNull(), // in XOF
  location: text("location").notNull(),
  imageUrl: text("image_url").notNull(),
  specifications: text("specifications").array(),
  isAvailable: boolean("is_available").notNull().default(true),
  weight: text("weight"),
  fuelType: text("fuel_type"),
  power: text("power"),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  equipmentId: integer("equipment_id").notNull(),
  userId: integer("user_id"), // New: Link to authenticated user
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  totalPrice: integer("total_price").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, completed, cancelled
  paymentMethod: text("payment_method"),
  paymentStatus: text("payment_status").default("pending"),
  paymentReference: text("payment_reference"),
  notes: text("notes"),
  canModify: boolean("can_modify").notNull().default(true),
  canCancel: boolean("can_cancel").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Historique des modifications de réservations
export const bookingHistory = pgTable("booking_history", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull(),
  field: text("field").notNull(), // Champ modifié (startDate, endDate, etc.)
  oldValue: text("old_value"), // Ancienne valeur
  newValue: text("new_value"), // Nouvelle valeur
  modifiedBy: text("modified_by").notNull(), // client, admin
  reason: text("reason"), // Raison de la modification
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Notifications pour l'administration
export const adminNotifications = pgTable("admin_notifications", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // reservation_modified, new_booking, cancellation
  title: text("title").notNull(),
  message: text("message").notNull(),
  bookingId: integer("booking_id"),
  isRead: boolean("is_read").notNull().default(false),
  priority: text("priority").notNull().default("normal"), // low, normal, high, urgent
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull(),
  amount: integer("amount").notNull(),
  paymentMethod: text("payment_method").notNull(),
  phoneNumber: text("phone_number").notNull(),
  transactionId: text("transaction_id"),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  equipmentCategory: text("equipment_category"),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull(),
});

export const partnerRequests = pgTable("partner_requests", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  website: text("website"),
  equipmentCategories: text("equipment_categories").array().notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  createdAt: timestamp("created_at").notNull().defaultNow(),
  processedAt: timestamp("processed_at"),
  processedBy: text("processed_by"),
  notes: text("notes"),
});

export const insertEquipmentSchema = createInsertSchema(equipment).omit({
  id: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  status: true,
  paymentStatus: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
});

export const insertPartnerRequestSchema = createInsertSchema(partnerRequests).omit({
  id: true,
  status: true,
  createdAt: true,
  processedAt: true,
  processedBy: true,
});

// User accounts system
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password"), // Can be null for OAuth users
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  role: text("role").notNull().default("customer"), // customer, admin, manager, partner
  isVerified: boolean("is_verified").notNull().default(false),
  authProvider: text("auth_provider").notNull().default("local"), // local, google
  googleId: text("google_id").unique(),
  profilePicture: text("profile_picture"),
  commercialManagerId: integer("commercial_manager_id"), // Reference to assigned manager
  preferences: jsonb("preferences"), // User preferences for recommendations
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Commercial managers
export const commercialManagers = pgTable("commercial_managers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Reference to users table
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  specialization: text("specialization"), // trucks, agricultural, industrial
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// User sessions for authentication
export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  sessionToken: text("session_token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Partner registration and management
export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // reference to users table
  companyName: text("company_name").notNull(),
  businessRegistrationNumber: text("business_registration_number").notNull().unique(),
  businessType: text("business_type").notNull(), // individual, company, cooperative
  taxNumber: text("tax_number"),
  website: text("website"),
  description: text("description"),
  logo: text("logo"),
  coverImage: text("cover_image"),
  status: text("status").notNull().default("pending"), // pending, approved, suspended, rejected
  commissionRate: real("commission_rate").notNull().default(15.0), // percentage
  documentsSubmitted: boolean("documents_submitted").notNull().default(false),
  documentsVerified: boolean("documents_verified").notNull().default(false),
  contractSigned: boolean("contract_signed").notNull().default(false),
  bankAccountName: text("bank_account_name"),
  bankAccountNumber: text("bank_account_number"),
  bankName: text("bank_name"),
  mobileMoneyCodes: jsonb("mobile_money_codes"), // Orange Money/Wave account details
  approvedAt: timestamp("approved_at"),
  approvedBy: integer("approved_by"), // reference to admin user
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Partner documents for verification
export const partnerDocuments = pgTable("partner_documents", {
  id: serial("id").primaryKey(),
  partnerId: integer("partner_id").notNull(),
  documentType: text("document_type").notNull(), // business_license, tax_certificate, id_card, bank_statement
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  isVerified: boolean("is_verified").notNull().default(false),
  verifiedAt: timestamp("verified_at"),
  verifiedBy: integer("verified_by"),
  notes: text("notes"),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
});

// Partner fleet management
export const partnerFleet = pgTable("partner_fleet", {
  id: serial("id").primaryKey(),
  partnerId: integer("partner_id").notNull(),
  equipmentId: integer("equipment_id").notNull(),
  ownershipType: text("ownership_type").notNull().default("owned"), // owned, leased, managed
  acquisitionDate: timestamp("acquisition_date"),
  registrationNumber: text("registration_number"),
  insuranceProvider: text("insurance_provider"),
  insuranceNumber: text("insurance_number"),
  insuranceExpiry: timestamp("insurance_expiry"),
  lastInspection: timestamp("last_inspection"),
  nextInspection: timestamp("next_inspection"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Partner earnings and commissions
export const partnerEarnings = pgTable("partner_earnings", {
  id: serial("id").primaryKey(),
  partnerId: integer("partner_id").notNull(),
  bookingId: integer("booking_id").notNull(),
  rentalAmount: integer("rental_amount").notNull(), // total rental amount
  commissionRate: real("commission_rate").notNull(),
  commissionAmount: integer("commission_amount").notNull(), // commission taken by Aywa
  partnerAmount: integer("partner_amount").notNull(), // amount for partner
  status: text("status").notNull().default("pending"), // pending, paid, disputed
  payoutMethod: text("payout_method"), // bank_transfer, mobile_money
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Partner application process tracking
export const partnerApplications = pgTable("partner_applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  applicationData: jsonb("application_data").notNull(), // all form data
  currentStep: text("current_step").notNull().default("basic_info"), // basic_info, documents, verification, approval
  status: text("status").notNull().default("draft"), // draft, submitted, under_review, approved, rejected
  reviewNotes: text("review_notes"),
  reviewedBy: integer("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  submittedAt: timestamp("submitted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Equipment reviews and ratings
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  equipmentId: integer("equipment_id").notNull(),
  userId: integer("user_id").notNull(),
  bookingId: integer("booking_id").notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Equipment tracking and GPS
export const equipmentTracking = pgTable("equipment_tracking", {
  id: serial("id").primaryKey(),
  equipmentId: integer("equipment_id").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  status: text("status").notNull().default("idle"), // idle, in-use, maintenance, transit
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  batteryLevel: integer("battery_level"), // for GPS devices
});

// Maintenance scheduling
export const maintenanceSchedule = pgTable("maintenance_schedule", {
  id: serial("id").primaryKey(),
  equipmentId: integer("equipment_id").notNull(),
  maintenanceType: text("maintenance_type").notNull(), // routine, repair, inspection
  scheduledDate: timestamp("scheduled_date").notNull(),
  completedDate: timestamp("completed_date"),
  technician: text("technician"),
  notes: text("notes"),
  cost: integer("cost"), // in XOF
  status: text("status").notNull().default("scheduled"), // scheduled, in-progress, completed, cancelled
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Multiple locations management
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  region: text("region").notNull(),
  phone: text("phone"),
  email: text("email"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  isActive: boolean("is_active").notNull().default(true),
  managerId: integer("manager_id"), // reference to users table
});

// Equipment inventory by location
export const equipmentInventory = pgTable("equipment_inventory", {
  id: serial("id").primaryKey(),
  equipmentId: integer("equipment_id").notNull(),
  locationId: integer("location_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  availableQuantity: integer("available_quantity").notNull().default(1),
  condition: text("condition").notNull().default("good"), // excellent, good, fair, needs-repair
});

// SMS notifications log
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  bookingId: integer("booking_id"),
  phone: text("phone").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // booking-confirmation, payment-reminder, maintenance-alert
  status: text("status").notNull().default("pending"), // pending, sent, failed
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Analytics data
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  metric: text("metric").notNull(), // bookings_count, revenue, equipment_utilization
  value: real("value").notNull(),
  metadata: jsonb("metadata"), // additional data like equipment_id, location_id
});

// Equipment unavailability periods set by partners
export const equipmentUnavailability = pgTable("equipment_unavailability", {
  id: serial("id").primaryKey(),
  partnerId: integer("partner_id").notNull(),
  equipmentId: integer("equipment_id").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  reason: text("reason").notNull(), // maintenance, rented_externally, personal_use, repair, other
  description: text("description"),
  isRecurring: boolean("is_recurring").notNull().default(false),
  recurringPattern: text("recurring_pattern"), // weekly, monthly, yearly
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Update existing tables with relations
export const equipmentRelations = relations(equipment, ({ many, one }) => ({
  bookings: many(bookings),
  reviews: many(reviews),
  tracking: one(equipmentTracking, {
    fields: [equipment.id],
    references: [equipmentTracking.equipmentId],
  }),
  inventory: many(equipmentInventory),
  maintenance: many(maintenanceSchedule),
}));

export const bookingRelations = relations(bookings, ({ one, many }) => ({
  equipment: one(equipment, {
    fields: [bookings.equipmentId],
    references: [equipment.id],
  }),
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  payments: many(payments),
  reviews: many(reviews),
}));

export const userRelations = relations(users, ({ many, one }) => ({
  bookings: many(bookings),
  reviews: many(reviews),
  sessions: many(userSessions),
  partner: one(partners, {
    fields: [users.id],
    references: [partners.userId],
  }),
  commercialManager: one(commercialManagers, {
    fields: [users.commercialManagerId],
    references: [commercialManagers.id],
  }),
}));

export const commercialManagerRelations = relations(commercialManagers, ({ one, many }) => ({
  user: one(users, {
    fields: [commercialManagers.userId],
    references: [users.id],
  }),
  customers: many(users),
}));

export const userSessionRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id],
  }),
}));

export const partnerRelations = relations(partners, ({ one, many }) => ({
  user: one(users, {
    fields: [partners.userId],
    references: [users.id],
  }),
  documents: many(partnerDocuments),
  fleet: many(partnerFleet),
  earnings: many(partnerEarnings),
  applications: many(partnerApplications),
}));

export const partnerFleetRelations = relations(partnerFleet, ({ one }) => ({
  partner: one(partners, {
    fields: [partnerFleet.partnerId],
    references: [partners.id],
  }),
  equipment: one(equipment, {
    fields: [partnerFleet.equipmentId],
    references: [equipment.id],
  }),
}));

// Insert schemas for new tables
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommercialManagerSchema = createInsertSchema(commercialManagers).omit({
  id: true,
  createdAt: true,
});

export const insertUserSessionSchema = createInsertSchema(userSessions).omit({
  id: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertTrackingSchema = createInsertSchema(equipmentTracking).omit({
  id: true,
  lastUpdated: true,
});

export const insertMaintenanceSchema = createInsertSchema(maintenanceSchedule).omit({
  id: true,
  createdAt: true,
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
});

export const insertInventorySchema = createInsertSchema(equipmentInventory).omit({
  id: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertPartnerSchema = createInsertSchema(partners).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPartnerDocumentSchema = createInsertSchema(partnerDocuments).omit({
  id: true,
  uploadedAt: true,
});

export const insertPartnerFleetSchema = createInsertSchema(partnerFleet).omit({
  id: true,
  createdAt: true,
});

export const insertPartnerEarningsSchema = createInsertSchema(partnerEarnings).omit({
  id: true,
  createdAt: true,
});

export const insertPartnerApplicationSchema = createInsertSchema(partnerApplications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type Equipment = typeof equipment.$inferSelect;
export type InsertEquipment = z.infer<typeof insertEquipmentSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type CommercialManager = typeof commercialManagers.$inferSelect;
export type InsertCommercialManager = z.infer<typeof insertCommercialManagerSchema>;
export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type EquipmentTracking = typeof equipmentTracking.$inferSelect;
export type InsertTracking = z.infer<typeof insertTrackingSchema>;
export type MaintenanceSchedule = typeof maintenanceSchedule.$inferSelect;
export type InsertMaintenance = z.infer<typeof insertMaintenanceSchema>;
export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type EquipmentInventory = typeof equipmentInventory.$inferSelect;
export type InsertInventory = z.infer<typeof insertInventorySchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Partner = typeof partners.$inferSelect;
export type InsertPartner = z.infer<typeof insertPartnerSchema>;
export type PartnerDocument = typeof partnerDocuments.$inferSelect;
export type InsertPartnerDocument = z.infer<typeof insertPartnerDocumentSchema>;
export type PartnerFleet = typeof partnerFleet.$inferSelect;
export type InsertPartnerFleet = z.infer<typeof insertPartnerFleetSchema>;
export type PartnerEarnings = typeof partnerEarnings.$inferSelect;
export type InsertPartnerEarnings = z.infer<typeof insertPartnerEarningsSchema>;
export type PartnerApplication = typeof partnerApplications.$inferSelect;
export type InsertPartnerApplication = z.infer<typeof insertPartnerApplicationSchema>;
