const mysql = require('mysql2');
const inquirer = require('inquirer');
const db = require('./db.connection');

//Present user with options
//View all departments - READ -SELECT * FROM
//Add a Department

//

//view all roles - READ - "SELECT" * FROM

//view all employees READ - "SELECT * FROM
async function viewAllEmployees()

async function createRole() 

//SELECT the existing department out for the 'department' table
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
    //.map() the results from 'department to question data for inquirer
    const choices = departments.map(department => {
        return {
            name: department.name,
            value: department.id
        }
    });

//add an employee

//update employee -SELECT