import PhotosUploader from "../PhotosUploader.jsx";
import Perks from "../Perks.jsx";
import PaymentOptions from "../PaymentOptions.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import AccountNav from "../AccountNav";
// import AdminNav from '../AdminNav.jsx';
import { Navigate, useParams } from "react-router-dom";
import RoomsPage from "./RoomsPage.jsx";
import {
  updateType,
  updateTitle,
  updateCity,
  updateAddress,
  updateDescription,
  updateCheckIn,
  updateCheckOut,
  updateExtraInfo,
  updatePlaceId,
} from "../redux/features/auth/placeSlice.js";
import { useDispatch } from "react-redux";

const cities = [
  {
    name: "saint-petersburg",
  },
  {
    name: "moscow",
  },
  {
    name: "dubai",
  },
];

const types = [
  {
    name: "hotel",
  },
  {
    name: "hotelApart",
  },
  {
    name: "apartment",
  },
  {
    name: "resort",
  },
];

const availability = [
  {
    name: "true",
  },
  {
    name: "false",
  },
];

export default function PlacesFormPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [city, setCity] = useState(cities[0]?.name);
  const [address, setAddress] = useState("");
  const [type, setType] = useState(types[0]?.name);
  const [isAvailable, setIsAvailable] = useState(availability[0]?.name);
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState(14);
  const [checkOut, setCheckOut] = useState(11);
  const [redirect, setRedirect] = useState(false);
  const [openRooms, setOpenRooms] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [place, setPlace] = useState({});
  // const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/places/" + id).then((response) => {
      const { data } = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCity(data.city);
      setType(data.type);
      setIsAvailable(data.isAvailable);
      setPaymentOptions(data.paymentOptions);
      setRooms(data?.rooms);
      setPlace(data);

      //=========={Redux dispatch}====================
      dispatch(updateType(data.type));
      dispatch(updateTitle(data.title));
      dispatch(updateCity(data.city));
      dispatch(updateAddress(data.address));
      dispatch(updateDescription(data.description));
      dispatch(updateCheckIn(data.checkIn));
      dispatch(updateCheckOut(checkOut));
      dispatch(updateExtraInfo(data.extraInfo));
      dispatch(updatePlaceId(data._id));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // useEffect(() => {
  //   dispatch(updateType(type));
  //   dispatch(updateTitle(title));
  //   dispatch(updateCity(city));
  //   dispatch(updateAddress(address));
  //   dispatch(updateDescription(description));
  //   dispatch(updateCheckIn(checkIn));
  //   dispatch(updateCheckOut(checkOut));
  //   dispatch(updateExtraInfo(extraInfo));
  //   dispatch(updatePlaceId(id));
  // }, []);

  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }
  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }
  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  const [filters, setFilters] = useState({
    title: "",
    perks: "",
    extraInfo: "",
    price: "",
    type: "",
    price: "",
    unavailableDates: "",
    maxGuests: "",
    roomNumber: "",
    isAvailable: "",
  });

  useEffect(() => {
    if (perks !== undefined) {
      setFilters(perks);
    }

    if (paymentOptions !== undefined) {
      setFilters(paymentOptions);
    }
  }, [perks, paymentOptions]);

  const handleInputChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const filteredData = data.filter((item) => {
    return (
      item.title.toLowerCase().includes(filters.title.toLowerCase()) &&
      (filters.category === "" || item.category === filters.category) &&
      (filters.price === "" || item.price === parseInt(filters.price))
    );
  });

  // useEffect(() => {
  //   if (id !== null || 'new') {
  //     setIsActive(true);
  //   } else {
  //     setIsActive(false);
  //   }
  // }, [id]);

  //AdminOnly routes
  //   createPlace
  // updatePlaces
  async function savePlace(ev) {
    ev.preventDefault();
    const placeData = {
      title,
      city,
      address,
      type,
      addedPhotos,
      description,
      perks,
      extraInfo,
      isAvailable,
      paymentOptions,
      checkIn: checkIn.toString(),
      checkOut: checkOut.toString(),
    };
    console.log("placeData", placeData);
    if (id) {
      // update
      await axios.put("/places", {
        id,
        ...placeData,
      });
      setRedirect(true);
    } else {
      // new place
      await axios.post("/places", placeData);
      setRedirect(true);
    }
  }
  // for admin only
  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }

  // TODO: add/ update rooms tab

  return (
    <>
      {openRooms ? (
        // <RoomsPage place={place} setOpenRooms={setOpenRooms} rooms={rooms} />
        <RoomsPage place={place} />
      ) : (
        <div>
          <AccountNav />
          <div className="flex justify-center items-center bg-gray-50 border">
            <div className="mt-10 bg-white rounded-2xl px-10 py-10 mb-10 border shadow-md">
              <div className="border-b mb-6">
                <div className="py-2 flex justify-between">
                  <h2 className="text-2xl font-bold text-blue-500">
                    {" "}
                    Add new property
                  </h2>
                  <button
                    className="text-white bg-blue-500 px-2 py-1 rounded-lg"
                    onClick={() => setOpenRooms(true)}
                  >
                    Rooms
                  </button>
                </div>
              </div>

              <form onSubmit={savePlace}>
                {preInput(
                  "Title",
                  "Title for your place. should be short and catchy as in advertisement"
                )}
                <input
                  type="text"
                  value={filters?.title}
                  onChange={handleInputChange}
                  placeholder="title, for example: My lovely apt"
                />
                {preInput("Address", "Address to this place")}
                <input
                  type="text"
                  value={filters?.address}
                  onChange={handleInputChange}
                  placeholder="address"
                />
                <div className="grid gap-2 grid-cols-2 md:grid-cols-4 mt-6 mb-6">
                  <div className="flex flex-row gap-2 items-center">
                    <label htmlFor="city" className="text-lg text-gray-500">
                      City:
                    </label>
                    <select
                      name="city"
                      className="dropdown bg-gray-50 rounded-lg text-gray-500 border border-blue-700 hover:text-gray-900 focus:ring-1 focus:outline-none focus:ring-blue-500 px-2 py-1"
                      value={filters?.city}
                      onChange={handleInputChange}
                    >
                      <option value="">Choose city</option>
                      {cities &&
                        cities.map((city, index) => (
                          <option key={index} value={city?.name}>
                            {city?.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <label htmlFor="type" className="text-lg text-gray-500">
                      Property:
                    </label>
                    <select
                      name="type"
                      className="dropdown bg-gray-50 rounded-lg text-gray-500 border border-blue-700 hover:text-gray-900 focus:ring-1 focus:outline-none focus:ring-blue-500 px-2 py-1"
                      value={filters?.type}
                      onChange={(ev) => setType(ev.target.value)}
                    >
                      <option value="">Choose type</option>
                      {types &&
                        types.map((type, index) => (
                          <option key={index} value={type?.name}>
                            {type?.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="flex flex-row gap-2 items-center">
                    <label
                      htmlFor="isAvailable"
                      className="text-lg text-gray-500"
                    >
                      Available:
                    </label>
                    <select
                      name="isAvailable"
                      className="dropdown bg-gray-50 rounded-lg text-gray-500 border border-blue-700 hover:text-gray-900 focus:ring-1 focus:outline-none focus:ring-blue-500 px-2 py-1"
                      value={filters?.isAvailable}
                      onChange={(ev) => setIsAvailable(ev.target.value)}
                    >
                      <option value="">Choose type</option>
                      {availability &&
                        availability.map((available, index) => (
                          <option key={index} value={available?.name}>
                            {available?.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {preInput(
                  "Payment Options",
                  "select all the Payments Options of your place"
                )}
                <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                  <PaymentOptions
                    selected={paymentOptions}
                    onChange={setPaymentOptions}
                  />
                </div>

                {preInput("Perks", "select all the perks of your place")}
                <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                  <Perks selected={perks} onChange={setPerks} />
                </div>

                <button className="primary my-4">Save</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
