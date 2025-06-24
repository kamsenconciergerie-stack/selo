-- Base de données MySQL pour Aywa - Location d'Équipement
-- Créé pour gérer l'ensemble du business de location

-- Table des utilisateurs (clients et administrateurs)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role ENUM('customer', 'admin', 'operator') DEFAULT 'customer',
    company_name VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    id_number VARCHAR(50), -- CNI ou passeport
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('active', 'suspended', 'deleted') DEFAULT 'active'
);

-- Table des catégories d'équipements
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des équipements
CREATE TABLE equipment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id INT NOT NULL,
    price_per_day DECIMAL(10,2) NOT NULL, -- Prix en XOF
    price_per_week DECIMAL(10,2),
    price_per_month DECIMAL(10,2),
    deposit_amount DECIMAL(10,2) NOT NULL, -- Caution
    location VARCHAR(100) NOT NULL,
    purchase_date DATE,
    purchase_price DECIMAL(10,2),
    supplier VARCHAR(255),
    serial_number VARCHAR(100),
    model VARCHAR(100),
    brand VARCHAR(100),
    year_manufactured YEAR,
    
    -- Spécifications techniques
    weight VARCHAR(50),
    dimensions VARCHAR(100),
    fuel_type ENUM('diesel', 'essence', 'electrique', 'hybride', 'pneumatique', 'manuel', 'autre'),
    power VARCHAR(50),
    capacity VARCHAR(50),
    
    -- État et disponibilité
    condition_status ENUM('excellent', 'bon', 'moyen', 'reparation_requise') DEFAULT 'bon',
    availability_status ENUM('disponible', 'loue', 'maintenance', 'reparation', 'hors_service') DEFAULT 'disponible',
    
    -- Médias
    primary_image_url VARCHAR(500),
    images JSON, -- URLs des images supplémentaires
    manual_url VARCHAR(500), -- Manuel d'utilisation
    
    -- Métadonnées
    specifications JSON, -- Autres spécifications techniques
    included_accessories JSON, -- Accessoires inclus
    maintenance_schedule JSON, -- Planning de maintenance
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_category (category_id),
    INDEX idx_location (location),
    INDEX idx_availability (availability_status),
    INDEX idx_price (price_per_day)
);

-- Table des réservations/locations
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_reference VARCHAR(20) UNIQUE NOT NULL, -- REF-2025-001
    user_id INT NOT NULL,
    equipment_id INT NOT NULL,
    
    -- Dates et durée
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_days INT NOT NULL,
    actual_return_date DATE,
    
    -- Détails client
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT,
    delivery_address TEXT,
    
    -- Tarification
    daily_rate DECIMAL(10,2) NOT NULL,
    total_equipment_cost DECIMAL(10,2) NOT NULL,
    delivery_cost DECIMAL(10,2) DEFAULT 0,
    insurance_cost DECIMAL(10,2) DEFAULT 0,
    deposit_amount DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    taxes DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    
    -- Statut et suivi
    status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'overdue') DEFAULT 'pending',
    payment_status ENUM('pending', 'partial', 'paid', 'refunded') DEFAULT 'pending',
    delivery_status ENUM('pending', 'scheduled', 'delivered', 'collected') DEFAULT 'pending',
    
    -- Livraison
    delivery_scheduled_date DATETIME,
    delivery_completed_date DATETIME,
    collection_scheduled_date DATETIME,
    collection_completed_date DATETIME,
    operator_id INT, -- Opérateur responsable
    
    -- Notes et conditions
    notes TEXT,
    special_instructions TEXT,
    damage_report TEXT,
    condition_on_delivery JSON,
    condition_on_return JSON,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (equipment_id) REFERENCES equipment(id),
    FOREIGN KEY (operator_id) REFERENCES users(id),
    INDEX idx_booking_ref (booking_reference),
    INDEX idx_dates (start_date, end_date),
    INDEX idx_status (status),
    INDEX idx_user (user_id),
    INDEX idx_equipment (equipment_id)
);

-- Table des paiements
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    payment_reference VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_type ENUM('deposit', 'rental', 'damage', 'late_fee', 'refund') NOT NULL,
    payment_method ENUM('cash', 'bank_transfer', 'mobile_money', 'card', 'cheque') NOT NULL,
    payment_provider VARCHAR(100), -- Orange Money, Wave, etc.
    transaction_id VARCHAR(100),
    status ENUM('pending', 'completed', 'failed', 'cancelled', 'refunded') DEFAULT 'pending',
    payment_date DATETIME,
    notes TEXT,
    processed_by INT, -- ID de l'utilisateur qui a traité
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (processed_by) REFERENCES users(id),
    INDEX idx_booking (booking_id),
    INDEX idx_reference (payment_reference),
    INDEX idx_status (status),
    INDEX idx_date (payment_date)
);

