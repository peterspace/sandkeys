import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

export default function Header(props) {
  const { user } = props;
  // const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  // const name = useSelector((state) => state?.auth?.name);


  const name = user?.name;

  // useEffect(() => {
  //   if (user?.name) {
  //     window.location.reload();
  //     return;
  //   }
  // }, []);



  return (
    <>
      <header className="w-full flex py-6 justify-between items-center navbar">
        <Link to={'/'} className="flex items-center gap-1 ml-6">
          <span className="text-[24px] sm:text-[32px] md:text-[40px] font-bold text-gray-900">
            Crib.com
          </span>
        </Link>
        {user ? (
          <Link
            to={user ? '/account' : '/login'}
            className="flex items-center gap-2 py-2 px-4 mr-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              // className="w-12 h-12"
              className="w-8 md:w-12 lg:w-20 h-8 md:h-12 lg:h-20"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
            <div className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                // className="w-12 h-12 relative top-1"
                // className="w-12 h-12 relative top-1"
                className="w-8 md:w-12 lg:w-20 h-8 md:h-12 lg:h-20 top-1"
              >
                <path
                  fillRule="evenodd"
                  d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div
              // className="text-gray-700 font-bold"
              className="text-[12px] md:text-[14px] lg:text-[18px] font-bold text-gray-700"
            >
              {name && name}
            </div>
          </Link>
        ) : (
          <div className="flex flex-row gap-6 mr-6">
            <Link to="/login">
              <div className="transition-transform duration-300 hover:scale-125 rounded-lg cursor-pointer flex flex-row justify-center items-center bg-black hover:bg-gray-700 text-white px-3 py-2 gap-1 text-[12px] md:text-[14px] lg:text-[18px]">
                Login
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"

                  className="w-6 md:w-10 lg:w-20 h-6 md:h-10 lg:h-20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
