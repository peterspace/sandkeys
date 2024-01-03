import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useLoginModal from '../../hooks/useLoginModal';
import { useNavigate } from 'react-router-dom';
import Container from '../../components/ui/Container';
// import { categories } from "../../components/ui/navbar/Categories";
// import Categories from "../../components/ui/Categories";
import { categories } from '../../components/ui/Categories';
import BookingHead from '../../components/ui/bookings/BookingHead';
import BookingInfo from '../../components/ui/bookings/BookingInfo';
import BookingWidget from '../../BookingWidget';

const BookingClient = ({
  listing,
  // reservations = [],
  currentUser,
  guestNumber,
  reservationId,
  paymentId,
}) => {
  const loginModal = useLoginModal();
  const navigate = useNavigate();

  // const disabledDates = useMemo(() => {
  //   let dates = [];

  //   reservations.forEach((reservation) => {
  //     const range = eachDayOfInterval({
  //       start: new Date(reservation.startDate),
  //       end: new Date(reservation.endDate)
  //     });

  //     dates = [...dates, ...range];
  //   });

  //   return dates;
  // }, [reservations]);

  const category = useMemo(() => {
    return categories.find((items) => items.label === listing.roomType);
  }, [listing.roomType]);

  return (
    <Container>
      <div
        className="
          max-w-screen-lg 
          mx-auto
        "
      >
        <div className="flex flex-col gap-6">
          <BookingHead
            id={listing._id}
            listing={listing}
            currentUser={currentUser}
          />
          <div
            className="
              grid 
              grid-cols-1 
              md:grid-cols-7 
              md:gap-10 
              mt-6
            "
          >
            <BookingInfo
              user={listing.user}
              listing={listing}
              category={category}
              // category={""}
              description={listing.description}
              roomCount={listing.room?.roomCount}
              guestCount={listing.numberOfGuests}
              bathroomCount={listing.room?.bathroomCount}
              locationValue={listing.locationValue}
            />
            <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
              <div className="mt-4 w-[600px]">
                <BookingWidget
                  // place={place}
                  user={currentUser}
                  place={listing}
                  checkIn={listing?.checkIn}
                  checkOut={listing?.checkOut}
                  guestNumber={listing?.numberOfGuests}
                  guestCity={listing?.room?.city}
                  name={listing?.name}
                  phone={listing?.phone}
                  price={listing?.price}
                  totalPrice={listing?.totalPrice}
                  paymentMethod={listing?.paymentMethod}
                  // type={type}
                  roomType={listing?.room?.roomType}
                  reservationId={reservationId}
                  paymentId={paymentId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default BookingClient;
