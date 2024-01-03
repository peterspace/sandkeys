import { useEffect, useState } from 'react';
import { differenceInCalendarDays, format } from 'date-fns';
import { Navigate, useParams, useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';

import {
  createBooking,
  getUserBookingById,
  createReservationService,
} from './services/apiService';
import { getOneUserReservationInternal } from './redux/features/reservation/reservationSlice';
import { toast } from 'react-toastify';

import {
  bookingConfirmation,
  paymentConfirmation,
} from './services/apiService';
import StripeContainer from './pages/payment/StripeContainer';
import YandexPay from './pages/payment/YandexPay';
import { reservationNotificationOwner } from './redux/features/reservation/reservationSlice';

const paymentOptions = [
  {
    name: 'Stripe',
    logo: '/stripe.png',
    // bgClass: 'bg-gray-200',
  },
  {
    name: 'YooMoney',
    logo: '/yoomoney.png',
    // bgClass: 'bg-gray-200',
  },
  {
    name: 'Stripe',
    logo: '/stripe.png',
    // bgClass: 'bg-gray-200',
  },
];

export const Providers = (props) => {
  const { provider } = props;
  const newRate = (
    <div className="flex flex-row justify-between items-center w-full">
      <div className="flex flex-row justify-center items-center p-2 gap-1">
        <div
          className={`${
            provider?.bgClass ? provider?.bgClass : 'bg-gray-100 rounded'
          }`}
        >
          <img src={provider?.logo} alt="" className="h-[25px] w-$ p-1" />
        </div>
      </div>

      <div className="h-3 py-2">{provider?.name}</div>
    </div>
  );
  return <>{newRate}</>;
};

export default function ReservationWidget(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    user,
    place,
    checkIn,
    checkOut,
    guestNumber,
    guestCity,
    roomType,
    setIsLoading,
    setIsReservation,
  } = props;
  console.log({ checkIn: checkIn, checkOut: checkOut });

  const email = user?.email;
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0]);
  console.log({ paymentMethod: paymentMethod });
  const [reservationResponse, setReservationResponse] = useState();
  console.log({ reservationResponse: reservationResponse });

  // const [currency, setCurrency] = useState('$');
  const [currency, setCurrency] = useState('RUB');

  const isPaidL = localStorage.getItem('isPaid')
    ? JSON.parse(localStorage.getItem('isPaid'))
    : false;
  const [isPaid, setIsPaid] = useState(isPaidL);

  const formatDateLong = new Intl.DateTimeFormat('en-us', {
    dateStyle: 'long',
  });

  let numberOfNights = 0;

  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  useEffect(() => {
    if (guestCity === 'dubai') {
      setPaymentMethod(paymentOptions[0]?.name);
    } else {
      setPaymentMethod(paymentOptions[1]?.name);
    }
  }, [guestCity]);

  useEffect(() => {
    if (reservationResponse) {
      dispatch(getOneUserReservationInternal(reservationResponse)); // first dispatch
      // navigate(`/approvalStatusUser/${response?._id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservationResponse]);

  async function BookThisPlace() {
    setIsLoading(true);
    const userData = {
      checkIn: checkIn,
      checkOut: checkOut,
      numberOfGuests: guestNumber,
      name,
      phone,
      place: place?.placeId, // placeId for room
      room: place?._id, // roomId
      numberOfNights,
      price: place?.price,
      // totalPrice: numberOfNights * place?.price,
      totalPrice:
        differenceInCalendarDays(new Date(checkOut), new Date(checkIn)) *
        place?.price,
      paymentMethod,
      owner: place?.owner,
      // status: 'Paid',
    };

    const response = await createReservationService(userData);

    if (response) {
      let userData = {
        bookingId: response?._id,
      };
      dispatch(reservationNotificationOwner(userData)); // first dispatch
      // setIsLoading(false);
      // setIsReservation(false); //check
      setReservationResponse(response);
      // dispatch(getOneUserReservationInternal(response)); // first dispatch
      // navigate(`approvalStatusUser/${response?._id}`);
    }
  }

  // useEffect(() => {
  //   if (reservationResponse) {
  //     dispatch(getOneUserReservationInternal(reservationResponse)); // first dispatch
  //   }
  // }, [reservationResponse]);

  // if (!user?.token) {
  //   return <Navigate to={'/auth'} />;
  // }

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <p className="mt-6 text-lg font-bold text-gray-900 sm:mt-8 sm:text-2xl lg:text-xl xl:text-4xl">
        {' '}
        You are booking
        <br className="inline" />
        <span className="text-indigo-500 ml-2">{roomType}</span>
        {/* <br className="inline" /> */}
        <span className="ml-2">in</span>
        {/* <br className="inline" /> */}
        <span className="text-indigo-500 ml-2">{guestCity}</span>
      </p>
      <div className="text-gray-700 text-xs">
        {' '}
        Kindly confirm that you are making the right booking
      </div>

      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex flex-col sm:flex-row justify-start items-start sm:justify-between sm:items-center">
        <div>
          <h2 className="text-2xl mb-4">Your booking information:</h2>
          {/* <PreBookingDates checkIn={activeCheckIn} checkOut={activeCheckOut} /> */}
        </div>
        <div className="bg-primary p-6 text-white rounded-2xl">
          <div>Total price</div>
          <div className="text-3xl">
            ₽{' '}
            {differenceInCalendarDays(new Date(checkOut), new Date(checkIn)) *
              place?.price}
          </div>
        </div>
      </div>

      <div className="bg-gray-200 p-6 my-6 rounded-2xl  flex flex-col gap-2 text-blue-700">
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <div className="flex text-2xl text-center font-semibold">Price:</div>
          <div className="flex text-2xl text-center">
            {place?.price} RUB/ night
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <div className="flex text-2xl text-center font-semibold">
            Number of nights:
          </div>
          <div className="flex text-2xl text-center">
            {differenceInCalendarDays(new Date(checkOut), new Date(checkIn))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <div className="flex text-2xl text-center font-semibold">
            Total Price:
          </div>
          <div className="flex text-2xl text-center">
            {differenceInCalendarDays(new Date(checkOut), new Date(checkIn)) *
              place?.price}{' '}
            RUB for{' '}
            {differenceInCalendarDays(new Date(checkOut), new Date(checkIn))}{' '}
            nights
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <div className="flex text-2xl text-center font-semibold">
            Deposit:{' '}
          </div>
          <div className="flex text-2xl text-center">
            {differenceInCalendarDays(new Date(checkOut), new Date(checkIn)) *
              place?.price *
              0.25}{' '}
            RUB
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <div className="flex text-2xl text-center font-semibold">
            Balance:{' '}
          </div>
          <div className="flex text-2xl text-center">
            {differenceInCalendarDays(new Date(checkOut), new Date(checkIn)) *
              place?.price *
              0.75}{' '}
            RUB
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <div className="flex text-2xl text-center font-semibold">Total:</div>
          <div className="flex text-2xl text-center">
            {differenceInCalendarDays(new Date(checkOut), new Date(checkIn)) *
              place?.price}{' '}
            RUB
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <div className="flex text-2xl text-center font-semibold">
            Check-in:
          </div>
          <div className="flex text-2xl text-center">
            {formatDateLong.format(new Date(checkIn))} (from {place.checkIn}:00)
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between">
          <div className="flex text-2xl text-center font-semibold">
            Check-out:
          </div>
          <div className="flex text-2xl text-center">
            {formatDateLong.format(new Date(checkOut))} (till {place.checkOut}
            :00)
          </div>
        </div>
      </div>

      <div className="border rounded-2xl mt-4">
        <div className="py-3 px-4 border-t"></div>
        {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Your full name:</label>
            <input
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />
            <label>Phone number:</label>
            <input
              type="tel"
              value={phone}
              onChange={(ev) => setPhone(ev.target.value)}
            />
            {/* <div className="flex flex-col gap-2 items-center">
              <label htmlFor="paymentMethod" className="text-lg text-gray-500">
                Payment:
              </label>
              {guestCity === 'dubai' ? (
                <div
                  className="cursor-pointer border-solid hover:border-2 hover:border-mediumspringgreen flex justify-center rounded-lg bg-white shadow-[0px_2px_4px_rgba(26,_47,_79,_0.2)] w-[320px] xs:w-[340px] md:w-[500px] p-4"
                  onClick={() => {
                    setPaymentMethod(paymentOptions[0]?.name);
                  }}
                >
                  <Providers provider={paymentOptions[2]} />
                </div>
              ) : (
                <div
                  className="cursor-pointer border-solid hover:border-2 hover:border-mediumspringgreen flex justify-center rounded-lg bg-white shadow-[0px_2px_4px_rgba(26,_47,_79,_0.2)] w-[320px] xs:w-[340px] md:w-[500px] p-4"
                  onClick={() => {
                    setPaymentMethod(paymentOptions[1]?.name);
                  }}
                >
                  <Providers provider={paymentOptions[1]} />
                </div>
              )}
            </div> */}
          </div>
        )}
      </div>
      {user.token ? (
        <div className="flex flex-col rounded-lg border border-indigo-300 p-2 outline outline-indigo-600 outline-[1px]">
          {/* <button onClick={BookThisPlace}>
            Book
          </button> */}
          <button onClick={BookThisPlace}>Submit</button>
        </div>
      ) : (
        <button className="primary mt-4" onClick={() => navigate('/auth')}>
          Login to Check out
        </button>
      )}
    </div>
  );
}
