import React from 'react';
import styles from '../style';

export default function DestinationsCard(props) {
  const { destination, language } = props;
  return (
    // <div className="flex items-center rounded-lg bg-white shadow-lg overflow-hidden">

    <div className="flex items-center rounded-lg bg-white shadow-lg overflow-hidden w-[274.62px] h-[106.67px]">
      <img
        className={`h-$ w-64 flex-shrink-0`}
        // className={`h-[106.67px] w-[106px]`}
        src={destination.imageUrl}
        alt={destination.imageAlt}
      />
      <div className="px-6 py-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-800 uppercase">
          {/* {destination.city} */}
          {language?.symbol === 'EN' && destination.city}
          {/* {
            language?.symbol === 'EN' && destination.cityEN
          } */}
          {
            language?.symbol === 'RU' && destination.cityRU
          }
          {
            language?.symbol === 'AR' && destination.cityAR
          }
        </h3>
        <p className="text-red-600">
        {language?.symbol === 'EN' &&
              `$${destination.averagePrice} / night`}
               {language?.symbol === 'RU' &&
              `$${destination.averagePrice} / ночь`}
               {language?.symbol === 'AR' &&
              `$${destination.averagePrice} / ليلة`}
        </p>
       
        <div className="mt-4">
          <a
            href="/"
            className="text-indigo-500 hover:text-indigo-400 font-semibold text-xs"
          >
            {language?.symbol === 'EN' &&
              `Explore ${destination.propertyCount} properties`}
              {language?.symbol === 'RU' &&
              `изучить ${destination.propertyCount} объектов недвижимости`}
            {language?.symbol === 'AR' &&
              `اكتشف ${destination.propertyCount} عقار`}
              

          </a>
        </div>
      </div>
    </div>
  );
}
