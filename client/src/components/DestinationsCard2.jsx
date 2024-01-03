import React from 'react';
import styles from '../style';

export default function DestinationsCard({ destination }) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-white shadow-lg overflow-hidden">
      <div className="flex flex-row items-center">
        <img
          className={`h-$ w-32 flex-shrink-0`}
          src={destination.imageUrl}
          alt={destination.imageAlt}
        />
        <div className=" px-6 py-4">
         
          <p className="text-red-600">
          ${destination.averagePrice}
        </p>
        <p className="text-xs font-semibold text-gray-800 uppercase">
            {destination.city}
          </p>
          
        </div>
      </div>
      <div className="mt-2 mb-2 flex flex-col justify-center items-center">
      
        <div className="">
            <a
              href="/"
              className="text-indigo-500 hover:text-indigo-400 font-semibold text-sm"
            >
              {' '}
              Explore {destination.propertyCount} properties
            </a>
          </div>
        
      </div>
    </div>
  );
}
