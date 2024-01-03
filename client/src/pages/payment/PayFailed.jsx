import { useEffect, useState } from 'react';

const PayFailed = () => {
  useEffect(() => {
    localStorage.setItem('paymentStatus', JSON.stringify(false));
  }, []);

  return (
    <>
      <div className="bg-white text-black flex flex-row justify-center items-center">
        Payment unsucessfull
      </div>
      {/* <button onClick={() => handleCheckout()}>Check out</button> */}
    </>
  );
};

export default PayFailed;
