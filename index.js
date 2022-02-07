const inquirer = require('inquirer');
const util = require('util');
const table = require('console.table');
const db = require('./db/connection');

//Allows query to be run asynchronously
db.query = util.promisify(db.query);

//Questions for input
const firstQuestion = [
    {
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
        name: 'response',
        validate: function (answer) {
            if (answer.length < 1) {
                return console.log("Please select an option and hit ENTER");
            }
            return true;
        }
    }
];

//User is presented with options from which to select
function askFirstQuestion() {
    inquirer
    .prompt (firstQuestion)
    .then(({response}) => {
        if (response == 'View all departments') {
            viewAllDepartments();
        } else if (response == 'View all roles') {
            viewAllRoles();
        } else if (response == 'View all employees') {
            viewAllEmployees();
        } else if (response == 'Add a department') {
            addDepartment();
        } else if (response == 'Add a role') {
            addRole();
        } else if (response == 'Add an employee') {
            addEmployee();
        } else if (response == 'Update an employee role') {
            updateEmployee();
        };
    });
};


//View all departments
async function viewAllDepartments() {
    try {
        // Runs Query database
        var results = await db.query('SELECT * FROM departments;')
        console.table(results);
    } catch (err) {
        console.error(err);
    }
    askFirstQuestion();
};

//View all roles
async function viewAllRoles() {
    try {
        // Runs Query database
        var results = await db.query('SELECT * FROM roles;')
        console.table(results);
    } catch (err) {
        console.error(err);
    }
    askFirstQuestion();
};

//View all employees
async function viewAllEmployees() {
    try {
        // Runs Query database
        var results = await db.query(`
        SELECT employees.id, employees.first_name, employees.last_name, roles.salary, roles.job_title, departments.department_name, managers.first_name AS manager_first_name, managers.last_name AS manager_last_name 
        FROM employees 
        LEFT JOIN roles ON employees.role_id = roles.id 
        LEFT JOIN departments ON employees.department_id = departments.id 
        LEFT JOIN employees managers ON employees.manager_id = managers.id;`);
        console.table(results);
    } catch (err) {
        console.error(err);
    }
    askFirstQuestion();
};

//Add a Department
async function addDepartment() {
    const {department} = await inquirer.prompt(
        [
            {
            type: "input",
            message: "Enter department name you wish to add.",
            name: "department",
                validate: function (answer) {
                    if (answer.length < 3) {
                        return console.log("Please enter a department name you'd like to add.");
                    }
                    return true;
                }
            }
        ]
    );
    try {
        db.query(`INSERT INTO departments (department_name) VALUES ("${department}")`, );
        console.log(`${department} added to Departments.`)
    } catch (err) {
        console.error(err);
    }
    askFirstQuestion();
};

//Add a role
async function addRole() {
    //Selects all current departments
    let departments = await db.query('SELECT * FROM departments;');

    //Maps out departments with ID as identifier in backend
    let departmentList = departments.map(department => {
        return { name: department.department_name, value: department.id } ;
    });

    const { job_title, salary, department_id } = await inquirer.prompt(
        [
            {
                type: "input",
                message: "Enter the job title of the new role.",
                name: "job_title",
                    validate: function (answer) {
                        if (answer.length < 3) {
                            return console.log("Please enter a role name.");
                        }
                        return true;
                    }
            },
            {
                type: "input",
                message: "Enter the salary of the new role.",
                name: "salary",
                    validate: function (answer) {
                        if (answer.length < 3) {
                            return console.log("Please enter this role's salary.");
                        }
                        return true;
                    }
            },
            {
                type: "list",
                message: "Select a department for this role.",
                choices: departmentList,
                name: "department_id",
                    validate: function (answer) {
                        if (!answer) {
                            return console.log("Please select the role's department.");
                        }
                        return true;
                    }
            }
        ]
    );
    //Adds information to Roles table
    try {
        await db.query(`INSERT INTO roles (job_title, salary, department_id) VALUES ("${job_title}", "${salary}", "${department_id}")`);
        console.log(`${job_title} added to Roles.`);
       
    } catch(err) {
        console.error(err);
    };
    askFirstQuestion();
};

