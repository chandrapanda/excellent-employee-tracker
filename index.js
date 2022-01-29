const mysql = require('mysql2');
const inquirer = require('inquirer');
const db = require('./db.connection');

//TODO: Present user with options


//TODO: View all departments - READ - "SELECT * FROM [table_name]"
async function viewAllDepartments() {


}

//TODO: Add a Department

//

//TODO: view all roles - READ - "SELECT" * FROM

//TODO: view all employees READ - "SELECT * FROM
async function viewAllEmployees() {
    const employees = await db.query('SELECT * FROM employee');
    console.table(employees);
}

async function createRole() {
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
}


//TODO: add an employee

//TODO: update employee -SELECT