-- Table de maintenance des équipements
CREATE TABLE maintenance_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    equipment_id INT NOT NULL,
    maintenance_type ENUM('preventive', 'corrective', 'inspection', 'cleaning') NOT NULL,
    description TEXT NOT NULL,
    performed_by VARCHAR(255) NOT NULL,
    performed_date DATE NOT NULL,
    cost DECIMAL(10,2),
    parts_replaced JSON, -- Liste des pièces remplacées
    next_maintenance_date DATE,
    hours_of_operation INT, -- Heures d'utilisation au moment de la maintenance
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'completed',
    notes TEXT,
    attachments JSON, -- Photos, factures, etc.
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (equipment_id) REFERENCES equipment(id),
    INDEX idx_equipment (equipment_id),
    INDEX idx_date (performed_date),
    INDEX idx_type (maintenance_type)
);

-- Table des demandes de renseignements
CREATE TABLE inquiries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    company_name VARCHAR(255),
    equipment_category VARCHAR(100),
    message TEXT NOT NULL,
    preferred_contact_method ENUM('email', 'phone', 'whatsapp') DEFAULT 'email',
    project_description TEXT,
    budget_range VARCHAR(100),
    timeline VARCHAR(100),
    
    status ENUM('new', 'contacted', 'quoted', 'converted', 'closed') DEFAULT 'new',
    assigned_to INT, -- Représentant commercial assigné
    response_sent BOOLEAN DEFAULT FALSE,
    response_date DATETIME,
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    INDEX idx_status (status),
    INDEX idx_category (equipment_category),
    INDEX idx_created (created_at)
);

-- Table des zones de livraison et tarifs
CREATE TABLE delivery_zones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    zone_name VARCHAR(100) NOT NULL,
    cities JSON NOT NULL, -- Liste des villes couvertes
    base_delivery_cost DECIMAL(10,2) NOT NULL,
    cost_per_km DECIMAL(5,2) DEFAULT 0,
    max_delivery_distance INT, -- Distance maximale en km
    delivery_time_hours INT NOT NULL, -- Temps de livraison standard
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table de l'inventaire et des mouvements
CREATE TABLE inventory_movements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    equipment_id INT NOT NULL,
    movement_type ENUM('rental_out', 'rental_return', 'maintenance_out', 'maintenance_return', 'purchase', 'sale', 'damage', 'transfer') NOT NULL,
    booking_id INT, -- Si lié à une réservation
    from_location VARCHAR(100),
    to_location VARCHAR(100),
    quantity INT DEFAULT 1,
    condition_before ENUM('excellent', 'bon', 'moyen', 'mauvais'),
    condition_after ENUM('excellent', 'bon', 'moyen', 'mauvais'),
    operator_id INT NOT NULL,
    notes TEXT,
    movement_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (equipment_id) REFERENCES equipment(id),
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (operator_id) REFERENCES users(id),
    INDEX idx_equipment (equipment_id),
    INDEX idx_type (movement_type),
    INDEX idx_date (movement_date)
);

-- Table des notifications système
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    type ENUM('booking_confirmation', 'payment_reminder', 'delivery_scheduled', 'maintenance_due', 'equipment_overdue', 'general') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_booking_id INT,
    related_equipment_id INT,
    is_read BOOLEAN DEFAULT FALSE,
    sent_via ENUM('email', 'sms', 'whatsapp', 'system') DEFAULT 'system',
    scheduled_for DATETIME,
    sent_at DATETIME,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (related_booking_id) REFERENCES bookings(id),
    FOREIGN KEY (related_equipment_id) REFERENCES equipment(id),
    INDEX idx_user (user_id),
    INDEX idx_type (type),
    INDEX idx_read (is_read)
);

-- Table des paramètres système
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    data_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    is_public BOOLEAN DEFAULT FALSE, -- Visible côté client
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (updated_by) REFERENCES users(id),
    INDEX idx_key (setting_key)
);

-- Table des rapports financiers (vue matérialisée pour performance)
CREATE TABLE financial_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    report_date DATE NOT NULL,
    period_type ENUM('daily', 'weekly', 'monthly', 'yearly') NOT NULL,
    total_revenue DECIMAL(15,2) DEFAULT 0,
    total_bookings INT DEFAULT 0,
    total_equipment_rented INT DEFAULT 0,
    average_booking_value DECIMAL(10,2) DEFAULT 0,
    top_equipment_category VARCHAR(100),
    top_location VARCHAR(100),
    occupancy_rate DECIMAL(5,2) DEFAULT 0, -- Taux d'occupation moyen
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_report (report_date, period_type),
    INDEX idx_date (report_date),
    INDEX idx_period (period_type)
);

