import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import React, { useState } from 'react';
import Style from './payment.module.css';

import { stripeCheckOut } from '../../services/apiService';

const CARD_OPTIONS = {
  iconStyle: 'solid',
  style: {
    base: {
      // iconColor: '#c4f0ff',
      iconColor: '#fff',
      color: '#fff',
      fontWeight: 500,
      fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      // ':-webkit-autofill': { color: '#fce883' },
      ':-webkit-autofill': { color: '#ffffff' },
      // '::placeholder': { color: '#87bbfd' },
      '::placeholder': { color: '#ffffff' },
    },
    invalid: {
      iconColor: '#ffc7ee',
      color: '#ffc7ee',
    },
  },
};

// #2563eb
/**
 *
 * stripe test Card
 *
 * Card number: 4242 4242 4242 4242
 * MM/YY: 04/24
 * CCV: 837
 * ZIP: 28976
 *
 */

export default function PaymentForm(props) {
  const { amount, setIsBookingVisible, setIsPaymentCompleted, reservationId } =
    props;
  const [success, setSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  console.log({ amount: amount });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (!error) {
      try {
        const { id } = paymentMethod;

        let userData = {
          amount, // all amount in "cents" ==> 1usd = 100cents
          id,
          reservationId,
        };

        const response = stripeCheckOut(userData);

        if (response) {
          console.log('Successful payment');
          setIsPaymentCompleted(true);
          setSuccess(true);
        }
      } catch (error) {
        console.log('Error', error);
      }
    } else {
      console.log(error.message);
    }
  };

  return (
    <>
      {!success ? (
        <form onSubmit={handleSubmit}>
          <fieldset className="FormGroup">
            <div className="FormRow">
              <CardElement options={CARD_OPTIONS} />
            </div>
          </fieldset>
          {/* <button>Pay</button> */}
          <button className="primary mt-4">Pay</button>
        </form>
      ) : null}
    </>
  );
}
