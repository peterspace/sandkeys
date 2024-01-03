import PhotosUploader from '../PhotosUploader.jsx';
import RoomPerks from '../RoomPerks.jsx';
import PaymentOptions from '../PaymentOptions.jsx';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AccountNav from '../AccountNav.jsx';
// import AdminNav from '../AdminNav.jsx';
import { Navigate, useParams } from 'react-router-dom';
// import RoomImg from '../RoomImg.jsx';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRooms } from '../redux/features/place/placeSlice.js';
// import { useDispatch } from 'react-redux';
import { createUserRooms, updateUserRooms } from '../services/apiService.js';

import { updateRoom } from '../redux/features/place/placeSlice.js';

const types = [
  {
    name: 'Studio',
  },
  {
    name: 'Standard',
  },
  {
    name: 'Superior',
  },
  {
    name: 'Delux',
  },
  {
    name: 'Suite',
  },
];

const availability = [
  {
    name: 'true',
  },
  {
    name: 'false',
  },
];

export default function RoomsFormPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);

  // const { placeId, id } = useParams();
  const roomId = id;
  console.log({ roomId: id });

  const updatedRoom = useSelector((state) => state.place?.updatedRoom);

  console.log({updatedRoom: updatedRoom})

  const placeId = useSelector((state) => state?.place?.placeId);
  console.log({ placeId: placeId });
  const title = useSelector((state) => state?.place?.title);
  console.log({ title: title });
  const city = useSelector((state) => state?.place?.city);
  console.log({ city: city });
  const address = useSelector((state) => state?.place?.address);
  console.log({ address: address });
  const description = useSelector((state) => state?.place?.description);
  console.log({ description: description });

  const paymentOptions = useSelector((state) => state?.place?.paymentOptions);
  console.log({ paymentOptions: paymentOptions });

  //======{Add to redux store}=====================================
  const perks = useSelector((state) => state?.place?.perks);
  console.log({ paymentOptions: paymentOptions });
  const rating = useSelector((state) => state?.place?.rating);
  const type = useSelector((state) => state?.place?.type);

  const [roomType, setRoomType] = useState(types[0]?.name);
  const [isAvailable, setIsAvailable] = useState(availability[0]?.name);
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [roomPerks, setRoomPerks] = useState([]);
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);
  const [roomNumber, setRoomNumber] = useState([]);
  const [extraInfo, setExtraInfo] = useState('');
  const [checkIn, setCheckIn] = useState(14);
  const [checkOut, setCheckOut] = useState(11);
  const [room, setRoom] = useState({});
  console.log({ room: room });

  // const allRoomsL = useSelector((state) => state?.place?.fetchedAllRooms);

  // const [allRooms, setAllRooms] = useState(allRoomsL);

  // console.log({allRoom: allRoomsL})

  // useEffect(()=>{
  //   dispatch(getAllRooms())

  // }, [])
  useEffect(() => {
    localStorage.setItem('prevLocation', JSON.stringify(location?.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/rooms/${id}`).then((response) => {
      //axios.get('/rooms/' + placeId).then((response) => { // new api
      const { data } = response;
      setAddedPhotos(data?.photos);
      setRoomPerks(data?.roomPerks);
      setMaxGuests(data?.maxGuests);
      setPrice(data?.price);
      setRoomNumber(data?.roomNumber);
      setRoomType(data?.type);
      setIsAvailable(data?.isAvailable);
      setExtraInfo(data?.extraInfo);
      setCheckIn(data?.checkIn);
      setCheckOut(data?.checkOut);
      setRoom(data);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

  //AdminOnly routes
  //   createPlace
  // updatePlaces
  async function saveRoom(ev) {
    ev.preventDefault();
    const roomData = {
      placeId: placeId,
      title: title,
      city: city,
      address: address,
      description: description,
      checkIn: checkIn.toString(),
      checkOut: checkOut.toString(),
      extraInfo,
      paymentOptions: paymentOptions,
      type,
      addedPhotos,
      price,
      perks, // place facilities
      maxGuests,
      isAvailable,
      // unavailableDates,
      roomNumber,
      roomPerks, // room facilities
      roomType,
      rating,
    };
    console.log('roomData', roomData);
    if (id) {
      // update
      // await axios.put('/rooms', {
      //   id: id,
      //   ...roomData,
      // });
      // await axios.put('/places/rooms', {
      //   id,
      //   ...roomData,
      // });
      const userData = {
        roomId,
        ...roomData,
      };
      dispatch(updateRoom(userData))
      // await updateUserRooms(userData);
      // await axios.patch('/places/rooms', {
      //   roomId,
      //   ...roomData,
      // });
      setRedirect(true);// updated later
    } else {
      // new place

      await createUserRooms(roomData);
      // await axios.post('/places/rooms', roomData);
      setRedirect(true);
    }
  }
  // for admin only
  if (redirect) {
    // return <Navigate to={'/account/rooms'} />;
    return <Navigate to={`/admin/account/places/${placeId}`} />;
  }

  return (
    <div>
      <AccountNav />
      <div className="flex justify-center items-center bg-gray-50 border">
        <div className="mt-10 bg-white rounded-2xl px-10 py-10 mb-10 border shadow-md">
          <div className="border-b mb-6">
            <div className="py-2 flex justify-between">
              <h2 className="text-2xl font-bold text-blue-500">
                {' '}
                Add new room
              </h2>
              <Link
                className="text-white bg-blue-500 px-2 py-1 rounded-lg"
                to={'/admin/account/places/new'}
              >
                Add new place
              </Link>
              {/* {placeId === "undefined" ? null : (
               
              )} */}
              <Link
                className="text-white bg-blue-500 px-2 py-1 rounded-lg"
                to={'/admin/account/places/' + placeId}
              >
                Back to place
              </Link>
            </div>
          </div>
          {/* Display place title  address and city here for admin to see */}
          <form onSubmit={saveRoom}>
            {preInput('Room Numbers', 'add room number')}
            <input
              type="text"
              value={roomNumber}
              onChange={(ev) => setRoomNumber(ev.target.value)}
              placeholder="201"
            />
            <div className="grid gap-2 grid-cols-2 md:grid-cols-4 mt-6 mb-6">
              <div className="flex flex-row gap-2 items-center">
                <label htmlFor="roomType" className="text-lg text-gray-500">
                  Room:
                </label>
                <select
                  name="roomType"
                  className="dropdown bg-gray-50 rounded-lg text-gray-500 border border-blue-700 hover:text-gray-900 focus:ring-1 focus:outline-none focus:ring-blue-500 px-2 py-1"
                  value={roomType}
                  onChange={(ev) => setRoomType(ev.target.value)}
                >
                  <option value="">Choose type</option>
                  {types.map((type, index) => (
                    <option key={index} value={type?.name}>
                      {type?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-row gap-2 items-center">
                <label htmlFor="isAvailable" className="text-lg text-gray-500">
                  Available:
                </label>
                <select
                  name="isAvailable"
                  className="dropdown bg-gray-50 rounded-lg text-gray-500 border border-blue-700 hover:text-gray-900 focus:ring-1 focus:outline-none focus:ring-blue-500 px-2 py-1"
                  value={isAvailable}
                  onChange={(ev) => setIsAvailable(ev.target.value)}
                >
                  <option value="">Choose type</option>
                  {availability.map((available, index) => (
                    <option key={index} value={available?.name}>
                      {available?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {preInput('Photos', 'more = better')}
            <PhotosUploader
              addedPhotos={addedPhotos}
              onChange={setAddedPhotos}
            />
            {preInput('roomPerks', 'select all the roomPerks of your place')}
            <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              <RoomPerks selected={roomPerks} onChange={setRoomPerks} />
            </div>
            {preInput('Extra info', 'house rules, etc')}
            <textarea
              value={extraInfo}
              onChange={(ev) => setExtraInfo(ev.target.value)}
            />
            {preInput(
              'Check in&out times',
              'add check in and out times, remember to have some time window for cleaning the room between guests'
            )}

            <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
              <div>
                <h3 className="mt-2 -mb-1">Check in time</h3>
                <input
                  type="number"
                  value={checkIn}
                  onChange={(ev) => setCheckIn(ev.target.value)}
                  placeholder="14"
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">Check out time</h3>
                <input
                  type="number"
                  value={checkOut}
                  onChange={(ev) => setCheckOut(ev.target.value)}
                  placeholder="11"
                />
              </div>
            </div>

            <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
              <div>
                <h3 className="mt-2 -mb-1">Max number of guests</h3>
                <input
                  type="number"
                  value={maxGuests}
                  onChange={(ev) => setMaxGuests(ev.target.value)}
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">Price per night</h3>
                <input
                  type="number"
                  value={price}
                  onChange={(ev) => setPrice(ev.target.value)}
                />
              </div>
            </div>
            <button className="primary my-4">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
}

