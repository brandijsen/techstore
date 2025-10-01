USE techstore;

-- =========================
-- CUSTOMERS (store)
-- =========================
CREATE TABLE customers (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(100) NOT NULL,
  email          VARCHAR(190) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  phone          VARCHAR(30) NULL,
  email_verified TINYINT(1) NOT NULL DEFAULT 0,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   deleted_at DATETIME NULL,
  INDEX idx_customers_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================
-- STAFF (backoffice)
-- - Garantisce 1 solo admin tramite admin_slot
-- =========================
CREATE TABLE staff (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(120) NOT NULL,
  email         VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('admin','employee') NOT NULL DEFAULT 'employee',
  admin_slot    TINYINT NULL,  -- 1 per l’admin unico, NULL per gli employee
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT uq_staff_admin_slot UNIQUE (admin_slot),
  CONSTRAINT chk_staff_admin_slot CHECK (
    (role = 'admin'    AND admin_slot = 1) OR
    (role = 'employee' AND admin_slot IS NULL)
  ),

  INDEX idx_staff_role (role),
  INDEX idx_staff_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM(
    'NEW_ORDER',
    'PO_SENT',
    'PO_CONFIRMED',
    'PO_ARRIVED',
    'LOW_STOCK',
    'STAFF_CHANGE_REQUEST',
    'STAFF_CHANGE_RESPONSE'
  ) NOT NULL,
  payload JSON NULL,              -- dati variabili in base al tipo di notifica
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  user_id_target INT NULL,        -- chi deve ricevere la notifica (admin o employee)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notif_user FOREIGN KEY (user_id_target)
    REFERENCES staff(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Indici utili per query frequenti
CREATE INDEX idx_notif_type ON notifications(type);
CREATE INDEX idx_notif_user ON notifications(user_id_target);
CREATE INDEX idx_notif_is_read ON notifications(is_read);
CREATE INDEX idx_notif_created ON notifications(created_at);
-- verifica
SHOW TABLES;
