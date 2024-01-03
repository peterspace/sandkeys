import { useMemo } from 'react';

const Date1 = ({
  calendarWithDates,
  chevronDown,
  datePosition,
  dateTop,
  dateLeft,
}) => {
  const dateStyle = useMemo(() => {
    return {
      position: datePosition,
      top: dateTop,
      left: dateLeft,
    };
  }, [datePosition, dateTop, dateLeft]);

  return (
    <div
      className="bg-white flex flex-row items-center justify-start p-1 gap-[8px] text-left text-[24px] text-grey-200 font-roboto"
      style={dateStyle}
    >
      <img
        className="relative rounded w-8 h-8 overflow-hidden shrink-0 object-cover"
        alt=""
        src={calendarWithDates}
      />
      <div className="relative">Choose</div>
      <img
        className="relative w-4 h-4 overflow-hidden shrink-0 object-cover"
        alt=""
        src={chevronDown}
      />
    </div>
  );
};

export default Date1;
