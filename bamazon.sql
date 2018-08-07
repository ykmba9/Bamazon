DROP DATABASE IF EXISTS Bamazon;
CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE Products(
    ItemID MEDIUMINT AUTO_INCREMENT NOT NULL,
    ProductName VARCHAR(100) NOT NULL,
    DepartmentName VARCHAR(50) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    StockQuantity INT(10) NOT NULL,
    primary key(ItemID)
);

select * from Products;

INSERT INTO Products(ProductName,DepartmentName,Price,StockQuantity)
VALUES ("Shampoo","KIDS",10.95,150),
    ("Teddy","KIDS",20.99,200),
    ("Cereals","GROCERY",10.50,50),
    ("Shirt","CLOTHING",78.00,5),
    ("Denim Jeans","CLOTHING",55.25,35),
    ("Survival Towel","SPORTS",42.42,42),
    ("Lotion","KIDS",15.00,25),
    ("Diaper","KIDS",25.50,57),
    ("Bike","KIDS",50.50,35),
    ("Crib","KIDS",109.95,23);

CREATE TABLE Departments(
    DepartmentID MEDIUMINT AUTO_INCREMENT NOT NULL,
    DepartmentName VARCHAR(50) NOT NULL,
    OverHeadCosts DECIMAL(10,2) NOT NULL,
    TotalSales DECIMAL(10,2) NOT NULL,
    PRIMARY KEY(DepartmentID));

INSERT INTO Departments(DepartmentName, OverHeadCosts, TotalSales)
VALUES ('ENTERTAINMENT', 30000.00, 25000.00),
    ('ELECTRONICS', 10000.00, 22000.00),
    ('HOME', 40000.00, 25000.00),
    ('BODY & HEALTH', 4000.00, 22000.00),
    ('GROCERY', 2200.00, 25000.00),
    ('KIDS', 50000.00, 22000.00),
    ('CLOTHING', 45000.00, 25000.00),
    ('SPORTS', 22000.00, 22000.00);