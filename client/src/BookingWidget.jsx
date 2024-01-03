import { useEffect, useState } from 'react';
import { differenceInCalendarDays, format } from 'date-fns';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createBooking, getUserBookingById } from './services/apiService';
import { toast } from 'react-toastify';


import {
  bookingConfirmation,
  paymentConfirmation,
} from './services/apiService';
import StripeContainer from './pages/payment/StripeContainer';
import YandexPay from './pages/payment/YandexPay';

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

export default function BookingWidget(props) {
  const {
    user,
    place,
    checkIn,
    checkOut,
    guestNumber,
    guestCity,
    name,
    phone,
    price,
    totalPrice,
    paymentMethod,
    roomType,
    paymentId,
    reservationId,
  } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const txData = useSelector(
    (state) => state.reservation?.getOneUserReservationInternal
  );

  const email = user?.email;

  // const [currency, setCurrency] = useState('$');
  const [currency, setCurrency] = useState('RUB');
  const [isBookingVisible, setIsBookingVisible] = useState(true);
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);
  const [isBookingCompleted, setIsBookingCompleted] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);
  console.log({ paymentUrl: paymentUrl }); // redirect url for yandex pay
  const [bookingInfo, setBookingInfo] = useState();
  console.log({ bookingInfo: bookingInfo }); // redirect url for yandex pay
  const [booking, setBooking] = useState(false);

  const [isBookingFetched, setIsBookingFetched] = useState(false);

  const [emailResponse, setEmailResponse] = useState();

  const [newData, setNewData] = useState('');

  const isPaidL = localStorage.getItem('isPaid')
    ? JSON.parse(localStorage.getItem('isPaid'))
    : false;
  const [isPaid, setIsPaid] = useState(isPaidL);

  const formatDateLong = new Intl.DateTimeFormat('en-us', {
    dateStyle: 'long',
  });

  let numberOfNights = 0;

  if (checkOut && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  const userData = {
    checkIn,
    checkOut,
    numberOfGuests: guestNumber,
    name,
    phone,
    place: place?.room?.placeId, // placeId for room
    room: place?.room?._id, // roomId
    numberOfNights,
    price,
    // totalPrice: numberOfNights * place?.price,
    totalPrice,
    paymentMethod,
    owner: place?.owner?._id,
    status: 'Paid',
  };
  console.log({ userDataBooking: userData }); // redirect url for yandex pay

  console.log({ fullPlace: place }); // redirect url for yandex pay



  useEffect(() => {
    if (paymentId) {
      setIsPaid(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('isPaid', JSON.stringify(isPaid));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaid]);
  useEffect(() => {
    if (isPaid) {
      //yandex payment sucessfull
      BookThisPlace();
      setTimeout(() => {
        setIsPaymentCompleted(false);
      }, [2000]);
      setIsPaid(false);
    }
  }, [isPaid]);

  useEffect(() => {
    if (isPaymentCompleted) {
      //Stripe payment sucessfull
      BookThisPlace();
      setTimeout(() => {
        setIsPaymentCompleted(false);
      }, [2000]);
    }
  }, [isPaymentCompleted]);

  async function BookThisPlace() {
    const userData = {
      checkIn,
      checkOut,
      numberOfGuests: guestNumber,
      name,
      phone,
      place: place?.room?.placeId, // placeId for room
      room: place?.room?._id, // roomId
      numberOfNights,
      price,
      // totalPrice: numberOfNights * place?.price,
      totalPrice,
      paymentMethod,
      owner: place?.owner?._id,
      status: 'Paid',
    };

    console.log('userBookingdata', userData);
    const data = await createBooking(userData);
    if (data) {
      const bookingId = data?._id;
      console.log('bookingId:', bookingId);
      setBookingInfo(data);
      setIsBookingFetched(true); // new

      let info = {
        id: bookingId,
        status: 'paid',
      };

      localStorage.setItem('newPaid', JSON.stringify(info));

      setTimeout(() => {
        navigate(`/account/bookings/${bookingId}`);
      }, 2000);
    }
  }
  //BookThisPlace();
  useEffect(() => {
    if (isBookingFetched) {
      const response = getUserBookingById(bookingInfo?._id);

      if (response) {
        let promise = new Promise(function (resolve, reject) {
          resolve(response);
        });

        promise.then((result) => {
          console.log(result);
          setBooking(result?.data);
          setIsBookingCompleted(true); // new
          setIsBookingFetched(false); // new
        });
      }
    }
  }, [isBookingFetched]);

  useEffect(() => {
    if (isBookingCompleted) {
      setTimeout(() => {
        bookingEmail();
        setIsBookingCompleted(false); // new update is booking completed
      }, [1000]);
    }
  }, [isBookingCompleted]);

  //======send email to the user regarding their booking
  // send email to the hotel that their hotel has been booked
  async function bookingEmail() {
    let userData = {
      email: user?.email,
      name: user?.name,
      booking,
    };

    setNewData(userData);
    const response = bookingConfirmation(userData);

    if (response) {
      let promise = new Promise(function (resolve, reject) {
        resolve(response);
      });

      promise.then((result) => {
        console.log(result);
        setEmailResponse(result);
      });
    }
  }

  async function paymentEmail() {
    let userData = {
      email: user?.email,
      name: user?.name,
    };

    setNewData(userData);
    const response = paymentConfirmation(userData);

    if (response) {
      let promise = new Promise(function (resolve, reject) {
        resolve(response);
      });

      promise.then((result) => {
        console.log(result);
        setEmailResponse(result);
      });
    }
  }
  // redirects user to login page if not logged in
  const submitBooking = async () => {
    if (user?.token) {
      setIsBookingVisible(true);
    }
  };

  if (!user?.token) {
    return <Navigate to={'/auth'} />;
  }

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <p className="mt-6 text-lg font-bold text-gray-900 sm:mt-8 sm:text-2xl lg:text-xl xl:text-4xl">
        {name} You are booking
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
      {isBookingVisible ? null : (
        <div className="flex flex-col rounded-lg border border-indigo-300 p-2 outline outline-indigo-600 outline-[1px]">
          <button
            // onClick={() => BookThisPlace()}
            onClick={submitBooking}
            className="primary mt-4"
          >
            {/* Book this place */}
            Book
          </button>
        </div>
      )}

      {paymentMethod === 'Stripe' ? (
        <>
          <div className="mt-10">
            <StripeContainer
              amount={
                differenceInCalendarDays(
                  new Date(checkOut),
                  new Date(checkIn)
                ) *
                place?.price *
                0.25
              }
              setIsBookingVisible={setIsBookingVisible}
              setIsPaymentCompleted={setIsPaymentCompleted}
              reservationId={reservationId}
            />
          </div>
        </>
      ) : null}

      {paymentMethod === 'YooMoney' ? (
        <>
          <div className="mt-10">
            <YandexPay
              amount={
                differenceInCalendarDays(
                  new Date(checkOut),
                  new Date(checkIn)
                ) *
                place?.price *
                0.25
              }
              currency={currency}
              setPaymentUrl={setPaymentUrl}
              setIsBookingVisible={setIsBookingVisible}
              reservationId={reservationId}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
