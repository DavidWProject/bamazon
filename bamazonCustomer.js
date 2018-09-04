var mysql = require("mysql");
const cTable = require('console.table');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 8889,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    readColleges();
});

function readColleges() {
    connection.query("SELECT id, product_name, department_name, price, stock_quantity FROM products", function (err, res) {
        if (err) throw err;

        // Log all results of the SELECT statement
        console.table(res);
        //connection.end();
        promptUser();

    })
};

function promptUser() {
    inquirer.prompt([{
        type: "input",
        name: "id",
        message: "\nType in ID of the product you would like to buy.\n"
    }]).then(function (data) {
        checkAnswer(data);
    });
}