CREATE TABLE city (
    zipCode INT(10) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE country (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    ISO3166_Alpha2 VARCHAR(10) NOT NULL
);

CREATE TABLE user(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone INT(12),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    isActive BOOLEAN DEFAULT true
);

CREATE TABLE user_password(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    
    CONSTRAINT fk_user_user_password FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE user_address(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    zipCode INT NOT NULL,
    country_id INT NOT NULL,
    phone INT(12) NOT NULL,
    
    CONSTRAINT fk_user_user_address FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (zipCode) REFERENCES city(zipCode),
    FOREIGN KEY (country_id) REFERENCES country(id)
);

CREATE TABLE currency(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    ISO4217_ISO VARCHAR(10)
);

CREATE TABLE category(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    imageFile VARCHAR(255)
);

CREATE TABLE product (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(5000),
    category_id INT NOT NULL,
    price FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    isActive BOOLEAN DEFAULT true,
    
    FOREIGN KEY (category_id) REFERENCES category(id)
);

CREATE TABLE product_image(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    product_id INT NOT NULL,
    imageFile VARCHAR(255),
    
    FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE product_inventory(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    product_id INT NOT NUll,
    quantity INT NOT NULL,

    CONSTRAINT fk_product_product_inventory FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE product_review(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    review VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    isActive BOOLEAN DEFAULT true,
    
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE invoice(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    currency_id INT NOT NULL,
    dueDate TIMESTAMP NOT NULL,
    paidDate TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    total FLOAT NOT NULL,
    
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (currency_id) REFERENCES currency(id)
);

CREATE TABLE invoice_line(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    invoice_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    message varchar(255),
    
    FOREIGN KEY (invoice_id) REFERENCES invoice(id),
    FOREIGN KEY (product_id) REFERENCES product(id)

);