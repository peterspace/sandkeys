import React from 'react';

import { destinations } from '../constants';

import DestinationsFeaturedCard from './DestinationsFeaturedCard';

const DestinationFeatured = (props) => {
  const { language } = props;


  return (
    <div>
      <div className="my-8 mx-8 px-12 lg:px-12 py-8">
        <h2 className="text-[24px] sm:text-[32px] md:text-[40px] font-bold text-gray-900 sm:mt-8">
          {' '}
          {
            language?.symbol === 'EN' && 'Popular destinations'
          }
          {
            language?.symbol === 'RU' && 'Популярные направления'
          }
          {
            language?.symbol === 'AR' && `الوجهات الشعبية`
          }
          
        </h2>
        <p className="mt-2 sm:mt-4 text-gray-600 md:mt-8">
          {' '}
          {
            language?.symbol === 'EN' && `A selection of beautiful cities with lots to see and explore`
          }
          {
            language?.symbol === 'RU' && `Подборка красивых городов, где есть что посмотреть и исследовать`
          }
          {
            language?.symbol === 'AR' && `مجموعة مختارة من المدن الجميلة التي بها الكثير لرؤيته واستكشافه`
          }
          
        </p>
        <div className="mt-6 grid gap-10 ss:grid-cols-3">
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

export default DestinationFeatured;
