import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Range } from 'react-date-range';
import { differenceInDays, eachDayOfInterval } from 'date-fns';
import useLoginModal from '../../hooks/useLoginModal';
import { useNavigate } from 'react-router-dom';

import Container from '../../components/ui/Container';
// import { categories } from "../../components/ui/navbar/Categories";
// import Categories from "../../components/ui/Categories";
import { categories } from '../../components/ui/Categories';
import ListingHead from '../../components/ui/listings/ListingHead';
import ListingInfo from '../../components/ui/listings/ListingInfo';
import ListingReservation from '../../components/ui/listings/ListingReservation';
import ReservationWidget from '../../ReservationWidget';

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: 'selection',
};

const ListingClient = ({
  listing,
  // reservations = [],
  // reservations,
  disabledDates,
  currentUser,
  guestNumber,
}) => {
  const loginModal = useLoginModal();
  const navigate = useNavigate();

  // const disabledDates = useMemo(() => {
  //   let dates = [];

  //   reservations.forEach((reservation) => {
  //     const range = eachDayOfInterval({
  //       start: new Date(reservation.checkIn),
  //       end: new Date(reservation.checkOut),
  //     });

  //     dates = [...dates, ...range];
  //   });

  //   return dates;
  // }, [reservations]);

  // const disabledDates = useMemo(() => {
  //   let dates = [];
  //   reservations?.map((reservation) => {
  //     const range = eachDayOfInterval({
  //       start: new Date(reservation.checkIn),
  //       end: new Date(reservation.checkOut),
  //     });

  //     dates = [...dates, ...range];
  //   });

  //   return dates;
  // }, [reservations]);

  const category = useMemo(() => {
    return categories.find((items) => items.label === listing.roomType);
  }, [listing.roomType]);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [isReservation, setIsReservation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState(initialDateRange);
  console.log({ totalPrice: totalPrice });
  console.log({ dateRange: dateRange });

  //checkIn:dateRange.startDate
  //checkOut:dateRange.endDate

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInDays(dateRange.endDate, dateRange.startDate);

      if (dayCount && listing.price) {
        setTotalPrice(dayCount * listing.price);
      } else {
        setTotalPrice(listing.price);
      }
    }
  }, [dateRange, listing.price]);

  return (
    <Container>
      <div
        className="
          max-w-screen-lg 
          mx-auto
        "
      >
        <div className="flex flex-col gap-6">
          <ListingHead
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
            <ListingInfo
              user={listing.user}
              listing={listing}
              category={category}
              // category={""}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.maxGuests ? listing.maxGuests : 1}
              bathroomCount={listing.bathroomCount}
              locationValue={listing.locationValue}
            />
            {!isReservation && (
              <div className="order-first mb-10 md:order-last md:col-span-3">
                <ListingReservation
                  price={listing.price}
                  totalPrice={totalPrice}
                  onChangeDate={(value) => setDateRange(value)}
                  dateRange={dateRange}
                  onSubmit={setIsReservation}
                  disabled={isLoading}
                  disabledDates={disabledDates}
                />
              </div>
            )}

            {isReservation && (
              <>
                <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
                  <div className="mt-4 w-[600px]">
                    <ReservationWidget
                      // place={place}
                      user={currentUser}
                      place={listing}
                      checkIn={dateRange.startDate}
                      checkOut={dateRange.endDate}
                      guestNumber={guestNumber ? guestNumber : 1}
                      guestCity={listing?.city}
                      // type={type}
                      roomType={listing?.roomType}
                      setIsLoading={setIsLoading}
                      setIsReservation={setIsReservation}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ListingClient;
