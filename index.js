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
        var results = await db.query('SELECT employees.*, roles.salary FROM employees LEFT JOIN roles ON employees.role_id = roles.id;')
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

    let departmentNameIDMap = {};
   
    //Creates array of departments to select from
    departments.forEach(department => {
            departmentNameIDMap[department.department_name] = department.id; 
    });

    let departmentList = departments.map(department => {
        return department.department_name;
    });

    const { job_title, salary, department_name } = await inquirer.prompt(
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
                name: "department_name",
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
        await db.query(`INSERT INTO roles (job_title, salary, department_id) VALUES ("${job_title}", "${salary}", "${departmentNameIDMap[department_name]}")`);
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
    let roleIDMap = {};

    //Creates array of roles to select from
    roles.forEach(role => {
            roleIDMap[role.job_title] = role.id; 
    });

    let roleList = roles.map(role => {
        return role.job_title;
    });

    //Selects all current departments
    let departments = await db.query('SELECT * FROM departments;');

    let departmentNameIDMap = {};

    //Creates array of departments to select from
    departments.forEach(department => {
        departmentNameIDMap[department.department_name] = department.id; 
    });

    let departmentList = departments.map(department => {
        return department.department_name;
    });

    //Creates array of managers to select from
    let managers = await db.query('SELECT id, first_name, last_name FROM employees;');

    let managerNameIDMap = {};

    //ID number added for edge case of two persons having the same name
    managers.forEach(manager => {
        managerNameIDMap[manager.first_name + ' ' + manager.last_name + ' ' + manager.id] = manager.id;
    });

    let managerList = managers.map(manager => {
        return manager.first_name + ' ' + manager.last_name + ' ' + manager.id;
    });

    const { first_name, last_name, job_title, department_name, manager_name } = await inquirer.prompt(
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
                name: "job_title",
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
                name: "department_name",
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
                name: "manager_name",
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
        await db.query(`INSERT INTO employees (first_name, last_name, role_id, department_id, manager_id) VALUES ("${first_name}", "${last_name}", "${roleIDMap[job_title]}", "${departmentNameIDMap[department_name]}", "${managerNameIDMap[manager_name]}");`);
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

    let employeeIDMap = {};

    //ID number added for edge case of two persons having the same name
    employees.forEach(employee => {
        employeeIDMap[employee.first_name + ' ' + employee.last_name + ' ' + employee.id] = employee.id;
    });

    let employeesList = employees.map(employee => {
        return employee.first_name + ' ' + employee.last_name + ' ' + employee.id;
    });

     //Selects all current roles
     let roles = await db.query('SELECT id, job_title FROM roles;');
     let roleIDMap = {};

     //Creates array of roles to select from
     roles.forEach(role => {
             roleIDMap[role.job_title] = role.id; 
     });
 
     let roleList = roles.map(role => {
         return role.job_title;
     });

    const { employee, job_title } = await inquirer.prompt(
        [
            {
                type: "list",
                message: "Choose the employee you'd like to update.",
                choices: employeesList,
                name: "employee",
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
            name: "job_title",
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
        await db.query(`UPDATE employees SET role_id = ("${roleIDMap[job_title]}") WHERE id = "${employeeIDMap[employee]}";`);
        console.log(`${employee} updated.`)
    } catch (err) {
        console.error(err);
    }
    askFirstQuestion();
};

//Initiate application
askFirstQuestion();