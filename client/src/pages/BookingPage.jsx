import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AddressLink from '../AddressLink';
import PlaceGallery from '../PlaceGallery';
import BookingDates from '../BookingDates';
import { getUserBookings } from '../services/apiService';
import { differenceInCalendarDays, format } from 'date-fns';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

export default function BookingPage() {
  const location = useLocation();
  const { user } = useSelector((state) => state.user);

  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    localStorage.setItem('prevLocation', JSON.stringify(location?.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id) {
      getUserBookings().then((response) => {
        const foundBooking = response.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);


  let numberOfNights = 0;

  if (booking?.checkOut && booking?.checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(booking?.checkOut),
      new Date(booking?.checkIn)
    );
    //  console.log("checkIn", checkIn)
  }

  //========={always update all user bookings list}============

  if (!booking) {
    return '';
  }

  return (
    <div className="my-8">
      <h1 className="text-3xl">{booking?.room?.title}</h1>
      <AddressLink className="my-2 block">{booking?.room?.address}</AddressLink>
      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-4">Your booking information:</h2>
          <BookingDates booking={booking} />
        </div>
        <div className="px-3 py-2 btn-primary text-2xl rounded-2xl">
          {booking?.status}
        </div>
        <div className="text-2xl text-center">
          Price: ₽{booking.price} / per night
        </div>
        <div className="bg-primary p-6 text-white rounded-2xl">
          <div>Total price</div>
          <div className="text-3xl">₽{numberOfNights * booking.price}</div>
        </div>
        <div className="flex flex-row gap-6">
          <Link to="/account/bookings">
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

      <PlaceGallery place={booking?.room} />
    </div>
  );
}
