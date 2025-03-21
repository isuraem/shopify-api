module.exports = function (router) {
	var bodyParser = require('body-parser');
	var jsonParser = bodyParser.json();

	//router controllers 
	const orderController = require('../../controllers/order/orderController');

	router.post('/get_orders',
		jsonParser,
		orderController.getOrdersFromShopify
	);
};