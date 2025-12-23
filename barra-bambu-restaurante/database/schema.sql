-- Banco de dados: barrabambu
CREATE DATABASE IF NOT EXISTS barrabambu 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE barrabambu;

-- Tabela de administradores
CREATE TABLE IF NOT EXISTS admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de itens do menu
CREATE TABLE IF NOT EXISTS menu_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_available (is_available)
);

-- Tabela de banners (carrossel)
CREATE TABLE IF NOT EXISTS banners (
    id INT PRIMARY KEY AUTO_INCREMENT,
    image_url VARCHAR(255) NOT NULL,
    title VARCHAR(100),
    subtitle VARCHAR(255),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    link_url VARCHAR(255),
    button_text VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active_order (is_active, display_order)
);

-- Tabela de galeria de fotos
CREATE TABLE IF NOT EXISTS gallery (
    id INT PRIMARY KEY AUTO_INCREMENT,
    image_url VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255),
    title VARCHAR(100),
    description TEXT,
    display_order INT DEFAULT 0,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category_order (category, display_order)
);

-- Tabela de reservas
CREATE TABLE IF NOT EXISTS reservations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100),
    customer_phone VARCHAR(20) NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    number_of_people INT NOT NULL,
    special_requests TEXT,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    table_number VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date_status (reservation_date, status),
    INDEX idx_customer_phone (customer_phone)
);

-- Tabela de pedidos (delivery)
CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(100),
    customer_address TEXT NOT NULL,
    customer_neighborhood VARCHAR(100),
    customer_city VARCHAR(100),
    customer_zipcode VARCHAR(10),
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    status ENUM('pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_method ENUM('cash', 'credit_card', 'debit_card', 'pix') DEFAULT 'cash',
    payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
    notes TEXT,
    estimated_delivery_time INT, -- em minutos
    delivered_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order_number (order_number),
    INDEX idx_status_created (status, created_at),
    INDEX idx_customer_phone (customer_phone)
);

-- Tabela de itens do pedido
CREATE TABLE IF NOT EXISTS order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    menu_item_id INT,
    item_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE SET NULL,
    INDEX idx_order (order_id)
);

-- Tabela de configurações
CREATE TABLE IF NOT EXISTS settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(50) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    category VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (setting_key)
);

-- Inserir configurações padrão
INSERT INTO settings (setting_key, setting_value, setting_type, category, description) VALUES
('restaurant_name', 'Barra Bambu Restaurante', 'string', 'general', 'Nome do restaurante'),
('restaurant_phone', '(11) 3634-0295', 'string', 'contact', 'Telefone principal'),
('restaurant_address', 'Av. Pedro Ometto, 88 - Centro, Barra Bonita - SP', 'string', 'contact', 'Endereço completo'),
('opening_hours', '{"segunda_quinta": "11:00-23:00", "sexta_sabado": "11:00-00:00", "domingo": "11:00-22:00"}', 'json', 'hours', 'Horário de funcionamento'),
('delivery_fee', '5.00', 'number', 'delivery', 'Taxa de entrega padrão'),
('min_order_amount', '30.00', 'number', 'delivery', 'Valor mínimo para entrega'),
('whatsapp_number', '551136340295', 'string', 'contact', 'Número do WhatsApp para pedidos'),
('instagram_url', 'https://instagram.com/barrabambuoficial', 'string', 'social', 'Link do Instagram'),
('facebook_url', 'https://facebook.com/barrabambu', 'string', 'social', 'Link do Facebook'),
('delivery_radius', '5', 'number', 'delivery', 'Raio de entrega em km'),
('enable_online_orders', 'true', 'boolean', 'orders', 'Ativar pedidos online'),
('enable_reservations', 'true', 'boolean', 'reservations', 'Ativar reservas online')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

-- Criar triggers para order_number
DELIMITER $$

CREATE TRIGGER IF NOT EXISTS before_order_insert
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
    IF NEW.order_number IS NULL THEN
        SET NEW.order_number = CONCAT(
            'BB',
            DATE_FORMAT(NOW(), '%Y%m%d'),
            LPAD(
                (SELECT COALESCE(MAX(SUBSTRING(order_number, 11)), 0) + 1 
                 FROM orders 
                 WHERE DATE(created_at) = CURDATE()),
                4, '0'
            )
        );
    END IF;
END$$

DELIMITER ;