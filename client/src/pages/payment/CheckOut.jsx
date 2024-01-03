import { useState } from 'react';

import Style from './payment.module.css';

// import spatula from './assets/spatula.jpg';
import StripeContainer from './StripeContainer';

export default function CheckOut() {
  const [showItem, setShowItem] = useState(false);
  return (
    <div className={Style.App}>
      <h1>Crib Bookings</h1>
      {showItem ? (
        <StripeContainer />
      ) : (
        <div className="flex flex-col justify-center items-center mb-8 gap-4">
			{/* display booking amount */}
			{/* {booking?.totalPrice} */}
          <h3>$10.00</h3>
          {/* <img src={spatula} alt="Spatula" /> */}
          {/* <button className='flex' onClick={() => setShowItem(true)}>Pay</button> */}
          <div
            className="transition-transform duration-300 hover:scale-125 cursor-pointer flex flex-row justify-center items-center p-2 rounded-lg bg-gray-300 hover:bg-gray-200 gap-2 w-[100px]"
            onClick={() => setShowItem(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
              />
            </svg>
            Pay
          </div>
        </div>
      )}
    </div>
  );
}
