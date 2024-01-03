import { useMemo } from 'react';

const Location1 = ({
  cityName,
  buildingCode,
  locationPosition,
  locationTop,
  locationLeft,
}) => {
  const locationStyle = useMemo(() => {
    return {
      position: locationPosition,
      top: locationTop,
      left: locationLeft,
    };
  }, [locationPosition, locationTop, locationLeft]);

  return (
    <div
      className="bg-white overflow-hidden flex flex-row items-center justify-start p-1 gap-[8px] text-left text-[24px] text-grey-200 font-roboto"
      style={locationStyle}
    >
      <div className="relative">{cityName}</div>
      <img
        className="relative w-4 h-4 overflow-hidden shrink-0 object-cover"
        alt=""
        src={buildingCode}
      />
    </div>
  );
};

export default Location1;
