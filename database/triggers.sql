-- Triggers pour automatiser certaines tâches dans la base de données Aywa

DELIMITER //

-- Trigger pour générer automatiquement une référence de réservation
CREATE TRIGGER before_booking_insert
BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN
    DECLARE v_booking_ref VARCHAR(20);
    
    IF NEW.booking_reference IS NULL OR NEW.booking_reference = '' THEN
        SELECT CONCAT('REF-', YEAR(CURDATE()), '-', LPAD(COALESCE(MAX(SUBSTRING(booking_reference, 10) + 0), 0) + 1, 3, '0'))
        INTO v_booking_ref
        FROM bookings 
        WHERE booking_reference LIKE CONCAT('REF-', YEAR(CURDATE()), '-%');
        
        SET NEW.booking_reference = v_booking_ref;
    END IF;
    
    -- Calculer la durée automatiquement
    SET NEW.duration_days = DATEDIFF(NEW.end_date, NEW.start_date) + 1;
    
    -- Valeurs par défaut
    IF NEW.created_at IS NULL THEN
        SET NEW.created_at = NOW();
    END IF;
    
    IF NEW.updated_at IS NULL THEN
        SET NEW.updated_at = NOW();
    END IF;
END //

-- Trigger pour mettre à jour automatiquement la date de modification
CREATE TRIGGER before_booking_update
BEFORE UPDATE ON bookings
FOR EACH ROW
BEGIN
    SET NEW.updated_at = NOW();
    
    -- Recalculer la durée si les dates changent
    IF NEW.start_date != OLD.start_date OR NEW.end_date != OLD.end_date THEN
        SET NEW.duration_days = DATEDIFF(NEW.end_date, NEW.start_date) + 1;
    END IF;
END //

-- Trigger pour maintenir l'historique des mouvements d'inventaire
CREATE TRIGGER after_equipment_status_update
AFTER UPDATE ON equipment
FOR EACH ROW
BEGIN
    IF NEW.availability_status != OLD.availability_status THEN
        INSERT INTO inventory_movements (
            equipment_id,
            movement_type,
            from_location,
            to_location,
            condition_before,
            condition_after,
            operator_id,
            notes,
            movement_date
        ) VALUES (
            NEW.id,
            CASE 
                WHEN NEW.availability_status = 'loue' THEN 'rental_out'
                WHEN OLD.availability_status = 'loue' AND NEW.availability_status = 'disponible' THEN 'rental_return'
                WHEN NEW.availability_status = 'maintenance' THEN 'maintenance_out'
                WHEN OLD.availability_status = 'maintenance' AND NEW.availability_status = 'disponible' THEN 'maintenance_return'
                ELSE 'transfer'
            END,
            OLD.location,
            NEW.location,
            OLD.condition_status,
            NEW.condition_status,
            1, -- TODO: Récupérer l'ID de l'utilisateur actuel du contexte
            CONCAT('Changement de statut: ', OLD.availability_status, ' -> ', NEW.availability_status),
            NOW()
        );
    END IF;
END //

