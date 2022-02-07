-- Drops database in case of TEST --
DROP DATABASE IF EXISTS company_db;
-- Creates the "company_db" database --
CREATE DATABASE company_db;

-- Selects the "company_db database" --
USE company_db;

-- Creates the table "departments" within company_db --
CREATE TABLE departments (
      -- Creates a numeric column called "id" which will automatically increment its default value  --
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL
);

-- Creates the table "roles" within company_db --
CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    job_title VARCHAR(30),
    department_id INT,
    salary INT,
    FOREIGN KEY (department_id)
    REFERENCES departments(id)
    ON DELETE SET NULL
);

-- Creates the table "employees" within company_db --
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    department_id INT,
    manager_id INT,
    FOREIGN KEY (manager_id)
    REFERENCES employees(id)
    ON DELETE SET NULL,
    FOREIGN KEY (role_id)
    REFERENCES roles(id)
    ON DELETE SET NULL,
    FOREIGN KEY (department_id)
    REFERENCES departments(id)
    ON DELETE SET NULL
);