-- Insertion des données de base

-- Catégories d'équipements
INSERT INTO categories (name, description, icon, display_order) VALUES
('Engins de Chantier', 'Pelleteuses, grues, chargeuses et équipements lourds', 'truck', 1),
('Équipement Électrique', 'Générateurs, compresseurs, pompes et équipements électriques', 'zap', 2),
('Outils à Main', 'Bétonnières, scies, perceuses et outils manuels', 'hammer', 3),
('Sécurité & EPI', 'Échafaudages, casques, harnais et équipements de protection', 'shield', 4),
('Agriculture', 'Tracteurs, moissonneuses et équipements agricoles', 'tractor', 5),
('Événementiel', 'Sonorisation, éclairage et équipements pour événements', 'volume-2', 6);

-- Zones de livraison
INSERT INTO delivery_zones (zone_name, cities, base_delivery_cost, delivery_time_hours) VALUES
('Dakar Métropolitain', '["Dakar", "Pikine", "Guédiawaye", "Rufisque"]', 0, 2),
('Région de Thiès', '["Thiès", "Mbour", "Tivaouane"]', 15000, 24),
('Région de Saint-Louis', '["Saint-Louis", "Dagana", "Podor"]', 25000, 48),
('Centre du Sénégal', '["Kaolack", "Diourbel", "Fatick", "Kaffrine"]', 20000, 48),
('Sud du Sénégal', '["Ziguinchor", "Kolda", "Sédhiou"]', 35000, 72),
('Est du Sénégal', '["Tambacounda", "Kédougou", "Matam"]', 40000, 72);

-- Paramètres système de base
INSERT INTO system_settings (setting_key, setting_value, description, data_type, is_public) VALUES
('company_name', 'Aywa', 'Nom de l\'entreprise', 'string', TRUE),
('company_phone', '+221 33 XXX XXXX', 'Téléphone principal', 'string', TRUE),
('company_email', 'contact@aywa.sn', 'Email de contact', 'string', TRUE),
('company_address', 'Zone Industrielle, Dakar, Sénégal', 'Adresse de l\'entreprise', 'string', TRUE),
('default_deposit_percentage', '30', 'Pourcentage de caution par défaut', 'number', FALSE),
('late_fee_per_day', '5000', 'Frais de retard par jour (XOF)', 'number', FALSE),
('max_booking_days', '90', 'Durée maximale de location (jours)', 'number', TRUE),
('min_booking_hours', '24', 'Durée minimale de location (heures)', 'number', TRUE),
('working_hours', '{"start": "08:00", "end": "18:00"}', 'Heures d\'ouverture', 'json', TRUE),
('emergency_contact', '+221 77 XXX XXXX', 'Contact d\'urgence 24h/24', 'string', TRUE);

-- Index additionnels pour optimisation
CREATE INDEX idx_equipment_search ON equipment(name, description(100), location);
CREATE INDEX idx_booking_period ON bookings(start_date, end_date, status);
CREATE INDEX idx_user_bookings ON bookings(user_id, created_at DESC);
CREATE INDEX idx_financial_summary ON payments(payment_date, amount, status);

-- Vues pour les rapports fréquents
CREATE VIEW equipment_availability AS
SELECT 
    e.id,
    e.name,
    e.category_id,
    c.name as category_name,
    e.location,
    e.availability_status,
    CASE 
        WHEN e.availability_status = 'disponible' THEN 'Disponible'
        WHEN EXISTS(
            SELECT 1 FROM bookings b 
            WHERE b.equipment_id = e.id 
            AND b.status = 'in_progress' 
            AND CURDATE() BETWEEN b.start_date AND b.end_date
        ) THEN 'En location'
        ELSE 'Non disponible'
    END as current_status,
    (SELECT MAX(end_date) FROM bookings WHERE equipment_id = e.id AND status IN ('confirmed', 'in_progress')) as next_available_date
FROM equipment e
JOIN categories c ON e.category_id = c.id
WHERE e.is_active = TRUE;

CREATE VIEW monthly_revenue AS
SELECT 
    YEAR(payment_date) as year,
    MONTH(payment_date) as month,
    SUM(amount) as total_revenue,
    COUNT(DISTINCT booking_id) as total_bookings,
    AVG(amount) as average_payment
FROM payments 
WHERE status = 'completed' 
AND payment_type IN ('rental', 'deposit')
GROUP BY YEAR(payment_date), MONTH(payment_date)
ORDER BY year DESC, month DESC;