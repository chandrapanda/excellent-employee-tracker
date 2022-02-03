const mysql = require("mysql2");
const util = require('util');

//connect to database
const connection = mysql.createConnection({
  host: "localhost",
  // Your username
  user: "root",
  // Your password
  password: "",
  database: "company_db",
});

connection.query = util.promisify( connection.query );

connection.connect(function (err) {
  if (err) {
    throw err;
  } else {
    console.log('Succesfully connected to mysql')
  }
});

module.exports = connection;