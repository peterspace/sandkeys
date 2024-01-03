import React, { useState } from 'react';
import styles from '../../../style'
import {paid} from '../../../assets/img/features'
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
// import Modal from './Modal';

// const data={
//   style,
//   message,
//   logo
// }

const Promotions = ({ data }) => {
  const [isNotificationVisible, setIsNotificationVisible] = useState(true);

  // useEffect(() => {
  //   setIsNotificationVisible(true);
  // }, [isNotificationVisible]);

  const notificationInfoBox = (
    <div className="flex flex-col w-[200px] h-[230px] justify-center rounded-xl items-center shadow-lg overflow-hidden bg-gray-50">
      <div className={`w-[80px] p-2 rounded-xl ${styles.flexCenter}`}>
        <img src={paid} alt="star" className="object-contain" />
      </div>
      <h1 className={`gap-1 ${styles.paragraph2} ${styles.flexCenter}`}>
        {' '}
        {data.city}
        <br className="inline" />
        {/* <br className='hidden lg:inline'/> */}
        <span className={`${styles.paragraphGreen} ${styles.flexCenter}`}>
          {data.averagePrice}
        </span>
        <br className="inline" />
        {/* <br className='hidden lg:inline'/> */}
        <span>/ night average</span>
      </h1>

      {/* for application */}

      {/* <div className={`mt-2 ${styles.paragraphDimBlue} ${styles.flexCenter} cursor-pointer`}>
          <Link to={data.link}>See history</Link>
        </div> */}
      <a
        className={`mt-2 ${styles.paragraphLightBlue} ${styles.flexCenter} cursor-pointer`}
        // href={data.link}
        href="https://letsexchange.io/"
      >
        more...
      </a>
      {/* for testing */}
      {/* <button
          className={`mt-2 ${styles.paragraphDimBlue} ${styles.flexCenter} cursor-pointer`}
          //   onClick={setIsTokenModalVisible}
          onClick={()=>setIsNotificationVisible(true)}
        >
          See history
        </button> */}
      <button
        className={`mt-6 mb-6 py-2 px-3 ${styles.paragraph2Hover} bg-pIndigoButton rounded-[10px] hover:opacity-90 outline-none cursor-pointer ${styles}`}
        //   onClick={setIsTokenModalVisible}
        onClick={() => setIsNotificationVisible(false)}
      >
        Dismiss
      </button>
    </div>
  );

  return (
    <div
    // className={`flex flex-col rounded-xl ml-1 ${styles.flexCenter} outline-none`}
      className={`flex flex-col rounded-xl ml-1 ${styles.flexCenter} mb-2 outline-none`}
    >
        {isNotificationVisible && notificationInfoBox}
    </div>
  );
};

export default Promotions;