-- Trigger pour créer automatiquement des notifications
CREATE TRIGGER after_booking_status_change
AFTER UPDATE ON bookings
FOR EACH ROW
BEGIN
    DECLARE v_notification_title VARCHAR(255);
    DECLARE v_notification_message TEXT;
    DECLARE v_notification_type VARCHAR(50);
    
    -- Notification lors du changement de statut
    IF NEW.status != OLD.status THEN
        CASE NEW.status
            WHEN 'confirmed' THEN
                SET v_notification_type = 'booking_confirmation';
                SET v_notification_title = CONCAT('Réservation confirmée - ', NEW.booking_reference);
                SET v_notification_message = CONCAT('Votre réservation pour ', (SELECT name FROM equipment WHERE id = NEW.equipment_id), ' a été confirmée pour la période du ', NEW.start_date, ' au ', NEW.end_date);
                
            WHEN 'overdue' THEN
                SET v_notification_type = 'equipment_overdue';
                SET v_notification_title = CONCAT('Équipement en retard - ', NEW.booking_reference);
                SET v_notification_message = CONCAT('L\'équipement ', (SELECT name FROM equipment WHERE id = NEW.equipment_id), ' devait être retourné le ', NEW.end_date, '. Veuillez contacter le client: ', NEW.customer_phone);
                
            WHEN 'cancelled' THEN
                SET v_notification_type = 'booking_confirmation';
                SET v_notification_title = CONCAT('Réservation annulée - ', NEW.booking_reference);
                SET v_notification_message = CONCAT('La réservation pour ', (SELECT name FROM equipment WHERE id = NEW.equipment_id), ' a été annulée');
                
            ELSE
                SET v_notification_type = 'general';
                SET v_notification_title = CONCAT('Mise à jour réservation - ', NEW.booking_reference);
                SET v_notification_message = CONCAT('Le statut de votre réservation a été mis à jour: ', NEW.status);
        END CASE;
        
        -- Créer la notification
        INSERT INTO notifications (
            user_id,
            type,
            title,
            message,
            related_booking_id,
            related_equipment_id
        ) VALUES (
            NEW.user_id,
            v_notification_type,
            v_notification_title,
            v_notification_message,
            NEW.id,
            NEW.equipment_id
        );
    END IF;
    
    -- Notification pour les rappels de paiement
    IF NEW.payment_status = 'pending' AND NEW.status = 'confirmed' THEN
        INSERT INTO notifications (
            user_id,
            type,
            title,
            message,
            related_booking_id,
            scheduled_for
        ) VALUES (
            NEW.user_id,
            'payment_reminder',
            CONCAT('Rappel de paiement - ', NEW.booking_reference),
            CONCAT('N\'oubliez pas de régler le solde de votre réservation avant le ', NEW.start_date),
            NEW.id,
            DATE_SUB(NEW.start_date, INTERVAL 1 DAY)
        );
    END IF;
END //

