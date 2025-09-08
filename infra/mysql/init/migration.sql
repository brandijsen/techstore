-- Charset e collations moderne
SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ====== DATABASE (già creato via env, ma assicuriamo) ======
CREATE DATABASE IF NOT EXISTS techstore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE techstore;

-- ====== USERS ======
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('customer','admin') NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ====== CATEGORIES ======
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  slug VARCHAR(140) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ====== PRODUCTS ======
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name VARCHAR(160) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  sku VARCHAR(64) NOT NULL UNIQUE,
  description TEXT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Indici utili
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);

-- ====== SEED (facoltativo, utile per test) ======
INSERT INTO categories (name, slug) VALUES
  ('Laptops', 'laptops'),
  ('Smartphones', 'smartphones')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO products (category_id, name, slug, sku, description, price, stock)
SELECT c.id, 'UltraBook 14', 'ultrabook-14', 'SKU-UB14', 'Laptop 14” leggero', 999.00, 10
FROM categories c WHERE c.slug='laptops'
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO products (category_id, name, slug, sku, description, price, stock)
SELECT c.id, 'Phone X', 'phone-x', 'SKU-PHONEX', 'Smartphone AMOLED', 699.00, 25
FROM categories c WHERE c.slug='smartphones'
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Admin demo (password fittizia hash da impostare in seguito)
INSERT INTO users (name, email, password_hash, role)
VALUES ('Admin', 'admin@techstore.local', '$2b$10$exampleExampleExampleExampleExamp', 'admin')
ON DUPLICATE KEY UPDATE name=VALUES(name);
