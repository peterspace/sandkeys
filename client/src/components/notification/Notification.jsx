import React, { useState } from 'react';
import NotificationCard from './NotificationCard';
import Modal from './Modal';


const Notification = ({price,
  sender,
  payment,
  currency, setIsBookingVisible, visible, setIsPaymentCompleted}) => {
  return (
    <>
      <button
        className="btn btn-primary shadow-lg hover:-translate-y-0.5 transform transition"
        onClick={() => {
          // setIsVisible(true);
          setIsBookingVisible(false);
        }}
      >
        Back
      </button>

      <Modal
        visible={visible}
        setVisible={setIsBookingVisible}
        title="Payment"
      >
        <div className='mb-6'>
        <NotificationCard
          price={price} sender={sender} payment={payment} currency={currency}
          setIsTokenModalVisible={setIsBookingVisible}
          setIsBookingVisible={setIsBookingVisible}
          setIsPaymentCompleted={setIsPaymentCompleted}
        />

        </div>
       
      </Modal>
    </>
  );
};

export default Notification;


