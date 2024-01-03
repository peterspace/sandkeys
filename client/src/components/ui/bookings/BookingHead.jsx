import useCountries from '../../../hooks/useCountries';
import Heading from '../Heading';
import HeartButton from '../HeartButton';
import AddressLink from '../../../AddressLink';

const BookingHead = ({ id, currentUser, listing }) => {
  console.log({ listingInfo: listing });

  return (
    <>
      {/* <Heading
        title={title}
        subtitle={`${listing?.address}, ${listing?.city}`}
      /> */}
      <div className={'text-start'}>
        <div className="text-2xl font-bold">{listing?.room?.title}</div>
        <div className="font-light text-neutral-500 mt-2">
          <AddressLink>
            {listing?.room?.address}, {listing?.room?.city}
          </AddressLink>
        </div>
      </div>

      <div
        className="
          w-full
          h-[60vh]
          overflow-hidden 
          rounded-xl
          relative
        "
      >
        <img
          src={listing?.room?.photos && listing?.room?.photos[0]}
          fill
          className="object-cover w-full"
          alt="Image"
        />
        <div
          className="
            absolute
            top-5
            right-5
          "
        >
          <HeartButton listingId={id} currentUser={currentUser} />
        </div>
      </div>
    </>
  );
};

export default BookingHead;
