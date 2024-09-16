import PhotosUploader from "../PhotosUploader.jsx";
import Perks from "../Perks.jsx";
import PaymentOptions from "../PaymentOptions.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import AccountNav from "../AccountNav";
// import AdminNav from '../AdminNav.jsx';
import { Navigate, useParams, useLocation } from "react-router-dom";
import RoomsPage from "./RoomsPage.jsx";
import {
  updateType,
  updateTitle,
  updateCity,
  updateAddress,
  updateDescription,
  updatePaymentOptions,
  updateCheckIn,
  updateCheckOut,
  updateExtraInfo,
  updatePlaceId,
  updatePerks,
  updateRating,
} from "../redux/features/place/placeSlice.js";
import {
  createPlace,
  updatePlaces,
} from "../redux/features/place/placeSlice.js";
import { useDispatch, useSelector } from "react-redux";

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
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const updatedPlaces = useSelector((state) => state.place?.updatedOwnerplace);

  console.log({ updatedPlaces: updatedPlaces });

  const [title, setTitle] = useState("");
  const [city, setCity] = useState(cities[0]?.name);
  const [address, setAddress] = useState("");
  const [type, setType] = useState(types[0]?.name);
  const [isAvailable, setIsAvailable] = useState(availability[0]?.name);
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [paymentOptions, setPaymentOptions] = useState([]);

  const [redirect, setRedirect] = useState(false);
  const [openRooms, setOpenRooms] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [place, setPlace] = useState({});
  // const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    localStorage.setItem("prevLocation", JSON.stringify(location?.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/places/" + id).then((response) => {
      const { data } = response;
      // owner
      setTitle(data.title);
      setCity(data.city);
      setAddress(data.address);
      setType(data.type);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);

      setPaymentOptions(data.paymentOptions);
      setRooms(data?.rooms);
      // rating
      // totalrating
      setPlace(data);

      //=========={Redux dispatch}====================
      dispatch(updateType(data.type));
      dispatch(updateTitle(data.title));
      dispatch(updateCity(data.city));
      dispatch(updateAddress(data.address));
      dispatch(updateDescription(data.description));
      dispatch(updatePaymentOptions(data.paymentOptions));
      dispatch(updatePlaceId(data._id));
      dispatch(updatePerks(data.perks));
      dispatch(updateRating(data.rating));
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
      paymentOptions,
    };
    console.log("placeData", placeData);
    if (id) {
      // update
      // await axios.put('/places', {
      const userData = {
        id,
        ...placeData,
      };
      dispatch(updatePlaces(userData));
      // await axios.patch(`${BACKEND_URL}/places`, {
      //   id,
      //   ...placeData,
      // });
      setRedirect(true);
    } else {
      // new place

      const userData = placeData;
      dispatch(createPlace(userData));
      // await axios.post(`${BACKEND_URL}/places`, placeData);
      setRedirect(true);
    }
  }
  // for admin only
  if (redirect) {
    return <Navigate to={"/admin/account/places"} />;
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
                  {/* {isActive && (
                    <button
                      className="text-white bg-blue-500 px-2 py-1 rounded-lg"
                      onClick={() => setOpenRooms(true)}
                    >
                      Add Room
                    </button>
                  )} */}
                </div>
              </div>

              <form onSubmit={savePlace}>
                {preInput(
                  "Title",
                  "Title for your place. should be short and catchy as in advertisement"
                )}
                <input
                  type="text"
                  value={title}
                  onChange={(ev) => setTitle(ev.target.value)}
                  placeholder="title, for example: My lovely apt"
                />
                {preInput("Address", "Address to this place")}
                <input
                  type="text"
                  value={address}
                  onChange={(ev) => setAddress(ev.target.value)}
                  placeholder="address"
                />

                {}

                <div className="grid gap-2 grid-cols-2 md:grid-cols-4 mt-6 mb-6">
                  <div className="flex flex-row gap-2 items-center">
                    <label htmlFor="city" className="text-lg text-gray-500">
                      City:
                    </label>
                    <select
                      name="city"
                      className="dropdown bg-gray-50 rounded-lg text-gray-500 border border-blue-700 hover:text-gray-900 focus:ring-1 focus:outline-none focus:ring-blue-500 px-2 py-1"
                      value={city}
                      onChange={(ev) => setCity(ev.target.value)}
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
                      value={type}
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
                </div>
                {preInput("Photos", "more = better")}
                <PhotosUploader
                  addedPhotos={addedPhotos}
                  onChange={setAddedPhotos}
                />
                {preInput("Description", "description of the place")}
                <textarea
                  value={description}
                  onChange={(ev) => setDescription(ev.target.value)}
                />
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
