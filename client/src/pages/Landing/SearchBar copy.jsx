import Location1 from "./Location1";
import Date1 from "./Date1";

const SearchBar = () => {
  return (
    <div className="rounded-md bg-grey-200 box-border overflow-hidden flex flex-row items-end justify-between py-5 px-[50px] text-left text-[24px] text-white font-roboto self-stretch border-[1px] border-solid border-gray-500">
      <div className="relative w-[124px] h-[74px]">
        <Location1
          cityName="Moscow"
          buildingCode="/chevrondown@2x.png"
          locationPosition="absolute"
          locationTop="38px"
          locationLeft="0px"
        />
        <div className="absolute top-[0px] left-[1px] flex flex-row items-center justify-center">
          <div className="relative">Where</div>
        </div>
      </div>
      <div className="relative w-[154px] h-[78px]">
        <div className="absolute top-[0px] left-[0px] flex flex-row items-center justify-center">
          <div className="relative">When</div>
        </div>
        <Date1
          calendarWithDates="/32--calendar-with-dates@2x.png"
          chevronDown="/chevrondown@2x.png"
          datePosition="absolute"
          dateTop="38px"
          dateLeft="0px"
        />
      </div>
      <div className="relative w-[90px] h-[74px]">
        <Location1
          cityName="Hotel"
          buildingCode="/chevrondown@2x.png"
          locationPosition="absolute"
          locationTop="38px"
          locationLeft="0px"
        />
        <div className="absolute top-[0px] left-[1px] flex flex-row items-center justify-center">
          <div className="relative">Type</div>
        </div>
      </div>
      <div className="relative w-[129px] h-[74px]">
        <Location1
          cityName="Standard"
          buildingCode="/chevrondown@2x.png"
          locationPosition="absolute"
          locationTop="38px"
          locationLeft="0px"
        />
        <div className="absolute top-[0px] left-[1px] flex flex-row items-center justify-center">
          <div className="relative">Room</div>
        </div>
      </div>
      <div className="relative w-[105px] h-[74px]">
        <Location1
          cityName="1 adult"
          buildingCode="/chevrondown@2x.png"
          locationPosition="absolute"
          locationTop="38px"
          locationLeft="0px"
        />
        <div className="absolute top-[0px] left-[1px] flex flex-row items-center justify-center">
          <div className="relative">Adults</div>
        </div>
      </div>
      <div className="rounded-lg bg-darkslategrey-100 overflow-hidden flex flex-row items-center justify-center p-2 border-[1px] border-solid border-gray-500">
        <div className="relative">Search</div>
      </div>
    </div>
  );
};

export default SearchBar;
