const mysql = require('mysql2');
const inquirer = require('inquirer');
const db = require('./db.json');

//Questions for input
const firstQuestion = [
    {
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
        name: 'first',
        validate: function (answer) {
            if (answer.length < 1) {
                return console.log("Please select an option and hit ENTER");
            }
            return true;
        }
    }
];

//TODO: Present user with options

function initialQuestion() {
    inquirer
    .prompt (firstQuestion)
    .then((response) => {
        console.log(response);
        if (response == 'View all departments') {
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


//TODO: View all departments - READ - "SELECT * FROM [table_name]"
async function viewAllDepartments() {
    console.log('view all departments');
}

//TODO: Add a Department
async function addDepartment() {
    console.log('add a department');
}

//TODO: view all roles - READ - "SELECT" * FROM
async function viewAllRoles() {
    console.log('view all roles');
}

//TODO: view all employees READ - "SELECT * FROM
async function viewAllEmployees() {
    const employees = await db.query('SELECT * FROM employee');
    console.table(employees);
}

async function addRole() {
    //TODO: SELECT the existing department out for the 'department' table
    const departments = [
        {
            id: 1,
            name: "Sales"
        },
        {
            id: 2,
            name: "Accounting"
        }
    ];
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