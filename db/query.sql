Select employee.id, employee.first_name, employee.last_name, roles.title, department.department_name, roles.salary, CONCAT (m.first_name, ' ', m.last_name) AS manager_id
FROM employee
JOIN roles
ON employee.role_id = roles.id
JOIN department
ON department.id = roles.department.id
JOIN employee manager_id
