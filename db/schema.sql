DROP DATABASE IF EXISTS departments_db;
-- Creates the "departments" database --
CREATE DATABASE departments_db;

-- Makes it so all of the following code will affect departments_db --
USE departments_db;

-- Creates the table "departments" within ?_db --

CREATE TABLE departments (
      -- Creates a numeric column called "id" which will automatically increment its default value as we create new rows --
    id INT PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL,
);

DROP DATABASE IF EXISTS roles_db;
-- Creates the "employees" database --
CREATE DATABASE roles_db;

-- Makes it so all of the following code will affect inventory_db --
USE roles_db;

-- Creates the table "roles" within ?_db --

CREATE TABLE roles (
      -- Creates a numeric column called "id" which will automatically increment its default value as we create new rows --
    id INT PRIMARY KEY,
    job_title VARCHAR(30) NOT NULL,
    department VARCHAR(30) NOT NULL,
    salary INT,
    manager_id INT,
    manager_name VARCHAR(30) NOT NULL,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
    FOREIGN KEY (department_id)
    REFERENCES department(id)
);

DROP DATABASE IF EXISTS employees_db;
-- Creates the "employees" database --
CREATE DATABASE employees_db;

-- Makes it so all of the following code will affect employees_db --
USE employees_db;

-- Creates the table "employees" within ?_db --

CREATE TABLE employees (
      -- Creates a numeric column called "id" which will automatically increment its default value as we create new rows --
    id INT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    manager_name VARCHAR(30) NOT NULL,
    FOREIGN KEY (role_id)
    REFERENCES roles(id)
    ON DELETE SET NULL
    FOREIGN KEY (manager_id)
    REFERENCES employees(id)
);