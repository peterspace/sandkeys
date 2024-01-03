// import useAxios from '../../hooks/useAxios';
// import Skeleton from './Skeleton';

import { useState, useEffect } from 'react';

const availability = [
  {
    name: 'true',
  },
  {
    name: 'false',
  },
];

export const MarketsTitle = (props) => {
  const { mode } = props;
  return (
    <div
      className={`gap-6 flex flex-row font-light p-4 border border-indigo-600 border-b ${
        mode === true ? 'text-black' : 'text-white'
      }`}
    >
      <span className="ml-4 flex items-center w-[10%] text-center">
        {' '}
        <p className="font-semibold">{`Room Number`}</p>
      </span>
      <span className="flex items-center w-[10%] text-center">
        {' '}
        <p className="font-semibold">{`Availabile`}</p>
      </span>
      <span className={`flex items-center gap-1 w-[10%]`}>
        <p className="font-semibold">{`Type`}</p>
      </span>
      <div className="hidden sm:block w-[10%]">
        <p className="font-semibold">{`Check In`}</p>
      </div>
      <div className="hidden sm:block w-[10%]">
        <p className="font-semibold">{`Check Out`}</p>
      </div>
      <div className="hidden sm:block w-[10%]">
        <p className="font-semibold">{`Guests`}</p>
      </div>
      <div className="hidden sm:block w-[10%]">
        <p className="font-semibold">{`Price`}</p>
      </div>
      <div className="hidden sm:block w-[10%]">
        <p className="font-semibold">{`Facility`}</p>
      </div>
      <div className="hidden sm:block w-[10%]">
        <p className="font-semibold">{`Extra Information`}</p>
      </div>
      <div className="hidden sm:block w-[10%]">
        <p className="font-semibold">{`Action`}</p>
      </div>
    </div>
  );
};

export const Coin = (props) => {
  const { coin, saveRoom, mode } = props;
  
  return (
    <div
      className={`cursor-pointer gap-6 flex flex-row font-light p-4 border border-indigo-600 border-b  ${
        mode === true
          ? 'hover:bg-gray-100 hover:outline hover:outline-lightslategray-300 hover:outline-[1px]'
          : 'hover:bg-hoverDark hover:outline hover:outline-lightslategray-300 hover:outline-[1px]'
      }`}
      // onClick={() => setIdx(coin?.id)}
    >
      <div className="flex flex-row items-center gap-1 w-[10%]">
        <img className="w-6" src={coin.photos[0]} alt={coin.roomNumber} />
        <p className={`${mode === true ? 'text-black' : 'text-white'}`}>
          {coin.roomNumber}
        </p>
      </div>
      <span
        className={`flex items-center w-[10%] text-center ${
          mode === true ? 'text-black' : 'text-white'
        }`}
      >
        {coin.Availabile}
      </span>

      <span
        className={`flex items-center w-[10%] text-center ${
          mode === true ? 'text-black' : 'text-white'
        }`}
      >
        {coin.roomType}
      </span>
      <span
        className={`flex items-center w-[10%] text-center ${
          mode === true ? 'text-black' : 'text-white'
        }`}
      >
        {coin.checkIn}
      </span>
      <span
        className={`flex items-center w-[10%] text-center ${
          mode === true ? 'text-black' : 'text-white'
        }`}
      >
        {coin.checkOut}
      </span>
      <span
        className={`flex items-center w-[10%] text-center ${
          mode === true ? 'text-black' : 'text-white'
        }`}
      >
        {coin.maxGuests}
      </span>
      <span
        className={`flex items-center w-[10%] text-center ${
          mode === true ? 'text-black' : 'text-white'
        }`}
      >
        {coin.price}
      </span>
      <span
        className={`flex items-center w-[10%] text-center ${
          mode === true ? 'text-black' : 'text-white'
        }`}
      >
        {coin.perks}
      </span>
      <span
        className={`flex items-center w-[10%] text-center ${
          mode === true ? 'text-black' : 'text-white'
        }`}
      >
        {coin.extraInfo}
      </span>
      <span
        className={`flex items-center w-[10%] text-center ${
          mode === true ? 'text-black' : 'text-white'
        }`}
      >
        <div className="cursor-pointer flex flex-row text-center p-1 rounded-lg bg-blue-500" onClick={saveRoom}>update</div>
        <div className="cursor-pointer flex flex-row text-center p-1 rounded-lg bg-rose-500">delete</div>
      </span>
    </div>
    // </Link>
  );
};

const RoomsList = (props) => {
  const { response } = props;
  const mode = true;

  async function saveRoom(ev) {
    ev.preventDefault();
    const roomData = {
      placeId: placeId,
      title: title,
      city: city,
      address: address,
      description: description,
      checkIn: checkIn.toString(),
      checkOut: checkOut.toString(),
      extraInfo,
      paymentOptions: paymentOptions,
      type,
      addedPhotos,
      price,
      perks, // place facilities
      maxGuests,
      isAvailable,
      // unavailableDates,
      roomNumber,
      roomPerks, // room facilities
      roomType,
      rating,
    };
    console.log('roomData', roomData);
    if (id) {
      // update
      // await axios.put('/rooms', {
      //   id: id,
      //   ...roomData,
      // });
      // await axios.put('/places/rooms', {
      //   id,
      //   ...roomData,
      // });
      await axios.patch('/places/rooms', {
        roomId,
        ...roomData,
      });
      setRedirect(true);
    } else {
      // new place
      await axios.post('/places/rooms', roomData);
      setRedirect(true);
    }
  }


  return (
    <section
      className={`flex flex-row gap-[16px] mt-[8px] rounded-lg p-[16px] ${
        mode === true
          ? 'bg-gray-100 outline outline-lightslategray-300 outline-[1px]'
          : 'bg-bgDark outline outline-lightslategray-300 outline-[1px]'
      }`}
    >
      <div className={`flex mt-8 flex-col gap-[8px]`}>
        <div
          className={`mt-[8px] ml-[8px] text-lg font-sans font-bold inline-block ${
            mode === true ? 'text-mediumspringgreen' : 'text-white'
          }`}
        >
          {'Markets'}
        </div>
        {/* <div className="m-2 flex flex-col rounded-lg bg-white shadow-[0px_2px_4px_rgba(26,_47,_79,_0.2)] h-[50vh] py-4"> */}
        <div
          className={`m-2 flex flex-col rounded-lg shadow-[0px_2px_4px_rgba(26,_47,_79,_0.2)] h-[22vh] py-4 ${
            mode === true
              ? 'bg-white'
              : 'outline outline-lightslategray-300 outline-[1px]'
          }`}
        >
          <MarketsTitle mode={mode} />
          <div
            className={`flex w-full h-px ${
              mode === true ? 'bg-lightslategray-300' : 'bg-gray-100'
            }`}
          />
          <div className="overflow-scroll">
            {response &&
              response.map((coin) => (
                <Coin key={coin._id} saveRoom={saveRoom} coin={coin} mode={mode} />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomsList;
