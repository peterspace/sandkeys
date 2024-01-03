import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate, Link, useLocation} from 'react-router-dom';
import PlacesPage from './PlacesPage';
import AccountNav from '../AccountNav';
import { useSelector, useDispatch } from 'react-redux';
// import { logoutUser } from '../services/apiService';
// import useRedirectLoggedOutUser from '../customHook/useRedirectLoggedOutUser'; // new

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  // useRedirectLoggedOutUser('/login'); // new


  useEffect(() => {
    localStorage.setItem('prevLocation', JSON.stringify(location?.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = 'profile';
  }

  // async function logout() {
  //   await logoutUser();
  //   localStorage.setItem('isLoggedIn', JSON.stringify(false));
  //   localStorage.setItem('user', JSON.stringify(null));
  //   window.location.reload(); // relaod to update changes m,ade by localStoarge

  //   navigate('/');
  // }

  return (
    <div>
      {user?.role === "User" ? (
        <>
          <AccountNav />
          {subpage === 'profile' && (
            <div className="text-center max-w-lg mx-auto">
              Logged in as {user?.name} ({user?.email})<br />
              {/* <button onClick={logout} className="primary max-w-sm mt-2">
                Logout
              </button> */}
            </div>
          )}
          {subpage === 'places' && <PlacesPage />}
        </>
      ) : null}
    </div>
  );
}
