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

-- =========================
-- CATEGORIES
-- =========================
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  slug VARCHAR(140) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =========================
-- PRODUCTS
-- =========================
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL UNIQUE,
  description TEXT NULL,
  category_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================
-- PRODUCT VARIANTS
-- =========================
CREATE TABLE IF NOT EXISTS product_variants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  sku VARCHAR(50) NOT NULL UNIQUE,         -- codice univoco variante (es. "IPH14-BLK-128")
  price DECIMAL(10,2) NOT NULL,            -- prezzo della variante
  stock_qty INT NOT NULL DEFAULT 0,        -- quantità a magazzino
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================
-- ATTRIBUTES (nuova)
-- =========================
CREATE TABLE IF NOT EXISTS attributes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,       -- es. 'Color', 'RAM', 'Storage'
  category_id INT NULL,                    -- opzionale: lega attributi a una categoria
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =========================
-- VARIANT ATTRIBUTES (nuova)
-- =========================
CREATE TABLE IF NOT EXISTS variant_attributes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  variant_id INT NOT NULL,
  attribute_id INT NOT NULL,
  value VARCHAR(100) NOT NULL,
  FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
  FOREIGN KEY (attribute_id) REFERENCES attributes(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- =========================
-- ATTRIBUTE_CATEGORY
-- (Relazione molti-a-molti tra attributes e categories)
-- =========================
CREATE TABLE IF NOT EXISTS attribute_category (
  id INT AUTO_INCREMENT PRIMARY KEY,
  attribute_id INT NOT NULL,
  category_id INT NOT NULL,
  FOREIGN KEY (attribute_id) REFERENCES attributes(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE KEY unique_attr_cat (attribute_id, category_id)
) ENGINE=InnoDB;

-- verifica
SHOW TABLES;
