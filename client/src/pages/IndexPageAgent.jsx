import { useState, useEffect } from 'react';

import Destination from '../components/Destination.jsx';
import DestinationFeatured from '../components/DestinationFeatured.jsx';
import TypesFeatured from '../components/TypesFeatured.jsx';
// import SearchEngine from './Filters/searchEngine.jsx';

//Note: alwways set fetched redux states after loggin in with a getUser api call and set states
export default function IndexPageAgent() {

  const [city, setCity]= useState("")

  console.log({city: city})


  return (
    <div className="flex flex-col gap-3 mt-8">
      <>
        {/* <div className="flex justify-center items-center">
          <SearchEngine />
        </div> */}
        <div className="flex justify-center items-center">
          <DestinationFeatured 
          setCity={setCity}
          />
        </div>
        <div className="flex justify-center items-center">
          <TypesFeatured />
        </div>

        <div className="flex justify-center items-center">
          <Destination />
        </div>

        <div>
          {/* <h1 className="flex flex-col gap-3 justify-center items-center ">
          ActiveUser: {activeOwnerId?.owner}
            </h1> */}
          {/* <h1 className="flex flex-col gap-3 justify-center items-center ">
              Booking Information
            </h1>
            <h2 className="text-xl text-gray-900">
              ActiveUser: {activeUser?.name}
            </h2>
            <h2 className="text-xl text-gray-900">
              CheckIn: {checkIn?.checkIn}
            </h2>
            <h2 className="text-xl text-gray-900">
              CheckOut: {checkOut?.checkOut}
            </h2> */}
          {/* <h2 className="text-xl text-gray-900">
              GuestNumber: {guestNumber?.guestNumber}
            </h2> */}
          {/* <h2 className="text-xl text-gray-900">
              GuestName: {guestName?.guestName}
            </h2>
            <h2 className="text-xl text-gray-900">
              roomType: {roomType?.type}
            </h2>
            <h2 className="text-xl text-gray-900">
              guestCity: {guestCity?.city}
            </h2> */}
        </div>
        {}
      </>
    </div>
  );
}
