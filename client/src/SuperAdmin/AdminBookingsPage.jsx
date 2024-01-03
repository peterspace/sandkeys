import AccountNav from '../AccountNav';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PlaceImg from '../PlaceImg';
import { Link } from 'react-router-dom';
import BookingDates from '../BookingDates';
import {
  getOwnerBookings,
  getAllPaidBookings,
  getAllPendingBookings,
  getAllActiveBookings,
  getAllCompletedBookings,
  getAllCanceledBookings,
  updateBookingsAutomatically,
} from '../services/apiService';
import { selectOwnerId } from '../redux/features/auth/bookingSlice';

import { useSelector } from 'react-redux';
import { differenceInCalendarDays, format } from 'date-fns';

const bookingStatus = [
  { name: 'All' },
  { name: 'Pending' },
  { name: 'Active' },
  { name: 'Paid' },
  { name: 'Cancel' },
  { name: 'Inactive' },
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [bookingsPending, setBookingsPending] = useState([]);
  const [bookingsPaid, setBookingsPaid] = useState([]);
  const [bookingsActive, setBookingsActive] = useState([]);
  const [bookingsCompleted, setBookingsCompleted] = useState([]);
  const [bookingsCancel, setBookingsCancel] = useState([]);

  const [activeStatus, setActiveStatus] = useState('All');
  const [activeBookings, setActiveBookings] = useState([]);
  // const [increase, setIncrease] = useState(false);

  // console.log({ increase: increase });

  // const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const userLocal = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null;

  const placeUpdated = localStorage.getItem('placeUpdated')
    ? JSON.parse(localStorage.getItem('placeUpdated'))
    : false;

  console.log({ userLocal: userLocal });

  const ownerId = userLocal?.userId;

  // const ownerId = useSelector((state) => state?.booking?.ownerId);
  // console.log('ownerId:', ownerId);

  useEffect(() => {
    if (ownerId === null || '' || undefined) {
      setIsLoading(true);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setActiveStatus(bookingStatus[1].name); // "pending"
    }, 200);
  }, []);

  useEffect(() => {
    console.log('ownerId:', ownerId);
    if (ownerId !== null || undefined) {
      //  let ownerId = activeOwnerId.ownerId.toString()
      getOwnerBookings(ownerId).then((response) => {
        if (response.length >= 1) {
          setBookings(response);
          console.log('userBookings', response);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (ownerId !== null || undefined) {
      getAllPaidBookings(ownerId).then((response) => {
        if (response.length >= 1) {
          setBookingsPaid(response);
          console.log('userBookingsPaid', response);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (ownerId !== null || undefined) {
      getAllPendingBookings(ownerId).then((response) => {
        if (response.length >= 1) {
          setBookingsPending(response);
          console.log('userBookingsPending', response);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (ownerId !== null || undefined) {
      getAllActiveBookings(ownerId).then((response) => {
        if (response.length >= 1) {
          setBookingsActive(response);
          console.log('userBookingsActive', response);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (ownerId !== null || undefined) {
      getAllCompletedBookings(ownerId).then((response) => {
        if (response.length >= 1) {
          setBookingsCompleted(response);
          console.log('userBookingsCompleted', response);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (ownerId !== null || undefined) {
      getAllCanceledBookings(ownerId).then((response) => {
        if (response.length >= 1) {
          setBookingsCancel(response);
          console.log('userBookingsCancel', response);
        }
      });
    }
  }, []);

  //==============={Using Filter}=====================================
  useEffect(() => {
    if (ownerId !== null || undefined) {
      changeStatus();
    }
  }, [activeStatus, ownerId]);

  async function changeStatus() {
    switch (activeStatus) {
      case 'All':
        setActiveBookings(bookings);
        break;
      case 'Active':
        setActiveBookings(bookingsActive);
        break;
      case 'Pending':
        setActiveBookings(bookingsPending);
        break;
      case 'Completed':
        setActiveBookings(bookingsCompleted);
        break;
      case 'Cancel':
        setActiveBookings(bookingsCancel);
        break;
      case 'Paid':
        setActiveBookings(bookingsPaid);
        break;
      case 'Inactive':
        setActiveBookings(bookingsPaid);
        break;
      default:
        console.warn('please choose status');
    }
  }

  //======{The initial status after booking is  "pending"}========================
  //======{The admin will update status to from "pending" to "paid" once payement is confirmed}========================
  //==={This system will Automatically update status to " Active, Completed, Canceled" using the underlined lines of codes}===========================

  async function statusUpdate2() {
    for (let i = 0; i < bookings.length; i++) {
      let checkOut = bookings[i]?.checkOut;
      let currentTime = new Date(Date.now());

      //======{The initial status after booking is  "pending"}========================
      //======{The admin will update status to from "pending" to "paid" once payement is confirmed}========================
      //==={This system will Automatically update status to " Active, Completed, Canceled" using the underlined lines of codes}===========================

      //==={Is active}==================

      if (
        checkOut > currentTime &&
        bookings[i]?.status !== 'Pending' &&
        bookings[i]?.status !== 'Cancel' &&
        bookings[i]?.status !== 'Completed' &&
        bookings[i]?.status === 'Paid'
      ) {
        setNewStatus('Active'); // update bookings
      }
      //==={Is Completed}==================

      if (checkOut < currentTime && bookings[i]?.status === 'Paid') {
        setNewStatus('Completed'); // update bookings
      }
      //==={Is Canceled}==================
      if (checkOut < currentTime && bookings[i]?.status !== 'Paid') {
        setNewStatus('Cancel'); // update bookings
      }
    }
  }

  //==={on component mount}=========
  useEffect(() => {
    statusUpdate();
  }, []);

  //==={by admin status updates using localStorage updates}=========
  useEffect(() => {
    if (placeUpdated === true) {
      statusUpdate();
      localStorage.setItem('placeUpdated', JSON.stringify(false));
    }
  }, [placeUpdated]);

  //==={set intervals for regular updates}=========
  useEffect(() => {
    const intervalId = setInterval(() => {
      statusUpdate();
    }, 600000); // every 10 minutes
    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const statusUpdate = async (ev) => {
  //   ev.preventDefault();

  //   bookings?.map(async (booking) => {
  //     let checkIn = new Date(booking?.checkIn);
  //     let checkOut = new Date(booking?.checkOut);
  //     let currentTime = new Date(Date.now());

  //     let currentStatus = booking?.status;

  //     let newStatusx;

  //     if (
  //       checkIn <= currentTime && // checkIn date is today or behind and checkout date has not reached yet
  //       checkOut >= currentTime &&
  //       booking?.status === 'Paid'
  //     ) {
  //       newStatusx = 'Active';
  //     }

  //     if (
  //       checkIn > currentTime && // checkIn date is ahead of now
  //       checkOut > currentTime && // checkOut date is ahead of now
  //       booking?.status === 'Paid'
  //     ) {
  //       newStatusx = 'Inactive';
  //     }

  //     if (
  //       checkIn >= currentTime && // checkIn date is today or ahead of today
  //       checkOut > currentTime && // checkOut date is ahead of today
  //       booking?.status === 'Pending'
  //     ) {
  //       newStatusx = 'Pending';
  //     }
  //     //==={Is Completed}==================

  //     if (
  //       checkOut < currentTime &&
  //       booking?.status !== 'Pending' &&
  //       booking?.status !== 'Inactive'
  //     ) {
  //       newStatusx = 'Completed';
  //     }
  //     //==={Is Canceled}==================
  //     if (
  //       checkOut < currentTime &&
  //       booking?.status !== 'Paid' &&
  //       booking?.status !== 'Cancel'
  //     ) {
  //       newStatusx = 'Cancel';
  //     }

  //     if (booking?.status !== 'Paid' && booking?.status !== 'Pending') {
  //       newStatusx = currentStatus;
  //     }
  //     const userData = {
  //       id: booking._id, // new
  //       place: booking.place,
  //       // place: booking.place?._id,
  //       room: booking?.room?._id,
  //       checkIn: booking.checkIn,
  //       checkOut: booking.checkOut,
  //       numberOfGuests: booking.numberOfGuests,
  //       name: booking.name,
  //       phone: booking.phone,
  //       price: booking.price,
  //       paymentMethod: booking.paymentMethod,
  //       owner: booking.owner,
  //       status: newStatusx, // new update
  //     };

  //     console.log('userData:', userData);
  //     updateBookingsAutomatically(userData).then((response) => {
  //       console.log(response);
  //     });
  //   });
  // };

  async function statusUpdate() {
    bookings?.map(async (booking) => {
      let checkIn = new Date(booking?.checkIn);
      let checkOut = new Date(booking?.checkOut);
      let currentTime = new Date(Date.now());

      let currentStatus = booking?.status;

      let newStatusx;

      if (
        checkIn <= currentTime && // checkIn date is today or behind and checkout date has not reached yet
        checkOut >= currentTime &&
        booking?.status === 'Paid'
      ) {
        newStatusx = 'Active';
      }

      if (
        checkIn > currentTime && // checkIn date is ahead of now
        checkOut > currentTime && // checkOut date is ahead of now
        booking?.status === 'Paid'
      ) {
        newStatusx = 'Inactive';
      }

      if (
        checkIn >= currentTime && // checkIn date is today or ahead of today
        checkOut > currentTime && // checkOut date is ahead of today
        booking?.status === 'Pending'
      ) {
        newStatusx = 'Pending';
      }
      //==={Is Completed}==================

      if (
        checkOut < currentTime &&
        booking?.status !== 'Pending' &&
        booking?.status !== 'Inactive'
      ) {
        newStatusx = 'Completed';
      }
      //==={Is Canceled}==================
      if (
        checkOut < currentTime &&
        booking?.status !== 'Paid' &&
        booking?.status !== 'Cancel'
      ) {
        newStatusx = 'Cancel';
      }

      if (booking?.status !== 'Paid' && booking?.status !== 'Pending') {
        newStatusx = currentStatus;
      }
      const userData = {
        id: booking._id, // new
        place: booking.place,
        // place: booking.place?._id,
        room: booking?.room?._id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        numberOfGuests: booking.numberOfGuests,
        name: booking.name,
        phone: booking.phone,
        price: booking.price,
        paymentMethod: booking.paymentMethod,
        owner: booking.owner,
        status: newStatusx, // new update
      };

      console.log('userData:', userData);
      updateBookingsAutomatically(userData).then((response) => {
        console.log(response);
      });
    });
  }

  const statusUpdateOnClick = async (ev) => {
    ev.preventDefault();
    bookings?.map(async (booking) => {
      let checkIn = new Date(booking?.checkIn);
      let checkOut = new Date(booking?.checkOut);
      let currentTime = new Date(Date.now());

      let currentStatus = booking?.status;

      let newStatusx;

      if (
        checkIn <= currentTime && // checkIn date is today or behind and checkout date has not reached yet
        checkOut >= currentTime &&
        booking?.status === 'Paid'
      ) {
        newStatusx = 'Active';
      }

      if (
        checkIn > currentTime && // checkIn date is ahead of now
        checkOut > currentTime && // checkOut date is ahead of now
        booking?.status === 'Paid'
      ) {
        newStatusx = 'Inactive';
      }

      if (
        checkIn >= currentTime && // checkIn date is today or ahead of today
        checkOut > currentTime && // checkOut date is ahead of today
        booking?.status === 'Pending'
      ) {
        newStatusx = 'Pending';
      }
      //==={Is Completed}==================

      if (
        checkOut < currentTime &&
        booking?.status !== 'Pending' &&
        booking?.status !== 'Inactive'
      ) {
        newStatusx = 'Completed';
      }
      //==={Is Canceled}==================
      if (
        checkOut < currentTime &&
        booking?.status !== 'Paid' &&
        booking?.status !== 'Cancel'
      ) {
        newStatusx = 'Cancel';
      }

      if (booking?.status !== 'Paid' && booking?.status !== 'Pending') {
        newStatusx = currentStatus;
      }
      const userData = {
        id: booking._id, // new
        place: booking.place,
        // place: booking.place?._id,
        room: booking?.room?._id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        numberOfGuests: booking.numberOfGuests,
        name: booking.name,
        phone: booking.phone,
        price: booking.price,
        paymentMethod: booking.paymentMethod,
        owner: booking.owner,
        status: newStatusx, // new update
      };

      console.log('userData:', userData);
      updateBookingsAutomatically(userData).then((response) => {
        console.log(response);
      });
    });
  };

  // const statusUpdate = async (ev) => {
  //   ev.preventDefault();
  //   // let checkOut = bookings[0]?.checkOut;

  //   let checkOut = new Date(bookings[0]?.checkOut);
  //   let currentTime = new Date(Date.now());
  //   if (checkOut > currentTime) {
  //     setIncrease(true);
  //   }
  // };

  return (
    <div>
      <AccountNav />
      {/* <button className='px-3 py-3 btn-primary' onClick={()=>updateBookingStatus()}>Get</button> */}
      <>
        {isLoading === true ? (
          <div>Loading...</div>
        ) : (
          <div>
            <>
              <div className="flex flex-row gap-2 items-center ml-8">
                <div className="flex flex-row gap-2 items-center">
                  <label
                    htmlFor="activeStatus"
                    className="text-lg text-gray-500"
                  >
                    Status:
                  </label>
                  <select
                    name="activeStatus"
                    className="dropdown bg-gray-50 rounded-lg text-gray-500 border border-blue-700 hover:text-gray-900 focus:ring-1 focus:outline-none focus:ring-blue-500 px-2 py-1"
                    value={activeStatus}
                    // onChange={(ev) => setActiveStatus(ev.target.value)}
                    onChange={(ev) => setActiveStatus(ev.target.value)}
                  >
                    <option value="">Choose status</option>
                    {bookingStatus.map((activeStatus, index) => (
                      <option key={index} value={activeStatus?.name}>
                        {activeStatus?.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div
                  className="flex flex-row gap-6"
                  onClick={statusUpdateOnClick}
                >
                  <div className="transition-transform duration-300 hover:scale-125 rounded-lg cursor-pointer flex flex-row justify-center items-center bg-black hover:bg-gray-700 text-white px-3 py-2 gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                      />
                    </svg>
                    Update
                  </div>
                </div>
              </div>
            </>
            <>
              {activeBookings.length < 1 ? (
                <div className="py-2 mt-8 mb-8 flex flex-row justify-center items-center">
                  <div className="text-gray-900 text-base">
                    No booking is available at the moment
                  </div>
                </div>
              ) : (
                <div>
                  {activeBookings &&
                    activeBookings.map((booking, index) => (
                      <Link
                        to={`/admin/account/agentbookings/${booking._id}`}
                        // onClick={() => setBooking(booking)}
                        key={index}
                        className="flex gap-4 mt-8"
                      >
                        <div className="flex flex-row bg-gray-200 rounded-2xl overflow-hidden gap-10 ml-10 border border-gray-50 shadow-md">
                          <div className="flex w-64 h-64 bg-gray-300 grow shrink-0">
                            <PlaceImg place={booking?.room} />
                          </div>
                          <div className="grow-0 shrink flex flex-col justify-center items-center px-10">
                            <h2 className="text-xl">{booking?.room?.title}</h2>
                            <button className="px-3 py-2 btn-primary rounded-2xl">
                              {booking.status}
                            </button>
                            <div className="text-xl border bg-gray-100 rounded-lg mt-2 px-2 py-2 border-gray-50">
                              <div className="px-2 py-2">
                                <BookingDates
                                  booking={booking}
                                  className="mb-2 mt-4 text-gray-500"
                                />
                                <div className="flex gap-1">
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
                                      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                                    />
                                  </svg>

                                  <span className="text-base text-gray-700">
                                    Price: ${booking.price} / per night
                                  </span>
                                </div>
                                <div className="flex gap-1">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-8 h-8"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                                    />
                                  </svg>
                                  <span className="text-2xl">
                                    Total price: $
                                    {differenceInCalendarDays(
                                      new Date(booking?.checkOut),
                                      new Date(booking?.checkIn)
                                    ) * booking.price}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              )}
            </>
          </div>
        )}
      </>
    </div>
  );
}

// const new = (
//   <div>
//   <AccountNav />
//   <div>
//     {/* {bookings?.length > 0 && */}
//     {bookings &&
//       bookings.map((booking, index) => (
//         <div key={index} className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden">
//           <div className="w-48">
//             <PlaceImg place={booking.place} />
//           </div>
//           <div className="py-3 pr-3 grow">
//             <h2 className="text-xl">{booking.place.title}</h2>
//             <div className="text-xl">
//               <BookingDates
//                 booking={booking}
//                 className="mb-2 mt-4 text-gray-500"
//               />
//               <div className="flex gap-1">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={1.5}
//                   stroke="currentColor"
//                   className="w-8 h-8"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
//                   />
//                 </svg>
//                 <span className="text-2xl">
//                   Total price: ${booking.price}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//         // <Link
//         //   to={`/account/bookings/${booking._id}`}
//         //   className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden"
//         // >

//         // </Link>
//       ))}
//   </div>
// </div>
// )
