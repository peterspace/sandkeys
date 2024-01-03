import React, { useState } from 'react';
import styles from '../../style';

import { qrcode } from '../../assets/img/payments';
import { paid } from '../../assets/img/payments';
import { Link } from 'react-router-dom';
// import Modal from './Modal';

const NotificationCard = ({
  price,
  sender,
  payment,
  currency,
  setIsBookingVisible,
  setIsPaymentCompleted,
}) => {
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  const notificationContent = (
    <div>
      <div className='flex flex-col'>
        <h1 className={`gap-1 ${styles.paragraph2} ${styles.flexCenter}`}>
          {' '}
          Accepted Here
        </h1>
        <h1 className={`gap-1 ${styles.paragraph2} ${styles.flexCenter} mb-2`}>
          {' '}
         If you have paid, you may click "paid" to complete your booking
        </h1>
      </div>
       <div className="flex flex-col justify-center items-center ">
      <div className="px-3 py-3 bg-gray-50 border rounded-lg">
        <div className={`w-[300px] h-[300px] rounded-lg ${styles.flexCenter}`}>
          <img
            src={qrcode}
            alt="star"
            className="w-[200%] h-[200%] object-contain"
          />
        </div>
      </div>
      <button
        className={`mt-3 py-4 px-6 ${styles.paragraph2} bg-secondary rounded-lg cursor-pointer ${styles}`}
        onClick={() => {
          setIsNotificationVisible(false);
          setIsBookingVisible(false);
          setIsPaymentCompleted(true);
        }}
      >
        Paid
      </button>
    </div>

    </div>
   
  );

  const notificationInfoBox = (
    <div className="flex flex-col justify-center items-center px-1 py-1">
      <div className={`w-[100px] h-[100px] rounded-full ${styles.flexCenter}`}>
        <img src={paid} alt="star" className="w-[50%] h-[50%] object-contain" />
      </div>
      <div className='mb-6'>
        <h1 className="mt-6 text-sm font-bold text-gray-900 sm:mt-8">
          {' '}
          Payment confirmation takes
          {/* <br className='inline'/> */}
          <span className='text-red-600 ml-2'> 30 mins</span>
        </h1>
      </div>
      <div>
        <h1 className={`gap-1 ${styles.paragraph2} ${styles.flexCenter}`}>
          {' '}
          Click "Scan Code" to proceed
          {/* <br className="inline" />
          <span className={`${styles.paragraphGreen} ${styles.flexCenter}`}>
            {sender}
          </span> */}
        </h1>
      </div>
      <button
        className={`mt-6 py-4 px-6 ${styles.paragraph2} bg-secondary rounded-lg cursor-pointer ${styles}`}
        onClick={() => setIsNotificationVisible(true)}
      >
        Scan Code
        {/* Proceed */}
      </button>
    </div>
  );

  return (
    <div
      className={`flex flex-col p-6 rounded-[20px] ml-1  ${styles.flexCenter} bg-white border`}
    >
      <div className="w-[400px] h-[400px] mb-6">
        {isNotificationVisible ? notificationContent : notificationInfoBox}
        {/* {notificationContent} */}
      </div>

      {/* <div className={`${styles.flexCenter}`}>
        <h4 className="font-poppins font-semibold text-white text-[18px] leading-[23.4px] mt-3 mb-1">
          {title}
        </h4>
      </div> */}
    </div>
  );
};

export default NotificationCard;
