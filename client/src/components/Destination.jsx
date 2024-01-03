import React from 'react';

import { ratesFeatured } from '../constants';
import DestinationsCard from './DestinationsCard';

const Destination = (props) => {
  const {language} = props
  return (
    <div>
      <div className="my-8 mx-8 px-12 lg:px-12 py-8">
        <h2 className="text-[24px] sm:text-[32px] md:text-[40px] font-bold text-gray-50 sm:mt-8">
          {' '}
          
          {
            language?.symbol === 'EN' && 'Average pricing'
          }
          {
            language?.symbol === 'RU' && 'Средняя цена'
          }
          {
            language?.symbol === 'AR' && `متوسط ​​التسعير`
          }
        </h2>
        <p className="mt-2 sm:mt-4 text-gray-100 md:mt-8">
     
          
          {
            language?.symbol === 'EN' && 'Enjoy your trip at an affordable rate'
          }
          {
            language?.symbol === 'RU' && 'Наслаждайтесь поездкой по доступной цене'
          }
          {
            language?.symbol === 'AR' && `استمتع برحلتك بسعر معقول`
          }
        </p>
        <div className="mt-6 grid gap-10 ss:grid-cols-3">
          {ratesFeatured.map((destination) => (
            <DestinationsCard
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

export default Destination;
