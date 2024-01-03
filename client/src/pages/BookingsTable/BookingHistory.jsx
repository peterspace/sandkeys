import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { differenceInCalendarDays, format } from 'date-fns';

// import { getTransactionByTxIdInternal } from '../../redux/features/transaction/transactionSlice';

const BookingHistory = (props) => {
  const { item, position } = props;
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isRedirect, setIsRedirect] = useState(false);

  useEffect(() => {
    if (user?.role === 'User' && isRedirect) {
      navigate(`/account/bookings/${item._id}`);
    }

    if (user?.role === 'Partner' && isRedirect) {
      navigate(`/admin/account/agentbookings/${item._id}`);
    }
  }, [isRedirect]);

  const checkInRaw = new Date(item?.checkIn);
  const checkOutRaw = new Date(item?.checkOut);

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

  let numberOfNights = 0;
  if (checkOut && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(item?.checkOut),
      new Date(item?.checkIn)
    );
  }

  const totalPrice = Number(item?.price) * numberOfNights;

  return (
    <>
      <div className="flex flex-col">
        <div
          className={`cursor-pointer grid grid-cols-11 gap-[12px] mr-2 ml-2 font-light p-4 border border-indigo-600 border-b  hover:bg-gray-100 hover:outline hover:outline-lightslategray-300 hover:outline-[1px]`}
        >
          <span className={`flex items-center text-center text-black`}>
            {position}
          </span>
          <span className={`flex items-center text-center text-black`}>
            {item?.room?.roomNumber}
          </span>
          <span className={`flex items-center text-center text-black`}>
            {checkIn}
          </span>
          <span className={`flex items-center text-center text-black`}>
            {checkOut}
          </span>
          <span className={`flex items-center text-center text-black`}>
            {item?.price}
          </span>
          <span className={`flex items-center text-center text-black`}>
            {numberOfNights}
          </span>
          <span className={`flex items-center text-center text-black`}>
            {totalPrice}
          </span>
          <span
            className={`flex flex-row justify-center items-center rounded-lg p-2 w-[100px] text-white ${
              item.depositStatus === 'Pending' &&
              'bg-indigo-400 hover:bg-indigo-600'
            } ${
              item.depositStatus === 'Unpaid' && 'bg-rose-600 hover:bg-rose-700'
            } ${
              item.depositStatus === 'Paid' && 'bg-blue-600 hover:bg-blue-400'
            }`}
          >
            {item?.depositStatus}
          </span>
          <span
            className={`flex flex-row justify-center items-center rounded-lg p-2 w-[100px] text-white ${
              item.paymentStatus === 'Pending' &&
              'bg-indigo-400 hover:bg-indigo-600'
            } ${
              item.paymentStatus === 'Unpaid' && 'bg-rose-600 hover:bg-rose-700'
            } ${
              item.paymentStatus === 'Paid' && 'bg-blue-600 hover:bg-blue-400'
            }`}
          >
            {item?.paymentStatus}
          </span>
          <span
            className={`flex flex-row justify-center items-center rounded-lg p-2 w-[100px] text-white ${
              item.status === 'Inactive' && 'bg-indigo-400 hover:bg-indigo-600'
            } ${
              item.status === 'Completed' && 'bg-rose-600 hover:bg-rose-700'
            } ${item.status === 'Active' && 'bg-blue-600 hover:bg-blue-400'}`}
          >
            {item?.status}
          </span>
          <span className={`flex gap-1 items-center text-center text-white `}>
            {/* <div
              className={`flex flex-col rounded-lg p-2 hover:bg-indigo-900 bg-indigo-600`}
              onClick={() => {
                setTxInfo(item);
                dispatch(getTransactionByTxIdInternal(item)); // dispatch txData globally
                setIsUpdate(true);
                setIsView(false);
                setIsTx(false);
              }}
            >
              <span className="text-smi text-gray-100">update</span>
            </div> */}

            <div
              className={`flex flex-row justify-center items-center rounded-lg p-2 w-[100px] text-white hover:bg-indigo-900 bg-indigo-600`}
              onClick={() => {
                setIsRedirect(true);
              }}
            >
              <span className="text-smi text-gray-100">View</span>
            </div>
          </span>
        </div>
        {/* <div className={`flex w-full h-px bg-lightslategray-300 `} /> */}
      </div>
    </>

    // </Link>
  );
};

export default BookingHistory;
