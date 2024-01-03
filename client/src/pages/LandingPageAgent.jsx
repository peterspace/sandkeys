import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
import Image from '../Image.jsx';
// import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getPlaces } from '../services/apiService.js';
import PlacePage from './PlacePage.jsx';
import { selectCity, selectType } from '../redux/features/auth/bookingSlice.js';
import { differenceInCalendarDays, format } from 'date-fns';
import AddressLink from '../AddressLink.jsx';

import {
  getAllPlaces,
  getAllPlacesByCityAndType,
  getOnePlace,
  getUserPlaces,
  getPlaceRooms,
} from '../redux/features/place/placeSlice.js';

import {
  updateRoomAvailability,
  getAllAvailableRoomsByCityAndType,
  getOneRoom,
  getAllRooms,
  getUserRooms,
  getAllAvailableRooms,
} from '../redux/features/place/placeSlice.js';

import SearchMenu from '../components/header/SearchMenu.jsx';

const cities = [
  {
    name: 'dubai',
  },
  {
    name: 'moscow',
  },
  {
    name: 'saint-petersburg',
  },
];

const propertyTypes = [
  {
    name: 'hotel',
  },
  {
    name: 'hotelApart',
  },
  {
    name: 'apartment',
  },
  {
    name: 'resort',
  },
  // {
  //   name: 'villa',
  // },
];

const roomTypes = [
  {
    name: 'Standard',
  },
  {
    name: 'Studio',
  },
  {
    name: 'Superior',
  },
  {
    name: 'Delux',
  },
  {
    name: 'Suite',
  },
];

