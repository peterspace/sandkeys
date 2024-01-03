import { useState, useEffect } from 'react';
import BookingHistory from './BookingHistory';
import Skeleton from './Skeleton';

export const MarketsTitle = () => {
  return (
    <div
      className={`grid grid-cols-11 gap-[24px] m-4 font-light p-4 border border-indigo-600 border-b text-black`}
    >
      <span className="flex items-center text-center">
        {' '}
        <p className="font-semibold">#</p>
      </span>
      <span className="flex items-center text-center">
        {' '}
        <p className="font-semibold">Room</p>
      </span>
      <span className="flex items-center text-center">
        {' '}
        <p className="font-semibold">CheckIn</p>
      </span>
      <span className={`flex items-center gap-1`}>
        <p className="font-semibold">CheckOut</p>
      </span>
      <div className="hidden sm:block">
        <p className="font-semibold">Price</p>
      </div>
      <div className="hidden sm:block">
        <p className="font-semibold">Nights</p>
      </div>
      <div className="hidden sm:block">
        <p className="font-semibold">Total Price</p>
      </div>
      <div className="hidden sm:block">
        <p className="font-semibold">Deposit</p>
      </div>
      <div className="hidden sm:block">
        <p className="font-semibold">Payment</p>
      </div>
      <div className="hidden sm:block">
        <p className="font-semibold">Booking</p>
      </div>
      <div className="hidden sm:block">
        <p className="font-semibold">Update</p>
      </div>
    </div>
  );
};

const BookingHistoryTable = (props) => {
  const { data } = props;

  const [loading, setIsLoading] = useState(false);

  if (loading) {
    return (
      <div className="wrapper-container mt-8">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-full mt-2" />
        <Skeleton className="h-8 w-full mt-2" />
        <Skeleton className="h-8 w-full mt-2" />
        <Skeleton className="h-8 w-full mt-2" />
        <Skeleton className="h-8 w-full mt-2" />
        <Skeleton className="h-8 w-full mt-2" />
        <Skeleton className="h-8 w-full mt-2" />
      </div>
    );
  }

  return (
    <section className={`flex mt-8 flex-col gap-[8px]`}>
      <div
        className={`mt-[8px] ml-[8px] text-lg font-sans font-bold inline-block text-mediumspringgreen`}
      >
        {'Booking History'}
      </div>
      <div
        className={`m-4 flex flex-col rounded-lg shadow-lg h-[740px] py-4 bg-white`}
      >
        <MarketsTitle />
        <div className={`flex w-full h-px bg-lightslategray-300 `} />
        <div className="overflow-scroll">
          {data &&
            data.map((item, idx) => (
              <BookingHistory key={idx} position={idx + 1} item={item} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default BookingHistoryTable;
