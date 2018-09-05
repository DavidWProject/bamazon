DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon-- Drops the favorite_db if it exists currently --

CREATE TABLE products (
id INTEGER NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100), 
department_name VARCHAR(100), 
price INTEGER(250), 
stock_quantity INTEGER(250), 
UNIQUE (id)
);

-- Makes it so all of the following code will affect favorite_db --
USE bamazon;
-- Creates new rows containing data in all named columns --
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Hammer", "Home Depo", 10, 100);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Nails", "Home Depo", 1, 1000);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Overhead Ceiling Fan", "Ikea", 566, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Oranges", "Stop and Shop", 1, 9999);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Banana", "Target", 1, 9998);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("McDouble", "McDonald", 2, 444);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Light Bulb", "Home Depo", 3, 101);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("T-shirt", "Target", 16, 89);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Muffin", "Vending Machine", 1, 100);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Slaves", "Nineteenth Century", 23, 444);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Flashlight", "Home Depo", 11, 33);
