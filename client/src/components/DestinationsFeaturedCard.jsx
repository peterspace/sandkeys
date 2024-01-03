import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DestinationsFeaturedCard(props) {
  const { setCity, destination, language } = props;

  const [isRedirect, setIsRedirect] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isRedirect) {
      setTimeout(() => {
        navigate('/landingPage');
        setIsRedirect(false);
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRedirect]);

  return (
    <div
      className="transition-transform duration-300 hover:scale-110 cursor-pointer flex flex-col items-center rounded-lg bg-white shadow-lg overflow-hidden"
      onClick={() => {
        // setCity(destination?.name);
        localStorage.setItem('city', JSON.stringify(destination?.name));
        setIsRedirect(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }}
    >
      {/* <span className="text-[14px] text-red-600">{destination.city}</span> */}
      <img
        className={`h-$ w-100 flex-shrink-0`}
        src={destination.imageUrl}
        alt={destination.imageAlt}
      />
      <div className="px-6 py-4 mt-2 sm:mt-4 md:mt-8">
        <h3 className="text-[14px] md:text-[18px] lg:text-[32px] font-semibold text-blue-900 uppercase">
          {/* {destination.city} */}
          {language?.symbol === 'EN' && destination.city}
          {/* {language?.symbol === 'EN' && destination.cityEN} */}
          {language?.symbol === 'RU' && destination.cityRU}
          {language?.symbol === 'AR' && destination.cityAR}
        </h3>
      </div>
    </div>
  );
}
