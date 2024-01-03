const axios = require('axios');
const asyncHandler = require('express-async-handler');

const { v4: uuidv4 } = require('uuid');

const createPayment = asyncHandler(async (req, res) => {
  const { amout } = req.body;
  try {
    const response = await axios.post(
      'https://api.yookassa.ru/v3/payments',
      {
        amount: {
          value: '100.00',
          currency: 'RUB',
        },
        capture: true,
        confirmation: {
          type: 'redirect',
          return_url: 'https://yookassa.ru/',
        },
        description: 'Заказ №1',
      },
      {
        headers: {
          // 'Accept': '*/*',
          // 'User-Agent':'Thunder Client (https://www.thunderclient.com)',
          'Access-Control-Allow-Origin': '*',
          'Idempotence-Key': idempotenceKey,
          'Content-Type': 'application/json',
          auth: {
            username: shopId,
            password: secretKey,
          },
        },
      }
    );
    res.json(response);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createPayment,
};
