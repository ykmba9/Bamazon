
var inquirer = require('inquirer');
var mysql = require('mysql');


var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,


	user: 'root',

	
	password: '',
	database: 'Bamazon'
});

// promptManagerAction will present menu options to the manager and trigger appropriate logic
function promptManagerAction() {
	

	// Prompt the manager to select an option
	inquirer.prompt([
		{
			type: 'list',
			name: 'option',
			message: 'Please select an option:',
			choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
			filter: function (val) {
				if (val === 'View Products for Sale') {
					return 'sale';
				} else if (val === 'View Low Inventory') {
					return 'lowInventory';
				} else if (val === 'Add to Inventory') {
					return 'addInventory';
				} else if (val === 'Add New Product') {
					return 'newProduct';
				} else {
					// This case should be unreachable
					console.log('ERROR: Unsupported operation!');
					exit(1);
				}
			}
		}
	]).then(function(input) {
		

		// Trigger the appropriate action based on the user input
		if (input.option ==='sale') {
			displayInventory();
		} else if (input.option === 'lowInventory') {
			displayLowInventory();
		} else if (input.option === 'addInventory') {
			addInventory();
		} else if (input.option === 'newProduct') {
			createNewProduct();
		} else {
			// This case should be unreachable
			console.log('ERROR: Unsupported operation!');
			exit(1);
		}
	})
}

// displayInventory will retrieve the current inventory from the database and output it to the console
function displayInventory() {
	

	
	queryStr = 'SELECT * FROM products';

	
	connection.query(queryStr, function(err, data) {
		if (err) throw err;

		console.log('Existing Inventory: ');
		console.log('...................\n');

		var strOut = '';
		for (var i = 0; i < data.length; i++) {
			strOut = '';
			strOut += 'Item ID: ' + data[i].ItemId + '  //  ';
			strOut += 'Product Name: ' + data[i].ProductName + '  //  ';
			strOut += 'Department: ' + data[i].DepartmentName + '  //  ';
			strOut += 'Price: $' + data[i].Price + '  //  ';
			strOut += 'Quantity: ' + data[i].StockQuantity + '\n';

			console.log(strOut);
		}

	  	console.log("---------------------------------------------------------------------\n");

		
		connection.end();
	})
}

// displayLowInventory will display a list of products with the available quantity below 100
function displayLowInventory() {
	;

	
	
	queryStr = 'SELECT * FROM products WHERE StockQuantity < 100';

	
	connection.query(queryStr, function(err, data) {
		if (err) throw err;

		console.log('Low Inventory Items (below 100): ');
		console.log('................................\n');

		var strOut = '';
		for (var i = 0; i < data.length; i++) {
			strOut = '';
			strOut += 'Item ID: ' + data[i].ItemID+ '  //  ';
			strOut += 'Product Name: ' + data[i].ProductName + '  //  ';
			strOut += 'Department: ' + data[i].DepartmentName + '  //  ';
			strOut += 'Price: $' + data[i].Price + '  //  ';
			strOut += 'Quantity: ' + data[i].StockQuantity + '\n';

			console.log(strOut);
		}

	  	console.log("---------------------------------------------------------------------\n");

	
		connection.end();
	})
}

// validateInteger makes sure that the user is supplying only positive integers for their inputs
function validateInteger(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Please enter a whole non-zero number.';
	}
}

// validateNumeric makes sure that the user is supplying only positive numbers for their inputs
function validateNumeric(value) {
	// Value must be a positive number
	var number = (typeof parseFloat(value)) === 'number';
	var positive = parseFloat(value) > 0;

	if (number && positive) {
		return true;
	} else {
		return 'Please enter a positive number for the unit price.'
	}
}

// addInventory will guilde a user in adding additional quantify to an existing item
function addInventory() {
	

	// Prompt the user to select an item
	inquirer.prompt([
		{
			type: 'input',
			name: 'ItemId',
			message: 'Please enter the Item ID for stock_count update.',
			validate: validateInteger,
			filter: Number
		},
		{
			type: 'input',
			name: 'Qantity',
			message: 'How many would you like to add?',
			validate: validateInteger,
			filter: Number
		}
	]).then(function(input) {
		;

		var item = input.itemId;
		var addQuantity = input.quantity;

		
		var queryStr = 'SELECT * FROM products WHERE ?';

		connection.query(queryStr, {itemId: item}, function(err, data) {
			if (err) throw err;

			

			if (data.length === 0) {
				console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
				addInventory();

			} else {
				var ProductData = data[0];

				

				console.log('Updating Inventory...');

				// Construct the updating query string
				var updateQueryStr = 'UPDATE products SET StockQuantity = ' + (ProductData.StockQuantity + addQuantity) + ' WHERE ItemId = ' + item;
				// console.log('updateQueryStr = ' + updateQueryStr);

				// Update the inventory
				connection.query(updateQueryStr, function(err, data) {
					if (err) throw err;

					console.log('Stock count for Item ID ' + item + ' has been updated to ' + (ProductData.StockQuantity + addQuantity) + '.');
					console.log("\n---------------------------------------------------------------------\n");

					// End the database connection
					connection.end();
				})
			}
		})
	})
}

// createNewProduct will guide the user in adding a new product to the inventory
function createNewProduct() {
	

	// Prompt the user to enter information about the new product
	inquirer.prompt([
		{
			type: 'input',
			name: 'ProductName',
			message: 'Please enter the new product name.',
		},
		{
			type: 'input',
			name: 'DepartmentName',
			message: 'Which department does the new product belong to?',
		},
		{
			type: 'input',
			name: 'Price',
			message: 'What is the price per unit?',
			validate: validateNumeric
		},
		{
			type: 'input',
			name: 'StockQuantity',
			message: 'How many items are in stock?',
			validate: validateInteger
		}
	]).then(function(input) {
		

		console.log('Adding New Item: \n    ProductName = ' + input.ProductName + '\n' +  
									   '    DepartmentName = ' + input.DepartmentName + '\n' +  
									   '    Price = ' + input.Price + '\n' +  
									   '    StockQuantity = ' + input.StockQuantity);

		g
		var queryStr = 'INSERT INTO products SET ?';

		
		connection.query(queryStr, input, function (error, results, fields) {
			if (error) throw error;

			console.log('New product has been added to the inventory under Item ID ' + results.insertId + '.');
			console.log("\n---------------------------------------------------------------------\n");

			
			connection.end();
		});
	})
}

// runBamazon will execute the main application 
function runBamazon() {
	

	// Prompt manager for input
	promptManagerAction();
}

// Run the application 
runBamazon();