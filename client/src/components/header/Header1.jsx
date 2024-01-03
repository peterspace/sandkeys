import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import MenuButton from '../../pages/Landing/MenuButton';
import MenuButtonActive from '../../pages/Landing/MenuButtonActive';
import TokenButtonLight from '../../pages/Landing/TokenButtonLight';

import { logoutUser } from '../../services/apiService';
import { Logout } from '../../redux/features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

export const Header1 = (props) => {
  // const Header1 = (props) => {
  const { setIsAuth, language, languages, setLanguage } = props;

  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const activeTabL = localStorage.getItem('activeTab')
    ? JSON.parse(localStorage.getItem('activeTab'))
    : 1;
  const [activeTab, setActiveTab] = useState(activeTabL); // default is 1
  const activeMenuL = localStorage.getItem('activeMenu')
    ? JSON.parse(localStorage.getItem('activeMenu'))
    : false;

  const [activeMenu, setActiveMenu] = useState(activeMenuL); // default is 1

  const [isLanguage, setIsLanguage] = useState(false); // default is 1

  useEffect(() => {
    localStorage.setItem('activeTab', JSON.stringify(activeTab));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  async function newFunc() {
    await logoutUser();
    setIsAuth(false);
    setActiveTab(1); // back to home
    navigate('/');
  }
  const handleLogout = () => {
    dispatch(Logout());
    newFunc();
    // window.location.replace('/');
  };

  const handleLogin = () => {
    setIsAuth(true);
    navigate('/auth');
    setActiveTab(1); // back to home
  };

  const handlePlaces = () => {
    navigate('/landingPage');
    setActiveTab(2);
  };

  const handlePartner = () => {
    navigate('/admin/register');
    setActiveTab(2);
  };

  const handleCrib = () => {
    navigate('/');
    setActiveTab(1);
  };

  const handleSupport = () => {
    // navigate('/support');
    // setActiveTab(2);
    console.log('support');
  };

  const handlePartnerProfile = () => {
    navigate('/admin/account');
    setActiveTab(7);
  };

  const handleAccommodations = () => {
    navigate('/admin/account/places');
    setActiveTab(5);
  };

  const handleActivities = () => {
    navigate('/admin/account/agentbookings');
    setActiveTab(6);
  };

  const handleAccount = () => {
    navigate('/account');
    setActiveTab(4);
  };

  const handleLanguage = () => {
    setIsLanguage(true);
  };

  useEffect(() => {
    localStorage.setItem('activeMenu', JSON.stringify(activeMenu));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenu]);
  useEffect(() => {
    if (user) {
      setActiveMenu(true);
    } else {
      setActiveMenu(false);
    }
  }, [user]);

  const guestHeader = (
    <>
      <div className="bg-grey-200 overflow-hidden flex flex-row items-start justify-between py-[22px] px-[15px] box-border text-left text-[24px] text-white font-roboto self-stretch">
        <div className="flex flex-row justify-between items-center w-[340px] h-9">
          <div className="cursor-pointer w-[93px]" handleclick={handleCrib}>
            <b className="">Crib</b>
          </div>
          {activeTab === 2 ? (
            <>
              <MenuButtonActive
                title="Places"
                menuButtonBorder="1px solid rgba(128, 163, 182, 0.2)"
                handleclick={handlePlaces}
              />
            </>
          ) : (
            <>
              <MenuButton
                title="Places"
                menuButtonBorder="unset"
                handleclick={handlePlaces}
              />
            </>
          )}

          {activeTab === 3 ? (
            <>
              <MenuButtonActive
                title="Partner"
                menuButtonBorder="1px solid rgba(128, 163, 182, 0.2)"
                handleclick={handlePartner}
              />
            </>
          ) : (
            <>
              <MenuButton
                title="Partner"
                menuButtonBorder="unset"
                handleclick={handlePartner}
              />
            </>
          )}
        </div>
        <div className="flex flex-row justify-between items-center w-[340px] h-9">
          <MenuButton
            title="Login"
            menuButtonBorder="unset"
            handleclick={handleLogin}
          />
          <MenuButton
            title="Support"
            menuButtonBorder="unset"
            handleclick={handleSupport}
          />
          <TokenButtonLight
            imgCard={language?.flag}
            rUB={language?.symbol}
            handleclick={handleLanguage}
          />
        </div>
      </div>
    </>
  );

  const partnerHeader = (
    <>
      <div className="bg-grey-200 overflow-hidden flex flex-row items-start justify-between py-[22px] px-[15px] box-border text-left text-[24px] text-white font-roboto self-stretch">
        <div className="flex flex-row justify-between items-center w-[340px] h-9">
          <div className="cursor-pointer w-[93px]" handleclick={handleCrib}>
            <b className="">Crib</b>
          </div>
          {activeTab === 5 ? (
            <>
              <MenuButtonActive
                title="Accommodations"
                menuButtonBorder="1px solid rgba(128, 163, 182, 0.2)"
                handleclick={handleAccommodations}
              />
            </>
          ) : (
            <>
              <MenuButton
                title="Accommodations"
                menuButtonBorder="unset"
                handleclick={handleAccommodations}
              />
            </>
          )}
        </div>
        <div className="flex flex-row justify-between items-center w-[340px] h-9">
          {activeTab === 6 ? (
            <>
              <MenuButtonActive
                title="Activities"
                menuButtonBorder="1px solid rgba(128, 163, 182, 0.2)"
                handleclick={handleActivities}
              />
            </>
          ) : (
            <>
              <MenuButton
                title="Activities"
                menuButtonBorder="unset"
                handleclick={handleActivities}
              />
            </>
          )}
          <MenuButton
            title="Logout"
            menuButtonBorder="unset"
            handleclick={handleLogout}
          />

          <TokenButtonLight
            imgCard={language?.flag}
            rUB={language?.symbol}
            handleclick={handleLanguage}
          />
        </div>
      </div>
    </>
  );

  const userHeader = (
    <>
      <div className="bg-grey-200 overflow-hidden flex flex-row items-start justify-between py-[22px] px-[15px] box-border text-left text-[24px] text-white font-roboto self-stretch">
        <div className="flex flex-row justify-between items-center w-[340px] h-9">
          <div className="cursor-pointer w-[93px]" handleclick={handleCrib}>
            <b className="">Crib</b>
          </div>
          {activeTab === 5 ? (
            <>
              <MenuButtonActive
                title="Accommodations"
                menuButtonBorder="1px solid rgba(128, 163, 182, 0.2)"
                handleclick={handleAccommodations}
              />
            </>
          ) : (
            <>
              <MenuButton
                title="Accommodations"
                menuButtonBorder="unset"
                handleclick={handleAccommodations}
              />
            </>
          )}
        </div>
        <div className="flex flex-row justify-between items-center w-[340px] h-9">
          {activeTab === 4 ? (
            <>
              <MenuButtonActive
                title="Account"
                menuButtonBorder="1px solid rgba(128, 163, 182, 0.2)"
                handleclick={handleAccount}
              />
            </>
          ) : (
            <>
              <MenuButton
                title="Account"
                menuButtonBorder="unset"
                handleclick={handleAccount}
              />
            </>
          )}
          <MenuButton
            title="Logout"
            menuButtonBorder="unset"
            handleclick={handleLogout}
          />
          <TokenButtonLight
            imgCard={language?.flag}
            rUB={language?.symbol}
            handleclick={handleLanguage}
          />
        </div>
      </div>
    </>
  );

  const adminHeader = (
    <>
      <div className="bg-grey-200 overflow-hidden flex flex-row items-start justify-between py-[22px] px-[15px] box-border text-left text-[24px] text-white font-roboto self-stretch">
        <div className="flex flex-row justify-between items-center w-[340px] h-9">
          <div className="cursor-pointer w-[93px]" handleclick={handleCrib}>
            <b className="">Crib</b>
          </div>
          {activeTab === 5 ? (
            <>
              <MenuButtonActive
                title="Accommodations"
                menuButtonBorder="1px solid rgba(128, 163, 182, 0.2)"
                handleclick={handleAccommodations}
              />
            </>
          ) : (
            <>
              <MenuButton
                title="Accommodations"
                menuButtonBorder="unset"
                handleclick={handleAccommodations}
              />
            </>
          )}

          {activeTab === 6 ? (
            <>
              <MenuButtonActive
                title="Activities"
                menuButtonBorder="1px solid rgba(128, 163, 182, 0.2)"
                handleclick={handleActivities}
              />
            </>
          ) : (
            <>
              <MenuButton
                title="Activitiesr"
                menuButtonBorder="unset"
                handleclick={handleActivities}
              />
            </>
          )}
        </div>
        <div className="flex flex-row justify-between items-center w-[500px] h-9">
          <MenuButton
            title="Logout"
            menuButtonBorder="unset"
            handleclick={handleLogout}
          />

          {activeTab === 7 ? (
            <>
              <MenuButtonActive
                title="Profile"
                menuButtonBorder="1px solid rgba(128, 163, 182, 0.2)"
                handleclick={handlePartnerProfile}
              />
            </>
          ) : (
            <>
              <MenuButton
                title="Profile"
                menuButtonBorder="unset"
                handleclick={handlePartnerProfile}
              />
            </>
          )}
          <TokenButtonLight
            imgCard={language?.flag}
            rUB={language?.symbol}
            handleclick={handleLanguage}
          />
        </div>
      </div>
    </>
  );

  const profile = (
    <div
      className="flex flex-col gap-4 justify-center items-center outline-lightslategray-300 outline-[1px] mr-4"
      onClick={() => setShow(true)}
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-2">
          <div className="flex justify-center items-center flex-shrink-0">
            <img
              className="w-[20px] h-$ shrink-0 overflow-hidden rounded-full"
              alt=""
              src={user?.photo}
            />
          </div>

          <div className="flex flex-col">
            <div className="cursor-pointer flex flex-col items-start">
              <div
                className={`text-[14px] font-sans font-medium  inline-block text-mediumspringgreen`}
              >
                {user?.name}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex bg-lightslategray-300 w-full h-px" />
    </div>
  );

  const menu = (
    <>
      {user ? (
        <>
          {user?.role === 'User' && <>{userHeader}</>}
          {user?.role === 'Partner' && <>{partnerHeader}</>}
          {user?.role === 'Admin' && <>{adminHeader}</>}
        </>
      ) : (
        <>{guestHeader}</>
      )}
    </>
  );

  return (
    <>
      <>{menu}</>

      {isLanguage && (
        <>
          <div className="flex flex-col gap-1 bg-gray-200 rounded-lg p-1">
            <div
              className="cursor-pointer flex flex-row gap-2 justify-center h-[24px] items-center"
              onClick={() => {
                setLanguage(languages[0]);
                setIsLanguage(false);
              }}
            >
              <img src={languages[0]?.flag} className="h-5 w-8" />
              <span className="">{languages[0]?.symbol}</span>
            </div>
            <div
              className="cursor-pointer flex flex-row gap-2 justify-center h-[24px] items-center"
              onClick={() => {
                setLanguage(languages[1]);
                setIsLanguage(false);
              }}
            >
              <img src={languages[1]?.flag} className="h-5 w-8" />
              <span className="">{languages[1]?.symbol}</span>
            </div>
            <div
              className="cursor-pointer flex flex-row gap-2 justify-center h-[24px] items-center"
              onClick={() => {
                setLanguage(languages[2]);
                setIsLanguage(false);
              }}
            >
              <img src={languages[2]?.flag} className="h-5 w-8" />
              <span className="">{languages[2]?.symbol}</span>
            </div>
          </div>
        </>
      )}
    </>
  );
};