//Add an employee
async function addEmployee() {

    //Selects all current roles
    let roles = await db.query('SELECT id, job_title FROM roles;');

    //Maps out list of roles and adds value of ID in backend
    let roleList = roles.map(role => {
        return { name: role.job_title, value: role.id };
    });

    //Selects all current departments
    let departments = await db.query('SELECT * FROM departments;');

    let departmentList = departments.map(department => {
        return { name: department.department_name, value: department.id };
    });

    //Creates array of managers to select from
    let managers = await db.query('SELECT id, first_name, last_name FROM employees;');

    //Maps out managers according to ID 
    let managerList = managers.map(manager => {
        return { name: manager.first_name + ' ' + manager.last_name, value: manager.id };
    });

    const { first_name, last_name, role_id, department_id, manager_id } = await inquirer.prompt(
        [
            {
                type: "input",
                message: "Enter the employee's first name.",
                name: "first_name",
                    validate: function (answer) {
                        if (answer.length < 2) {
                            return console.log("Please enter a first name.");
                        }
                        return true;
                    }
            },
            {
                type: "input",
                message: "Enter the employee's last name.",
                name: "last_name",
                    validate: function (answer) {
                        if (answer.length < 2) {
                            return console.log("Please enter a last name.");
                        }
                        return true;
                    }
            },
            {
                type: "list",
                message: "Select a role for this employee.",
                choices: roleList,
                name: "role_id",
                    validate: function (answer) {
                        if (!answer) {
                            return console.log("Please select the employee's role.");
                        }
                        return true;
                    }
            },
            {
                type: "list",
                message: "Select a department for this employee.",
                choices: departmentList,
                name: "department_id",
                    validate: function (answer) {
                        if (!answer) {
                            return console.log("Please select the employee's department.");
                        }
                        return true;
                    }
            },
            {
                type: "list",
                message: "Select the employee's manager.",
                choices: managerList,
                name: "manager_id",
                    validate: function (answer) {
                        if (!answer) {
                            return console.log("Please select a manager's name.");
                        }
                        return true;
                    }
            },
        ]
    );

    //Adds information to Employees table
    try {
        await db.query(`INSERT INTO employees (first_name, last_name, role_id, department_id, manager_id) VALUES ("${first_name}", "${last_name}", "${role_id}", "${department_id}", "${manager_id}");`);
        console.log(`${first_name} ${last_name} added to Employees.`);
        
    } catch(err) {
        console.error(err);
    };
    askFirstQuestion();
}

//Update employee role
async function updateEmployee() {

    //Creates array of employees to select from
    let employees = await db.query('SELECT id, first_name, last_name FROM employees;');

    //Maps employees based on name as key and ID as value
    let employeesList = employees.map(employee => {
        return { name: employee.first_name + ' ' + employee.last_name, value: employee.id };
    });

      //Selects all current roles
    let roles = await db.query('SELECT id, job_title FROM roles;');

    //Maps out list of roles and adds value of ID in backend
    let roleList = roles.map(role => {
        return { name: role.job_title, value: role.id };
    });

    const { employee_id, role_id } = await inquirer.prompt(
        [
            {
                type: "list",
                message: "Choose the employee you'd like to update.",
                choices: employeesList,
                name: "employee_id",
                    validate: function (answer) {
                        if (answer.length < 3) {
                            return console.log("Please choose the employee you'd like to update.");
                        }
                        return true;
                    }
                },
            {
            type: "list",
            message: "Please choose the employee's new role.",
            choices: roleList,
            name: "role_id",
                validate: function (answer) {
                    if (answer.length < 3) {
                        return console.log("Please choose the employee's new role.");
                    }
                    return true;
                }
            }
        ]
    );

    try {
        await db.query(`UPDATE employees SET role_id = ("${role_id}") WHERE id = "${employee_id}";`);
        console.log(`${employee_id} updated.`)
    } catch (err) {
        console.error(err);
    }
    askFirstQuestion();
};

//Initiate application
askFirstQuestion();