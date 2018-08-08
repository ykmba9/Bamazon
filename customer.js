
var inquirer = require('inquirer');
var mysql = require('mysql');


var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,

	
	user: 'root',

	
	password: '',
	database: 'Bamazon'
});

// validateInput makes sure that only positive integers being supplied by the user
function validateInput(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Please enter a whole non-zero number.';
	}
}

// promptUserPurchase will prompt the user for the item/quantity they would like to purchase
function promptUserPurchase() {
	

	// Prompt the user to select an item
	inquirer.prompt([
		{
			type: 'input',
			name: 'itemId',
			message: 'Please enter the Item ID which you would like to purchase.',
			validate: validateInput,
			filter: Number
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many do you need?',
			validate: validateInput,
			filter: Number
		}
	]).then(function(input) {
		

		var item = input.itemId;
		var quantity = input.quantity;

		
		var queryStr = 'SELECT * FROM products WHERE ?';

		connection.query(queryStr, {itemId: item}, function(err, data) {
			if (err) throw err;

			

			if (data.length === 0) {
				console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
				displayInventory();

			} else {
				var productData = data[0];

				

				// If the quantity requested by the user is in stock
				if (quantity <= productData.stockQuantity) {
					console.log('Congratulations, the product you requested is in stock! Placing order!');

					// make update query string
					var updateQueryStr = 'UPDATE products SET stockQuantity = ' + (productData.stockQuantity - quantity) + ' WHERE itemId = ' + item;
					

					// Update the inventory
					connection.query(updateQueryStr, function(err, data) {
						if (err) throw err;

						console.log('Your oder has been placed! Your total is $' + productData.price * quantity);
						console.log('Thank you for shopping with us!');
						console.log("\n---------------------------------------------------------------------\n");

						
						connection.end();
					})
				} else {
					console.log('Sorry, there is not enough product in stock, your order can not be placed as is.');
					console.log('Please modify your order.');
					console.log("\n---------------------------------------------------------------------\n");

					displayInventory();
				}
			}
		})
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
			console.log(data[i]);
			strOut = '';
			strOut += 'Item ID: ' + data[i].ItemID + '  //  ';
			strOut += 'Product Name: ' + data[i].ProductName + '  //  ';
			strOut += 'Department: ' + data[i].DepartmentName + '  //  ';
			strOut += 'Price: $' + data[i].Price + '\n';

			console.log(strOut);
		}


	  	console.log("---------------------------------------------------------------------\n");

	  	//Prompt the user for item/quantity they would like to purchase
	  	promptUserPurchase();
	})
}

// runBamazon will execute the main application 
function runBamazon() {
	

	// Display the available inventory
	displayInventory();
}

// Run the application
runBamazon();