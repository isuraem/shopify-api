require('dotenv').config();  // Load environment variables
const BadRequestException = require('./../../util/exceptions/badRequestException');
const axios = require('axios');

const MONDAY_API_KEY = process.env.MONDAY_API_KEY;
const BOARD_ID = process.env.MONDAY_BOARD_ID;

module.exports.getOrdersFromShopify = async (requestBody) => {
  try {
    console.log("Received Order Data:", requestBody);

    const orders = Array.isArray(requestBody) ? requestBody : [requestBody];

    for (const order of orders) {
      console.log(`Processing Order ID: ${order.id}`);

      const items = order.line_items.map(item => 
        `${item.quantity} x ${item.title} ($${item.price})`
      ).join(", ");

      const columnValues = {
        customer_email: order.email,
        total_price: order.total_price,
        items_list: items,
        status: "New Order"
      };

      await axios.post(
        "https://api.monday.com/v2",
        {
          query: `
            mutation {
                create_item (
                    board_id: ${BOARD_ID}, 
                    item_name: "Order #${order.id}",
                    column_values: "${JSON.stringify(columnValues).replace(/"/g, '\\"')}"
                ) {
                    id
                }
            }
          `,
        },
        {
          headers: {
            Authorization: `Bearer ${MONDAY_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`Added Order #${order.id} to Monday with items: ${items}`);
    }

    return {
      msg: "Success",
      data: requestBody
    };

  } catch (error) {
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      console.error('Shopify API Error:', errorData);
      throw new BadRequestException(errorData.message || 'An error occurred with the Shopify API.');
    } else {
      console.error('Unexpected Error:', error);
      throw new BadRequestException(error.message || 'An unexpected error occurred.');
    }
  }
};
