import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPlace } from '../services/apiService';
import ClientOnly from '../components/ui/ClientOnly';
import EmptyState from '../components/ui/EmptyState';
import BookingClient from './ListingPage/BookingClient';
import { useSelector, useDispatch } from 'react-redux';
import { getOneRoom } from '../redux/features/place/placeSlice';
import { getOneUserReservationService } from '../services/apiService';
import { getOneUserReservationInternal } from '../redux/features/reservation/reservationSlice';

const cities = [
  {
    name: 'dubai',
    cityEN: 'Moscow',
    cityRU: 'Дубай',
    cityAR: 'موسكو',
  },
  {
    name: 'moscow',
    cityEN: 'Moscow',
    cityRU: 'Москва',
    cityAR: 'موسكو',
  },
  {
    name: 'saint-petersburg',
    cityEN: 'Saint Petersburg',
    cityRU: 'Санкт-Петербург',
    cityAR: 'سان بطرسبورج',
  },
];

const propertyTypes = [
  {
    name: 'hotel',
    placeEN: 'Hotel',
    placeRU: 'Гостиница',
    placeAR: 'الفندق',
  },
  {
    name: 'hotelApart',
    placeEN: 'Hotel Apart',
    placeRU: 'Отель Апарт',
    placeAR: 'فندق أبارت',
  },
  {
    name: 'apartment',
    placeEN: 'Apartment',
    placeRU: 'Квартира',
    placeAR: 'شقة',
  },
];

const roomTypes = [
  {
    name: 'Standard',
    nameEN: 'Standard',
    nameRU: 'Стандартный',
    nameAR: 'معيار',
  },
  {
    name: 'Studio',
    nameEN: 'Studio',
    nameRU: 'Студия',
    nameAR: 'استوديو',
  },
  {
    name: 'Superior',
    nameEN: 'Superior',
    nameRU: 'большой',
    nameAR: 'أرقى',
  },
  {
    name: 'Delux',
    nameEN: 'Delux',
    nameRU: 'Делюкс',
    nameAR: 'ديلوكس',
  },
  {
    name: 'Suite',
    nameEN: 'Suite',
    nameRU: 'люкс',
    nameAR: 'جناح',
  },
];

export default function BookRoomPage() {
  const { id, paymentId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  //====================================================================================================
  //======================================={LOGIN REDIRECT}=====================================
  //====================================================================================================

  const { user } = useSelector((state) => state.user);
  //==========================================================================

  const listing = useSelector(
    (state) => state.reservation?.getOneUserReservationInternal
  );
  console.log({ listing: listing });

  console.log({ listing: listing });
  const reservations = '';

  console.log({ id: id, paymentId: paymentId });

  const [callResponse, setCallResponse] = useState();
  console.log({ callResponse: callResponse });

  useEffect(() => {
    localStorage.setItem('prevLocation', JSON.stringify(location?.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id) {
      updateTxData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateTxData() {
    const response = await getOneUserReservationService(id);
    setCallResponse(response);
    if (response) {
      dispatch(getOneUserReservationInternal(response));
    }
  }

  if (!listing) {
    return (
      <ClientOnly>
        <EmptyState />
      </ClientOnly>
    );
  }
  return (
    <>
      <ClientOnly>
        <BookingClient
          listing={listing}
          reservations={reservations}
          currentUser={user}
          guestNumber={listing?.numberOfGuests}
          reservationId={id}
          paymentId={paymentId}
        />
      </ClientOnly>
    </>
  );
}
