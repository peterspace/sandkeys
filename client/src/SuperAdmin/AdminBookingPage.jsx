import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AddressLink from '../AddressLink';
import PlaceGallery from '../PlaceGallery';
import BookingDates from '../BookingDates';
import { getUserBookings } from '../services/apiService';
import { differenceInCalendarDays, format } from 'date-fns';
import { Link } from 'react-router-dom';

import {
  getOwnerBookings,
  updateOwnerBooking,
  getUser,
  updateBookingsAutomatically,
} from '../services/apiService';
import { selectOwnerId } from '../redux/features/auth/bookingSlice';

import { useSelector } from 'react-redux';

// const bookingStatus = [
//   { name: 'Pending' },
//   { name: 'Active' },
//   { name: 'Paid' },
//   { name: 'Cancel' },
// ];

const bookingStatus = [{ name: 'Pending' }, { name: 'Paid' }];

export default function AdminBookingPage() {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [newStatus, setNewStatus] = useState(bookingStatus[0].name);
  const [isRedirect, setIsRedirect] = useState(false);

  // console.log("userData:", booking);

  // const [ownerId, setOwnerId]= useState("");

  const userLocal = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null;

  // console.log({userLocal: userLocal})

  const activeOwnerId = userLocal?.userId;
  console.log('activeOwnerId:', activeOwnerId);

  useEffect(() => {
    if (activeOwnerId === null || '' || undefined) {
      setIsLoading(true);
    }
  }, []);

  useEffect(() => {
    if (id) {

      getOwnerBookings().then((response) => {
        const foundBooking = response.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);


  const handleBookingUpdate = async (ev) => {
    ev.preventDefault();
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
      status: newStatus, // new update
    };

    console.log('userData:', userData);
    updateOwnerBooking(userData).then((response) => {
      console.log(response);
    });

    localStorage.setItem('placeUpdated', JSON.stringify(true)); // agitate automatic status update
  };

  // const handleBookingUpdate = async (ev) => {
  //   ev.preventDefault();
  //   const userData = {
  //     id: booking._id, // new
  //     place: booking.place,
  //     // place: booking.place?._id,
  //     room: booking?.room?._id,
  //     checkIn: booking.checkIn,
  //     checkOut: booking.checkOut,
  //     numberOfGuests: booking.numberOfGuests,
  //     name: booking.name,
  //     phone: booking.phone,
  //     price: booking.price,
  //     paymentMethod: booking.paymentMethod,
  //     owner: booking.owner,
  //     status: newStatus, // new update
  //   };

  //   console.log('userData:', userData);
  //   updateOwnerBooking(userData).then((response) => {
  //     console.log(response);
  //   });

  //   let checkIn = new Date(booking?.checkIn);
  //   let checkOut = new Date(booking?.checkOut);
  //   let currentTime = new Date(Date.now());

  //   if (
  //     checkIn <= currentTime &&
  //     checkOut >= currentTime &&
  //     newStatus === 'Paid'
  //   ) {
  //     let userData = {
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
  //       status: 'Active', // new update
  //     };

  //     console.log('userData:', userData);
  //     updateBookingsAutomatically(userData).then((response) => {
  //       console.log(response);
  //     });
  //   }

  //   if (
  //     checkIn > currentTime &&
  //     checkOut > currentTime &&
  //     newStatus === 'Paid'
  //   ) {
  //     let userData = {
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
  //       status: 'Inactive', // user has booked ahead
  //     };

  //     console.log('userData:', userData);
  //     updateBookingsAutomatically(userData).then((response) => {
  //       console.log(response);
  //     });
  //   }
  // };

  if (!booking) {
    return '';
  }

  let numberOfNights = 0;

  if (booking?.checkOut && booking?.checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(booking?.checkOut),
      new Date(booking?.checkIn)
    );
    //  console.log("checkIn", checkIn)
  }

  return (
    <>
      {isLoading === true ? (
        <div>Loading...</div>
      ) : (
        <div className="my-8">
          <h1 className="text-3xl">{booking.room.title}</h1>
          <AddressLink className="my-2 block">
            {booking.room.address}
          </AddressLink>
          <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
            <div>
              <h2 className="text-2xl mb-4">Client's booking information:</h2>
              <BookingDates booking={booking} />
            </div>
            <>
              <div className="flex flex-row gap-2 items-center">
                <div className="flex flex-row gap-2 items-center">
                  <label htmlFor="newStatus" className="text-lg text-gray-500">
                    Status:
                  </label>
                  <select
                    name="newStatus"
                    className="dropdown bg-gray-50 rounded-lg text-gray-500 border border-blue-700 hover:text-gray-900 focus:ring-1 focus:outline-none focus:ring-blue-500 px-2 py-1"
                    value={newStatus}
                    onChange={(ev) => setNewStatus(ev.target.value)}
                  >
                    <option value="">Choose status</option>
                    {bookingStatus.map((newStatus, index) => (
                      <option key={index} value={newStatus?.name}>
                        {newStatus?.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <button
                    // type="button"
                    onClick={handleBookingUpdate}
                    className="px-3 py-2 btn-primary rounded-2xl"
                  >
                    Save
                  </button>
                </div>
              </div>
            </>
            {/* <div className="bg-primary p-6 text-white rounded-2xl">
              <div>Total price</div>
              <div className="text-3xl">${booking.price}</div>
            </div> */}
            <div className="text-2xl text-center">
              Price: ${booking.price} / per night
            </div>
            <div className="bg-primary p-6 text-white rounded-2xl">
              <div>Total price</div>
              <div className="text-3xl">${numberOfNights * booking.price}</div>
            </div>
            <div className="flex flex-row gap-6">
              <Link to="/admin/account/agentbookings">
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
                  Return
                </div>
              </Link>
            </div>
          </div>
          <PlaceGallery place={booking.place} />
        </div>
      )}
    </>
  );
}
