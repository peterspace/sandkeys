import "./list.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import useFetch from "../../../hooks/useFetch.js";

import ListingCard from "../listings/ListingCard.jsx";
import Container from "../Container.jsx";
import ClientOnly from "../ClientOnly.jsx";
import { useSelector, useDispatch } from "react-redux";
import {
  getOneRoom,
  getAllRooms,
} from "../../../redux/features/place/placeSlice.js";

const cities = [
  {
    name: "saint-petersburg",
    cityEN: "Saint Petersburg",
    cityRU: "Санкт-Петербург",
    cityAR: "سان بطرسبورج",
  },
  {
    name: "moscow",
    cityEN: "Moscow",
    cityRU: "Москва",
    cityAR: "موسكو",
  },
  {
    name: "dubai",
    cityEN: "Moscow",
    cityRU: "Дубай",
    cityAR: "موسكو",
  },
];

const propertyTypes = [
  {
    name: "hotel",
    placeEN: "Hotel",
    placeRU: "Гостиница",
    placeAR: "الفندق",
  },
  {
    name: "hotelApart",
    placeEN: "Hotel Apart",
    placeRU: "Отель Апарт",
    placeAR: "فندق أبارت",
  },
  {
    name: "apartment",
    placeEN: "Apartment",
    placeRU: "Квартира",
    placeAR: "شقة",
  },
];

const roomTypes = [
  {
    name: "Standard",
    nameEN: "Standard",
    nameRU: "Стандартный",
    nameAR: "معيار",
  },
  {
    name: "Studio",
    nameEN: "Studio",
    nameRU: "Студия",
    nameAR: "استوديو",
  },
  {
    name: "Superior",
    nameEN: "Superior",
    nameRU: "большой",
    nameAR: "أرقى",
  },
  {
    name: "Delux",
    nameEN: "Delux",
    nameRU: "Делюкс",
    nameAR: "ديلوكس",
  },
  {
    name: "Suite",
    nameEN: "Suite",
    nameRU: "люкс",
    nameAR: "جناح",
  },
];

