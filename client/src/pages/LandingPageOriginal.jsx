import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
// import { Link } from 'react-router-dom';
import ImageLanding from '../ImageLanding.jsx';
// import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getPlaces } from '../services/apiService.js';
import PlacePage from './PlacePage.jsx';
import { selectCity, selectType } from '../redux/features/auth/bookingSlice.js';
import { differenceInCalendarDays, format } from 'date-fns';
import AddressLink from '../AddressLink.jsx';
import ListingCard from '../components/ui/listings/ListingCard.jsx';
import Container from '../components/ui/Container.jsx';
import ClientOnly from '../components/ui/ClientOnly.jsx';

import {
  updateRoomAvailability,
  getAllAvailableRoomsByCityAndType,
  getOneRoom,
  getAllRooms,
} from '../redux/features/place/placeSlice.js';

import SearchMenu from '../components/header/SearchMenu.jsx';
import {
  updateRequest,
  fetchRequest,
  postRequest,
  deletRequest,
} from '../hooks/api.js';

const cities = [
  {
    name: 'dubai',
    cityEN: 'Moscow',
    cityRU: 'Дубай',
    cityAR: 'موسكو',
  },
  {
    name: 'moscow',
    cityEN: 'Moscow',
    cityRU: 'Москва',
    cityAR: 'موسكو',
  },
  {
    name: 'saint-petersburg',
    cityEN: 'Saint Petersburg',
    cityRU: 'Санкт-Петербург',
    cityAR: 'سان بطرسبورج',
  },
];

const propertyTypes = [
  {
    name: 'hotel',
    placeEN: 'Hotel',
    placeRU: 'Гостиница',
    placeAR: 'الفندق',
  },
  {
    name: 'hotelApart',
    placeEN: 'Hotel Apart',
    placeRU: 'Отель Апарт',
    placeAR: 'فندق أبارت',
  },
  {
    name: 'apartment',
    placeEN: 'Apartment',
    placeRU: 'Квартира',
    placeAR: 'شقة',
  },
];

const roomTypes = [
  {
    name: 'Standard',
    nameEN: 'Standard',
    nameRU: 'Стандартный',
    nameAR: 'معيار',
  },
  {
    name: 'Studio',
    nameEN: 'Studio',
    nameRU: 'Студия',
    nameAR: 'استوديو',
  },
  {
    name: 'Superior',
    nameEN: 'Superior',
    nameRU: 'большой',
    nameAR: 'أرقى',
  },
  {
    name: 'Delux',
    nameEN: 'Delux',
    nameRU: 'Делюкс',
    nameAR: 'ديلوكس',
  },
  {
    name: 'Suite',
    nameEN: 'Suite',
    nameRU: 'люкс',
    nameAR: 'جناح',
  },
];

