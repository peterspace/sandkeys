import useCountries from '../../../hooks/useCountries';

import Avatar from '../Avatar';
import ListingCategory from './ListingCategory';
import Map from '../Map';

// const Map = dynamic(() => import('../Map'), {
//   ssr: false
// });

const BookingInfo = ({
  user,
  description,
  guestCount,
  roomCount,
  bathroomCount,
  category,
  locationValue,
  listing,
}) => {
  const { getByValue } = useCountries();

  const coordinates = getByValue(locationValue)?.latlng;
  //getoneroom
  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div
          className="
            text-xl 
            font-semibold 
            flex 
            flex-row 
            items-center
            gap-2
          "
        >
          <div>Hosted by {listing?.owner?.name}</div>
          <Avatar src={listing?.owner?.photo} />
        </div>
        <div
          className="
            flex 
            flex-row 
            items-center 
            gap-4 
            font-light
            text-neutral-500
          "
        >
          <div>{guestCount} guests</div>
          <div>{roomCount} rooms</div>
          <div>{bathroomCount} bathrooms</div>
        </div>
      </div>
      <hr />
      {category && (
        <ListingCategory
          icon={category.icon}
          label={category?.label}
          // label={listing?.roomType}
          description={category?.description}
        />
      )}
      <hr />
      <div
        className="
      text-lg font-light text-neutral-500"
      >
        {listing?.description}
      </div>
      <hr />
      {/* <Map center={coordinates} /> */}
    </div>
  );
};

export default BookingInfo;
