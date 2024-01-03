import { useEffect, useState } from 'react';
import { useNavigation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
// import { getYandexPayment } from '../../services/apiService';

const PaySuccess = () => {
  // const [redirect, setRedirect] = useState(false);
  // const navigate = useNavigation()
  const [paymentData, setPaymentData] = useState();
  const [paymentId, setPaymentId] = useState(
    // '2cc59221-000f-5000-9000-1efc58813e0c'
    '2cc59b2b-000f-5000-a000-1f3b6273446a'
  );
  console.log({ paymentId: paymentId });
  console.log({ paymentData: paymentData });

  const shopId = '253989';
  const secretKey = 'test_5OmBQDJ16mWQO8_9YoYAttxknu4jgar9uC1o-xwOGak';

  useEffect(() => {
    localStorage.setItem('paymentStatus', JSON.stringify(true));
    // setRedirect(true)
  }, []);

  // useEffect(() => {
  //   if (redirect) {
  //     setTimeout(() => {
  //       navigate("/landingPage")
  //       setRedirect(false);
  //     }, 100);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [redirect]);

  // curl https://api.yookassa.ru/v3/payments/{payment_id} \
  // -u <Идентификатор магазина>:<Секретный ключ>

  const getYandexPayment = async (paymentId) => {
    const payment_id = paymentId;
    const idempotenceKey = uuidv4(); // Generate a unique idempotenceKey

    // Combine shopId and secretKey, and encode as base64
    const credentials = btoa(`${shopId}:${secretKey}`);
    try {
      // const response = await axios.get(
      //   `https://api.yookassa.ru/v3/payments/${payment_id}`
      // );

      const response = await axios.post(
        `https://api.yookassa.ru/v3/payments/${payment_id}`,
        {
          headers: {
            Authorization: `Basic ${credentials}`,
            'Idempotence-Key': idempotenceKey, // Include the Idempotence-Key header
            // Other headers
          },
        }
      );
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
     
      console.log(message)
    }
  };

  const handleGetPayment = async () => {
    try {
      const data = await getYandexPayment(paymentId);
      console.log({ userData: data });
      if (data) {
        setPaymentData(data);
      }
    } catch (e) {
      console.log(e)
      // alert('Login failed');
    }
  };

  return (
    <>
      <div className="bg-white text-black flex flex-row justify-center items-center">
        Payment Sucessfull
      </div>
      {/* <button onClick={() => handleCheckout()}>Check out</button> */}
      {/* <button onClick={handleGetPayment}>Check out</button> */}
    </>
  );
};

export default PaySuccess;
