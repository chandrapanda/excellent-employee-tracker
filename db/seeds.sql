INSERT INTO departments (department_name)
VALUES ("Software Development"),
       ("Finance"),
       ("Legal"),
       ("Sales");

INSERT INTO roles (job_title, department_id, salary, manager_name)
VALUES ("Head of marketing", 4, 120000, "Leah Rodriguez"),
       ("Accountant", 2, 100000, "Matthew Smith"),
       ("Software Engineer", 1, 90000, "Kunal Singh"),
       ("Lawyer", 3, 110000, "Tori Bakersfield");

INSERT INTO employees (first_name, last_name, role_id, salary, manager_id, manager_name)
VALUES ("Jose", "Mañuel", 1, 67000, 3, "Leah Rodriguez"),
       ("Cleo", "Shmidt", 2, 75000, 2, "Matthew Smith"),
       ("Hong", "Mai", 3, 88000, 1, "Kunal Singh"),
       ("Gary", "Zhang", 4, 93000, 4, "Tori Bakersfield");
       

       
