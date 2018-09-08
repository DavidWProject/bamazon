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
    // console.log("connected as id " + connection.threadId + "\n");
    listOptions();
    // listProducts();
});

function listOptions() {
    inquirer.prompt([{
        type: 'list',
        name: 'options',
        message: 'Menu Options: ',
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }]).then(function (data) {
        if (data.options === "View Products for Sale") {
            listProducts();
        }
        if (data.options === "View Low Inventory") {
            connection.query("SELECT id, product_name, department_name, price, stock_quantity FROM products WHERE stock_quantity < 5", function (err, res) {
                if (err) throw err;
                console.log("\nBelow are a table of items that are low in stock. \n");
                console.table(res);
                endPrompt();
            });
        }
        if (data.options === "Add to Inventory") {
            addInventory();
        }
        if (data.options === "Add New Product") {
            addNewProduct();
        }
    })
};

function listProducts() {
    connection.query("SELECT id, product_name, department_name, price, stock_quantity FROM products", function (err, res) {
        if (err) throw err;

        // Log all results of the SELECT statement
        console.table(res);
        //connection.end();
        inquirer.prompt([{
            type: 'list',
            name: 'options',
            message: 'Do you want to move to the purchase menu?',
            choices: ["Yes", "No"]
        }]).then(function (data) {
            if (data.options === "Yes") {
                promptUser();
            } else {
                listOptions();
            }
        })

        // console.log(res[0].id); 

    })
};

function promptUser() {
    inquirer.prompt([{
        name: "product",
        message: "Type in ID of the product you would like to buy.",
        validate: function (value) {
            if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 11) {
                return true;
            }
            return false;
        }
    }, {
        name: "quantity",
        message: "How many units of the product they would like to buy?",
        validate: function (value) {
            if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 1000) {
                return true;
            }
            return false;
        }

    }]).then(function (data) {
        var sqlProduct = Number(data.product) - 1;
        connection.query("SELECT id, product_name, department_name, price, stock_quantity FROM products", function (err, res) {
            console.log("\nSo you just purchased " + data.quantity + " units of " + res[sqlProduct].product_name + ".\n");
            var totalCost = data.quantity * res[sqlProduct].price;
            console.log("The total cost of your purchase is $" + totalCost + ".");

            var numberDifference = res[sqlProduct].stock_quantity - data.quantity;
            if (Number(data.quantity) > res[sqlProduct].stock_quantity) {
                console.log("Insufficient quantity!");
            } else {
                var sql = "UPDATE products SET stock_quantity = '" + numberDifference + "' WHERE id = '" + data.product + "'";
                connection.query(sql, function (err, result) {
                    if (err) throw err;
                    endPrompt();
                });
            }
        })


        // if (typeof Number(data.id) !== 'number') {
        //     console.log("You need to provide a number")

        // }

        // for (var i = 0; i < res.length - 1; i++) {
        //     if (Number(data.id) === res[i].id) {
        //         console.log("You want to buy " + res[i].product_name); 
        //     } else {
        //         console.log("Invalid Product ID");
        //     }
        // }
    });

};

function addInventory() {

    // inquirer.prompt([{
    //     type: 'list',
    //     name: 'name',
    //     message: 'Select the item you would like to add inventory to.',
    //     choices: ["Hammer", "Nails", "Overhead Ceiling Fan", "Oranges", "Banana", "McDouble", "Light Bulb", "T-shirt", "Muffin", "Ham", "Flashlight"]
    // }, {
    //     name: "quantity",
    //     message: "How many units would you like to add?",
    //     validate: function (value) {
    //         if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 1000) {
    //             return true;
    //         }
    //         return false;
    //     }

    // }]).then(function (data) {
    //     connection.query("SELECT id, product_name, department_name, price, stock_quantity FROM products", function (err, res) {
    //         var productAddition = res[sqlProduct].stock_quantity + data.quantity;
    //         sqlAddInventory();
    //         console.log("\nYou've added " + data.quantity + " units of " + data.name + " to the inventory.\n");
    //         // endPrompt(); 
    //     });
    // })
    // var sql = "UPDATE products SET stock_quantity = '" + numberDifference + "' WHERE id = '" + data.product + "'";  
    // connection.query(sql, function (err, result) {
    //     if (err) throw err; 
    //     endPrompt(); 
    // });

    inquirer.prompt([{
        name: "product",
        message: "Type in ID of item you want to add into inventory.",
        validate: function (value) {
            if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 11) {
                return true;
            }
            return false;
        }
    }, {
        name: "quantity",
        message: "How many units of the product they would like to add?",
        validate: function (value) {
            if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 1000) {
                return true;
            }
            return false;
        }

    }]).then(function (data) {
        var sqlProduct = Number(data.product) - 1;
        connection.query("SELECT id, product_name, department_name, price, stock_quantity FROM products", function (err, res) {
            console.log("\nSo you just added " + data.quantity + " units of " + res[sqlProduct].product_name + " into inventory.\n");

            var productAddition = Number(res[sqlProduct].stock_quantity) + Number(data.quantity);

            var sql = "UPDATE products SET stock_quantity = '" + productAddition + "' WHERE id = '" + data.product + "'";
            connection.query(sql, function (err, result) {
                if (err) throw err;
                endPrompt();
            });

        })
    });
}

