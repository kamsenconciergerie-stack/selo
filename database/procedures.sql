-- Procédures stockées et fonctions pour Aywa

DELIMITER //

-- Procédure pour créer une nouvelle réservation
CREATE PROCEDURE CreateBooking(
    IN p_user_id INT,
    IN p_equipment_id INT,
    IN p_start_date DATE,
    IN p_end_date DATE,
    IN p_customer_name VARCHAR(255),
    IN p_customer_email VARCHAR(255),
    IN p_customer_phone VARCHAR(20),
    IN p_delivery_address TEXT,
    IN p_notes TEXT,
    OUT p_booking_id INT,
    OUT p_booking_reference VARCHAR(20),
    OUT p_total_amount DECIMAL(10,2)
)
BEGIN
    DECLARE v_daily_rate DECIMAL(10,2);
    DECLARE v_duration_days INT;
    DECLARE v_equipment_cost DECIMAL(10,2);
    DECLARE v_delivery_cost DECIMAL(10,2) DEFAULT 0;
    DECLARE v_deposit_amount DECIMAL(10,2);
    DECLARE v_total DECIMAL(10,2);
    DECLARE v_booking_ref VARCHAR(20);
    DECLARE v_equipment_available BOOLEAN DEFAULT FALSE;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Vérifier la disponibilité de l'équipement
    SELECT COUNT(*) = 0 INTO v_equipment_available
    FROM bookings b
    WHERE b.equipment_id = p_equipment_id
    AND b.status IN ('confirmed', 'in_progress')
    AND (
        (p_start_date BETWEEN b.start_date AND b.end_date) OR
        (p_end_date BETWEEN b.start_date AND b.end_date) OR
        (b.start_date BETWEEN p_start_date AND p_end_date)
    );
    
    IF NOT v_equipment_available THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Équipement non disponible pour ces dates';
    END IF;
    
    -- Récupérer le tarif journalier et le montant de caution
    SELECT price_per_day, deposit_amount INTO v_daily_rate, v_deposit_amount
    FROM equipment 
    WHERE id = p_equipment_id AND is_active = TRUE;
    
    -- Calculer la durée et les coûts
    SET v_duration_days = DATEDIFF(p_end_date, p_start_date) + 1;
    SET v_equipment_cost = v_daily_rate * v_duration_days;
    
    -- TODO: Calculer les frais de livraison selon la zone
    -- SET v_delivery_cost = CalculateDeliveryCost(p_delivery_address);
    
    SET v_total = v_equipment_cost + v_delivery_cost;
    
    -- Générer une référence unique
    SELECT CONCAT('REF-', YEAR(CURDATE()), '-', LPAD(COALESCE(MAX(SUBSTRING(booking_reference, 10) + 0), 0) + 1, 3, '0'))
    INTO v_booking_ref
    FROM bookings 
    WHERE booking_reference LIKE CONCAT('REF-', YEAR(CURDATE()), '-%');
    
    -- Insérer la réservation
    INSERT INTO bookings (
        booking_reference, user_id, equipment_id, start_date, end_date, duration_days,
        customer_name, customer_email, customer_phone, delivery_address,
        daily_rate, total_equipment_cost, delivery_cost, deposit_amount, total_amount,
        notes, status
    ) VALUES (
        v_booking_ref, p_user_id, p_equipment_id, p_start_date, p_end_date, v_duration_days,
        p_customer_name, p_customer_email, p_customer_phone, p_delivery_address,
        v_daily_rate, v_equipment_cost, v_delivery_cost, v_deposit_amount, v_total,
        p_notes, 'pending'
    );
    
    SET p_booking_id = LAST_INSERT_ID();
    SET p_booking_reference = v_booking_ref;
    SET p_total_amount = v_total;
    
    -- Mettre à jour le statut de l'équipement
    UPDATE equipment SET availability_status = 'loue' WHERE id = p_equipment_id;
    
    COMMIT;
END //

