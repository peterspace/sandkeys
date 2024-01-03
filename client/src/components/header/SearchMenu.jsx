import { DateRange } from 'react-date-range';
import { useEffect, useState } from 'react';
// import { useContext, useState } from "react";
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Slider from '../slider/Slider';
import { slides } from '../../constants';

import {
  setType,
  setCity,
  setCheckIn,
  setCheckOut,
  setGuestNumber,
  setGuestName,
  setGuestPhone,
  setRoomType,
  setRoomNumber,
} from '../../redux/features/booking/bookingSlice';
import { useDispatch } from 'react-redux';

const SearchMenu = (props) => {
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
  } = props;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setGuestNumber({ guestNumber: numberOfGuests }));
  }, [numberOfGuests]);

  const handleSearch = () => {
    // dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options } });
    navigate('/list', { state: { destination: city, dates, options } });
  };

  return (
    <>
      {/* <div className="flex flex-col bg-gray-100 rounded shadow-md"> */}
      <div className="bg-grey-200 flex flex-col rounded shadow-md">
        <div className="flex flex-col rounded py-3 justify-start items-start sm:justify-between sm:items-center bg-grey-200 border-[1px] border-solid border-lavender">
          <div className="text-white font-robotopy-3 sm:px-4 ml-10 flex flex-col">
            <div>City</div>
            <select
              name="city"
              className="dropdown bg-grey-200 rounded-none text-gray-500 border border-lavender hover:text-gray-900 focus:ring-1 focus:outline-none focus:ring-blue-500 px-2 py-1"
              value={city}
              onChange={(ev) => {
                updateCity(ev.target.value);
                dispatch(setCity({ city: ev.target.value }));
              }}
            >
              <option value="">Choose</option>
              {cities.map((city, index) => (
                <option key={index} value={city?.name}>
                  {city?.name}
                </option>
              ))}
            </select>
          </div>
          <div className="text-white font-robotopy-3 sm:px-4 ml-10 flex flex-col">
            <div>Property</div>
            <select
              name="type"
              className="dropdown bg-grey-200 rounded-none text-gray-500 border border-lavender hover:text-gray-900 focus:ring-1 focus:outline-none focus:ring-blue-500 px-2 py-1"
              value={type}
              onChange={(ev) => {
                updateType(ev.target.value);
                dispatch(setType({ type: ev.target.value }));
              }}
            >
              <option value="">Choose</option>
              {propertyTypes.map((type, index) => (
                <option key={index} value={type?.name}>
                  {type?.name}
                </option>
              ))}
            </select>
          </div>
          <div className="text-white font-robotopy-3 sm:px-4 ml-10 flex flex-col">
            <div>Rooms</div>
            <select
              name="roomType"
              className="dropdown bg-grey-200 rounded-none text-gray-500 border border-lavender hover:text-gray-900 focus:ring-1 focus:outline-none focus:ring-blue-500 px-2 py-1"
              value={roomType}
              onChange={(ev) => {
                updateRoomType(ev.target.value);
                dispatch(setRoomType({ type: ev.target.value }));
              }}
            >
              <option value="">Choose</option>
              {roomTypes.map((type, index) => (
                <option key={index} value={type?.name}>
                  {type?.name}
                </option>
              ))}
            </select>
          </div>
          <div className="text-white font-robotopy-3 sm:px-4 ml-10 flex flex-col w-[150px] border-l sm:ml-0">
            <label>Guests</label>
            <input
              type="number"
              value={numberOfGuests}
              className="bg-grey-200  text-gray-500 border border-lavender hover:text-gray-900 focus:ring-1 focus:outline-none focus:ring-blue-500 px-2 py-1"
              onChange={(ev) => {
                updatetNumberOfGuests(ev.target.value); // dispatch also
              }}
            />
          </div>
          {/* <div className="flex flex-col py-3 px-4 border-l">
            <label>Find</label>
            <Link
              to={'/landingPage'}
              className="btn-primary px-3 py-2 mr-20 rounded-lg"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </Link>
          </div> */}
          <div className="flex flex-col py-3 sm:px-4 border-l ml-10 sm:ml-0">
            <label>Find</label>
            <div
              // to={'/landingPage'}
              className="btn-primary px-3 py-2 mr-20 rounded-lg"
              onClick={() => {
                setShowPlace(false);
                handleSearch();
              }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchMenu;

//className="text-blue-700 border border-lavender hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 mb-3 mt-1"

//className="text-blue-700 border border-lavender hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center

// className="py-3 px-4 rounded-lg bg-blue-500 text-white mr-5 border-l"
