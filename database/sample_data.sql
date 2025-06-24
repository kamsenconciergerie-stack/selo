-- Données d'exemple pour tester la base de données Aywa

-- Insertion d'utilisateurs de test
INSERT INTO users (email, password_hash, first_name, last_name, phone, role, company_name, address, city, id_number, is_verified, status) VALUES
('admin@aywa.sn', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Amadou', 'Diallo', '+221771234567', 'admin', 'Aywa SARL', 'Zone Industrielle, Dakar', 'Dakar', '1234567890123', TRUE, 'active'),
('fatou.sow@aywa.sn', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Fatou', 'Sow', '+221776543210', 'admin', 'Aywa SARL', 'Zone Industrielle, Dakar', 'Dakar', '2345678901234', TRUE, 'active'),
('moussa.kane@aywa.sn', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Moussa', 'Kane', '+221779876543', 'operator', 'Aywa SARL', 'Zone Industrielle, Dakar', 'Dakar', '3456789012345', TRUE, 'active'),

-- Clients test
('client1@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ousmane', 'Ndiaye', '+221771111111', 'customer', 'Construction Ndiaye', 'Médina, Dakar', 'Dakar', '4567890123456', TRUE, 'active'),
('client2@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Aïssatou', 'Ba', '+221772222222', 'customer', 'Événements Ba', 'Plateau, Dakar', 'Dakar', '5678901234567', TRUE, 'active'),
('client3@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mamadou', 'Fall', '+221773333333', 'customer', 'Agro Fall', 'Centre-ville, Thiès', 'Thiès', '6789012345678', TRUE, 'active');

-- Insertion d'équipements de test avec les ID des catégories
INSERT INTO equipment (
    name, description, category_id, price_per_day, price_per_week, price_per_month, deposit_amount, 
    location, brand, model, year_manufactured, weight, fuel_type, power, capacity,
    condition_status, availability_status, primary_image_url, specifications, included_accessories
) VALUES
-- Engins de Chantier (category_id = 1)
('Pelleteuse CAT 320D', 'Pelleteuse hydraulique 20 tonnes pour travaux de terrassement et excavation', 1, 85000, 510000, 2040000, 500000, 'Dakar', 'Caterpillar', '320D', 2022, '20 tonnes', 'diesel', '140 CV', '20 tonnes', 'excellent', 'disponible', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12', '["Godet 1.2m³", "Chenilles", "Climatisation", "GPS"]', '["Godets supplémentaires", "Brise-roche hydraulique"]'),

('Camion-Citerne IVECO', 'Transport d\'eau potable 10 000L avec pompe intégrée', 1, 95000, 570000, 2280000, 600000, 'Thiès', 'IVECO', 'Trakker', 2021, '15 tonnes', 'diesel', '250 CV', '10000L', 'bon', 'disponible', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12', '["Cuve inox alimentaire", "Pompe haute pression", "Flexible 50m"]', '["Flexibles supplémentaires", "Raccords divers"]'),

('Foreuse Atlas Copco', 'Foreuse pour puits d\'eau jusqu\'à 100m de profondeur', 1, 120000, 720000, 2880000, 800000, 'Thiès', 'Atlas Copco', 'SmartROC T25', 2023, '8 tonnes', 'diesel', '180 CV', '100m profondeur', 'excellent', 'disponible', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12', '["Système GPS", "Compresseur intégré", "Chenilles"]', '["Tiges de forage", "Couronnes diamant"]'),

('Camion Grue LIEBHERR', 'Grue mobile 25 tonnes avec stabilisateurs', 1, 150000, 900000, 3600000, 1000000, 'Dakar', 'Liebherr', 'LTM 1025', 2022, '35 tonnes', 'diesel', '350 CV', '25 tonnes', 'excellent', 'disponible', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12', '["Portée 30m", "Stabilisateurs automatiques", "Cabine climatisée"]', '["Sangles", "Élingues", "Crochets divers"]'),

('Tracteur John Deere', 'Tracteur agricole 85 CV avec relevage hydraulique', 1, 75000, 450000, 1800000, 400000, 'Diourbel', 'John Deere', '6085M', 2021, '4.5 tonnes', 'diesel', '85 CV', '85 CV', 'bon', 'disponible', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12', '["4x4", "Relevage hydraulique", "Prise de force", "Climatisation"]', '["Charrue", "Cultivateur", "Semoir"]'),

-- Équipement Électrique (category_id = 2)
('Générateur SDMO 100 KVA', 'Générateur diesel silencieux pour alimentations de secours', 2, 45000, 270000, 1080000, 300000, 'Dakar', 'SDMO', 'J100K', 2022, '2.5 tonnes', 'diesel', '100 KVA', '100 KVA', 'excellent', 'disponible', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1', '["Démarrage automatique", "Niveau sonore 65dB", "Autonomie 10h"]', '["Câbles de raccordement", "Prolongateurs"]'),

('Motopompe Honda', 'Pompe d\'irrigation haute pression pour agriculture', 2, 35000, 210000, 840000, 200000, 'Kaolack', 'Honda', 'WB30XT', 2023, '800 kg', 'diesel', '75 CV', '500 m³/h', 'excellent', 'disponible', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1', '["Auto-amorçante", "Aspiration 8m", "Refoulement 50m"]', '["Tuyaux d\'aspiration", "Tuyaux de refoulement", "Raccords"]'),

('Compresseur Atlas Copco', 'Compresseur d\'air mobile 500L pour outils pneumatiques', 2, 28000, 168000, 672000, 150000, 'Dakar', 'Atlas Copco', 'XAMS 407', 2022, '180 kg', 'electrique', '5.5 kW', '500L', 'bon', 'disponible', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1', '["Pression 12 bar", "Silencieux", "Roulettes"]', '["Tuyaux spiralés", "Pistolets de soufflage", "Raccords rapides"]'),

('Groupe Solaire Hybrid', 'Générateur hybride solaire-diesel 50 KVA', 2, 65000, 390000, 1560000, 400000, 'Saint-Louis', 'SolarTech', 'HYB-50', 2023, '2 tonnes', 'hybride', '50 KVA', '50 KVA', 'excellent', 'disponible', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1', '["Panneaux solaires 10kW", "Batterie lithium 100kWh", "Onduleur intelligent"]', '["Régulateur de charge", "Monitoring WiFi"]'),

('Système Audio Professionnel', 'Sonorisation 5000W pour événements avec éclairage LED', 2, 45000, 270000, 1080000, 250000, 'Dakar', 'Pioneer', 'PA-5000', 2022, '150 kg', 'electrique', '5000W', '5000W', 'excellent', 'disponible', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1', '["Sans fil", "8 microphones", "Table de mixage", "Éclairage LED"]', '["Micros supplémentaires", "Câbles", "Pieds"]'),

('Station Lavage Mobile', 'Unité de lavage haute pression avec récupération d\'eau', 2, 35000, 210000, 840000, 200000, 'Thiès', 'Kärcher', 'HDS-M', 2023, '500 kg', 'electrique', '15 kW', '200 bar', 'excellent', 'disponible', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1', '["Récupération d\'eau", "Filtration", "Mobile sur remorque"]', '["Brosses", "Détergents écologiques", "Accessoires lavage"]'),

-- Outils à Main (category_id = 3)
('Bétonnière ALTRAD', 'Bétonnière thermique professionnelle 350L', 3, 15000, 90000, 360000, 80000, 'Dakar', 'Altrad', 'B350', 2022, '120 kg', 'essence', '5.5 CV', '350L', 'bon', 'disponible', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12', '["Moteur Honda", "Cuve basculante", "Roues pneumatiques"]', '["Pelle à béton", "Seau de mesure"]'),

('Scie Circulaire Makita', 'Scie circulaire sur table professionnelle', 3, 18000, 108000, 432000, 100000, 'Saint-Louis', 'Makita', 'MLT100', 2023, '45 kg', 'electrique', '3000W', 'Lame 315mm', 'excellent', 'disponible', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1', '["Guide parallèle", "Aspiration poussière", "Sécurité totale"]', '["Lames supplémentaires", "Guide d\'angle"]'),

-- Sécurité & EPI (category_id = 4)
('Échafaudage Layher', 'Échafaudage mobile aluminium jusqu\'à 8m', 4, 25000, 150000, 600000, 150000, 'Dakar', 'Layher', 'SpeedyScaf', 2022, '150 kg', 'manuel', 'N/A', '8m hauteur', 'excellent', 'disponible', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1', '["Roues avec freins", "Garde-corps", "Planchers antidérapants"]', '["Stabilisateurs", "Filets de sécurité"]'),

('Kit EPI Complet', 'Équipements de protection individuelle - Lot professionnel', 4, 8000, 48000, 192000, 50000, 'Dakar', 'Divers', 'PRO-KIT', 2023, '20 kg', 'manuel', 'N/A', '10 personnes', 'excellent', 'disponible', 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1', '["Casques", "Gilets haute visibilité", "Gants", "Chaussures sécurité"]', '["Lunettes protection", "Masques respiratoires"]');

-- Création de quelques réservations de test
INSERT INTO bookings (
    user_id, equipment_id, start_date, end_date, customer_name, customer_email, customer_phone,
    delivery_address, daily_rate, total_equipment_cost, delivery_cost, deposit_amount, total_amount,
    status, payment_status, notes
) VALUES
(4, 1, '2025-01-15', '2025-01-20', 'Ousmane Ndiaye', 'client1@example.com', '+221771111111', 
'Chantier Pikine, Dakar', 85000, 510000, 0, 255000, 510000, 'confirmed', 'partial', 'Chantier de construction résidentielle'),

(5, 5, '2025-01-20', '2025-01-25', 'Aïssatou Ba', 'client2@example.com', '+221772222222',
'Hôtel King Fahd, Dakar', 45000, 270000, 0, 135000, 270000, 'pending', 'pending', 'Mariage de 300 personnes'),

(6, 3, '2025-02-01', '2025-02-10', 'Mamadou Fall', 'client3@example.com', '+221773333333',
'Village de Keur Moussa, Thiès', 120000, 1200000, 25000, 600000, 1225000, 'confirmed', 'partial', 'Forage pour accès à l\'eau potable');

-- Création de quelques paiements de test
INSERT INTO payments (
    booking_id, amount, payment_type, payment_method, payment_provider, 
    transaction_id, status, processed_by, notes
) VALUES
(1, 255000, 'deposit', 'mobile_money', 'Orange Money', 'OM2025011500123', 'completed', 1, 'Acompte versé via Orange Money'),
(3, 600000, 'deposit', 'bank_transfer', 'BOA Sénégal', 'BOA2025013100456', 'completed', 1, 'Caution versée par virement bancaire');

-- Création de quelques enregistrements de maintenance
INSERT INTO maintenance_records (
    equipment_id, maintenance_type, description, performed_by, performed_date, 
    cost, next_maintenance_date, status
) VALUES
(1, 'preventive', 'Vidange moteur et vérification hydraulique', 'Moussa Kane', '2024-12-15', 75000, '2025-03-15', 'completed'),
(2, 'corrective', 'Remplacement pompe à eau', 'Garage IVECO Dakar', '2024-11-20', 180000, '2025-05-20', 'completed'),
(6, 'inspection', 'Contrôle général avant mise en service', 'Moussa Kane', '2024-12-01', 25000, '2025-06-01', 'completed');

-- Création de quelques demandes de renseignements
INSERT INTO inquiries (
    first_name, last_name, email, phone, company_name, equipment_category, 
    message, project_description, budget_range, timeline, status, assigned_to
) VALUES
('Ibrahima', 'Sarr', 'i.sarr@construction.sn', '+221774444444', 'Construction Sarr', 'Engins de Chantier', 
'Besoin d\'une pelleteuse pour un chantier de 2 mois', 'Construction d\'un immeuble R+3 à Guédiawaye', '3-5 millions XOF', '2 mois', 'contacted', 2),

('Mariama', 'Diop', 'm.diop@events.sn', '+221775555555', 'Royal Events', 'Événementiel', 
'Organisation d\'un festival de musique', 'Festival 3 jours avec 5000 spectateurs par jour', '2-3 millions XOF', '1 semaine', 'quoted', 2),

('Seydou', 'Traoré', 's.traore@agri.sn', '+221776666666', 'Coopérative Agricole Kaolack', 'Agriculture', 
'Location tracteur pour la saison des pluies', 'Préparation des sols pour 500 hectares', '1-2 millions XOF', '3 mois', 'new', NULL);

-- Mise à jour des statistiques dans system_settings
INSERT INTO system_settings (setting_key, setting_value, description, data_type, is_public) VALUES
('total_bookings_2024', '156', 'Nombre total de réservations en 2024', 'number', FALSE),
('total_revenue_2024', '98500000', 'Chiffre d\'affaires 2024 en XOF', 'number', FALSE),
('customer_satisfaction_rate', '98', 'Taux de satisfaction client (%)', 'number', TRUE),
('equipment_utilization_rate', '75', 'Taux d\'utilisation moyen des équipements (%)', 'number', FALSE);

-- Ajout de notifications de test
INSERT INTO notifications (
    user_id, type, title, message, related_booking_id, is_read
) VALUES
(4, 'booking_confirmation', 'Réservation confirmée - REF-2025-001', 'Votre réservation pour Pelleteuse CAT 320D a été confirmée pour la période du 2025-01-15 au 2025-01-20', 1, FALSE),
(1, 'equipment_overdue', 'Rappel: Équipement à récupérer', 'L\'équipement Pelleteuse CAT 320D doit être récupéré aujourd\'hui chez le client Ousmane Ndiaye', 1, FALSE),
(5, 'payment_reminder', 'Rappel de paiement - REF-2025-002', 'N\'oubliez pas de régler le solde de votre réservation avant le 2025-01-20', 2, TRUE);