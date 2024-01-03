import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const YoPay = () => {
  const [cardholder, setCardholder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiration, setExpiration] = useState('');
  const [cvv, setCVV] = useState('');
  const [confirmationToken, setConfirmationToken] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // const shopId = 'YOUR_SHOP_ID';
  // const secretKey = 'YOUR_SECRET_KEY';

  const shopId = '253989';
  const secretKey = 'test_5OmBQDJ16mWQO8_9YoYAttxknu4jgar9uC1o-xwOGak';

  const handleCardholderChange = (e) => {
    setCardholder(e.target.value);
  };

  const handleCardNumberChange = (e) => {
    setCardNumber(e.target.value);
  };

  const handleExpirationChange = (e) => {
    setExpiration(e.target.value);
  };

  const handleCVVChange = (e) => {
    setCVV(e.target.value);
  };

  const handleGetConfirmationToken = async () => {
    try {
      const idempotenceKey = uuidv4(); // Generate a unique idempotenceKey

      // Combine shopId and secretKey, and encode as base64
      const credentials = btoa(`${shopId}:${secretKey}`);

      const response = await axios.post(
        'https://api.yookassa.ru/v3/payments',
        {
          amount: 1000, // Replace with the actual payment amount
          confirmation: {
            type: 'redirect',
            return_url: 'YOUR_RETURN_URL',
          },
          description: 'Payment for XYZ Product',
          payment_method_data: {
            type: 'bank_card',
            card: {
              number: cardNumber,
              cardholder: cardholder,
              expiration_month: expiration.split('/')[0],
              expiration_year: expiration.split('/')[1],
              cvv: cvv,
            },
          },
        },
        {
          headers: {
            Authorization: `Basic ${credentials}`,
            'Idempotence-Key': idempotenceKey, // Include the Idempotence-Key header
            // Other headers
          },
        }
      );

      setConfirmationToken(response.data.confirmation.confirmation_token);
    } catch (error) {
      console.error('Error obtaining confirmation token:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (confirmationToken) {
      try {
        const idempotenceKey = uuidv4(); // Generate a unique idempotenceKey

        // Combine shopId and secretKey, and encode as base64
        const credentials = btoa(`${shopId}:${secretKey}`);

        const response = await axios.post(
          `https://api.yookassa.ru/v3/payments/${confirmationToken}/capture`,
          {
            amount: 1000, // Replace with the actual payment amount
          },
          {
            headers: {
              Authorization: `Basic ${credentials}`,
              'Idempotence-Key': idempotenceKey, // Include the Idempotence-Key header
              // Other headers
            },
          }
        );

        setPaymentStatus(response.data.status);
      } catch (error) {
        console.error('Payment error:', error);
        setPaymentStatus('failed');
      }
    } else {
      console.error('Confirmation token is missing. Please obtain it before submitting the payment.');
    }
  };

  return (
    <div>
      <h2>Payment Details</h2>
      <form onSubmit={handleSubmit}>
        {/* Payment form fields */}
        <div className="form-group">
          <label htmlFor="cardholder">Cardholder Name</label>
          <input
            type="text"
            id="cardholder"
            value={cardholder}
            onChange={handleCardholderChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            value={cardNumber}
            onChange={handleCardNumberChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="expiration">Expiration Date</label>
          <input
            type="text"
            id="expiration"
            value={expiration}
            onChange={handleExpirationChange}
            placeholder="MM/YYYY"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cvv">CVV</label>
          <input
            type="text"
            id="cvv"
            value={cvv}
            onChange={handleCVVChange}
            required
          />
        </div>
        <button type="button" onClick={handleGetConfirmationToken}>
          Get Confirmation Token
        </button>
        {confirmationToken && (
          <button type="submit">Submit Payment</button>
        )}
      </form>
      {paymentStatus && (
        <div>
          <h3>Payment Status: {paymentStatus}</h3>
        </div>
      )}
    </div>
  );
};

export default YoPay;
