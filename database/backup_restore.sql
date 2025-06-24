-- Scripts de sauvegarde et restauration pour la base de données Aywa

-- ================================
-- PROCÉDURES DE SAUVEGARDE
-- ================================

DELIMITER //

-- Procédure pour créer une sauvegarde complète
CREATE PROCEDURE CreateFullBackup()
BEGIN
    DECLARE backup_date VARCHAR(20);
    DECLARE backup_file VARCHAR(255);
    
    SET backup_date = DATE_FORMAT(NOW(), '%Y%m%d_%H%i%s');
    SET backup_file = CONCAT('aywa_backup_', backup_date, '.sql');
    
    -- Cette procédure nécessiterait des privilèges système pour exécuter mysqldump
    -- En production, utiliser un script externe ou un outil de sauvegarde
    
    SELECT CONCAT('mysqldump -u root -p aywa_db > /backups/', backup_file) as backup_command;
    
    -- Log de la sauvegarde
    INSERT INTO system_settings (setting_key, setting_value, description, data_type)
    VALUES (
        CONCAT('last_backup_', backup_date), 
        backup_file, 
        'Fichier de sauvegarde complète', 
        'string'
    );
END //

-- Procédure pour archiver les anciennes données
CREATE PROCEDURE ArchiveOldData(
    IN p_months_to_keep INT
)
BEGIN
    DECLARE v_cutoff_date DATE;
    DECLARE v_archived_bookings INT DEFAULT 0;
    DECLARE v_archived_payments INT DEFAULT 0;
    DECLARE v_archived_notifications INT DEFAULT 0;
    
    SET v_cutoff_date = DATE_SUB(CURDATE(), INTERVAL p_months_to_keep MONTH);
    
    START TRANSACTION;
    
    -- Créer les tables d'archive si elles n'existent pas
    CREATE TABLE IF NOT EXISTS archived_bookings LIKE bookings;
    CREATE TABLE IF NOT EXISTS archived_payments LIKE payments;
    CREATE TABLE IF NOT EXISTS archived_notifications LIKE notifications;
    
    -- Archiver les réservations anciennes et complétées
    INSERT INTO archived_bookings
    SELECT * FROM bookings 
    WHERE status IN ('completed', 'cancelled') 
    AND created_at < v_cutoff_date;
    
    GET DIAGNOSTICS v_archived_bookings = ROW_COUNT;
    
    -- Archiver les paiements associés
    INSERT INTO archived_payments
    SELECT p.* FROM payments p
    JOIN bookings b ON p.booking_id = b.id
    WHERE b.status IN ('completed', 'cancelled') 
    AND b.created_at < v_cutoff_date;
    
    GET DIAGNOSTICS v_archived_payments = ROW_COUNT;
    
    -- Archiver les anciennes notifications lues
    INSERT INTO archived_notifications
    SELECT * FROM notifications
    WHERE is_read = TRUE 
    AND created_at < v_cutoff_date;
    
    GET DIAGNOSTICS v_archived_notifications = ROW_COUNT;
    
    -- Supprimer les données archivées des tables principales
    DELETE p FROM payments p
    JOIN bookings b ON p.booking_id = b.id
    WHERE b.status IN ('completed', 'cancelled') 
    AND b.created_at < v_cutoff_date;
    
    DELETE FROM bookings 
    WHERE status IN ('completed', 'cancelled') 
    AND created_at < v_cutoff_date;
    
    DELETE FROM notifications
    WHERE is_read = TRUE 
    AND created_at < v_cutoff_date;
    
    COMMIT;
    
    -- Log de l'archivage
    INSERT INTO system_settings (setting_key, setting_value, description, data_type)
    VALUES (
        CONCAT('archive_', DATE_FORMAT(NOW(), '%Y%m%d')), 
        JSON_OBJECT(
            'date', NOW(),
            'months_kept', p_months_to_keep,
            'archived_bookings', v_archived_bookings,
            'archived_payments', v_archived_payments,
            'archived_notifications', v_archived_notifications
        ), 
        'Rapport d\'archivage automatique', 
        'json'
    );
    
    SELECT 
        v_archived_bookings as bookings_archived,
        v_archived_payments as payments_archived, 
        v_archived_notifications as notifications_archived,
        v_cutoff_date as cutoff_date;
END //

DELIMITER ;

-- ================================
-- SCRIPTS DE MONITORING
-- ================================

-- Vue pour surveiller la santé de la base de données
CREATE VIEW database_health AS
SELECT 
    'Tables' as metric_type,
    COUNT(*) as total_count,
    NULL as details
FROM information_schema.tables 
WHERE table_schema = 'aywa_db'

UNION ALL

SELECT 
    'Active Equipment' as metric_type,
    COUNT(*) as total_count,
    JSON_OBJECT(
        'available', SUM(CASE WHEN availability_status = 'disponible' THEN 1 ELSE 0 END),
        'rented', SUM(CASE WHEN availability_status = 'loue' THEN 1 ELSE 0 END),
        'maintenance', SUM(CASE WHEN availability_status = 'maintenance' THEN 1 ELSE 0 END)
    ) as details
FROM equipment WHERE is_active = TRUE

UNION ALL

SELECT 
    'Active Bookings' as metric_type,
    COUNT(*) as total_count,
    JSON_OBJECT(
        'pending', SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END),
        'confirmed', SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END),
        'in_progress', SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END),
        'overdue', SUM(CASE WHEN status = 'overdue' THEN 1 ELSE 0 END)
    ) as details
