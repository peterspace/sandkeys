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
import { getOneRoomBookings } from '../../redux/features/place/placeSlice';
import { useDispatch } from 'react-redux';

// const cities = [
//   {
//     name: 'dubai',
//   },
//   {
//     name: 'moscow',
//   },
//   {
//     name: 'saint-petersburg',
//   },
// ];

// const propertyTypes = [
//   {
//     name: 'hotel',
//   },
//   {
//     name: 'hotelApart',
//   },
//   {
//     name: 'apartment',
//   },
//   {
//     name: 'resort',
//   },
// ];

// const roomTypes = [
//   {
//     name: 'Standard',
//   },
//   {
//     name: 'Studio',
//   },
//   {
//     name: 'Superior',
//   },
//   {
//     name: 'Delux',
//   },
//   {
//     name: 'Suite',
//   },
// ];

const CheckAvailability = () => {
  // const {
  //   place,
  //   updateCheckIn,
  //   updateCheckOut,

  //   checkIn,
  //   checkOut,

  //   setShowPlace,
  // } = props;
  const dispatch = useDispatch();
  // we should use this when we click check availability and not redirect immediately to booking but allow users to preview page and see available dates beside the room photos
  //create preview page with focus on avaialble dates

  const placeBookings =
    useSelector((state) => state?.place?.fetchedOneRoomBookings) || null;
  console.log({ placeBookings: placeBookings });

  // const [placeBookings, setPlaceBookings] = useState();
  console.log({ MplaceBookings: placeBookings });

  const [isAvailableCheckIn, setIsAvailableCheckIn] = useState(true);
  console.log({ isAvailableCheckIn: isAvailableCheckIn });
  const [isAvailableCheckOut, setIsAvailableCheckOut] = useState(true);
  console.log({ isAvailableCheckOut: isAvailableCheckOut });

  const [selectedCheckIn, setSelectedCheckIn] = useState();
  console.log({ selectedCheckIn: selectedCheckIn });
  const [selectedCheckOut, setSelectedCheckOut] = useState();
  console.log({ selectedCheckOut: selectedCheckOut });

  const [allReservation, setAllReservation] = useState();

  //==============={Fetch Data with Redux}==========================================

  // make api call to check all active bookings on selected place and display this dates on calender

  //==============={Fetch Data with Redux}==========================================
  // useEffect(() => {
  //   if (place) {
  //     dispatch(getOneRoomBookings(place?._id));
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  //   if (isAvailableCheckIn) {
  //     updateCheckIn(selectedCheckIn);
  //     dispatch(setCheckIn({ checkIn: selectedCheckIn }));
  //     setIsAvailableCheckIn(false);
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isAvailableCheckIn]);

  // useEffect(() => {
  //   if (isAvailableCheckOut) {
  //     updateCheckOut(selectedCheckOut);
  //     dispatch(setCheckOut({ checkOut: selectedCheckOut }));
  //     setIsAvailableCheckOut(false);
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isAvailableCheckOut]);

  // useEffect(() => {
  //   if (place) {
  //     AllBookedDates();
  //   }
  // }, [place]);

  // async function AllBookedDates() {
  //   let reservedDates = [];
  //   if (placeBookings) {
  //     placeBookings?.map(async (d) => {
  //       const booked = {
  //         checkIn: new Date(d?.checkIn).getTime(),
  //         checkOut: new Date(d?.checkOut).getTime(),
  //       };
  //       reservedDates.push(booked);
  //     });
  //   }
  //   setAllReservation(reservedDates);
  // }

  // if (allReservation.some(ev => new Date(ev.target.value).getTime() === 'Magenic')) {
  //   /* vendors contains the element we're looking for */
  // }

  // Handlers

  useEffect(() => {
    validateCheckIn();
    validateCheckOut();
  }, [selectedCheckIn, selectedCheckOut]);

  async function validateCheckIn() {
    if (placeBookings) {
      placeBookings?.map(async (d) => {
        new Date(d?.checkIn).getTime() === new Date(selectedCheckIn).getTime();
        setIsAvailableCheckIn(false);
      });
    }
  }

  async function validateCheckOut() {
    if (placeBookings) {
      placeBookings?.map(async (d) => {
        new Date(d?.checkOut).getTime() ===
          new Date(selectedCheckOut).getTime();
        setIsAvailableCheckOut(false);
      });
    }
  }
  // Handlers
  const handleCheckIn = (ev) => {
    if (placeBookings) {
      placeBookings?.map(async (d) => {
        new Date(d?.checkIn).getTime() !== new Date(ev.target.value).getTime();
        setSelectedCheckIn(ev.target.value);
      });
    }
  };

  const handleCheckOut = (ev) => {
    if (placeBookings) {
      placeBookings?.map(async (d) => {
        new Date(d?.checkOut).getTime() !== new Date(ev.target.value).getTime();
        setSelectedCheckOut(ev.target.value);
      });
    }
  };

  return (
    <>
      <div className="flex flex-col bg-gray-100">
        <div className="flex flex-col sm:flex-row py-3 justify-start items-start sm:justify-between sm:items-center bg-gray-50 border">
          <div className="flex flex-col py-3 sm:px-4 border-l ml-10 sm:ml-0">
            <label>Check in</label>
            <input
              type="date"
              value={selectedCheckIn}
              className={`bg-gray-50 rounded-none border border-blue-700 hover:text-gray-900 focus:ring-1 focus:outline-none focus:ring-blue-500 px-2 py-1 ${
                isAvailableCheckIn ? 'text-rose-500' : 'text-gray-500'
              }`}
              // className={`bg-gray-50 rounded-none border border-blue-700 hover:text-gray-900 focus:ring-1 focus:outline-none focus:ring-blue-500 px-2 py-1 text-gray-500`}
              // onChange={handleCheckIn}
              onChange={(ev) => setSelectedCheckIn(ev.target.value)}

              // disabled={() => {
              //   if (placeBookings) {
              //     placeBookings?.map(async (d) => {
              //       new Date(d?.checkIn).getTime() ===
              //         new Date(ev.target.value).getTime();
              //     });
              //   }
              // }}
            />
          </div>
          <div className="flex flex-col py-3 sm:px-4 border-l ml-10 sm:ml-0">
            <label>Check out</label>
            <input
              type="date"
              value={selectedCheckOut}
              className={`bg-gray-50 rounded-none border border-blue-700 hover:text-gray-900 focus:ring-1 focus:outline-none focus:ring-blue-500 px-2 py-1 ${
                isAvailableCheckOut ? 'text-rose-500' : 'text-gray-500'
              }`}
              // className={`bg-gray-50 rounded-none border border-blue-700 hover:text-gray-900 focus:ring-1 focus:outline-none focus:ring-blue-500 px-2 py-1 text-gray-500`}
              // onChange={handleCheckOut}
              onChange={(ev) => setSelectedCheckOut(ev.target.value)}
              // disabled={() => {
              //   if (placeBookings) {
              //     placeBookings?.map(async (d) => {
              //       new Date(d?.checkOut).getTime() ===
              //         new Date(ev.target.value).getTime();
              //     });
              //   }
              // }}
            />
          </div>

          <div className="flex flex-col py-3 sm:px-4 border-l ml-10 sm:ml-0">
            {/* <label>Find</label> */}
            <label>Book</label>
            <div
              // to={'/landingPage'}
              className="btn-primary px-3 py-2 mr-20 rounded-lg"
              // onClick={() => setShowPlace(false)}
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

export default CheckAvailability;