-- Fonction pour calculer le taux d'occupation d'un équipement
CREATE FUNCTION GetEquipmentOccupancyRate(
    p_equipment_id INT,
    p_start_date DATE,
    p_end_date DATE
) RETURNS DECIMAL(5,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_total_days INT;
    DECLARE v_rented_days INT;
    DECLARE v_occupancy_rate DECIMAL(5,2);
    
    SET v_total_days = DATEDIFF(p_end_date, p_start_date) + 1;
    
    SELECT COALESCE(SUM(
        DATEDIFF(
            LEAST(b.end_date, p_end_date),
            GREATEST(b.start_date, p_start_date)
        ) + 1
    ), 0) INTO v_rented_days
    FROM bookings b
    WHERE b.equipment_id = p_equipment_id
    AND b.status IN ('confirmed', 'in_progress', 'completed')
    AND b.start_date <= p_end_date
    AND b.end_date >= p_start_date;
    
    SET v_occupancy_rate = (v_rented_days / v_total_days) * 100;
    
    RETURN LEAST(v_occupancy_rate, 100.00);
END //

-- Procédure pour traiter un paiement
CREATE PROCEDURE ProcessPayment(
    IN p_booking_id INT,
    IN p_amount DECIMAL(10,2),
    IN p_payment_type ENUM('deposit', 'rental', 'damage', 'late_fee', 'refund'),
    IN p_payment_method ENUM('cash', 'bank_transfer', 'mobile_money', 'card', 'cheque'),
    IN p_payment_provider VARCHAR(100),
    IN p_transaction_id VARCHAR(100),
    IN p_processed_by INT,
    OUT p_payment_id INT,
    OUT p_payment_reference VARCHAR(50)
)
BEGIN
    DECLARE v_payment_ref VARCHAR(50);
    DECLARE v_booking_status VARCHAR(20);
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Générer une référence de paiement
    SELECT CONCAT('PAY-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(COALESCE(MAX(SUBSTRING(payment_reference, 13) + 0), 0) + 1, 4, '0'))
    INTO v_payment_ref
    FROM payments 
    WHERE payment_reference LIKE CONCAT('PAY-', DATE_FORMAT(NOW(), '%Y%m%d'), '-%');
    
    -- Insérer le paiement
    INSERT INTO payments (
        booking_id, payment_reference, amount, payment_type, payment_method,
        payment_provider, transaction_id, status, payment_date, processed_by
    ) VALUES (
        p_booking_id, v_payment_ref, p_amount, p_payment_type, p_payment_method,
        p_payment_provider, p_transaction_id, 'completed', NOW(), p_processed_by
    );
    
    SET p_payment_id = LAST_INSERT_ID();
    SET p_payment_reference = v_payment_ref;
    
    -- Mettre à jour le statut de la réservation si nécessaire
    SELECT 
        CASE 
            WHEN SUM(CASE WHEN payment_type IN ('deposit', 'rental') THEN amount ELSE 0 END) >= b.total_amount THEN 'paid'
            WHEN SUM(amount) > 0 THEN 'partial'
            ELSE 'pending'
        END INTO v_booking_status
    FROM payments p
    JOIN bookings b ON p.booking_id = b.id
    WHERE p.booking_id = p_booking_id AND p.status = 'completed'
    GROUP BY b.id;
    
    UPDATE bookings SET payment_status = v_booking_status WHERE id = p_booking_id;
    
    COMMIT;
END //

-- Procédure pour générer un rapport de revenus
CREATE PROCEDURE GenerateRevenueReport(
    IN p_start_date DATE,
    IN p_end_date DATE,
    IN p_group_by ENUM('day', 'week', 'month')
)
BEGIN
    IF p_group_by = 'day' THEN
        SELECT 
            DATE(payment_date) as report_date,
            SUM(amount) as total_revenue,
            COUNT(DISTINCT booking_id) as total_bookings,
            AVG(amount) as average_payment,
            COUNT(*) as total_transactions
        FROM payments
        WHERE payment_date BETWEEN p_start_date AND p_end_date
        AND status = 'completed'
        AND payment_type IN ('deposit', 'rental')
        GROUP BY DATE(payment_date)
        ORDER BY report_date;
        
    ELSEIF p_group_by = 'week' THEN
        SELECT 
            YEARWEEK(payment_date) as week_year,
            DATE(payment_date - INTERVAL WEEKDAY(payment_date) DAY) as week_start,
            SUM(amount) as total_revenue,
            COUNT(DISTINCT booking_id) as total_bookings,
            AVG(amount) as average_payment,
            COUNT(*) as total_transactions
        FROM payments
        WHERE payment_date BETWEEN p_start_date AND p_end_date
        AND status = 'completed'
        AND payment_type IN ('deposit', 'rental')
        GROUP BY YEARWEEK(payment_date)
        ORDER BY week_year;
        
    ELSE -- month
        SELECT 
            YEAR(payment_date) as year,
            MONTH(payment_date) as month,
            MONTHNAME(payment_date) as month_name,
            SUM(amount) as total_revenue,
            COUNT(DISTINCT booking_id) as total_bookings,
            AVG(amount) as average_payment,
            COUNT(*) as total_transactions
        FROM payments
        WHERE payment_date BETWEEN p_start_date AND p_end_date
        AND status = 'completed'
        AND payment_type IN ('deposit', 'rental')
        GROUP BY YEAR(payment_date), MONTH(payment_date)
        ORDER BY year, month;
    END IF;
END //

-- Procédure pour vérifier les équipements en retard
CREATE PROCEDURE CheckOverdueEquipment()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_booking_id INT;
    DECLARE v_equipment_id INT;
    DECLARE v_customer_name VARCHAR(255);
    DECLARE v_customer_phone VARCHAR(20);
    DECLARE v_end_date DATE;
    DECLARE v_equipment_name VARCHAR(255);
    
    DECLARE overdue_cursor CURSOR FOR
        SELECT b.id, b.equipment_id, b.customer_name, b.customer_phone, b.end_date, e.name
        FROM bookings b
        JOIN equipment e ON b.equipment_id = e.id
        WHERE b.status = 'in_progress'
        AND b.end_date < CURDATE()
        AND b.id NOT IN (
            SELECT DISTINCT related_booking_id 
            FROM notifications 
            WHERE type = 'equipment_overdue' 
            AND related_booking_id = b.id
            AND DATE(created_at) = CURDATE()
        );
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN overdue_cursor;
    
    read_loop: LOOP
        FETCH overdue_cursor INTO v_booking_id, v_equipment_id, v_customer_name, v_customer_phone, v_end_date, v_equipment_name;
        
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Mettre à jour le statut de la réservation
        UPDATE bookings SET status = 'overdue' WHERE id = v_booking_id;
        
        -- Créer une notification
        INSERT INTO notifications (
            type, title, message, related_booking_id, related_equipment_id
        ) VALUES (
            'equipment_overdue',
            CONCAT('Équipement en retard: ', v_equipment_name),
            CONCAT('Le client ', v_customer_name, ' n\'a pas retourné l\'équipement "', v_equipment_name, '" prévu pour le ', v_end_date),
            v_booking_id,
            v_equipment_id
        );
        
    END LOOP;
    
    CLOSE overdue_cursor;
    
    -- Retourner le nombre d'équipements en retard
    SELECT COUNT(*) as overdue_count
    FROM bookings
    WHERE status = 'overdue';
END //

-- Fonction pour calculer les frais de retard
CREATE FUNCTION CalculateLateFees(
    p_booking_id INT
) RETURNS DECIMAL(10,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_end_date DATE;
    DECLARE v_actual_return_date DATE;
    DECLARE v_daily_rate DECIMAL(10,2);
    DECLARE v_late_days INT DEFAULT 0;
    DECLARE v_late_fee_per_day DECIMAL(10,2);
    DECLARE v_total_late_fees DECIMAL(10,2) DEFAULT 0;
    
    -- Récupérer les informations de la réservation
    SELECT end_date, actual_return_date, daily_rate
    INTO v_end_date, v_actual_return_date, v_daily_rate
    FROM bookings
    WHERE id = p_booking_id;
    
    -- Récupérer le taux de frais de retard
    SELECT CAST(setting_value AS DECIMAL(10,2))
    INTO v_late_fee_per_day
    FROM system_settings
    WHERE setting_key = 'late_fee_per_day';
    
    -- Calculer les jours de retard
    IF v_actual_return_date IS NOT NULL AND v_actual_return_date > v_end_date THEN
        SET v_late_days = DATEDIFF(v_actual_return_date, v_end_date);
    ELSEIF v_actual_return_date IS NULL AND CURDATE() > v_end_date THEN
        SET v_late_days = DATEDIFF(CURDATE(), v_end_date);
    END IF;
    
    -- Calculer les frais de retard
    IF v_late_days > 0 THEN
        SET v_total_late_fees = v_late_days * v_late_fee_per_day;
    END IF;
    
    RETURN v_total_late_fees;
END //

DELIMITER ;

-- Événements planifiés pour la maintenance automatique

-- Vérification quotidienne des équipements en retard
CREATE EVENT IF NOT EXISTS daily_overdue_check
ON SCHEDULE EVERY 1 DAY
STARTS '2025-01-01 09:00:00'
DO
    CALL CheckOverdueEquipment();

-- Génération automatique des rapports mensuels
CREATE EVENT IF NOT EXISTS monthly_report_generation
ON SCHEDULE EVERY 1 MONTH
STARTS '2025-01-01 01:00:00'
DO
    INSERT INTO financial_reports (report_date, period_type, total_revenue, total_bookings, total_equipment_rented, average_booking_value)
    SELECT 
        LAST_DAY(CURDATE() - INTERVAL 1 MONTH) as report_date,
        'monthly' as period_type,
        COALESCE(SUM(p.amount), 0) as total_revenue,
        COUNT(DISTINCT b.id) as total_bookings,
        COUNT(DISTINCT b.equipment_id) as total_equipment_rented,
        COALESCE(AVG(b.total_amount), 0) as average_booking_value
    FROM bookings b
    LEFT JOIN payments p ON b.id = p.booking_id AND p.status = 'completed' AND p.payment_type IN ('deposit', 'rental')
    WHERE b.created_at >= DATE_FORMAT(CURDATE() - INTERVAL 1 MONTH, '%Y-%m-01')
    AND b.created_at < DATE_FORMAT(CURDATE(), '%Y-%m-01');

-- Nettoyage automatique des anciennes notifications (garde 90 jours)
CREATE EVENT IF NOT EXISTS cleanup_old_notifications
ON SCHEDULE EVERY 1 WEEK
STARTS '2025-01-01 02:00:00'
DO
    DELETE FROM notifications 
    WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY)
    AND is_read = TRUE;