const List = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const location = useLocation();
  const dispatch = useDispatch();
  // const [destination, setDestination] = useState(location.state.destination);
  // const [dates, setDates] = useState(location.state.dates);
  // const [openDate, setOpenDate] = useState(false);
  // const [options, setOptions] = useState(location.state.options);
  const [min, setMin] = useState(undefined);
  const [max, setMax] = useState(undefined);
  const [children, setChildren] = useState(1);
  const [adult, setAdult] = useState(1);

  const cityL = localStorage.getItem("city")
    ? JSON.parse(localStorage.getItem("city"))
    : cities[0].name;
  const [city, updateCity] = useState(cityL);
  console.log({ city: city });

  const typeL = localStorage.getItem("type")
    ? JSON.parse(localStorage.getItem("type"))
    : propertyTypes[0].name;
  const [type, updateType] = useState(typeL);
  const propertyType = type;
  console.log({ propertyType: propertyType });

  const roomTypeL = localStorage.getItem("roomType")
    ? JSON.parse(localStorage.getItem("roomType"))
    : roomTypes[0].name;
  const [roomType, updateRoomType] = useState(roomTypeL);
  console.log({ roomType: roomType });

  const [totalRoomType, setTotalRoomType] = useState();
  console.log({ totalRoomType: totalRoomType });

  const [filteredData, setFilteredData] = useState([]);

  const allRoomsL =
    useSelector((state) => state?.place?.fetchedAllRooms) || null;
  console.log({ allRoomsL: allRoomsL });

  const listing = useSelector((state) => state?.place?.fetchedOneRoom) || null;
  console.log({ listing: listing });

  const [newPlace, setNewPlace] = useState({});
  console.log({ newPlace: newPlace });

  const { data, loading, error, reFetch } = useFetch(
    `${BACKEND_URL}/places/rooms/getRoomsByFilter?city=${city}&min=${
      min || 0
    }&max=${max || 999}`
  );

  const handleClick = () => {
    reFetch();
  };

  useEffect(() => {
    localStorage.setItem("prevLocation", JSON.stringify(location?.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //==============={Update Persisted User Selections with Local Stoarge}==========================================
  useEffect(() => {
    localStorage.setItem("selectedPlace", JSON.stringify(newPlace));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newPlace]);

  useEffect(() => {
    localStorage.setItem("city", JSON.stringify(city));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  useEffect(() => {
    localStorage.setItem("propertyType", JSON.stringify(type));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    localStorage.setItem("roomType", JSON.stringify(roomType));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomType]);

  useEffect(() => {
    dispatch(getAllRooms());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (newPlace) {
      dispatch(getOneRoom(newPlace?._id));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newPlace]);

  useEffect(() => {
    if (newPlace) {
      if (!data && allRoomsL) {
        setFilteredData(allRoomsL);
      }
      setFilteredData(data);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allRoomsL, data]);

  // const searchBox = (
  //   <div className="listSearch">
  //     <h1 className="lsTitle">Search</h1>
  //     <div className="lsItem">
  //       <label>Destination</label>
  //       <input placeholder={destination} type="text" />
  //     </div>
  //     <div className="lsItem">
  //       <label>Check-in Date</label>
  //       <span onClick={() => setOpenDate(!openDate)}>{`${format(
  //         dates[0].startDate,
  //         'MM/dd/yyyy'
  //       )} to ${format(dates[0].endDate, 'MM/dd/yyyy')}`}</span>
  //       {openDate && (
  //         <DateRange
  //           onChange={(item) => setDates([item.selection])}
  //           minDate={new Date()}
  //           ranges={dates}
  //         />
  //       )}
  //     </div>
  //     <div className="lsItem">
  //       <label>Options</label>
  //       <div className="lsOptions">
  //         <div className="lsOptionItem">
  //           <span className="lsOptionText">
  //             Min price <small>per night</small>
  //           </span>
  //           <input
  //             type="number"
  //             onChange={(e) => setMin(e.target.value)}
  //             className="lsOptionInput"
  //           />
  //         </div>
  //         <div className="lsOptionItem">
  //           <span className="lsOptionText">
  //             Max price <small>per night</small>
  //           </span>
  //           <input
  //             type="number"
  //             onChange={(e) => setMax(e.target.value)}
  //             className="lsOptionInput"
  //           />
  //         </div>
  //         <div className="lsOptionItem">
  //           <span className="lsOptionText">Adult</span>
  //           <input
  //             type="number"
  //             min={1}
  //             className="lsOptionInput"
  //             placeholder={options.adult}
  //           />
  //         </div>
  //         <div className="lsOptionItem">
  //           <span className="lsOptionText">Children</span>
  //           <input
  //             type="number"
  //             min={0}
  //             className="lsOptionInput"
  //             placeholder={options.children}
  //           />
  //         </div>
  //         <div className="lsOptionItem">
  //           <span className="lsOptionText">Room</span>
  //           <input
  //             type="number"
  //             min={1}
  //             className="lsOptionInput"
  //             placeholder={options.room}
  //           />
  //         </div>
  //       </div>
  //     </div>
  //     <button onClick={handleClick}>Search</button>
  //   </div>
  // );

  return (
    <div>
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label>Destination</label>
              {/* <input placeholder={destination} type="text" /> */}
              <div className="py-3 sm:px-4 ml-10 flex flex-col">
                <div>City</div>
                <select
                  name="city"
                  className="dropdown bg-gray-50 rounded-none text-gray-500 border border-blue-700 hover:text-gray-900 focus:ring-1 focus:outline-none focus:ring-blue-500 px-2 py-1"
                  value={city}
                  onChange={(ev) => {
                    updateCity(ev.target.value);
                    // dispatch(setCity({ city: ev.target.value }));
                  }}
                >
                  <option value="">Choose</option>
                  {cities.map((city, index) => (
                    <option key={index} value={city?.name}>
                      {city?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Min price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    onChange={(e) => setMin(e.target.value)}
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Max price <small>per night</small>
                  </span>
                  <input
                    type="number"
                    onChange={(e) => setMax(e.target.value)}
                    className="lsOptionInput"
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    // placeholder={options.adult}
                    value={adult}
                    onChange={(e) => setAdult(e.target.value)}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input
                    type="number"
                    min={0}
                    className="lsOptionInput"
                    // placeholder={options.children}
                    value={children}
                    onChange={(e) => setChildren(e.target.value)}
                  />
                </div>
                <div className="py-3 sm:px-4 ml-10 border-l flex flex-col">
                  <div>Property</div>
                  <select
                    name="type"
                    className="dropdown bg-gray-50 rounded-none text-gray-500 border border-blue-700 hover:text-gray-900 focus:ring-1 focus:outline-none focus:ring-blue-500 px-2 py-1"
                    value={type}
                    onChange={(ev) => {
                      updateType(ev.target.value);
                      // dispatch(setType({ type: ev.target.value }));
                    }}
                  >
                    <option value="">Choose</option>
                    {propertyTypes.map((type, index) => (
                      <option key={index} value={type?.name}>
                        {type?.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="py-3 sm:px-4 ml-10 border-l flex flex-col">
                  <div>Rooms</div>
                  <select
                    name="roomType"
                    className="dropdown bg-gray-50 rounded-none text-gray-500 border border-blue-700 hover:text-gray-900 focus:ring-1 focus:outline-none focus:ring-blue-500 px-2 py-1"
                    value={roomType}
                    onChange={(ev) => {
                      updateRoomType(ev.target.value);
                      // dispatch(setRoomType({ type: ev.target.value }));
                    }}
                  >
                    <option value="">Choose</option>
                    {roomTypes.map((type, index) => (
                      <option key={index} value={type?.name}>
                        {type?.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <button onClick={handleClick}>Search</button>
          </div>
          {/* <div className="listResult">
            {loading ? (
              'loading'
            ) : (
              <>
                {' '}
                {filteredData && filteredData.length < 1 ? (
                  <div className="py-2 mt-8 mb-8 flex flex-row justify-center items-center">
                    <div className="text-gray-900 text-base">
                      No {roomType} is available in {city} at the moment
                    </div>
                  </div>
                ) : (
                  <div className="ml-8 mt-8 mb-8">
                    <h1 className="text-4xl">
                      {roomType}'s in {city}
                    </h1>
                  </div>
                )}
                <>
                  <ClientOnly>
                    <Container>
                      <div
                        className="
                pt-24
                grid 
                grid-cols-1 
                sm:grid-cols-2 
                md:grid-cols-3 
                lg:grid-cols-4
                xl:grid-cols-5
                2xl:grid-cols-6
                gap-8
              "
                      >
                        {filteredData?.map((listing) => (
                          <div
                            className=""
                            key={listing._id}
                            onClick={() => {
                              setNewPlace(listing);
                              // setShowBooking(true);
                            }}
                          >
                            <ListingCard
                              currentUser={user}
                              // key={listing._id}
                              data={listing}
                              totalRoomType={totalRoomType}
                            />
                          </div>
                        ))}
                      </div>
                    </Container>
                  </ClientOnly>
                </>
              </>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default List;
