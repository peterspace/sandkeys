import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCallback, useMemo } from 'react';
import { differenceInCalendarDays, format } from 'date-fns';

import useCountries from '../../../hooks/useCountries';

import HeartButton from '../HeartButton';
import Button from '../Button';
import AddressLink from '../../../AddressLink';
import BookingDates from '../../../BookingDates';
import { MdDateRange } from 'react-icons/md';
import { MdOutlineBedroomParent } from 'react-icons/md';
import { MdOutlinePriceChange } from 'react-icons/md';
import { MdPriceChange } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';

const MyListingCard = ({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = '',
  currentUser,
}) => {
  const navigate = useNavigate();
  const { getByValue } = useCountries();

  const location = getByValue(data.locationValue);
  const { user } = useSelector((state) => state.user);
  const [isRedirect, setIsRedirect] = useState(false);

  const handleCancel = useCallback(() => {
    e.stopPropagation();

    if (disabled) {
      return;
    }

    onAction?.(actionId);
  }, [disabled, onAction, actionId]);

  const checkInRaw = new Date(data?.checkIn);
  const checkOutRaw = new Date(data?.checkOut);

  //===full ==> Monday, September 11, 2023
  const formatDate = new Intl.DateTimeFormat('en-us', {
    dateStyle: 'full',
  });

  //===long ==> September 11, 2023
  const formatDateLong = new Intl.DateTimeFormat('en-us', {
    dateStyle: 'long',
  });

  //===medium ==> Sep 10, 2023
  const formatDateMedium = new Intl.DateTimeFormat('en-us', {
    dateStyle: 'medium',
  });

  const checkIn = formatDateMedium.format(checkInRaw);
  const checkOut = formatDateMedium.format(checkOutRaw);

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }

    return data.price;
  }, [reservation, data.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }

    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, 'PP')} - ${format(end, 'PP')}`;
  }, [reservation]);

  useEffect(() => {
    if (user?.role === 'User' && isRedirect) {
      navigate(`/account/bookings/${data._id}`);
    }

    if (user?.role === 'Partner' && isRedirect) {
      navigate(`/admin/account/agentbookings/${data._id}`);
    }
  }, [isRedirect]);

  //   <div
  //   className={`flex justify-center items-center rounded-lg shadow-[0px_2px_4px_rgba(26,_47,_79,_0.2)] w-[320px] p-4 ${
  //     mode === true
  //       ? "bg-white"
  //       : "bg-bgDark outline outline-bgDarkOutline outline-[1px]"
  //   }`}
  // >
  return (
    <div
      onClick={() => setIsRedirect(true)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full rounded-xl bg-white outline outline-gray-200 outline-[1px] p-2 shadow-lg">
        <div
          className="
            aspect-square 
            w-full 
            relative 
            overflow-hidden 
            rounded-xl
          "
        >
          <img
            fill
            className="
              object-cover 
              h-full 
              w-full 
              group-hover:scale-110 
              transition
            "
            src={data?.room?.photos?.[0]}
            alt="Listing"
          />
        </div>
        <div className="font-semibold text-lg">
          <AddressLink>
            {data?.room?.address}, {data?.room?.city}
          </AddressLink>
        </div>
        <div className="p-4">
          <div className="flex flex-col sm:flex-row sm:justify-between text-rose-600">
            <div className="flex text-2xl text-center font-semibold">
              <div className="flex gap-1">
                <MdOutlineBedroomParent />
                <span className="text-base"> Type:</span>
              </div>
            </div>
            <div className="flex text-base text-center">
              {data?.room?.roomType}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between text-rose-600">
            <div className="flex text-2xl text-center font-semibold">
              <div className="flex gap-1">
                <MdDateRange />
                <span className="text-base"> From:</span>
              </div>
            </div>
            <div className="flex text-base text-center">{checkIn}</div>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between text-rose-600">
            <div className="flex text-2xl text-center font-semibold">
              <div className="flex gap-1">
                <MdDateRange />
                <span className="text-base"> To:</span>
              </div>
            </div>
            <div className="flex text-base text-center">{checkOut}</div>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between text-blue-700">
            <div className="flex text-2xl text-center font-semibold">
              <div className="flex gap-1">
                <MdOutlinePriceChange />
                <span className="text-base"> Price:</span>
              </div>
            </div>
            <div className="flex text-base text-center">{data.price} RUB</div>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between text-blue-700">
            <div className="flex text-2xl text-center font-semibold">
              <div className="flex gap-1">
                <MdPriceChange />
                <span className="text-base"> Total price::</span>
              </div>
            </div>
            <div className="flex text-base text-center">
              {differenceInCalendarDays(
                new Date(data?.checkOut),
                new Date(data?.checkIn)
              ) * data?.price}{' '}
              RUB
            </div>
          </div>
          <div className="flex flex-row justify-between mt-2">
            <div className={`flex flex-col rounded-lg p-1 bg-indigo-600`}>
              <span className="text-base text-gray-100 inline-block">
                Deposit Status
              </span>
            </div>
            <div
              className={`flex flex-col rounded-lg p-1 ${
                data?.depositStatus === 'Pending' && 'bg-yellow-400'
              } ${data?.depositStatus === 'Unpaid' && 'bg-rose-600'} ${
                data?.depositStatus === 'Paid' && 'bg-blue-600'
              }`}
            >
              <span className="text-base text-gray-100 inline-block">
                {data?.depositStatus}
              </span>
            </div>
          </div>

          <div className="flex flex-row justify-between mt-2">
            <div className={`flex flex-col rounded-lg p-1 bg-indigo-600`}>
              <span className="text-base text-gray-100 inline-block">
                Payment Status
              </span>
            </div>
            <div
              className={`flex flex-col rounded-lg p-1 ${
                data?.paymentStatus === 'Pending' && 'bg-yellow-400'
              } ${data?.paymentStatus === 'Unpaid' && 'bg-rose-600'} ${
                data?.paymentStatus === 'Paid' && 'bg-blue-600'
              }`}
            >
              <span className="text-base text-gray-100 inline-block">
                {data?.paymentStatus}
              </span>
            </div>
          </div>
          <div className="flex flex-row justify-between mt-2">
            <div className={`flex flex-col rounded-lg p-1 bg-indigo-600`}>
              <span className="text-base text-gray-100 inline-block">
                Booking Status
              </span>
            </div>
            <div
              className={`flex flex-col rounded-lg p-1 ${
                data?.status === 'Inactive' && 'bg-yellow-400'
              } ${data?.status === 'Completed' && 'bg-rose-600'} ${
                data?.status === 'Active' && 'bg-blue-600'
              }`}
            >
              <span className="text-base text-gray-100 inline-block">
                {data?.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyListingCard;
