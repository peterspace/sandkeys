import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useState } from 'react';
import axios from 'axios';

// const PUBLIC_KEY = "pk_test_rgWMA3zxjAtwaB6iV8b5W40x"

const PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

const stripeTestPromise = loadStripe(PUBLIC_KEY);

export default function YooMoney(props) {
  const { amount, cardData, setIsBookingVisible, setIsPaymentCompleted } =
    props;

  const [data, setData] = useState([]);
  const [confirmationToken, setConfirmationToken] = useState([]);

  const shopId = '253989';
  const secretKey = 'test_5OmBQDJ16mWQO8_9YoYAttxknu4jgar9uC1o-xwOGak';

  //getConfrimationId
  const getConfrimationToken = async () => {
    let paymentURL = 'https://api.yookassa.ru/v3/payments';

    let userData = {
      amount: '2.00',
      currency: 'RUB',
      description: 'Заказ №72', // "hotel reservation"
      language: 'en_US', // English: "en_US", Russian:"ru_RU" //text language of payment form
    };

    try {
      const response = await axios.post(
        paymentURL,
        {
          amount: {
            value: userData?.amount,
            currency: userData?.currency,
          },
          confirmation: {
            type: 'embedded',
            locale: language,
          },
          //   capture: true, // with the value 'true' to write off money immediately after the user confirms the payment
          capture: false, // with the value 'false' to write off money later
          description: userData?.description,
        },
        {
          headers: {
            //   'Idempotence-Key': '<Ключ идемпотентности>', // not necessary/ optional
            'Idempotence-Key': '<Ключ идемпотентности>', // not necessary
            'Content-Type': 'application/json',
          },
          auth: {
            username: shopId,
            password: secretKey,
          },
        }
      );
      if (response.data) {
        setData(response?.data); // get Data
        setConfirmationToken(response?.data?.confirmation?.confirmation_token);
        //example response
        // response = {
        //   data: {
        //     id: '22d6d597-000f-5000-9000-145f6df21d6f', // payment_id
        //     status: 'pending',
        //     paid: false,
        //     amount: {
        //       value: '2.00',
        //       currency: 'RUB',
        //     },
        //     confirmation: {
        //       type: 'embedded',
        //       confirmation_token: 'ct-24301ae5-000f-5000-9000-13f5f1c2f8e0',
        //     },
        //     created_at: '2018-07-10T14:25:27.535Z',
        //     description: 'Заказ №72',
        //     metadata: {},
        //     recipient: {
        //       account_id: '100500',
        //       gateway_id: '100700',
        //     },
        //     refundable: false,
        //     test: false,
        //   },
        // };
      }
      //   return response.data;
    } catch (error) {
      const err = error.response.data;
      console.log(err);
      //   return { status: err.success, message: err.message };
    }
  };

 

  async function payWithYooMoney() {
    if (confirmationToken) {
      const checkout = new window.YooMoneyCheckoutWidget({
        confirmation_token: confirmationToken, //A token that must be received from Yandex.Checkout before making a payment
        return_url: 'http://localhost:5173/', // Link to payment completion page
        error_callback: function (error) {
          //Handling initialization errors
          console.log(error); // temporarily
        },
      });

      //Displaying a payment form in a container
      checkout
        .render('payment-form')
        //The method returns a Promise, the execution of which indicates that the payment form has been fully loaded (you may not use it).
        .then(() => {
          //Code to be executed after the payment form is displayed.
        });

      //Removing a payment form from a container
      // used when user changes input
      checkout.destroy();

      const checkoutNew = new window.YooMoneyCheckoutWidget({
        confirmation_token: confirmationToken, //A token that must be received from Yandex.Checkout before making a payment
        return_url: 'http://localhost:5173/', // Link to payment completion page
        error_callback: function (error) {
          //Handling initialization errors
          console.log(error); // temporarily
        },
      });

      //Displaying a payment form in a container
      checkoutNew
        .render('payment-form')
        //The method returns a Promise, the execution of which indicates that the payment form has been fully loaded (you may not use it).
        .then(() => {
          //Code to be executed after the payment form is displayed.
        });
    }
  }

  async function payWithYooMoney2() {
    if (confirmationToken) {

     
      const checkout = new window.YooMoneyCheckoutWidget({
        confirmation_token: confirmationToken, //A token that must be received from Yandex.Checkout before making a payment
        return_url: 'http://localhost:5173/', // Link to payment completion page
        error_callback: function (error) {
          //Handling initialization errors
          console.log(error); // temporarily
        },
      });

      //Displaying a payment form in a container
      checkout
        .render('payment-form')
        //The method returns a Promise, the execution of which indicates that the payment form has been fully loaded (you may not use it).
        .then(() => {
          //Code to be executed after the payment form is displayed.
        });

      //Removing a payment form from a container
      // used when user changes input
      checkout.destroy();

      const checkoutNew = new window.YooMoneyCheckoutWidget({
        confirmation_token: confirmationToken, //A token that must be received from Yandex.Checkout before making a payment
        return_url: 'http://localhost:5173/', // Link to payment completion page
        error_callback: function (error) {
          //Handling initialization errors
          console.log(error); // temporarily
        },
      });

      //Displaying a payment form in a container
      checkoutNew
        .render('payment-form')
        //The method returns a Promise, the execution of which indicates that the payment form has been fully loaded (you may not use it).
        .then(() => {
          //Code to be executed after the payment form is displayed.
        });
    }
  }

  async function yooCheckout() {
    const shopId = '253989';
    // const checkout = YooMoneyCheckout(shopId, {
    //   language: 'en',
    // });
    const url = 'https://static.yoomoney.ru/checkout-js/v1/checkout.js';
    const response = await axios.post(url, {
      language: 'en',
    });

    const checkout = response?.data;
    // https://static.yoomoney.ru/checkout-js/v1/checkout.js

    checkout
      .tokenize({
        number: cardData?.number,
        cvc: cardData?.cvc,
        month: cardData?.month,
        year: cardData?.year,
      })
      .then((response) => {
        if (response.status === 'success') {
          const { paymentToken } = response.data.response;

          // eyJlbmNyeXB0ZWRNZXNzYWdlIjoiWlc...
          console.log({ paymentToken: paymentToken });

          setConfirmationToken(paymentToken);
          return paymentToken;
        }
      });
  }

  console.log({ amount: amount });
  return (
    <Elements stripe={stripeTestPromise}>
      <PaymentForm
        amount={amount}
        setIsBookingVisible={setIsBookingVisible}
        setIsPaymentCompleted={setIsPaymentCompleted}
      />
    </Elements>
  );
}
