import { useEffect, useState } from 'react';
import Location1 from './Location1';
import Date1 from './Date1';
import DropDownBox from '../../components/DropDownBox';

const SearchBar = (props) => {
  const {
    updatetNumberOfGuests,
    updateCity,
    updateType,
    updateRoomType,
    cities,
    propertyTypes,
    roomTypes,
    numberOfGuests,
    city,
    type,
    roomType,
    setShowPlace,
    handleSearch,
  } = props;
  return (
    <div className="rounded-md bg-grey-200 box-border overflow-hidden flex flex-row items-end justify-between py-5 px-[50px] text-left text-[24px] text-white font-roboto self-stretch border-[1px] border-solid border-lavender">
      <div className="flex flex-row justify-between items-center w-full h-[74px]">
        <div className="flex flex-col gap-2">
          <div className="relative text-base">Where</div>
          <DropDownBox item={city} setItem={updateCity} options={cities} />
        </div>
        <div className="flex flex-col gap-2">
          <div className="relative text-base">Type</div>
          <DropDownBox
            item={type}
            setItem={updateType}
            options={propertyTypes}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="relative text-base">Room</div>
          <DropDownBox
            item={roomType}
            setItem={updateRoomType}
            options={roomTypes}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="relative text-base">Adults</div>
          <input
            type="number"
            value={numberOfGuests}
            className="bg-grey-200  text-gray-500 border border-lavender hover:text-gray-900 focus:ring-1 focus:outline-none focus:ring-blue-500 px-2 py-1"
            onChange={(ev) => {
              updatetNumberOfGuests(ev.target.value); // dispatch also
            }}
          />
        </div>
        {/* redirect to landing page */}
        <div className="flex flex-col gap-2">
          <div className="cursor-pointer relative text-base text-blue-400 hover:text-blue-600">Advance filter</div>
          <div
          className="cursor-pointer rounded-lg bg-darkslategrey-100 overflow-hidden flex flex-row items-center justify-center p-2 border-[1px] border-solid border-lavender"
          onClick={handleSearch}
        >
          <div className="relative text-base">Search</div>
        </div>
        </div>
       
      </div>
    </div>
  );
};

export default SearchBar;