export default function LandingPage(props) {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const { language } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [openSidebar, setOpenSidebar] = useState(false);

  //=============={Places}==========================================
  const allPlacesL =
    useSelector((state) => state?.place?.fetchedAllPlaces) || null;
  // console.log({ allPlacesL: allPlacesL });
  const allAvailablePlacesByCityAndTypeL =
    useSelector((state) => state?.place?.fetchedAllPlacesByCityAndType) || null;
  //==============={Fetch data and manage states using Redux}==========================================
  //==============={Rooms}==========================================
  const allRoomsL =
    useSelector((state) => state?.place?.fetchedAllRooms) || null;
  // console.log({ allRoomsL: allRoomsL });

  const [allRooms, setAllRooms] = useState();

  const listing = useSelector((state) => state?.place?.fetchedOneRoom) || null;
  console.log({ listing: listing });

  const [newPlace, setNewPlace] = useState({});
  console.log({ newPlace: newPlace });
  const [showBooking, setShowBooking] = useState(false);
  const [showPlaceReady, setShowPlaceReady] = useState(false);
  const [showPlace, setShowPlace] = useState(false);

  const checkInL = localStorage.getItem('checkIn')
    ? JSON.parse(localStorage.getItem('checkIn'))
    : '';

  const checkOutL = localStorage.getItem('checkOut')
    ? JSON.parse(localStorage.getItem('checkOut'))
    : '';

  const [checkIn, updateCheckIn] = useState(checkInL);
  console.log({ checkIn: checkIn });
  const [checkOut, updateCheckOut] = useState(checkOutL);
  console.log({ checkOut: checkOut });
  //==============={Persist User Selection with Local Stoarge}==========================================
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
  // console.log({ city: city });

  const typeL = localStorage.getItem('type')
    ? JSON.parse(localStorage.getItem('type'))
    : propertyTypes[0].name;
  const [type, updateType] = useState(typeL);
  const propertyType = type;
  // console.log({ propertyType: propertyType });
  const roomTypeL = localStorage.getItem('roomType')
    ? JSON.parse(localStorage.getItem('roomType'))
    : roomTypes[0].name;
  const [roomType, updateRoomType] = useState(roomTypeL);
  // console.log({ roomType: roomType });

  const [filteredData, setFilteredData] = useState([]);

  console.log({ filteredData: filteredData });
  const [totalRoomType, setTotalRoomType] = useState();
  // console.log({ totalRoomType: totalRoomType });

  const testdate = new Date('2023-10-05T00:00:00.000+00:00');

  const testCheckIn = checkIn ? new Date(checkIn) : null;

  // const date1 = testdate.getTime();
  const date1 = new Date('2023-10-05T00:00:00.000+00:00').getTime();
  const date2 = testCheckIn ? testCheckIn.getTime() : null;

  console.log({ date1: date1 });
  console.log({ date2: date2 });

  if (date1 === date2) {
    console.log({ isMatch: true });
  } else {
    console.log({ isMatch: false });
  }

  useEffect(() => {
    localStorage.setItem('prevLocation', JSON.stringify(location?.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   if (newPlace) {
  //     dispatch(getOneRoom(newPlace?._id));
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [newPlace]);

  useEffect(() => {
    if (newPlace) {
      fetchOneRoom();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newPlace]);

  const fetchOneRoom = async () => {
    if (newPlace?._id) {
      try {
        const response = await fetchRequest({
          url: `/places/${newPlace?._id}`,
        });
        if (response) {
          dispatch(getOneRoom(newPlace?._id));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // useEffect(() => {
  //   // dispatch(getAllRooms());
  //   fetchAllRooms();

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [allRooms]);

  useEffect(() => {
    // dispatch(getAllRooms());
    fetchAllRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allRooms]);

  const fetchAllRooms = async () => {
    try {
      const response = await fetchRequest({
        url: '/places/rooms/allRooms',
      });

      if (response) {
        setAllRooms(response);
        dispatch(getAllRooms(response));
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  //==============={Update Persisted User Selections with Local Stoarge}==========================================
  useEffect(() => {
    localStorage.setItem('selectedPlace', JSON.stringify(newPlace));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newPlace]);

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
    localStorage.setItem('checkIn', JSON.stringify(checkIn));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIn]);

  useEffect(() => {
    localStorage.setItem('checkOut', JSON.stringify(checkOut));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkOut]);
  //==============={Fetch Data with Redux}==========================================

  useEffect(() => {
    if (showPlaceReady === true) {
      console.log('generatedPlace', newPlace);
      setShowPlace(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPlace]);

  useEffect(() => {
    filterUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredData, allRooms]);

  function filterUserData() {
    let startPrice;
    startPrice = 200;
    let endPrice;
    // endPrice = 300;

    if (allRooms && endPrice) {
      const userData = allRooms?.filter((item) => {
        return (
          item.city.toLowerCase().includes(city?.toLowerCase()) &&
          (item.type === propertyType || '') &&
          (item.roomType === roomType || '') &&
          (item.maxGuests === maxGuests || 1) &&
          ((Number(item.price) >= startPrice
            ? startPrice
            : 0 && Number(item.price) <= endPrice) ||
            '' ||
            null) // price range
        );
      });
      setFilteredData(userData);
    } else {
      const userData = allRooms?.filter((item) => {
        return (
          item.city.toLowerCase().includes(city?.toLowerCase()) &&
          (item.type === propertyType || '') &&
          (item.roomType === roomType || '') &&
          (item.maxGuests === maxGuests || 1) &&
          (Number(item.price) >= startPrice || 0) // price range
        );
      });
      setFilteredData(userData);
    }
  }

  useEffect(() => {
    getCount();
  }, [filteredData]);

  async function getCount() {
    let remainingRooms = [];
    filteredData.map(async (b) => {
      if (b?.roomType === roomType) {
        remainingRooms.push(b);
      }
      // let totalRoomType = (remainingRooms.length
      // console.log(totalRoomType)
      setTotalRoomType(remainingRooms.length);
    });
  }

  useEffect(() => {
    if (showPlace && checkIn !== '' && checkOut !== '') {
      navigate('/placePage');
    }
  }, [showPlace, checkIn, checkOut]);

  const sidebar = (
    <>
      {openSidebar ? (
        <>
          <div className="h-screen p-4 overflow-y-auto transition-transform -translate-x-full bg-white w-80 dark:bg-gray-800">
            <h5 className="inline-flex items-center mb-6 text-base font-semibold text-gray-500 uppercase dark:text-gray-400">
              <svg
                className="w-4 h-4 me-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 16"
              >
                <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
              </svg>
              Contact us
            </h5>
            <button
              type="button"
              onClick={() => {
                setOpenSidebar((prev) => !prev);
              }}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                className="w-3 h-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close menu</span>
            </button>
            <form className="mb-6">
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="subject"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Let us know how we can help you"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Your message..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 w-full focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 block"
              >
                Send message
              </button>
            </form>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <a href="#" className="hover:underline">
                info@company.com
              </a>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <a href="#" className="hover:underline">
                212-456-7890
              </a>
            </p>
          </div>
        </>
      ) : (
        <>
          <div
            className={`h-screen p-4 overflow-y-auto transition-transform -translate-x-full bg-white w-12 dark:bg-gray-800`}
          >
            <button
              type="button"
              onClick={() => {
                setOpenSidebar((prev) => !prev);
              }}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                data-slot="icon"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>

              <span className="sr-only">Close menu</span>
            </button>
          </div>
        </>
      )}
    </>
  );

  return (
    <div className="flex flex-row gap-2">
      <div className="flex flex-col gap-2 items-center bg-white p-8 h-screen">

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
          language={language}
          // setShowPlaceReady={setShowPlaceReady}
        />
      </div>

      <div className="flex flex-col">
        {showPlace && checkIn !== '' && checkOut !== '' ? (
          <>null</>
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
            <>
              <div className="flex flex-row gap-2">
                <div className="flex flex-row w-[300px]">{sidebar}</div>
                <ClientOnly>
                  <Container>
                    <div
                      className="
            pt-24
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4
            xl:grid-cols-5
            2xl:grid-cols-6
            gap-8
          "
                    >
                      {filteredData?.map((listing) => (
                        <div
                          className=""
                          key={listing._id}
                          onClick={() => {
                            setNewPlace(listing);
                            // setShowBooking(true);
                          }}
                        >
                          <ListingCard
                            currentUser={user}
                            // key={listing._id}
                            data={listing}
                            totalRoomType={totalRoomType}
                          />
                        </div>
                      ))}
                    </div>
                  </Container>
                </ClientOnly>
              </div>
            </>
          </>
        )}
      </div>
    </div>
  );
}

//bg-white dark:bg-app-container-dark text-gray-900 dark:text-gray-100

//text-[#111111]
//bg-[#F3F3F3] dark:bg-bgDarkMode text-gray-900 dark:text-gray-100

//bg-white dark:bg-app-container-dark text-gray-900 dark:text-gray-100
