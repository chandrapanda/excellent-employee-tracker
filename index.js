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

//TODO: Add a Department
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
}

async function addRole() {
    //TODO: SELECT the existing department out for the 'department' table
    // try {
    //     let departments = await db.query('SELECT * FROM departments;')
    // }

    //TODO: .map() the results from 'department to question data for inquirer
    const choices = departments.map(department => {
        return {
            name: department.name,
            value: department.id
        }
    });
};

//TODO: add an employee
async function addEmployee() {
    console.log('add employee');
}

//TODO: update employee -SELECT
async function updateEmployee() {
    console.log('update employee');
}

//Initiate application
initialQuestion();