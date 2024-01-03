import { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from 'react-query';
//================={Intermediate}==========================================
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//==============={AIR}======================================================
import './App.css';
import Layout from './Layout';
import axios from 'axios';
import ProfilePage from './pages/ProfilePage.jsx';
import PlacesPage from './pages/PlacesPage';
import PlacesFormPage from './pages/PlacesFormPage';
import RoomsPage from './pages/RoomsPage';
import RoomsFormPage from './pages/RoomsFormPage';
// import PlacePage from './pages/PlacePage';
import BookingsPage from './pages/BookingsPage';
import BookingPage from './pages/BookingPage';
import LandingPage from './pages/LandingPage';
import PlacePage from './pages/PlacePage';
import LayoutAdmin from './LayoutAdmin';
import ProfilePageAdmin from './pages/ProfilePageAdmin';
import IndexPageAdmin from './pages/IndexPageAdmin';
import AdminBookingsPage from './Admin/AdminBookingsPage';
import AdminBookingPage from './Admin/AdminBookingPage';
// import Home from './components/home/Home';
import Home from './pages/Home.jsx';
import PaySuccess from './pages/payment/PaySuccess';
import PayFailed from './pages/payment/PayFailed';
import TestYandexPay from './pages/payment/TestYandexPay';
//==============={New}======================================================
// import BookingCalendar from './BookingCalendar';
import { Auth } from './pages/auth/auth';
// import Reset from './pages/auth/Reset';
import { Reset } from './pages/auth/Reset';
import { Otp } from './pages/auth/Otp';
import { ReaderCSV } from './components/readCSV/ReaderCSV';
import LayoutPartner from './LayoutPartner';
import { Approval } from './pages/auth/Approval';
import { Deposited } from './pages/auth/Deposited';
import ListingPage from './pages/ListingPage.jsx';
import BookRoomPage from './pages/BookRoomPage.jsx';
import { getOneUserReservationInternal } from './redux/features/reservation/reservationSlice.js';
import { ApprovalStatusUser } from './pages/auth/ApprovalStatusUser.jsx';
import List from './components/ui/list/List.jsx';
import Newlanding from './pages/Home.jsx';
import { Header } from './components/header/Header';
import { Header1 } from './components/header/Header1.jsx';

//==============={AIR}======================================================
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const languages = [
  {
    id: '1',
    name: 'English',
    symbol: 'EN',
    flag: '/gbp.png', // link to country flags
  },
  {
    id: '2',
    name: 'Russian',
    symbol: 'RU',
    flag: '/rub.png',
  },
  {
    id: '3',
    name: 'Arabic',
    symbol: 'AR',
    flag: '/aed.png',
  },
];

// function AdminLayout() {
//   // const { user } = useSelector((state) => state.user);

//   const user = localStorage.getItem('user')
//     ? JSON.parse(localStorage.getItem('user'))
//     : null;

//   const location = useLocation();

//   return user?.role === "Partner" ? (
//     <Outlet />
//   ) : (
//     <Navigate to="/auth" state={{ from: location }} replace />
//   );
// }

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [userL, setUser] = useState('');

  const isAuthL = localStorage.getItem('isAuth')
    ? JSON.parse(localStorage.getItem('isAuth'))
    : null;

  const [isAuth, setIsAuth] = useState(isAuthL);

  const languageL =
    (localStorage.getItem('language') &&
      JSON.parse(localStorage.getItem('language'))) ||
    languages[0];

  const [language, setLanguage] = useState(languageL);
  // use for reservation tx
  const txDataRedux = useSelector(
    (state) => state.reservation?.getOneUserReservationInternal
  );

  const txDataLocal = localStorage.getItem('txData')
    ? JSON.parse(localStorage.getItem('txData'))
    : null;
  const [txData, setTxData] = useState(txDataLocal);
  console.log({ txDataInBackground: txData });
  const { data } = useQuery(
    ['GET_ONE_USER_RESERVATION'],
    async () => {
      if (!txData?._id) {
        return;
      }
      //approval decision has been made if (txData?.approval !=== "pending")
      if (txData?.approval !== 'Pending') {
        return;
      }
      const { data } = await axios.get(
        `${BACKEND_URL}/reservations/${txData?._id}`
      );
      return data;
    },
    {
      refetchInterval: 3000, // every 3 seconds
      refetchIntervalInBackground: true, // when tab is not on focus
      refetchOnMount: true,
    }
  );
  console.log({ dataInBackground: data });

  //====================={Global txData dispatch}==================================
  useEffect(() => {
    if (data) {
      dispatch(getOneUserReservationInternal(data)); // dispatch txData globally
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  //====================={To Monitor the blockchain}==================================

  //================================={TXDATA HANDLING wITH LOCAL STORAGE, REDUX, REACT QUERY AND REACT STATES}========================================

  //============{The Goal is have the reight id: txData?._id to fetch transaction detail using React Query, fetching data in the background}
  //if real data in txDataRedux set txData as value
  useEffect(() => {
    if (txDataRedux) {
      setTxData(txDataRedux);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txDataRedux]);
  //if there is no data in txDataRedux first remove txData from local storage to avoid empty value error and set txData as null
  useEffect(() => {
    if (txDataRedux === null) {
      localStorage.removeItem('txData');
      setTxData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txDataRedux]);
  //if there is no data in txData (e.g if txdata is null, undefined or {}) then do not save value to local storage, else you can save the data
  useEffect(() => {
    if (txData) {
      localStorage.setItem('txData', JSON.stringify(txData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txData]);

  //================================={TXDATA BLOCK}========================================

  useEffect(() => {
    localStorage.setItem('language', JSON.stringify(language));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <BrowserRouter>
      {/* <ToastContainer /> */}
      <Header
        setIsAuth={setIsAuth}
        user={user}
        language={language}
        languages={languages}
        setLanguage={setLanguage}
      />
      <div className="bg-gray-100 w-full overflow-hidden">
        <Routes>
          <Route
            path="/header1"
            element={
              <Header1
                setIsAuth={setIsAuth}
                language={language}
                languages={languages}
                setLanguage={setLanguage}
              />
            }
          />
          <Route path="/testYandexPay" element={<TestYandexPay />} />
          {/* ==================={USERS ONLY}======================== */}
          {/* <Route path="/" element={<Layout user={user} />}> */}

          <Route path="/" element={<Home language={language} />} />
          <Route
            path="/landingPage"
            element={<LandingPage language={language} />}
          />
          {/* <Route index element={<Home language={language} />} /> */}
          <Route path="/list" element={<List />} />
          <Route path="/newlanding" element={<Newlanding language={language}/>} />

          <Route path="/readerCSV" element={<ReaderCSV />} />
          <Route path="/paySuccess" element={<PaySuccess />} />
          <Route path="/payFailed" element={<PayFailed />} />
          {/* <Route path="/bookingCalendar" element={<BookingCalendar />} /> */}

          {/* Show to all */}
          <Route
            path="/approvalStatusUser/:id"
            element={<ApprovalStatusUser />}
          />

          <Route path="/booking/:id" element={<BookRoomPage />} />
          <Route path="/booking/:id/:paymentId" element={<BookRoomPage />} />

          <Route path="/resetpassword/:resetToken" element={<Reset />} />
          <Route path="/otp" element={<Otp setUser={setUser} />} />
          <Route path="/otp/:authId" element={<Otp setUser={setUser} />} />
          <Route
            path="/approval/:authId/:id"
            element={<Approval user={user} />}
          />
          <Route
            path="/deposited/:authId/:id"
            element={<Deposited setUser={setUser} />}
          />
          <Route path="/auth/success/:authId" element={<Auth />} />
          <Route path="/auth/failure/:message" element={<Auth />} />
          <Route path="/auth" element={<Auth />} />

        

          <Route path="/placePage" element={<PlacePage />} />
          <Route path="/placePage/:id" element={<PlacePage />} />
          <Route path="/listingPage/:id" element={<ListingPage />} />

          {/* <Route path="/login" element={<Navigate to="/landingPage" />} /> */}

          {/* Show on login */}
          <Route
            path="/account"
            element={
              user && user?.role === 'User' ? (
                <ProfilePage />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          {/* userOnly Routes */}
          <Route
            path="/account/bookings"
            element={
              user && user?.role === 'User' ? (
                <BookingsPage />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/account/bookings/:id"
            element={
              user && user?.role === 'User' ? (
                <BookingPage />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />

          <>
            {/* Show to all */}
            <Route path="/admin" element={<IndexPageAdmin />} />
            {/* <Route path="/admin/landingPage" element={<LandingPageAdmin />} /> */}

            {/* Show on login */}
            <Route
              path="/admin/account"
              element={<ProfilePageAdmin user={user} />}
            />

            {/* Admin and  Agents Only can list and update listings */}

            {/* ==================={Place}======================== */}
            <Route path="/admin/account/places" element={<PlacesPage />} />
            <Route
              path="/admin/account/places/new"
              element={<PlacesFormPage />}
            />
            <Route
              path="/admin/account/places/:id"
              element={<PlacesFormPage />}
            />

            {/* ==================={Rooms}======================== */}
            <Route path="/admin/account/rooms" element={<RoomsPage />} />
            <Route
              path="/admin/account/rooms/new"
              element={<RoomsFormPage />}
            />
            <Route
              path="/admin/account/rooms/:id"
              element={<RoomsFormPage />}
            />

            <Route
              path="/admin/account/agentbookings"
              element={<AdminBookingsPage />}
            />
            <Route
              path="/admin/account/agentbookings/:id"
              element={<AdminBookingPage />}
            />
          </>

          {/* ==================={ADMIN ONLY}======================== */}

          {/* ==================={AGENTS ONLY}======================== */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