function addNewProduct() {
    inquirer.prompt([{
        name: "name",
        message: "What's the name of the product you would like to add?",
        validate: function (value) {
            if (value !== "") {
                return true;
            }
            return false;
        }
    }, {
        name: "department",
        message: "What's the name of the department where your product came from?",
        validate: function (value) {
            if (value !== "") {
                return true;
            }
            return false;
        }
    }, {
        name: "price",
        message: "What's the price of each product?",
        validate: function (value) {
            if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 1000) {
                return true;
            }
            return false;
        }
    }, {
        name: "quantity",
        message: "How many units of the product they would like to add?",
        validate: function (value) {
            if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 1000) {
                return true;
            }
            return false;
        }
    }]).then(function (data) {
        var sqlProduct = Number(data.product) - 1;
        connection.query("SELECT id, product_name, department_name, price, stock_quantity FROM products", function (err, res) {

            // var productAddition = Number(res[sqlProduct].stock_quantity) + Number(data.quantity);

            var sql = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('" + data.name + "', '" + data.department + "', '" + data.price + "', '" + data.quantity + "')";
            connection.query(sql, function (err, result) {
                if (err) throw err;
                
                console.log("\nSo you just added " + data.quantity + " units of " + data.name + " into the database.\n");
                endPrompt1();
            });

        })
    });
}

function endPrompt() {

    // console.table(res);

    inquirer.prompt([{
        type: 'list',
        name: 'options',
        message: 'Menu Options',
        choices: ["Purchase another item", "Return to home menu", "End Session"]
    }]).then(function (data) {
        if (data.options === "Purchase another item") {
            promptUser();
        }
        if (data.options === "Return to home menu") {
            listOptions();
        }
        if (data.options === "End Session") {
            console.log("\nThanks for using BAmazon, Hope you come back soon!");
            connection.end();
        }
    })

    // connection.end(); 
};
// function updateProduct() {
//     console.log("Updating " + res[sqlProduct].product_name + " items in stock.");
//     var query = connection.query(
//       "UPDATE products SET ? WHERE ?",
//       [
//         {
//           quantity: res[sqlProduct].quantity - data.quantity
//         },
//         {
//           product_name: res[sqlProduct].product_name
//         }
//       ],
//       function(err, res) {
//         // console.log(res.affectedRows + " products updated!\n");
//         // Call deleteProduct AFTER the UPDATE completes

//       }
//     );

//     // logs the actual query being run
//     console.table(res);
//   }

// function sqlAddInventory() {

//     var sql = "UPDATE products SET stock_quantity = '" + productAddition + "' WHERE product_name = '" + data.name + "'";
//     connection.query(sql, function (err, result) {
//         if (err) throw err;
//         endPrompt();
//     });

// }

function endPrompt1() {

    // console.table(res);

    inquirer.prompt([{
        type: 'list',
        name: 'options',
        message: 'Menu Options',
        choices: ["View List of Products", "Return to home menu", "End Session"]
    }]).then(function (data) {
        if (data.options === "View List of Products") {
            listProducts();
        }
        if (data.options === "Return to home menu") {
            listOptions();
        }
        if (data.options === "End Session") {
            console.log("\nThanks for using BAmazon, Hope you come back soon!");
            connection.end();
        }
    })

    // connection.end(); 
};