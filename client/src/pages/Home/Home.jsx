import React, { useState } from 'react';
import { GovercityBlue } from '../img/gologos';
import { stock6Pay } from '../img/stocks';
import { destinations } from '../constants';
import DestinationsCard from './DestinationsCard';
import CarouselPromotions from './sliders/CarouselPromotions';
import CarouselWalletOptions from './sliders/CarouselWalletOptions';
import CarouselServices from './sliders/CarouselServices';

const Home = () => {
  const [showServices, setShowServices] = useState(false);
  const [showPromotions, setShowPromotions] = useState(false);
  const [showWalletsOptions, setShowWalletsOptions] = useState(false);

  return (
    <div>
      <div className="bg-gray-100 grid lg:grid-cols-2 2xl:grid-cols-5">
        <div className="px-8 py-12 text-center max-w-md mx-auto sm:max-w-xl lg:px-12 lg:py-24 lg:max-w-full xl:mr-0 2xl:col-span-2">
          <div className="xl:max-w-xl">
            <img className="h-10" src={GovercityBlue} alt="logo " />
            <img
              className="mt-6 rounded-lg shadow-xl sm:mt-8 sm:h-64 sm:w-full sm:object-cover object-center lg:hidden"
              src={stock6Pay}
              alt="workation "
            />
            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:mt-8 sm:text-4xl lg:text-3xl xl:text-4xl">
              {' '}
              You can work from anywhere.
              <br className="inline" />
              {/* <br className='hidden lg:inline'/> */}
              <span className="text-indigo-500">Take advantage of it.</span>
            </h1>
            <p className="mt-2 text-gray-600 sm:mt-4 sm:text-xl">
              Work station helps you find work-freindly rentals in beautiful
              locations so you can enjoy some nice weather even when you're not
              on vacation.
            </p>

            <div className="mt-4 space-x-1 sm:mt-6">
              <a
                className="btn btn-primary shadow-lg hover:-translate-y-0.5 transform transition"
                href="/"
              >
                Book your reservation
              </a>
              <a className="btn btn-secondary" href="/">
                Learn More
              </a>
            </div>
          </div>
        </div>
        <div className="hidden relative lg:block 2xl:col-span-3">
          <img
            className="absolute inset-0 w-full h-full object-cover object-center"
            src={stock6Pay}
            alt="workation "
          />
        </div>
      </div>
      <div className="max-w-md sm:max-w-xl lg:max-w-6xl mx-auto px-8 lg:px-12 py-8">
        <h2 className="text-xl text-gray-900"> Popular destinations</h2>
        <p className="mt-2 text-gray-600">
          {' '}
          A selection of great work-friendly cities with lots to see and explore
        </p>
        <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {/* <DestinationsCard destination={destinations[1]} /> */}
          {destinations.map((destination) => (
            <DestinationsCard
              destination={destination}
              key={destination.city}
            />
          ))}
        </div>
      </div>

      <section className=" flex-flex-row justify-center items-center bg-gray-200 rounded-lg  mt-8 px- lg:px-12">
        <span className="mb-3 pb-2 flex flex-row gap-3 py-4 px-4 ">
          <h3 className="font-helvetica">Services</h3>
          <span
            className={`w-[100px] h-[100px] rounded-xl`}
            onClick={() => {
              setShowServices((prev) => !prev);
            }}
          >
            {/* {showServices?(<img src={chevronUp} alt="star" className="w-[50%] h-[50%] object-contain" />):( <img src={chevronDown} alt="star" className="w-[50%] h-[50%] object-contain" />)} */}
            {showServices ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="#343261"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 15l7-7 7 7"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="#343261"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            )}
          </span>
        </span>

        {showServices && (
          <div className="mb-6">
            <CarouselServices list={destinations} />
          </div>
        )}
      </section>

      {/* New Wallet Options */}

      <section className=" flex-flex-row justify-center items-center bg-gray-200 rounded-lg  mt-8 px- lg:px-12">
        <span className="mb-3 pb-2 flex flex-row gap-3 py-4 px-4 ">
          <h3 className="font-helvetica">Options</h3>
          <span
            className={`w-[100px] h-[100px] rounded-xl`}
            onClick={() => {
              setShowWalletsOptions((prev) => !prev);
            }}
          >
            {/* {showServices?(<img src={chevronUp} alt="star" className="w-[50%] h-[50%] object-contain" />):( <img src={chevronDown} alt="star" className="w-[50%] h-[50%] object-contain" />)} */}
            {showWalletsOptions ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="#343261"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 15l7-7 7 7"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="#343261"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            )}
          </span>
        </span>

        {showWalletsOptions && (
          <div className="mb-6">
            <CarouselWalletOptions list={destinations} />
          </div>
        )}
      </section>

      {/* New Promotions With Carosel */}

      <section className=" flex-flex-row justify-center items-center bg-gray-200 rounded-lg  mt-8 px- lg:px-12">
        <span className="mb-3 pb-2 flex flex-row gap-3 py-4 px-4 ">
          <h3 className="font-helvetica">Promotions</h3>
          <span
            className={`w-[100px] h-[100px] rounded-xl`}
            onClick={() => {
              setShowPromotions((prev) => !prev);
            }}
          >
            {/* {showServices?(<img src={chevronUp} alt="star" className="w-[50%] h-[50%] object-contain" />):( <img src={chevronDown} alt="star" className="w-[50%] h-[50%] object-contain" />)} */}
            {showPromotions ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="#343261"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 15l7-7 7 7"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="#343261"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            )}
          </span>
        </span>

        {showPromotions && (
          <div className="mb-6">
            <CarouselPromotions list={destinations} />
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
// w-[200px] h-[200px]

// const [toggle, setToggle] = useState(false);

// onClick={() => {
//   setToggle((prev) => !prev);
//     setTimeout(() => {
//         setToggle((prev) => !prev);
//     }, 1000);
// }}
