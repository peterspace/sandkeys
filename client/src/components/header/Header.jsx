import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/apiService';
import { Logout } from '../../redux/features/user/userSlice';
import { useDispatch } from 'react-redux';
import TokenButtonLight from '../../pages/Landing/TokenButtonLight';

export const Header = (props) => {
  const { setIsAuth, user, language, languages, setLanguage } = props;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const activeTabL = localStorage.getItem('activeTab')
    ? JSON.parse(localStorage.getItem('activeTab'))
    : 1;

  const [activeTab, setActiveTab] = useState(activeTabL); // default is 1

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

  const handleLanguage = () => {
    setIsLanguage(true);
  };

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

  const isHome = (
    <>
      {/* <div className="flex flex-col md:flex-row gap-[32px] md:justify-between md:gap-0 mt-[8px] w-screen text-[16px]"> */}
      <div className="bg-grey-200 overflow-hidden flex flex-row items-start justify-between py-[22px] px-[15px] box-border text-left text-[24px] text-white font-roboto self-stretch  w-screen">
        <div className="flex flex-col md:flex-row gap-[32px] ml-[20px]">
          <div
            className="cursor-pointer  text-white  text-center inline-block"
            onClick={() => {
              navigate('/');
              setActiveTab(1);
            }}
          >
            Crib
          </div>
          <div className={`flex flex-col md:flex-row gap-[32px] ml-[20px]`}>
            <div
              className={`${
                activeTab === 2
                  ? `rounded-lg bg-gray-100 text-gray-900 p-1`
                  : `text-silver `
              } cursor-pointer text-center inline-block`}
              onClick={() => {
                navigate('/landingPage');
                setActiveTab(2);
              }}
            >
              Places
            </div>
            {user?.role && (
              <div
                className={`${
                  activeTab === 3
                    ? `rounded-lg bg-gray-100 text-gray-900 p-1`
                    : `text-silver `
                } cursor-pointer text-center inline-block`}
                onClick={() => {
                  navigate('/admin/register');
                  setActiveTab(2);
                }}
              >
                Partner
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-[32px] mr-[20px]">
          <>
            {user?.role === 'Partner' ? (
              <>
                <div
                  className={`${
                    activeTab === 5
                      ? `rounded-lg bg-gray-100 text-gray-900 p-1`
                      : `text-silver `
                  } cursor-pointer text-center inline-block`}
                  onClick={() => {
                    navigate('/admin/account/places');
                    setActiveTab(5);
                  }}
                >
                  Accommodations
                </div>
                <div
                  className={`${
                    activeTab === 6
                      ? `rounded-lg bg-gray-100 text-gray-900 p-1`
                      : `text-silver `
                  } cursor-pointer text-center inline-block`}
                  onClick={() => {
                    navigate('/admin/account/agentbookings');
                    setActiveTab(6);
                  }}
                >
                  Activities
                </div>
                <div
                  className={`${
                    activeTab === 7
                      ? `rounded-lg bg-gray-100 text-gray-900 p-1`
                      : `text-silver `
                  } cursor-pointer text-center inline-block`}
                  onClick={() => {
                    navigate('/admin/account');
                    setActiveTab(7);
                  }}
                >
                  Profile
                </div>
              </>
            ) : (
              <>
                <div className="cursor-pointer text-center inline-block">
                  FAQ
                </div>
                <div className="cursor-pointer text-center inline-block">
                  Support
                </div>
              </>
            )}
          </>

          {isLanguage ? (
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
          ) : (
            // <div
            //   className="cursor-pointer flex flex-row gap-2 justify-center h-[24px] items-center bg-gray-200 rounded-lg p-1"
            //   onClick={() => {
            //     setIsLanguage(true);
            //   }}
            // >
            //   <img src={language?.flag} className="h-5 w-8" />
            //   <span className="">{language?.symbol}</span>
            // </div>

            <TokenButtonLight
              imgCard={language?.flag}
              rUB={language?.symbol}
              handleclick={handleLanguage}
            />
          )}

          {user?.role ? (
            <>
              <div
                className={`${
                  activeTab === 4
                    ? `rounded-lg bg-gray-100 text-gray-900 p-1`
                    : `text-silver `
                } cursor-pointer text-center inline-block`}
                onClick={() => {
                  navigate('/account');
                  setActiveTab(4);
                }}
              >
                Account
              </div>
              <div
                className="cursor-pointer text-center inline-block"
                onClick={handleLogout}
              >
                Logout
              </div>
              {profile}
            </>
          ) : (
            <div
              className="cursor-pointer text-center inline-block"
              onClick={() => {
                setIsAuth(true);
                navigate('/auth');
                setActiveTab(1); // back to home
              }}
            >
              Login
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col md:flex-row justify-center gap-4 shadow-[0px_2px_4px_rgba(26,_47,_79,_0.2)] h-[80px]">
      {/* <div className="flex flex-row justify-center items-center">{isHome}</div> */}
      {isHome}
    </div>
  );
};
