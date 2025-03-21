const BadRequestException = require('./../../util/exceptions/badRequestException');
const axios = require('axios');

module.exports.getOrdersFromShopify = async (requestBody) => {

  try {

    console.log("Data :", requestBody)

    return {
        msg : "Success",
        data: requestBody
    }

    
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
