import React, { useEffect, useState } from 'react';

import { createYandexPay } from '../../services/apiService';

const YandexPay = (props) => {
  const {
    amount,
    currency,
    paymentMethod,
    description,
    setPaymentUrl,
    setIsBookingVisible,
    reservationId,
    // setIsPaymentCompleted,
  } = props;
  const [redirect, setRedirect] = useState(false);
  const [confirmationUrl, setConfirmationUrl] = useState(null);
  const [confirmationData, setConfirmationData] = useState(null);
  console.log({ confirmationData: confirmationData });

  // console.log({ paymentStatus: paymentStatus });

  useEffect(() => {
    if (redirect) {
      setTimeout(() => {
        window.location.href = confirmationUrl;
        setRedirect(false);
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirect]);

  //   {
  //   "amount": "200", "currency":"RUB", "paymentMethod":"bank_card","description": "Заказ №72"
  // }

  const handleGetConfirmationUrl = async () => {
    const userData = {
      amount,
      currency: currency ? currency : 'RUB',
      paymentMethod: paymentMethod ? paymentMethod : 'bank_card',
      description: description ? description : 'Hotel reservation',
      reservationId,
    };
    try {
      const data = await createYandexPay(userData);
      console.log({ userData: data });
      if (data) {
        setConfirmationUrl(data?.confirmation?.confirmation_url);
        setConfirmationData(data);
        setPaymentUrl(data?.confirmation?.confirmation_url);
        // setIsBookingVisible(false);
        // setIsPaymentCompleted(true); //new

        setRedirect(true);
      }
    } catch (e) {
      alert('Login failed');
    }
  };

  const sendFund = (
    <div className="flex justify-center items-center rounded-lg p-4 w-full">
      <div className="flex flex-col rounded-lg border border-indigo-300 p-2 outline outline-indigo-600 outline-[1px]">
        <div
          className="flex flex-row justify-center items-center"
          onClick={handleGetConfirmationUrl}
        >
          <div className="cursor-pointer flex flex-row justify-center items-center bg-indigo-700 hover:opacity-90 text-white p-4 shrink-0 rounded w-[250px]">
            Pay {amount} {currency}
          </div>
        </div>
      </div>
    </div>
  );

  return <>{sendFund}</>;
};

export default YandexPay;

// curl https://api.yookassa.ru/v3/payments \
//   -X POST \
//   -u <Shop ID>:<Secret Key> \
//   -H 'Idempotence-Key: <Idempotence Key>' \
//   -H 'Content-Type: application/json' \
//   -d '{
//         "amount": {
//           "value": "100.00",
//           "currency": "RUB"
//         },
//         "capture": true,
//         "confirmation": {
//           "type": "redirect",
//           "return_url": "https://www.example.com/return_url"
//         },
//         "description": "Order No. 1"
//       }'
