import { useEffect, useState } from 'react';
import PlaceImg from '../PlaceImg';
import { Link, useLocation } from 'react-router-dom';
import BookingDates from '../BookingDates';
import {
  getUserBookings,
  updateBookingsAutomatically,
} from '../services/apiService';
import { differenceInCalendarDays, format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { BookingsTable } from './BookingsTable/BookingsTable';
import { LuTable2 } from 'react-icons/lu';
import { FaListUl } from 'react-icons/fa6';
import { MdGridView } from 'react-icons/md';
import ClientOnly from '../components/ui/ClientOnly';
import Container from '../components/ui/Container';
import MyListingCard from '../components/ui/myBookings/MyListingCard';

export default function BookingsPage() {
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const [bookings, setBookings] = useState([]);

  const [view, setView] = useState('pallet');

  console.log({ bookings: bookings });

  useEffect(() => {
    localStorage.setItem('prevLocation', JSON.stringify(location?.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getUserBookings().then((response) => {
      setBookings(response);
    });
  }, []);

  return (
    <div>
      {/* <AccountNav /> */}
      <nav className="mb-10 flex flex-row gap-2 py-2 bg-white mt-8 w-screen">
        <>
          <div
            className={`ml-6 rounded-lg hover:bg-gray-300 p-2 ${
              view === 'pallet' && 'bg-gray-200'
            }`}
            onClick={() => {
              setView('pallet');
            }}
          >
            <MdGridView size={20} color={'#111827'} />
          </div>
          <div
            className={`rounded-lg hover:bg-gray-300 p-2 ${
              view === 'list' && 'bg-gray-200'
            }`}
            onClick={() => {
              setView('list');
            }}
          >
            <FaListUl size={20} color={'#111827'} />
          </div>
          <div
            className={`rounded-lg hover:bg-gray-300 p-2 ${
              view === 'table' && 'bg-gray-200'
            }`}
            onClick={() => {
              setView('table');
            }}
          >
            <LuTable2 size={20} color={'#111827'} />
          </div>
        </>
      </nav>
      <div>
        <>
          {view === 'table' && (
            <> {bookings && <BookingsTable data={bookings} />}</>
          )}
          {view === 'list' && (
            <>
              {' '}
              {bookings &&
                bookings.map((booking, index) => (
                  <Link
                    to={`/account/bookings/${booking._id}`}
                    key={index}
                    className="flex gap-4 mt-8"
                  >
                    <div className="flex flex-row bg-gray-200 rounded-2xl overflow-hidden gap-10 ml-10 border border-gray-50 shadow-md">
                      <div className="flex flex-row items-center w-80 h-80 bg-gray-300 grow shrink-0 mt-4 mb-4">
                        <PlaceImg place={booking?.room} />
                      </div>
                      <div className="grow-0 shrink flex flex-col justify-center items-center px-10 mt-4 mb-4">
                        <h2 className="text-xl">{booking?.room?.title}</h2>
                        <button className="px-3 py-2 btn-primary rounded-2xl">
                          {booking?.status}
                        </button>
                        <div className="text-xl border bg-gray-100 rounded-lg mt-2 px-2 py-2 border-gray-50">
                          <div className="px-2 py-2">
                            <BookingDates
                              booking={booking}
                              className="mb-2 mt-4 text-gray-500"
                            />
                            <div className="flex flex-col sm:flex-row sm:justify-between">
                              <div className="flex text-2xl text-center font-semibold">
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
                                  <span className="text-base">Price:</span>
                                </div>
                              </div>
                              <div className="flex text-base text-center">
                                {booking.price} RUB
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:justify-between">
                              <div className="flex text-2xl text-center font-semibold">
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
                                  <span className="text-base">
                                    Total price:
                                  </span>
                                </div>
                              </div>
                              <div className="flex text-base text-center">
                                {differenceInCalendarDays(
                                  new Date(booking?.checkOut),
                                  new Date(booking?.checkIn)
                                ) * booking?.price}{' '}
                                RUB
                              </div>
                            </div>
                            <div className="flex flex-row justify-between mt-2">
                              <div
                                className={`flex flex-col rounded-lg p-1 bg-indigo-600`}
                              >
                                <span className="text-base text-gray-100 inline-block">
                                  Deposit Status
                                </span>
                              </div>
                              <div
                                className={`flex flex-col rounded-lg p-1 ${
                                  booking.depositStatus === 'Pending' &&
                                  'bg-yellow-400'
                                } ${
                                  booking.depositStatus === 'Unpaid' &&
                                  'bg-rose-600'
                                } ${
                                  booking.depositStatus === 'Paid' &&
                                  'bg-blue-600'
                                }`}
                              >
                                <span className="text-base text-gray-100 inline-block">
                                  {booking.depositStatus}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-row justify-between mt-2">
                              <div
                                className={`flex flex-col rounded-lg p-1 bg-indigo-600`}
                              >
                                <span className="text-base text-gray-100 inline-block">
                                  Payment Status
                                </span>
                              </div>
                              <div
                                className={`flex flex-col rounded-lg p-1 ${
                                  booking.paymentStatus === 'Pending' &&
                                  'bg-yellow-400'
                                } ${
                                  booking.paymentStatus === 'Unpaid' &&
                                  'bg-rose-600'
                                } ${
                                  booking.paymentStatus === 'Paid' &&
                                  'bg-blue-600'
                                }`}
                              >
                                <span className="text-base text-gray-100 inline-block">
                                  {booking.paymentStatus}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-row justify-between mt-2">
                              <div
                                className={`flex flex-col rounded-lg p-1 bg-indigo-600`}
                              >
                                <span className="text-base text-gray-100 inline-block">
                                  Booking Status
                                </span>
                              </div>
                              <div
                                className={`flex flex-col rounded-lg p-1 ${
                                  booking.status === 'Inactive' &&
                                  'bg-yellow-400'
                                } ${
                                  booking.status === 'Completed' &&
                                  'bg-rose-600'
                                } ${
                                  booking.status === 'Active' && 'bg-blue-600'
                                }`}
                              >
                                <span className="text-base text-gray-100 inline-block">
                                  {booking.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </>
          )}
          {view === 'pallet' && (
            <>
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
                    {bookings &&
                      bookings?.map((listing) => (
                        <div key={listing._id}>
                          <MyListingCard
                            data={listing}
                          />
                        </div>
                      ))}
                  </div>
                </Container>
              </ClientOnly>
            </>
          )}
        </>
      </div>
    </div>
  );
}
