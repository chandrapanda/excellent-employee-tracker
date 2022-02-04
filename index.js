const inquirer = require('inquirer');
const util = require('util');
const table = require('console.table');
const db = require('./db/connection');
const _ = require('lodash');
const { last } = require('lodash');

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
function initialQuestion() {
    inquirer
    .prompt (firstQuestion)
    .then(({response}) => {
        if (response == firstQuestion[0].choices[0]) {
            viewAllDepartments();
            console.log('View all departments initiated');
        } else if (response == 'View all roles') {
            viewAllRoles();
            console.log('View all roles initiated');
        } else if (response == 'View all employees') {
            viewAllEmployees();
            console.log('View all employees initiated');
        } else if (response == 'Add a department') {
            addDepartment();
            console.log('Add a department initiated');
        } else if (response == 'Add a role') {
            addRole();
            console.log('Add a role initiated');
        } else if (response == 'Add an employee') {
            addEmployee();
            console.log('Add an employee initiated');
        } else if (response == 'Update an employee role') {
            updateEmployee();
            console.log('Update an employee initiated');
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
    initialQuestion();
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
    initialQuestion();
}

//View all employees
async function viewAllEmployees() {
    try {
        // Runs Query database
        var results = await db.query('SELECT * FROM employees;')
        console.table(results);
    } catch (err) {
        console.error(err);
    }
    initialQuestion();
}

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
        db.query("INSERT INTO departments (department_name) VALUES (?)", department);
        console.log(`${department} added to Departments.`)
    } catch (err) {
        console.error(err);
    }
    initialQuestion();
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
        await db.query("INSERT INTO roles (job_title, salary, department_id) VALUES (?, ?, ?)", [job_title, salary, departmentNameIDMap[department_name]]);
        console.log(`${job_title} added to Roles.`);
       
    } catch(err) {
        console.error(err);
    };
    initialQuestion();
};

//Add an employee
async function addEmployee() {
        //Selects all current roles
        let roles = await db.query('SELECT id, job_title FROM roles;');
        console.log(roles);
        let roleIDMap = {};
        console.log(roleIDMap);
        //Creates array of roles to select from
        roles.forEach(role => {
                roleIDMap[role.job_title] = role.id; 
        });
    
        let roleList = roles.map(role => {
            return role.job_title;
        });
    console.log(roleIDMap)
        const { first_name, last_name, job_title, manager_name } = await inquirer.prompt(
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
                    message: "Select the employee's manager.",
                    choices: ["Leah Rodriguez", "Matthew Smith", "Kunal Singh", "Tori Bakersfield"],
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
            await db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_name) VALUES ("${first_name}", "${last_name}", "${roleIDMap[job_title]}", "${manager_name}")`);
            console.log(`${first_name} ${last_name} added to Employees.`);
           
        } catch(err) {
            console.error(err);
        };
        initialQuestion();
}

//TODO: update employee -SELECT
async function updateEmployee() {
    let employees = await db.query('SELECT first_name FROM employees;');
 
    let employeesList = employees.map(employee => {
        return employee.first_name;
    });
    let roles = await db.query('SELECT job_title FROM roles;');
    console.log(roles);

    let rolesList = roles.map(role => {
        return role.job_title;
    });

    const {newEmployeeRole} = await inquirer.prompt(
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
            choices: rolesList,
            name: "newRole",
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
        //TODO: finish query for update
        db.query("UPDATE employees SET role_id VALUES (?)", newEmployeeRole);
        console.log(`${employee} updated.`)
    } catch (err) {
        console.error(err);
    }
    initialQuestion();
}

//Initiate application
initialQuestion();