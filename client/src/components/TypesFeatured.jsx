import React from 'react';

import { typesFeatured } from '../constants';

import TypesFeaturedCard from './TypesFeaturedCard';

const TypesFeatured = (props) => {
  const {language} = props
  return (
    <div>
      <div className="my-8 mx-8 px-12 lg:px-12 py-8">
        <h2 className="text-[24px] sm:text-[32px] md:text-[40px] font-bold text-gray-900 sm:mt-8">
          {' '}
          
          {
            language?.symbol === 'EN' && 'Popular reservations'
          }
          {
            language?.symbol === 'RU' && 'Популярные бронирования'
          }
          {
            language?.symbol === 'AR' && `التحفظات الشعبية`
          }
        </h2>
        <p className="mt-2 sm:mt-4 text-gray-600 md:mt-8">
          
          {
            language?.symbol === 'EN' && 'Explore our reservations'
          }
          {
            language?.symbol === 'RU' && 'Изучите наши бронирования'
          }
           {
            language?.symbol === 'AR' && `استكشف تحفظاتنا`
          }
        </p>
        <div className="mt-6 grid gap-10 ss:grid-cols-3">
          {typesFeatured.map((destination) => (
            <TypesFeaturedCard
              destination={destination}
              key={destination.place}
              language={language}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypesFeatured;
