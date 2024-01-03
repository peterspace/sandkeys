import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AddressLink from '../AddressLink';
import PlaceGallery from '../PlaceGallery';
import BookingDates from '../BookingDates';
import { getUserBookings } from '../services/apiService';

import {
  getOwnerBookings,
  updateOwnerBooking,
  getUser,
} from '../services/apiService';
import { selectOwnerId } from '../redux/features/auth/bookingSlice';

import { useSelector } from 'react-redux';

const bookingStatus = [
  { name: 'Pending' },
  { name: 'Active' },
  { name: 'Paid' },
  { name: 'Cancel' },
];

export default function AgentBookingPage() {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [newStatus, setNewStatus] = useState(bookingStatus[0].name);

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
  };

  // const handleBookingUpdate = async (ev) => {
  //   ev.preventDefault();
  //   console.log('Yes');
  // };

  if (!booking) {
    return '';
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
            <div className="bg-primary p-6 text-white rounded-2xl">
              <div>Total price</div>
              <div className="text-3xl">${booking.price}</div>
            </div>
          </div>
          <PlaceGallery place={booking.place} />
          
        </div>
      )}
    </>
  );
}
