import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import PlacesPage from './PlacesPage';
import AdminNav from '../AdminNav';

import ProfileContainer from './profile/ProfileContainer';
import stylesProfile from './profile/ProfileContainer.module.css';

export const UserProfile = (props) => {
  const { l } = props;

  const [show, setShow] = useState(false);



  const newCard = (
    <div
      className="flex flex-col gap-4 justify-center p-4 outline-lightslategray-300 outline-[1px]"
      onClick={() => setShow(true)}
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-2">
          <div className="flex justify-center items-center flex-shrink-0">
            <img
              className="w-[20px] h-$ shrink-0 overflow-hidden rounded-full"
              alt=""
              src={l?.photo}
            />
          </div>

          <div className="flex flex-col">
            <div className="cursor-pointer flex flex-col items-start">
              <div
                className={`text-base font-sans font-medium leading-[24px] inline-block text-mediumspringgreen`}
              >
                {l?.name}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex bg-lightslategray-300 w-full h-px" />
    </div>
  );
  return <>{newCard}</>;
};

export default function ProfilePageAdmin(props) {
  const { user } = props;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('prevLocation', JSON.stringify(location?.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = 'profile';
  }

  useEffect(() => {
    if (user?.role !== 'Partner') {
      navigate('/auth');
    }
  }, []);

  return (
    <div>
      <>
        <div className={stylesProfile.profileOverlay}>
          <ProfileContainer
            user={user}
            setIsProfile={setIsProfile}
            profileContainerPosition="absolute"
            profileContainerTop="calc(50% - 260.5px)"
            profileContainerLeft="calc(50% - 135px)"
            updateProfileBorder="1px solid var(--color-mediumpurple-100)"
          />
        </div>
        {/* <ProfileContainer
          user={user}
          setIsProfile={setIsProfile}
          profileContainerPosition="absolute"
          profileContainerTop="calc(50% - 260.5px)"
          profileContainerLeft="calc(50% - 135px)"
          updateProfileBorder="1px solid var(--color-mediumpurple-100)"
        /> */}
      </>
    </div>
  );
}
