import React, { useEffect, useState } from 'react';
import {
  useParams,
  useNavigate,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getOneUserReservationInternal,
  getOneUserReservation,
} from '../../redux/features/reservation/reservationSlice';
import { getOneUserReservationService } from '../../services/apiService';
// import BookingWidget from '../../BookingWidget';
export const ApprovalStatusUser = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  // use for reservation tx
  /********************************************************************************************************************** */
  /********************************************************************************************************************** */
  /*********************************************     REDUX STATES    **************************************************** */
  /********************************************************************************************************************** */
  /********************************************************************************************************************** */
  const txData = useSelector(
    (state) => state.reservation?.getOneUserReservationInternal
  );
  /********************************************************************************************************************** */
  /********************************************************************************************************************** */
  /*********************************************     REACT STATES    **************************************************** */
  /********************************************************************************************************************** */
  /********************************************************************************************************************** */

  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    localStorage.setItem('prevLocation', JSON.stringify(location?.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (txData?.approval === 'Yes') {
      setIsApproved(true);
      setIsRejected(false);
      setIsBooking(false);
    }
  }, [txData]);

  useEffect(() => {
    if (txData?.approval === 'No') {
      setIsApproved(false);
      setIsRejected(true);
      setIsBooking(false);
    }
  }, [txData]);

  useEffect(() => {
    if (id) {
      updateTxData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateTxData() {
    const response = await getOneUserReservationService(id);
    if (response) {
      dispatch(getOneUserReservationInternal(response));
    }
  }

  //========{begin to monitor transaction after this click}=========================
  const updateTransaction = async () => {
    const userData = {
      id: txData?._id,
    };
    // await updateTransactionsAutomatically(userData);
  };

  const approvalWaitingCard = (
    <div className="flex justify-center rounded-lg bg-white shadow-[0px_2px_4px_rgba(26,_47,_79,_0.2)] w-[320px] xs:w-[340px] md:w-[500px] p-4">
      <div className="flex flex-col gap-[24px]">
        <div className="flex flex-col gap-[8px] md:gap-[12px]">
          <div className="flex flex-row gap-4 mt-[24px]">
            <div className="text-smi leading-[22px] text-darkgray-100 inline-block w-[50%]">
              Approval In Progress
            </div>
          </div>
          <div className="flex bg-lightslategray-300 md:w-[452px] w-[300px] h-px" />
        </div>

        <div className="flex flex-row rounded bg-gray-100 p-2 md:w-[452px] w-[300px]">
          <div className="ml-1 flex justify-center items-center w-[24px] flex-shrink-0">
            {' '}
          </div>
          <div className="text-xs leading-[14.4px] text-darkslategray-200 inline-block w-[424px]">
            We are currently waiting for the owners approval.
          </div>
        </div>
        <div className="flex bg-lightslategray-300 md:w-[452px] w-[300px] h-px" />
        <div className="flex flex-row justify-center items-center">
          <div className="cursor-pointer flex flex-row justify-center items-center bg-mediumspringgreen hover:opacity-90 text-white h-[49px] shrink-0 rounded w-full">
            Please hold ...
          </div>
        </div>

        <div className="flex flex-row w-full" />
      </div>
    </div>
  );

  const approvalCard = (
    <div className="flex justify-center rounded-lg bg-white shadow-[0px_2px_4px_rgba(26,_47,_79,_0.2)] w-[320px] xs:w-[340px] md:w-[500px] p-4">
      <div className="flex flex-col gap-[24px]">
        <div className="flex flex-col gap-[8px] md:gap-[12px]">
          <div className="flex flex-row gap-4 mt-[24px]">
            <div className="text-smi leading-[22px] text-darkgray-100 inline-block w-[50%]">
              Approved
            </div>
          </div>
          <div className="flex bg-lightslategray-300 md:w-[452px] w-[300px] h-px" />
        </div>

        <div className="flex flex-row rounded bg-gray-100 p-2 md:w-[452px] w-[300px]">
          <div className="ml-1 flex justify-center items-center w-[24px] flex-shrink-0">
            {' '}
          </div>
          <div className="text-xs leading-[14.4px] text-darkslategray-200 inline-block w-[424px]">
            Please proceed to payment
          </div>
        </div>
        <div className="flex bg-lightslategray-300 md:w-[452px] w-[300px] h-px" />
        <div className="flex flex-row justify-center items-center">
          <div
            className="cursor-pointer flex flex-row justify-center items-center bg-mediumspringgreen hover:opacity-90 text-white h-[49px] shrink-0 rounded w-full"
            onClick={() => {
              // navigate(`/placePage/${txData?._id}`);
              setIsApproved(false);
              setIsRejected(false);
              setIsBooking(true);
              navigate(`/booking/${txData?._id}`);
            }}
          >
            Pay
          </div>
        </div>

        <div className="flex flex-row w-full" />
      </div>
    </div>
  );

  const rejectedCard = (
    <div className="flex justify-center rounded-lg bg-white shadow-[0px_2px_4px_rgba(26,_47,_79,_0.2)] w-[320px] xs:w-[340px] md:w-[500px] p-4">
      <div className="flex flex-col gap-[24px]">
        <div className="flex flex-col gap-[8px] md:gap-[12px]">
          <div className="flex flex-row gap-4 mt-[24px]">
            <div className="text-smi leading-[22px] text-darkgray-100 inline-block w-[50%]">
              Not Approved
            </div>
          </div>
          <div className="flex bg-lightslategray-300 md:w-[452px] w-[300px] h-px" />
        </div>

        <div className="flex flex-row rounded bg-gray-100 p-2 md:w-[452px] w-[300px]">
          <div className="ml-1 flex justify-center items-center w-[24px] flex-shrink-0">
            {' '}
          </div>
          <div className="text-xs leading-[14.4px] text-darkslategray-200 inline-block w-[424px]">
            The property is cureently unavailable, please view other options in
            the city
          </div>
        </div>
        <div className="flex bg-lightslategray-300 md:w-[452px] w-[300px] h-px" />
        <div className="flex flex-row justify-center items-center">
          <div
            className="cursor-pointer flex flex-row justify-center items-center bg-mediumspringgreen hover:opacity-90 text-white h-[49px] shrink-0 rounded w-full"
            onClick={() => {
              navigate('/');
              setIsApproved(false);
              setIsRejected(false);
              setIsBooking(false);
            }}
          >
            View
          </div>
        </div>

        <div className="flex flex-row w-full" />
      </div>
    </div>
  );

  //=================={On Component Mount}==================================

  if (!user?.token) {
    return <Navigate to="/auth" />;
  }
  // return <>{sendFund}</>;
  return (
    <>
      {!isApproved && !isRejected && !isBooking && <>{approvalWaitingCard}</>}
      {isApproved && !isRejected && !isBooking && <>{approvalCard}</>}
      {!isApproved && isRejected && !isBooking && <>{rejectedCard}</>}
      {/* {!isApproved && !isRejected && !isBooking && (
        <>
          <BookingWidget />
        </>
      )} */}
    </>
  );
};
