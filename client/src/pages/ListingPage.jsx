import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPlace } from '../services/apiService';
import ClientOnly from '../components/ui/ClientOnly';
import EmptyState from '../components/ui/EmptyState';
import ListingClient from './ListingPage/ListingClient';
import { useSelector, useDispatch } from 'react-redux';
import { getOneRoom } from '../redux/features/place/placeSlice';
import { getRoomsByBookingDateService } from '../services/apiService';
import { differenceInDays, eachDayOfInterval } from 'date-fns';

export default function ListingPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  //====================================================================================================
  //======================================={LOGIN REDIRECT}=====================================
  //====================================================================================================

  const { user } = useSelector((state) => state.user);
  //==========================================================================
  const numberOfGuestsL = localStorage.getItem('maxGuests')
    ? JSON.parse(localStorage.getItem('maxGuests'))
    : 1;

  const guestNumber = Number(numberOfGuestsL);
  console.log({ guestNumber: guestNumber });

  const listing = useSelector((state) => state?.place?.fetchedOneRoom) || null;
  console.log({ listing: listing });
  const txData = useSelector(
    (state) => state.reservation?.getOneUserReservationInternal
  );

  const [reservations, setReservations] = useState([]);
  const [disabledDates, setDisabledDates] = useState([]);

  // console.log({ reservations: reservations });
  // console.log({ disabledDates: disabledDates });

  console.log({ listing: listing });
  // const disableDate = '';

  useEffect(() => {
    localStorage.setItem('prevLocation', JSON.stringify(location?.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(getOneRoom(id));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchBookedDates();
      // fetchDisabledDates();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchBookedDates() {
    const response = await getRoomsByBookingDateService(id);
    if (response) {
      setReservations(response);

      let dates = [];

      response?.map((reservation) => {
        const range = eachDayOfInterval({
          start: new Date(reservation.checkIn),
          end: new Date(reservation.checkOut),
        });

        dates.push(range);
        // dates = [...dates, ...range];
      });

      setDisabledDates(dates);
    }
  }

  useEffect(() => {
    if (txData?.approval === 'Pending') {
      navigate(`/approvalStatusUser/${txData?._id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txData]);

  // async function fetchDisabledDates() {
  //   let dates = [];
  //   reservations?.map((reservation) => {
  //     const range = eachDayOfInterval({
  //       start: new Date(reservation.checkIn),
  //       end: new Date(reservation.checkOut),
  //     });

  //     dates.push(range);
  //   });

  //   setDisabledDates(dates);
  // }

  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }
  return (
    <>
      {listing && (
        <>
          <ClientOnly>
            <ListingClient
              listing={listing}
              // reservations={reservations}
              disabledDates={disabledDates}
              currentUser={user}
              guestNumber={guestNumber}
            />
          </ClientOnly>
        </>
      )}
    </>
  );
}
