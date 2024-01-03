import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { destinations } from '../../constants';

export function DestinationsFeaturedCard(props) {
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
      className="self-stretch flex-1 rounded-xl bg-white shadow-[0px_2px_4px_rgba(28,_5,_77,_0.1),_0px_12px_32px_rgba(0,_0,_0,_0.05)] overflow-hidden flex flex-col items-start justify-start"
      onClick={() => {
        localStorage.setItem('city', JSON.stringify(destination?.name));
        setIsRedirect(true);
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000);
      }}
    >
      <img
        className="self-stretch relative max-w-full overflow-hidden h-[397px] shrink-0 object-cover"
        alt={destination.imageAlt}
        src={destination.imageUrl}
      />
      <div className="self-stretch bg-white flex flex-col items-start justify-start py-4 px-6 gap-[4px]">
        <div className="self-stretch flex flex-row items-start justify-start">
          <div className="flex-1 relative font-semibold">
            <span>{destination?.title}, </span>
            <span className="text-mediumslateblue">
              {language?.symbol === 'EN' && destination.city}
              {/* {language?.symbol === 'EN' && destination.cityEN} */}
              {language?.symbol === 'RU' && destination.cityRU}
              {language?.symbol === 'AR' && destination.cityAR}
            </span>
          </div>
          <div className="relative font-semibold text-right inline-block w-[72px] shrink-0">
            ${destination?.price}
          </div>
        </div>
        <div className="self-stretch relative text-base text-grey-400">
          {destination?.description}
        </div>
      </div>
    </div>
  );
}

const DestinationsFeatured = ({ title, cardRowAlignItems, language }) => {
  // const { setCity, destination, language } = props;

  const cardRowStyle = useMemo(() => {
    return {
      alignItems: cardRowAlignItems,
    };
  }, [cardRowAlignItems]);

  return (
    <div
      className="overflow-x-auto flex flex-col items-start justify-start py-10 px-16 box-border gap-[24px] text-left text-[24px] text-grey-600 font-body-large self-stretch"
      style={cardRowStyle}
    >
      <div className="self-stretch flex flex-row items-start justify-between">
        <b className="relative">
          <span>{`Find your next adventure with these `}</span>
          <span className="text-mediumslateblue">{title}</span>
        </b>
        <div className="shrink-0 flex flex-row items-center justify-start gap-[4px] text-right text-grey-300">
          <div className="relative">All</div>
          <img
            className="relative rounded w-8 h-8 overflow-hidden shrink-0 object-cover"
            alt=""
            src="/32--arrowright@2x.png"
          />
        </div>
      </div>
      <div className="self-stretch flex flex-col items-start justify-start gap-[40px] text-lg">
        <div className="self-stretch flex flex-row items-start justify-start gap-[40px]">
          {destinations.map((destination) => (
            <DestinationsFeaturedCard
              destination={destination}
              key={destination.city}
              language={language}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DestinationsFeatured;
