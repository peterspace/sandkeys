import React, { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { eachDayOfInterval, endOfMonth, format, startOfToday, isToday, isSameMonth, isEqual, parse, add, getDay } from "date-fns";
// import {GlassmorphicWrapper} from './index';
import GlassmorphicWrapper from "./GlassmorphicWrapper";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');  
}

const DatePicker = ({dateSelectionHandler}) => {

  let today = startOfToday();
  const [selectedDate, setSelectedDate] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM yyyy'));
  let firstDayCurrentMonth = parse(currentMonth, 'MMM yyyy', new Date());
  let newDays = eachDayOfInterval({ start: firstDayCurrentMonth, end: endOfMonth(firstDayCurrentMonth) });

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM yyyy'))
  }

  function previousMonth() {
    let firstDayPreviousMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayPreviousMonth, 'MMM yyyy'));
  }

  function handleDateSelection(date) {
      setSelectedDate(date);
    dateSelectionHandler(format(date, 'MMM, dd, yyyy'));
    // dateSelectionHandler(date);
  }

  return (
    <GlassmorphicWrapper shadow={true} className="px-2 py-4 w-fit h-fit rounded-lg">
      {/* <div className="px-4 mx-auto sm:px-7 md:px-6 md:max-w-4xl"> */}
        <div className="md:grid md:grid-col-2">
          {/* <div className="md:pr-14"> */}
            <div className="flex items-center">
              <h2 className="flex-auto font-semibold text-gray-900 dark:text-gray-200">
                {format(firstDayCurrentMonth, 'MMMM yyyy')}
              </h2>

              <button type="button" onClick={previousMonth}><span className="sr-only">Previous month</span> <IoIosArrowBack /></button>
              <button type="button" onClick={nextMonth}><span className="sr-only">Next month</span> <IoIosArrowForward /></button>
            </div>

            {/* ==================== days of week row ==================== */}
            <div className="mt-5 grid grid-cols-7 text-s leading-6 text-center text-gray-500">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            {/* ==================== days matrix ==================== */}
            <div className="grid grid-cols-7 text-sm text-center">
              {
                newDays.map((day, dayIdx) => (
                  <div
                    key={day.toString()}
                    className={classNames(
                      dayIdx > 6 && 'border-t border-gray-200 dark:border-gray-500',
                      dayIdx === 0 && colStartClasses[getDay(day)],
                      'py-2'
                    )}
                  >
                    <button
                      type="button"
                      className={classNames(
                        isEqual(day, selectedDate) && 'text-white',
                        !isEqual(day, selectedDate) && isToday(day) && 'text-sky-600',
                        !isEqual(day, selectedDate) && !isToday(day) && isSameMonth(day, firstDayCurrentMonth) && 'text-gray-900 font-normal dark:text-gray-300',
                        !isEqual(day, selectedDate) && !isToday(day) && !isSameMonth(day, firstDayCurrentMonth) && 'text-gray-400 dark:text-gray-900',
                        isEqual(day, selectedDate) && isToday(day) && 'bg-sky-600',
                        isEqual(day, selectedDate) && !isToday(day) && 'bg-gray-900 dark:bg-gray-200 dark:text-gray-900',
                        !isEqual(day, selectedDate) && 'hover:bg-sky-600',
                        (isEqual(day, selectedDate) || isToday(day)) && 'font-semibold',
                        'mx-auto flex h-6 w-6 items-center justify-center rounded-full hover:text-white'
                      )}
                      onClick={()=>handleDateSelection(day)}
                    >
                      <time dateTime={format(day, 'yyyy-MM-dd')}>
                        {format(day, 'd')}
                      </time>
                    </button>
                  </div>
                ))
              }
            </div>
          {/* </div> */}
        </div>
      {/* </div> */}
    </GlassmorphicWrapper>
  );
};

// Moving the date columns in the grid layout
let colStartClasses = [
  '', // sunday
  'col-start-2', // monday
  'col-start-3', // tuesday
  'col-start-4', // wednesday
  'col-start-5', // thursday
  'col-start-6', // friday
  'col-start-7' // saturday
]

export default DatePicker;