-- Trigger pour créer automatiquement une référence de paiement
CREATE TRIGGER before_payment_insert
BEFORE INSERT ON payments
FOR EACH ROW
BEGIN
    DECLARE v_payment_ref VARCHAR(50);
    
    IF NEW.payment_reference IS NULL OR NEW.payment_reference = '' THEN
        SELECT CONCAT('PAY-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(COALESCE(MAX(SUBSTRING(payment_reference, 13) + 0), 0) + 1, 4, '0'))
        INTO v_payment_ref
        FROM payments 
        WHERE payment_reference LIKE CONCAT('PAY-', DATE_FORMAT(NOW(), '%Y%m%d'), '-%');
        
        SET NEW.payment_reference = v_payment_ref;
    END IF;
    
    IF NEW.payment_date IS NULL THEN
        SET NEW.payment_date = NOW();
    END IF;
END //

-- Trigger pour mettre à jour le statut de paiement de la réservation
CREATE TRIGGER after_payment_insert
AFTER INSERT ON payments
FOR EACH ROW
BEGIN
    DECLARE v_total_paid DECIMAL(10,2);
    DECLARE v_booking_total DECIMAL(10,2);
    DECLARE v_new_payment_status ENUM('pending', 'partial', 'paid', 'refunded');
    
    -- Calculer le total payé pour cette réservation
    SELECT 
        COALESCE(SUM(CASE WHEN payment_type != 'refund' THEN amount ELSE -amount END), 0),
        b.total_amount
    INTO v_total_paid, v_booking_total
    FROM payments p
    JOIN bookings b ON p.booking_id = b.id
    WHERE p.booking_id = NEW.booking_id 
    AND p.status = 'completed'
    GROUP BY b.total_amount;
    
    -- Déterminer le nouveau statut de paiement
    IF v_total_paid >= v_booking_total THEN
        SET v_new_payment_status = 'paid';
    ELSEIF v_total_paid > 0 THEN
        SET v_new_payment_status = 'partial';
    ELSE
        SET v_new_payment_status = 'pending';
    END IF;
    
    -- Mettre à jour le statut de paiement de la réservation
    UPDATE bookings 
    SET payment_status = v_new_payment_status
    WHERE id = NEW.booking_id;
    
    -- Si paiement complet et réservation confirmée, passer en "in_progress" si c'est le jour J
    IF v_new_payment_status = 'paid' THEN
        UPDATE bookings 
        SET status = 'in_progress'
        WHERE id = NEW.booking_id 
        AND status = 'confirmed'
        AND start_date <= CURDATE();
    END IF;
END //

-- Trigger pour valider les dates de réservation
CREATE TRIGGER before_booking_insert_validation
BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN
    DECLARE v_equipment_available BOOLEAN DEFAULT TRUE;
    DECLARE v_max_booking_days INT;
    
    -- Vérifier que la date de fin est après la date de début
    IF NEW.end_date <= NEW.start_date THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La date de fin doit être postérieure à la date de début';
    END IF;
    
    -- Vérifier que la date de début n'est pas dans le passé
    IF NEW.start_date < CURDATE() THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La date de début ne peut pas être dans le passé';
    END IF;
    
    -- Vérifier la durée maximale autorisée
    SELECT CAST(setting_value AS UNSIGNED) INTO v_max_booking_days
    FROM system_settings WHERE setting_key = 'max_booking_days';
    
    IF NEW.duration_days > v_max_booking_days THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = CONCAT('La durée maximale de location est de ', v_max_booking_days, ' jours');
    END IF;
    
    -- Vérifier la disponibilité de l'équipement
    SELECT COUNT(*) = 0 INTO v_equipment_available
    FROM bookings b
    WHERE b.equipment_id = NEW.equipment_id
    AND b.status IN ('confirmed', 'in_progress')
    AND b.id != COALESCE(NEW.id, 0)
    AND (
        (NEW.start_date BETWEEN b.start_date AND b.end_date) OR
        (NEW.end_date BETWEEN b.start_date AND b.end_date) OR
        (b.start_date BETWEEN NEW.start_date AND NEW.end_date)
    );
    
    IF NOT v_equipment_available THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Équipement non disponible pour ces dates';
    END IF;
END //

-- Trigger pour maintenir la cohérence des données d'équipement
CREATE TRIGGER before_equipment_update
BEFORE UPDATE ON equipment
FOR EACH ROW
BEGIN
    -- Empêcher la suppression logique si l'équipement est loué
    IF NEW.is_active = FALSE AND OLD.is_active = TRUE THEN
        IF EXISTS(
            SELECT 1 FROM bookings 
            WHERE equipment_id = NEW.id 
            AND status IN ('confirmed', 'in_progress')
        ) THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Impossible de désactiver un équipement en cours de location';
        END IF;
    END IF;
    
    -- Mettre à jour la date de modification
    SET NEW.updated_at = NOW();
END //

-- Trigger pour créer automatiquement un enregistrement de maintenance
CREATE TRIGGER after_equipment_maintenance_status
AFTER UPDATE ON equipment
FOR EACH ROW
BEGIN
    IF NEW.availability_status = 'maintenance' AND OLD.availability_status != 'maintenance' THEN
        INSERT INTO maintenance_records (
            equipment_id,
            maintenance_type,
            description,
            performed_by,
            performed_date,
            status
        ) VALUES (
            NEW.id,
            'inspection',
            'Maintenance programmée - équipement mis hors service',
            'Système automatique',
            CURDATE(),
            'scheduled'
        );
    END IF;
END //

DELIMITER ;

-- Index supplémentaires pour optimiser les triggers
CREATE INDEX idx_booking_dates_equipment ON bookings(equipment_id, start_date, end_date, status);
CREATE INDEX idx_payment_booking_status ON payments(booking_id, status, payment_type);
CREATE INDEX idx_equipment_status ON equipment(availability_status, is_active);
CREATE INDEX idx_notifications_scheduling ON notifications(scheduled_for, sent_at);