FROM bookings WHERE status IN ('pending', 'confirmed', 'in_progress', 'overdue')

UNION ALL

SELECT 
    'Users' as metric_type,
    COUNT(*) as total_count,
    JSON_OBJECT(
        'customers', SUM(CASE WHEN role = 'customer' THEN 1 ELSE 0 END),
        'admins', SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END),
        'operators', SUM(CASE WHEN role = 'operator' THEN 1 ELSE 0 END)
    ) as details
FROM users WHERE status = 'active';

-- ================================
-- SCRIPTS DE PERFORMANCE
-- ================================

-- Analyse des requêtes lentes potentielles
CREATE VIEW slow_query_analysis AS
SELECT 
    'Equipment Search' as query_type,
    'Check indexes on name, description, location' as recommendation,
    COUNT(*) as usage_frequency
FROM equipment 
WHERE created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)

UNION ALL

SELECT 
    'Booking Date Range' as query_type,
    'Ensure compound index on (equipment_id, start_date, end_date)' as recommendation,
    COUNT(*) as usage_frequency
FROM bookings 
WHERE created_at > DATE_SUB(NOW(), INTERVAL 7 DAY);

-- Statistiques d'utilisation des tables
CREATE VIEW table_usage_stats AS
SELECT 
    table_name,
    table_rows as row_count,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) as size_mb,
    ROUND((data_length / 1024 / 1024), 2) as data_mb,
    ROUND((index_length / 1024 / 1024), 2) as index_mb
FROM information_schema.tables 
WHERE table_schema = 'aywa_db'
ORDER BY (data_length + index_length) DESC;

-- ================================
-- SCRIPTS DE NETTOYAGE
-- ================================

DELIMITER //

-- Procédure pour nettoyer les données temporaires
CREATE PROCEDURE CleanupTempData()
BEGIN
    DECLARE cleaned_records INT DEFAULT 0;
    
    START TRANSACTION;
    
    -- Supprimer les notifications lues de plus de 30 jours
    DELETE FROM notifications 
    WHERE is_read = TRUE 
    AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
    
    SET cleaned_records = cleaned_records + ROW_COUNT();
    
    -- Supprimer les sessions expirées (si table existe)
    -- DELETE FROM user_sessions WHERE expires_at < NOW();
    
    -- Nettoyer les logs d'erreur anciens (si table existe)
    -- DELETE FROM error_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);
    
    COMMIT;
    
    SELECT cleaned_records as total_cleaned_records;
END //

-- Procédure pour optimiser les tables
CREATE PROCEDURE OptimizeTables()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE table_name VARCHAR(255);
    DECLARE optimize_cursor CURSOR FOR 
        SELECT TABLE_NAME FROM information_schema.tables 
        WHERE table_schema = 'aywa_db' 
        AND engine = 'InnoDB';
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN optimize_cursor;
    
    optimize_loop: LOOP
        FETCH optimize_cursor INTO table_name;
        
        IF done THEN
            LEAVE optimize_loop;
        END IF;
        
        SET @sql = CONCAT('OPTIMIZE TABLE ', table_name);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
        
    END LOOP;
    
    CLOSE optimize_cursor;
    
    SELECT 'All tables optimized' as result;
END //

DELIMITER ;

-- ================================
-- ÉVÉNEMENTS DE MAINTENANCE
-- ================================

-- Sauvegarde automatique quotidienne (logs seulement)
CREATE EVENT IF NOT EXISTS daily_backup_log
ON SCHEDULE EVERY 1 DAY
STARTS '2025-01-01 02:00:00'
DO
    INSERT INTO system_settings (setting_key, setting_value, description, data_type)
    VALUES (
        CONCAT('backup_needed_', DATE_FORMAT(NOW(), '%Y%m%d')), 
        'true', 
        'Indicateur de sauvegarde quotidienne nécessaire', 
        'boolean'
    );

-- Nettoyage automatique hebdomadaire
CREATE EVENT IF NOT EXISTS weekly_cleanup
ON SCHEDULE EVERY 1 WEEK
STARTS '2025-01-01 03:00:00'
DO
    CALL CleanupTempData();

-- Optimisation mensuelle des tables
CREATE EVENT IF NOT EXISTS monthly_optimization
ON SCHEDULE EVERY 1 MONTH
STARTS '2025-01-01 04:00:00'
DO
    CALL OptimizeTables();

-- Archivage trimestriel (garde 24 mois de données)
CREATE EVENT IF NOT EXISTS quarterly_archive
ON SCHEDULE EVERY 3 MONTH
STARTS '2025-01-01 05:00:00'
DO
    CALL ArchiveOldData(24);

-- ================================
-- COMMANDES DE MAINTENANCE MANUELLE
-- ================================

-- Commande pour vérifier l'intégrité des données
-- CALL CheckDataIntegrity();

-- Commande pour analyser les performances
-- SELECT * FROM slow_query_analysis;
-- SELECT * FROM table_usage_stats;

-- Commande pour voir la santé générale
-- SELECT * FROM database_health;

-- Commande pour forcer un nettoyage
-- CALL CleanupTempData();

-- Commande pour optimiser toutes les tables
-- CALL OptimizeTables();

-- Commande pour archiver les vieilles données (garde les 18 derniers mois)
-- CALL ArchiveOldData(18);