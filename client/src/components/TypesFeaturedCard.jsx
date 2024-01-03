import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TypesFeaturedCard(props) {
  // const { setType, destination } = props;
  const {destination, language} = props

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
      className="transition-transform duration-300 hover:scale-110 cursor-pointer flex flex-col items-center overflow-hidden"
      onClick={() => {
        // setType(destination?.type);
        localStorage.setItem('type', JSON.stringify(destination?.type));
        setIsRedirect(true);
      }}
    >
      <div className="rounded-lg bg-white shadow-lg overflow-hidden">
        <img
          className={`h-$ w-100 flex-shrink-0`}
          src={destination.imageUrl}
          alt={destination.imageAlt}
        />
      </div>
      <div className="px-6 py-4 mt-2 sm:mt-4 md:mt-8">
        <h3 className="text-[14px] md:text-[18px] lg:text-[32px] font-semibold text-indigo-500">
          {/* {destination.place} */}
          {language?.symbol === 'EN' && destination.place}
          {/* {
            language?.symbol === 'EN' && destination.placeEN
          } */}
          {
            language?.symbol === 'RU' && destination.placeRU
          }
          {
            language?.symbol === 'AR' && destination.placeAR
          }
        </h3>
      </div>
    </div>
  );
}
