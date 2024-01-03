import React, { useState } from 'react';
import Calendar from '@demark-pro/react-booking-calendar';

// const reserved = [
//   {
//     startDate: new Date(2023, 3, 22),
//     endDate: new Date(2016, 4, 5),
//   },
// ];

const reserved = [
  {
    startDate: new Date(2023, 10, 5),
    endDate: new Date(2023, 10, 10),
  },
];

const BookingCalendar = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const handleChange = (e) => setSelectedDates(e);

  return (
    <Calendar
      selected={selectedDates}
      onChange={handleChange}
      onOverbook={(e, err) => alert(err)}
      components={{
        DayCellFooter: ({ innerProps }) => (
          <div {...innerProps}>Booked</div>
        ),
      }}
      disabled={(date, state) => !state.isSameMonth}
      reserved={reserved}
      variant="events"
      dateFnsOptions={{ weekStartsOn: 1 }}
      range={true}
    />
  );
};

export default BookingCalendar;
