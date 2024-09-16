import { DateRange } from "react-date-range";
import { useEffect, useState } from "react";
// import { useContext, useState } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
// import { SearchContext } from "../../context/SearchContext";
// import { AuthContext } from "../../context/AuthContext";
import { selectUser } from "../../redux/features/auth/authSlice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Slider from "../slider/Slider";
import { slides } from "../../constants";

import {
  setType,
  setCity,
  setCheckIn,
  setCheckOut,
  setGuestNumber,
  setGuestName,
  setGuestPhone,
} from "../../redux/features/auth/bookingSlice";
import { useDispatch } from "react-redux";

const cities = [
  {
    name: "saint-petersburg",
  },
  {
    name: "moscow",
  },

  {
    name: "dubai",
  },
];

const types = [
  {
    name: "hotel",
  },
  {
    name: "apartment",
  },
  {
    name: "resort",
  },
  {
    name: "villa",
  },
];

const Hero = () => {
  const dispatch = useDispatch();

  const [checkIn, updateCheckIn] = useState("");
  const [checkOut, updateCheckOut] = useState("");
  const [numberOfGuests, updatetNumberOfGuests] = useState(1);
  const [city, updateCity] = useState(cities[0].name);
  const [type, updateType] = useState(types[0].name);

  // using defailt guest number as 1
  useEffect(() => {
    dispatch(setGuestNumber({ guestNumber: numberOfGuests }));
  }, [numberOfGuests]);

  return (
    <>
      <div className="flex flex-col bg-gray-100">
        <div className="flex justify-center items-center mt-6 py-10 mb-6 ml-3 sm:mt-8">
          <Slider slides={slides} />
          <h2 className="text-xl font-bold text-gray-900 sm:text-4xl lg:text-3xl xl:text-4xl">
            Explore endless comfort at Crib.com
          </h2>
        </div>

        <div className="flex flex-row py-3 justify-between items-center bg-gray-50 border">
          <div className="py-3 px-4 ml-10 flex flex-col">
            <div>City</div>
            <select
              name="city"
              className="dropdown bg-gray-50 rounded-none text-gray-500 border border-blue-700 hover:text-gray-900 focus:ring-1 focus:outline-none focus:ring-blue-500 px-2 py-1"
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
          <div className="py-3 px-4 ml-10 border-l flex flex-col">
            <div>Property</div>
            <select
              name="type"
              className="dropdown bg-gray-50 rounded-none text-gray-500 border border-blue-700 hover:text-gray-900 focus:ring-1 focus:outline-none focus:ring-blue-500 px-2 py-1"
              value={type}
              onChange={(ev) => {
                updateType(ev.target.value);
                dispatch(setType({ type: ev.target.value }));
              }}
            >
              <option value="">Choose</option>
              {types.map((type, index) => (
                <option key={index} value={type?.name}>
                  {type?.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col py-3 px-4 border-l">
            <label>Check in</label>
            <input
              type="date"
              value={checkIn}
              className="bg-gray-50 rounded-none text-gray-500 border border-blue-700 hover:text-gray-900 focus:ring-1 focus:outline-none focus:ring-blue-500 px-2 py-1"
              onChange={(ev) => {
                updateCheckIn(ev.target.value);
                dispatch(setCheckIn({ checkIn: ev.target.value }));
              }}
            />
          </div>
          <div className="flex flex-col py-3 px-4 border-l">
            <label>Check out</label>
            <input
              type="date"
              value={checkOut}
              className="bg-gray-50 rounded-none text-gray-500 border border-blue-700 hover:text-gray-900 focus:ring-1 focus:outline-none focus:ring-blue-500 px-2 py-1"
              onChange={(ev) => {
                updateCheckOut(ev.target.value);
                dispatch(setCheckOut({ checkOut: ev.target.value }));
              }}
            />
          </div>
          <div className="py-3 px-2 w-[150px] border-l">
            <label>Guests</label>
            <input
              type="number"
              value={numberOfGuests}
              className="bg-gray-50  text-gray-500 border border-blue-700 hover:text-gray-900 focus:ring-1 focus:outline-none focus:ring-blue-500 px-2 py-1"
              onChange={(ev) => {
                updatetNumberOfGuests(ev.target.value);
              }}
            />
          </div>
          <div className="flex flex-col py-3 px-4 border-l">
            <label>Find</label>
            <Link
              to={"/landingPage"}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;

//className="text-blue-700 border border-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 mb-3 mt-1"

//className="text-blue-700 border border-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center

// className="py-3 px-4 rounded-lg bg-blue-500 text-white mr-5 border-l"