export default function LandingPageAgent() {
  // const navigate = useNavigate();
  const dispatch = useDispatch();

  const userLocal = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null;

  console.log({ user: userLocal });

  //=============={Places}==========================================
  const allPlacesL =
    useSelector((state) => state?.place?.fetchedAllPlaces) || null;
  console.log({ allPlacesL: allPlacesL });

  const allAvailablePlacesByCityAndTypeL =
    useSelector((state) => state?.place?.fetchedAllPlacesByCityAndType) || null;

  //==============={Rooms}==========================================

  const allRoomsL =
    useSelector((state) => state?.place?.fetchedAllRooms) || null;
  console.log({ allRoomsL: allRoomsL });

  const [newPlace, setNewPlace] = useState({});
  console.log({ newPlace: newPlace });
  const [showBooking, setShowBooking] = useState(false);
  const [showPlaceReady, setShowPlaceReady] = useState(false);
  const [showPlace, setShowPlace] = useState(false);

  // const propertyType =
  //   useSelector((state) => state?.booking?.type?.type) || null;
  // console.log({ propertyType: propertyType });

  // const roomType =
  //   useSelector((state) => state?.booking?.roomType?.type) || null;
  // console.log({ roomType: roomType });

  // const city = useSelector((state) => state?.booking?.city?.city) || null;
  // console.log({ city: city });

  // const maxGuests =
  //   useSelector((state) => state?.booking?.guestNumber?.guestNumber) || 1;
  // console.log({ maxGuests: maxGuests });

  // const startPrice = useSelector((state) => state?.booking?.startPrice?.startPrice) || null;
  // console.log({ startPrice: startPrice });

  // const endPrice = useSelector((state) => state?.booking?.endPrice?.endPrice) || null;
  // console.log({ endPrice: endPrice });

  const [checkIn, updateCheckIn] = useState('');
  console.log({ checkIn: checkIn });
  const [checkOut, updateCheckOut] = useState('');
  console.log({ checkOut: checkOut });

  const numberOfGuestsL = localStorage.getItem('maxGuests')
    ? JSON.parse(localStorage.getItem('maxGuests'))
    : 1;
  const [numberOfGuests, updatetNumberOfGuests] = useState(numberOfGuestsL);
  const maxGuests = Number(numberOfGuests);

  console.log({ maxGuests: maxGuests });
  // const [city, updateCity] = useState(cities[0].name);
  // const [city, updateCity] = useState(cities[0].name);
  const cityL = localStorage.getItem('city')
    ? JSON.parse(localStorage.getItem('city'))
    : cities[0].name;
  const [city, updateCity] = useState(cityL);
  console.log({ city: city });

  const typeL = localStorage.getItem('type')
    ? JSON.parse(localStorage.getItem('type'))
    : propertyTypes[0].name;
  const [type, updateType] = useState(typeL);
  const propertyType = type;
  console.log({ propertyType: propertyType });

  const roomTypeL = localStorage.getItem('roomType')
    ? JSON.parse(localStorage.getItem('roomType'))
    : roomTypes[0].name;
  const [roomType, updateRoomType] = useState(roomTypeL);
  console.log({ roomType: roomType });

  const [filteredData, setFilteredData] = useState([]);

  console.log({ filteredData: filteredData });

  // useEffect(() => {
  //   setTimeout(() => {
  //     updateCity(cities[2].name);
  //   }, 200);
  // }, []);

  useEffect(() => {
    setTimeout(() => {
      if (!cityL) {
        updateCity(cities[2].name);
      } else {
        updateCity(cityL);
        // updateCity(cityL);
        // filterUserData();
      }
    }, 200);
  }, []);

  useEffect(() => {
    localStorage.setItem('city', JSON.stringify(city));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  useEffect(() => {
    localStorage.setItem('propertyType', JSON.stringify(type));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    localStorage.setItem('roomType', JSON.stringify(roomType));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomType]);

  useEffect(() => {
    localStorage.setItem('maxGuests', JSON.stringify(maxGuests));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxGuests]);

  useEffect(() => {
    dispatch(getAllRooms());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (showPlaceReady === true) {
      console.log('generatedPlace', newPlace);
      setShowPlace(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPlace]);

  // const handleSelect = () => {
  //   if (showBooking === true) {
  //     let id = newPlace._id;
  //     console.log('newPlaceId', id);
  //     console.log('generatedPlace', newPlace);
  //     // navigate(`/place/${id}`);
  //     // setShowPlace(true);
  //     setShowBooking(false);
  //     setShowPlace(true);
  //   }
  // };

  // useEffect(() => {
  //   if (allRoomsL !== undefined) {
  //     filterUserData();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [city, propertyType, roomType, maxGuests, startPrice, endPrice]);

  useEffect(() => {
    if (allRoomsL !== undefined) {
      filterUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, propertyType, roomType, numberOfGuests]);

  //==={if refresh}
  // useEffect(() => {
  //   if (allRoomsL !== undefined) {
  //     filterUserData();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (!city) {
  //       filterUserData();
  //     }
  //   }, 200);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (city && !filteredData) {
  //       filterUserData();
  //     }
  //   }, 200);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  function filterUserData() {
    const userData = allRoomsL?.filter((item) => {
      return (
        item.city.toLowerCase().includes(city?.toLowerCase()) &&
        (item.type === propertyType || '') &&
        (item.roomType === roomType || '') &&
        (item.maxGuests === maxGuests || 1) &&
        item.isAvailable === true
        // ((Number(item.price) >= startPrice && Number(item.price) <= endPrice) ||
        //   '' ||
        //   null) // price range
      );
    });
    setFilteredData(userData);
  }

  // let lisbonTime = new Date().toLocaleString("en-Us",{timeZone:'Europe/Lisbon', timeStyle:"medium", hourCycle:"h24"}) // GMT reference
  // let londonTime = new Date().toLocaleString("en-Us",{timeZone:'Europe/London', timeStyle:"medium", hourCycle:"h24"})  // London is 1 hour ahead of GMt in summer (From April)

  // let russiaTime = new Date().toLocaleString("en-Us",{timeZone:"Europe/Moscow", timeStyle:"medium", hourCycle:"h24"})
  // let dubaiTime = new Date().toLocaleString("en-Us",{timeZone:"Asia/Dubai", timeStyle:"medium", hourCycle:"h24"})
  // let checkIn = "2023-04-01"

  return (
    <>
      <SearchMenu
        updateCheckIn={updateCheckIn}
        updateCheckOut={updateCheckOut}
        updatetNumberOfGuests={updatetNumberOfGuests}
        updateCity={updateCity}
        updateType={updateType}
        updateRoomType={updateRoomType}
        cities={cities}
        propertyTypes={propertyTypes}
        roomTypes={roomTypes}
        checkIn={checkIn}
        checkOut={checkOut}
        numberOfGuests={numberOfGuests}
        city={city}
        type={type}
        roomType={roomType}
        setShowPlace={setShowPlace}
        // setShowPlaceReady={setShowPlaceReady}
      />
      {showPlace ? (
        <PlacePage
          place={newPlace}
          checkIn={checkIn}
          checkOut={checkOut}
          guestNumber={numberOfGuests}
          guestCity={city}
          // type={type}
          roomType={roomType}
        />
      ) : (
        <>
          {' '}
          {filteredData && filteredData.length < 1 ? (
            <div className="py-2 mt-8 mb-8 flex flex-row justify-center items-center">
              <div className="text-gray-900 text-base">
                No {roomType} is available in {city} at the moment
              </div>
            </div>
          ) : (
            <div className="ml-8 mt-8 mb-8">
              <h1 className="text-4xl">
                {roomType}'s in {city}
              </h1>
            </div>
          )}
          {/* <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-3"> */}
          <div className="mt-8 w-[80%]">
            {filteredData &&
              filteredData?.map((place, index) => (
                <div
                  className="flex cursor-pointer gap-4 p-4 w-[900px]"
                  key={index}
                  onClick={() => {
                    setNewPlace(place);
                    // setShowPlace(true);
                    setShowBooking(true);
                  }}
                >
                  {/* <Link to={'/place/' + place._id} key={index}> */}
                  <div className="flex flex-row gap-8 px-6 py-6 bg-gray-50 rounded-lg ml-8 w-[900px]">
                    {/* Section1: Photo */}
                    <section className="bg-gray-500 mb-2 rounded-2xl flex w-[30%] h-[100px]">
                      <>
                        {/* <div className="relative">
                      <div class="fixed h-32 w-32 bg-blue-700">
                          <div class="absolute top-0 right-0 h-16 w-16">
                            03
                          </div>
                        </div>
                        
                      </div> */}
                        <div className="relative">
                          {/* <div className="absolute top-0 right-0 z-2 "> */}
                          <div className="absolute top-[5px] right-[5px] z-2 ">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6 stroke-yellow-500 fill-gray-200 hover:fill-yellow-500"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                              />
                            </svg>
                          </div>

                          {place.photos?.[0] && (
                            <Image
                              className="rounded-2xl object-cover aspect-square"
                              src={place.photos?.[0]}
                              alt=""
                            />
                          )}
                        </div>
                      </>
                    </section>
                    {/* Section2: Info*/}
                    <section className="flex flex-col justify-start items-start gap-3 w-[50%]">
                      <div className="flex gap-2">
                        <div className="justify-start items-start h-[14px]">
                          <span className="text-xl font-bold text-gray-600">
                            {place.title}
                          </span>
                        </div>

                        <div className="flex justify-start items-start h-[14px] mt-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-[11.65px] h-[11.65px] stroke-yellow-500 fill-yellow-500 hover:stroke-black"
                          >
                            <path d="M23.555 8.729a1.505 1.505 0 0 0-1.406-.98h-6.087a.5.5 0 0 1-.472-.334l-2.185-6.193a1.5 1.5 0 0 0-2.81 0l-.005.016-2.18 6.177a.5.5 0 0 1-.471.334H1.85A1.5 1.5 0 0 0 .887 10.4l5.184 4.3a.5.5 0 0 1 .155.543l-2.178 6.531a1.5 1.5 0 0 0 2.31 1.684l5.346-3.92a.5.5 0 0 1 .591 0l5.344 3.919a1.5 1.5 0 0 0 2.312-1.683l-2.178-6.535a.5.5 0 0 1 .155-.543l5.194-4.306a1.5 1.5 0 0 0 .433-1.661z"></path>
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-[11.65px] h-[11.65px] stroke-yellow-500 fill-yellow-500 hover:stroke-black"
                          >
                            <path d="M23.555 8.729a1.505 1.505 0 0 0-1.406-.98h-6.087a.5.5 0 0 1-.472-.334l-2.185-6.193a1.5 1.5 0 0 0-2.81 0l-.005.016-2.18 6.177a.5.5 0 0 1-.471.334H1.85A1.5 1.5 0 0 0 .887 10.4l5.184 4.3a.5.5 0 0 1 .155.543l-2.178 6.531a1.5 1.5 0 0 0 2.31 1.684l5.346-3.92a.5.5 0 0 1 .591 0l5.344 3.919a1.5 1.5 0 0 0 2.312-1.683l-2.178-6.535a.5.5 0 0 1 .155-.543l5.194-4.306a1.5 1.5 0 0 0 .433-1.661z"></path>
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-[11.65px] h-[11.65px] stroke-yellow-500 fill-yellow-500 hover:stroke-black"
                          >
                            <path d="M23.555 8.729a1.505 1.505 0 0 0-1.406-.98h-6.087a.5.5 0 0 1-.472-.334l-2.185-6.193a1.5 1.5 0 0 0-2.81 0l-.005.016-2.18 6.177a.5.5 0 0 1-.471.334H1.85A1.5 1.5 0 0 0 .887 10.4l5.184 4.3a.5.5 0 0 1 .155.543l-2.178 6.531a1.5 1.5 0 0 0 2.31 1.684l5.346-3.92a.5.5 0 0 1 .591 0l5.344 3.919a1.5 1.5 0 0 0 2.312-1.683l-2.178-6.535a.5.5 0 0 1 .155-.543l5.194-4.306a1.5 1.5 0 0 0 .433-1.661z"></path>
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-[11.65px] h-[11.65px] stroke-yellow-500 fill-yellow-500 hover:stroke-black"
                          >
                            <path d="M23.555 8.729a1.505 1.505 0 0 0-1.406-.98h-6.087a.5.5 0 0 1-.472-.334l-2.185-6.193a1.5 1.5 0 0 0-2.81 0l-.005.016-2.18 6.177a.5.5 0 0 1-.471.334H1.85A1.5 1.5 0 0 0 .887 10.4l5.184 4.3a.5.5 0 0 1 .155.543l-2.178 6.531a1.5 1.5 0 0 0 2.31 1.684l5.346-3.92a.5.5 0 0 1 .591 0l5.344 3.919a1.5 1.5 0 0 0 2.312-1.683l-2.178-6.535a.5.5 0 0 1 .155-.543l5.194-4.306a1.5 1.5 0 0 0 .433-1.661z"></path>
                          </svg>
                        </div>
                      </div>
                      <div className="flex flex-row">
                        <span className="text-blue-500">
                          <AddressLink>
                            {place.address} {place.city}
                          </AddressLink>
                        </span>
                      </div>

                      <span className="text-[12px] text-gray-900">
                        2.1 miles from centre
                      </span>
                      <span className="text-xs font-semibold text-gray-900">
                        {place.roomType}
                      </span>
                      <span className="text-xs font-semibold text-green-600">
                        Free cancellation. no prepayment needed
                      </span>
                      {/* <span className="text-xs text-green-600">
                        You can cancel later, so lock in this great price today.
                      </span> */}
                      <span className="text-xs font-semibold text-red-600">
                        Only 2 rooms left at this price on our site
                      </span>
                    </section>
                    {/* Section3: Reviews and Price */}
                    <section className="flex flex-col gap-3 w-[20%]">
                      <div className="flex flex-row gap-2">
                        <div className="flex flex-col">
                          <div className="text-base font-semibold text-gray-900">
                            Review Score
                          </div>
                          <div className="text-xs text-gray-700">
                            1,250 views
                          </div>
                        </div>
                        <div className="px-2 py-2 bg-blue-700 text-white rounded-r-xl rounded-t-lg">
                          8.0
                        </div>
                      </div>

                      <div className=" justify-start items-start px-1.5 py-1.5 hover:rounded-full hover:bg-gray-200">
                        {/* <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-[14px] h-[14px] stroke-yellow-500 fill-yellow-500 hover:stroke-black"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                          />
                        </svg> */}
                      </div>

                      <div className="flex flex-col">
                        <div className="text-gray-900 text-xs">
                          1 night, {place?.maxGuests} adults
                        </div>
                        <div className="text-gray-900 text-2xl">
                          RUB {place?.price}
                        </div>
                        <div className="text-xs text-gray-700">
                          includes taxes and charges
                        </div>
                      </div>

                      {showBooking && (
                        <div className=" bg-blue-500 rounded-lg px-2 py-2 w-[150px] flex flex-row hover:opacity-90 mt-4">
                          <div
                            className="text-white"
                            // onClick={() => handleSelect()}
                            onClick={() => {
                              setShowPlace(true);
                              setShowBooking(false);
                            }}
                          >
                            See availability
                          </div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6 stroke-white"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8.25 4.5l7.5 7.5-7.5 7.5"
                            />
                          </svg>
                        </div>
                      )}
                    </section>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
      <>
        {/* <h2 className="text-xl text-gray-900">roomType: {roomType?.type}</h2>
        <h2 className="text-xl text-gray-900">guestCity: {guestCity?.city}</h2> */}
        {/* <div className='flex flex-row justify-start items-start gap-1 object-contain'>
        <div className="flex gap-1 items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
          />
        </svg>
        {format(new Date(checkIn), 'yyyy-MM-dd')}
      </div>
        </div>
        <h2 className="text-xl text-gray-900">Time in Portugal (GMT): {lisbonTime}</h2>
        <h2 className="text-xl text-gray-900">Time in London: {londonTime}</h2>
        <h2 className="text-xl text-gray-700">Time in Russia: {russiaTime}</h2>
        <h2 className="text-xl text-gray-500">Time in Dubai: {dubaiTime}</h2> */}
      </>
    </>
  );
}
