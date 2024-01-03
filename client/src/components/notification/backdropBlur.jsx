import React from 'react';
import { stock6Pay } from '../../assets/stocks';

const backdropBlur = () => {
  return (
    <div
      className="fixed inset-0 backdrop-filter backdrop-blur-sm bg-black bg-opacity-50
            flex justify-center items-center overflow-auto z-50"
    >
      <div className="w-40 h-40">
        <img
          className="mt-6 rounded-lg shadow-xl sm:mt-8 sm:h-64 sm:w-full sm:object-cover object-center lg:hidden"
          src={stock6Pay}
          alt="workation "
        />
      </div>
    </div>
  );
};

export default backdropBlur;
