import { useEffect, useState } from 'react';

import Location1 from './Location1';
import Date1 from './Date1';
import DropDownBox from '../../components/DropDownBox';

const SideFilter = (props) => {
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
    <div className="bg-grey-200 box-border overflow-hidden flex flex-col items-start gap-8 py-5 px-[50px] text-left text-[24px] text-white font-roboto self-stretch border-[1px] border-solid border-lavender h-full">
      <div className="relative w-[124px] h-[74px]">
        <div className="absolute top-[0px] left-[1px] flex flex-row items-center justify-center">
          <div className="flex flex-col gap-2">
            <div className="relative">Where</div>
            <DropDownBox item={city} setItem={updateCity} options={cities} />
          </div>
        </div>
      </div>
      {/* <div className="relative w-[154px] h-[78px]">
        <div className="absolute top-[0px] left-[0px] flex flex-row items-center justify-center">
          <div className="relative">When</div>
        </div>
        <Date1
          calendarWithDates="/32--calendar-with-dates@2x.png"
          chevronDown="/chevrondown@2x.png"
          datePosition="absolute"
          dateTop="38px"
          dateLeft="0px"
        />
      </div> */}
      <div className="relative w-[90px] h-[74px]">
        <div className="absolute top-[0px] left-[1px] flex flex-row items-center justify-center">
          <div className="flex flex-col gap-2">
            <div className="relative">Type</div>
            <DropDownBox
              item={type}
              setItem={updateType}
              options={propertyTypes}
            />
          </div>
        </div>
      </div>
      <div className="relative w-[129px] h-[74px]">
        <div className="absolute top-[0px] left-[1px] flex flex-row items-center justify-center">
          <div className="flex flex-col gap-2">
            <div className="relative">Room</div>
            <DropDownBox
              item={roomType}
              setItem={updateRoomType}
              options={roomTypes}
            />
          </div>
        </div>
      </div>
      <div className="relative w-[105px] h-[74px]">
        <div className="absolute top-[0px] left-[1px] flex flex-row items-center justify-center">
          <div className="flex flex-col gap-2">
            <div className="relative">Adults</div>
            <input
              type="number"
              value={numberOfGuests}
              className="bg-grey-200  text-gray-500 border border-lavender hover:text-gray-900 focus:ring-1 focus:outline-none focus:ring-blue-500 px-2 py-1"
              onChange={(ev) => {
                updatetNumberOfGuests(ev.target.value); // dispatch also
              }}
            />
          </div>
        </div>
      </div>
      <div
        className="cursor-pointer rounded-lg bg-darkslategrey-100 overflow-hidden flex flex-row items-center justify-center p-2 border-[1px] border-solid border-lavender"
        onClick={handleSearch}
      >
        <div className="relative">Search</div>
      </div>
    </div>
  );
};

export default SideFilter;
