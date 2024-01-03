import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// import getReservations from '@/app/actions/getReservations';
// import getReservations from '@/app/actions/getReservations';

import ClientOnly from '../../components/ui/ClientOnly';
import EmptyState from '../../components/ui/EmptyState';
import { useSelector, useDispatch } from 'react-redux';

import ListingClient from './ListingClient';
import { getOneRoom } from '../../redux/features/place/placeSlice';


  export default function ListingPage(){
  //state.fetchedOneRoom
  const { id } = useParams();
  const dispatch = useDispatch();
  // const listing = localStorage.getItem('selectedPlace')
  //   ? JSON.parse(localStorage.getItem('selectedPlace'))
  //   : null;

  const listing = useSelector((state) => state?.place?.fetchedOneRoom) || null;
  console.log({ listing: listing });

  // const listing = await getListingById(params);
  // const reservations = await getReservations(params);
  const reservations = '';

  const currentUser = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null;

  useEffect(() => {
    if (id) {
      dispatch(getOneRoom(id));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
        <ListingClient
          listing={listing}
          // reservations={reservations}
          currentUser={currentUser}
        />
      </ClientOnly>
    </>
  );
};
