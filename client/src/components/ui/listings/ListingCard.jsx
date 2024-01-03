import { useNavigate } from 'react-router-dom';

import { useCallback, useMemo } from 'react';
import { format } from 'date-fns';

import useCountries from '../../../hooks/useCountries';

import HeartButton from '../HeartButton';
import Button from '../Button';
import AddressLink from '../../../AddressLink';

const ListingCard = ({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = '',
  currentUser,
  totalRoomType,
}) => {
  const navigate = useNavigate();
  const { getByValue } = useCountries();

  const location = getByValue(data.locationValue);

  const handleCancel = useCallback(() => {
    e.stopPropagation();

    if (disabled) {
      return;
    }

    onAction?.(actionId);
  }, [disabled, onAction, actionId]);

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }

    return data.price;
  }, [reservation, data.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }

    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, 'PP')} - ${format(end, 'PP')}`;
  }, [reservation]);

  return (
    <div
      onClick={() => navigate(`/listingPage/${data._id}`)}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div
          className="
            aspect-square 
            w-full 
            relative 
            overflow-hidden 
            rounded-xl
          "
        >
          <img
            fill
            className="
              object-cover 
              h-full 
              w-full 
              group-hover:scale-110 
              transition
            "
            src={data?.photos?.[0]}
            alt="Listing"
          />
          <div
            className="
            absolute
            top-3
            right-3
          "
          >
            <HeartButton listingId={data.id} currentUser={currentUser} />
          </div>
        </div>
        <div className="font-semibold text-lg">

          <AddressLink>
            {data?.address}, {data?.city}
          </AddressLink>
        </div>
        <div className="font-light text-neutral-500">
          {data?.roomType}
        </div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">₽ {data?.price}</div>
          {!reservation && <div className="font-light">night</div>}
        </div>
        <span className="text-xs font-semibold text-red-600">
          {/* Only {totalRoomType} rooms left at this price on our site */}
          Only {totalRoomType} {data?.roomType} rooms left at this {data?.type}
        </span>
        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default ListingCard;
