import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
// import { Link } from 'react-router-dom';
import ImageLanding from "../ImageLanding.jsx";
// import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { getPlaces } from "../services/apiService.js";
import PlacePage from "./PlacePage.jsx";
import { selectCity, selectType } from "../redux/features/auth/bookingSlice.js";
import { differenceInCalendarDays, format } from "date-fns";
import AddressLink from "../AddressLink.jsx";
import ListingCard from "../components/ui/listings/ListingCard.jsx";
import Container from "../components/ui/Container.jsx";
import ClientOnly from "../components/ui/ClientOnly.jsx";
import SearchBar from "./Landing/SearchBar.jsx";
import SideFilter from "./Landing/SideFilter.jsx";

import {
  updateRoomAvailability,
  getAllAvailableRoomsByCityAndType,
  getOneRoom,
  getAllRooms,
} from "../redux/features/place/placeSlice.js";

import SearchMenu from "../components/header/SearchMenu.jsx";
import {
  updateRequest,
  fetchRequest,
  postRequest,
  deletRequest,
} from "../hooks/api.js";

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

export default function LandingPage(props) {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const { language } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [openSidebar, setOpenSidebar] = useState(false);

  //=============={Places}==========================================
  const allPlacesL =
    useSelector((state) => state?.place?.fetchedAllPlaces) || null;
  // console.log({ allPlacesL: allPlacesL });
  const allAvailablePlacesByCityAndTypeL =
    useSelector((state) => state?.place?.fetchedAllPlacesByCityAndType) || null;
  //==============={Fetch data and manage states using Redux}==========================================
  //==============={Rooms}==========================================
  const allRoomsL =
    useSelector((state) => state?.place?.fetchedAllRooms) || null;
  // console.log({ allRoomsL: allRoomsL });

  const [allRooms, setAllRooms] = useState();

  const listing = useSelector((state) => state?.place?.fetchedOneRoom) || null;
  console.log({ listing: listing });

  const [newPlace, setNewPlace] = useState({});
  console.log({ newPlace: newPlace });
  const [showBooking, setShowBooking] = useState(false);
  const [showPlaceReady, setShowPlaceReady] = useState(false);
  const [showPlace, setShowPlace] = useState(false);

  const checkInL = localStorage.getItem("checkIn")
    ? JSON.parse(localStorage.getItem("checkIn"))
    : "";

  const checkOutL = localStorage.getItem("checkOut")
    ? JSON.parse(localStorage.getItem("checkOut"))
    : "";

  const [checkIn, updateCheckIn] = useState(checkInL);
  console.log({ checkIn: checkIn });
  const [checkOut, updateCheckOut] = useState(checkOutL);
  console.log({ checkOut: checkOut });
  //==============={Persist User Selection with Local Stoarge}==========================================
  const numberOfGuestsL = localStorage.getItem("maxGuests")
    ? JSON.parse(localStorage.getItem("maxGuests"))
    : 1;
  const [numberOfGuests, updatetNumberOfGuests] = useState(numberOfGuestsL);
  const maxGuests = Number(numberOfGuests);

  console.log({ maxGuests: maxGuests });
  // const [city, updateCity] = useState(cities[0].name);
  // const [city, updateCity] = useState(cities[0].name);
  const cityL = localStorage.getItem("city")
    ? JSON.parse(localStorage.getItem("city"))
    : cities[0].name;
  const [city, updateCity] = useState(cityL);
  // console.log({ city: city });

  const typeL = localStorage.getItem("propertyType")
    ? JSON.parse(localStorage.getItem("propertyType"))
    : propertyTypes[0].name;
  const [type, updateType] = useState(typeL);
  const propertyType = type;
  // console.log({ propertyType: propertyType });
  const roomTypeL = localStorage.getItem("roomType")
    ? JSON.parse(localStorage.getItem("roomType"))
    : roomTypes[0].name;
  const [roomType, updateRoomType] = useState(roomTypeL);
  // console.log({ roomType: roomType });

  const [filteredData, setFilteredData] = useState([]);

  console.log({ filteredData: filteredData });
  const [totalRoomType, setTotalRoomType] = useState();
  // console.log({ totalRoomType: totalRoomType });

  const testdate = new Date("2023-10-05T00:00:00.000+00:00");

  const testCheckIn = checkIn ? new Date(checkIn) : null;

  // const date1 = testdate.getTime();
  const date1 = new Date("2023-10-05T00:00:00.000+00:00").getTime();
  const date2 = testCheckIn ? testCheckIn.getTime() : null;

  console.log({ date1: date1 });
  console.log({ date2: date2 });

  if (date1 === date2) {
    console.log({ isMatch: true });
  } else {
    console.log({ isMatch: false });
  }

  useEffect(() => {
    localStorage.setItem("prevLocation", JSON.stringify(location?.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   if (newPlace) {
  //     dispatch(getOneRoom(newPlace?._id));
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [newPlace]);

  useEffect(() => {
    if (newPlace) {
      fetchOneRoom();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newPlace]);

  const fetchOneRoom = async () => {
    if (newPlace?._id) {
      try {
        const response = await fetchRequest({
          url: `/places/${newPlace?._id}`,
        });
        if (response) {
          dispatch(getOneRoom(newPlace?._id));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // useEffect(() => {
  //   // dispatch(getAllRooms());
  //   fetchAllRooms();

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [allRooms]);

  useEffect(() => {
    // dispatch(getAllRooms());
    fetchAllRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allRooms]);

  const fetchAllRooms = async () => {
    try {
      const response = await fetchRequest({
        url: "/places/rooms/allRooms",
      });

      if (response) {
        setAllRooms(response);
        dispatch(getAllRooms(response));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (!cityL) {
        updateCity(cities[2].name);
      } else {
        updateCity(cityL);
        // updateCity(cityL);
        // filterUserData();
      }
    }, 200);
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
    localStorage.setItem("maxGuests", JSON.stringify(maxGuests));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxGuests]);

  useEffect(() => {
    localStorage.setItem("checkIn", JSON.stringify(checkIn));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIn]);

  useEffect(() => {
    localStorage.setItem("checkOut", JSON.stringify(checkOut));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkOut]);
  //==============={Fetch Data with Redux}==========================================

  useEffect(() => {
    if (showPlaceReady === true) {
      console.log("generatedPlace", newPlace);
      setShowPlace(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPlace]);

  useEffect(() => {
    filterUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredData, allRooms]);

  function filterUserData() {
    let startPrice;
    startPrice = 200;
    let endPrice;
    // endPrice = 300;

    if (allRooms && endPrice) {
      const userData = allRooms?.filter((item) => {
        return (
          item.city.toLowerCase().includes(city?.toLowerCase()) &&
          (item.type === propertyType || "") &&
          (item.roomType === roomType || "") &&
          (item.maxGuests === maxGuests || 1) &&
          ((Number(item.price) >= startPrice
            ? startPrice
            : 0 && Number(item.price) <= endPrice) ||
            "" ||
            null) // price range
        );
      });
      setFilteredData(userData);
    } else {
      const userData = allRooms?.filter((item) => {
        return (
          item.city.toLowerCase().includes(city?.toLowerCase()) &&
          (item.type === propertyType || "") &&
          (item.roomType === roomType || "") &&
          (item.maxGuests === maxGuests || 1) &&
          (Number(item.price) >= startPrice || 0) // price range
        );
      });
      setFilteredData(userData);
    }
  }

  useEffect(() => {
    getCount();
  }, [filteredData]);

  async function getCount() {
    let remainingRooms = [];
    filteredData.map(async (b) => {
      if (b?.roomType === roomType) {
        remainingRooms.push(b);
      }
      // let totalRoomType = (remainingRooms.length
      // console.log(totalRoomType)
      setTotalRoomType(remainingRooms.length);
    });
  }

  useEffect(() => {
    if (showPlace && checkIn !== "" && checkOut !== "") {
      navigate("/placePage");
    }
  }, [showPlace, checkIn, checkOut]);

  // const filterJobs = (val) => {
  //   if (allRooms?.includes(val)) {
  //     setAllRooms(allRooms.filter((el) => el != val));
  //   } else {
  //     setAllRooms([...allRooms, val]);
  //   }
  // };

  // const filterExperience = async (e) => {
  //   if (expVal?.includes(e)) {
  //     setExpVal(expVal?.filter((el) => el != e));
  //   } else {
  //     setExpVal([...expVal, e]);
  //   }
  // };

  const handleSearch = () => {
    navigate("/landingPage");
  };

  return (
    <div className="relative bg-white w-full h-screen overflow-hidden flex flex-col items-start justify-start text-left text-5xl text-silver font-roboto">
      <div className="self-stretch bg-white overflow-hidden flex flex-col items-start justify-start text-gray-200">
        <div className="self-stretch bg-white overflow-hidden flex flex-row items-start justify-start gap-[20px]">
          <div className="h-screen">
            <SideFilter
              updateCheckIn={updateCheckIn}
              updateCheckOut={updateCheckOut}
              updatetNumberOfGuests={updatetNumberOfGuests}
              updateCity={updateCity}
              updateType={updateType}
              updateRoomType={updateRoomType}
              cities={cities}
              propertyTypes={propertyTypes}
              roomTypes={roomTypes}
              checkIn={checkIn}
              checkOut={checkOut}
              numberOfGuests={numberOfGuests}
              city={city}
              type={type}
              roomType={roomType}
              setShowPlace={setShowPlace}
              language={language}
              handleSearch={handleSearch}
            />
          </div>

          <div className="flex-1 bg-white overflow-hidden flex flex-col items-start justify-start gap-[40px] text-lg text-grey-600 font-body-large">
            <div className="flex flex-col">
              {showPlace && checkIn !== "" && checkOut !== "" ? (
                <>null</>
              ) : (
                <>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
