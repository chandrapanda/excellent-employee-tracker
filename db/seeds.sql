INSERT INTO departments (department_name)
VALUES ("Software Development"),
       ("Finance"),
       ("Legal"),
       ("Sales");

INSERT INTO roles (job_title, department_id, salary)
VALUES ("Head of Marketing", 4, 120000),
       ("Accountant", 2, 100000),
       ("Software Engineer", 1, 90000),
       ("Lawyer", 3, 110000);

INSERT INTO employees (first_name, last_name, role_id, department_id, manager_id)
VALUES ("Jose", "Mañuel", 1, 3, NULL),
       ("Cleo", "Shmidt", 2, 2, 1),
       ("Hong", "Mai", 3, 4, 1),
       ("Gary", "Zhang", 4, 1, 1);
       

       
