import React, { useState, useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { AiFillApple, AiOutlineClose } from 'react-icons/ai';
import { IoIosClose } from 'react-icons/io';
import { resetPassword } from '../../services/apiService';
import styles from './Auth.module.css';
import { useNavigate } from 'react-router-dom';



import { toast } from 'react-toastify';

import { useDispatch } from 'react-redux';
import Modal from './Modal';

export const Reset = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();


  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [redirectHome, setRedirectHome] = useState(false);

  const [isSucess, setIsSucess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isReset, setIsReset] = useState(true);

  const dispatch = useDispatch();

  async function ResetSubmit(ev) {
    ev.preventDefault();

    if (password.length < 6) {
      return toast.error('Passwords must be up to 6 characters');
    }
    if (password !== password2) {
      return toast.error('Passwords do not match');
    }

    const userData = {
      password,
      password2,
    };

    try {
      const data = await resetPassword(userData, resetToken);
      // toast.success(data.message);
      if (data) {
        setIsSucess(true);
        setIsError(false);
        setIsReset(false);
      } else {
        setIsSucess(false);
        setIsError(true);
        setIsReset(false);
      }
    } catch (error) {
      setIsSucess(false);
      setIsError(true);
      setIsReset(false);
    }
  }

  if (redirect) {
    // return <Navigate to={'/landingPage'} />;
    return <Navigate to={'/auth'} />;
  }

  if (redirectHome) {
    // return <Navigate to={'/landingPage'} />;
    return <Navigate to={'/'} />;
  }

   /************************************************************************************** */
  /**********************************************{RESET}********************************* */
  /************************************************************************************** */

  const toastSuccess = (
    <>
      <div
        id="toast-default"
        className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 mt-[64px] flex items-center w-full max-w-xs p-4 text-gray-500 bg-white dark:bg-bgDarkMode rounded-lg shadow dark:text-gray-100"
        role="alert"
      >
        <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-bgPrimary bg-chizzySnow rounded-lg dark:bg-bgPrimary dark:text-blue-200">
          <svg
            className="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.147 15.085a7.159 7.159 0 0 1-6.189 3.307A6.713 6.713 0 0 1 3.1 15.444c-2.679-4.513.287-8.737.888-9.548A4.373 4.373 0 0 0 5 1.608c1.287.953 6.445 3.218 5.537 10.5 1.5-1.122 2.706-3.01 2.853-6.14 1.433 1.049 3.993 5.395 1.757 9.117Z"
            />
          </svg>
          <span className="sr-only">Fire icon</span>
        </div>
        <div className="ms-3 text-sm font-normal">
          Password reset successfull!
        </div>
        <div
          className="ml-4 cursor-pointer text-sm font-medium text-bgPrimary p-1.5 rounded-lg dark:text-bgPrimary hover:underline hover:underline-offset-4"
          onClick={() => {
            setTimeout(() => {
              navigate('/auth');
            }, 200);
          }}
        >
          Login
        </div>

        <span
          className="transition-transform duration-300 hover:scale-110 cursor-pointer text-bgPrimary dark:text-gray-100 rounded-lg bg-chizzySnow dark:bg-bgPrimary ms-auto -mx-1.5 -my-1.5 h-8 w-8"
          onClick={() => {
            setTimeout(() => {
              navigate('/');
            }, 200);
          }}
        >
          {' '}
          <IoIosClose size={32} />
        </span>
      </div>
    </>
  );

  const toastError = (
    <>
      <div
        id="toast-default"
        className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 mt-[64px] flex items-center w-full max-w-xs p-4 text-gray-500 bg-white dark:bg-bgDarkMode rounded-lg shadow dark:text-gray-100"
        role="alert"
      >
        <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-bgPrimary bg-chizzySnow rounded-lg dark:bg-bgPrimary dark:text-blue-200">
          <svg
            className="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.147 15.085a7.159 7.159 0 0 1-6.189 3.307A6.713 6.713 0 0 1 3.1 15.444c-2.679-4.513.287-8.737.888-9.548A4.373 4.373 0 0 0 5 1.608c1.287.953 6.445 3.218 5.537 10.5 1.5-1.122 2.706-3.01 2.853-6.14 1.433 1.049 3.993 5.395 1.757 9.117Z"
            />
          </svg>
          <span className="sr-only">Fire icon</span>
        </div>
        <span className="ml-2 inline-flex items-center">
          {' '}
          Invalid credentials!
        </span>
        <div
          className="ml-4 cursor-pointer text-sm font-medium text-bgPrimary p-1.5 rounded-lg dark:text-bgPrimary hover:underline hover:underline-offset-4"
          onClick={() => {
            setIsSucess(false);
            setIsError(false);
            setIsReset(true);
          }}
        >
          Reset
        </div>
        <span
          className="transition-transform duration-300 hover:scale-110 cursor-pointer text-bgPrimary dark:text-gray-100 rounded-lg bg-chizzySnow dark:bg-bgPrimary ms-auto -mx-1.5 -my-1.5 h-8 w-8"
          onClick={() => {
            setTimeout(() => {
              navigate('/');
            }, 200);
          }}
        >
          {' '}
          <IoIosClose size={32} />
        </span>
      </div>
    </>
  );

  const reset = (
    <div className="flex justify-center rounded-lg bg-white shadow-[0px_2px_4px_rgba(26,_47,_79,_0.2)] w-[375px] md:w-[500px] p-4">
      <div className="flex flex-col gap-[24px]">
        <div className="flex flex-col gap-[8px] md:gap-[12px]">
          <div className="flex flex-row justify-between mt-[24px]">
            <div className="text-[18px] md:text-[24px] font-extrabold leading-[32px] inline-block">
              Reset Password
            </div>
            <div className="transition-transform duration-300 hover:scale-125 cursor-pointer flex flex-row justify-center items-center p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#130D1A"
                className="w-5 h-5"
                onClick={() => setRedirectHome(true)}
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="flex bg-lightslategray-300 md:w-[452px] w-[370px] h-px" />
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row h-[48px] bg-whitesmoke-100 rounded outline outline-lightslategray-300 outline-[1px]">
            <input
              type="password"
              className="ml-2 text-[16px] md:text-[14px] leading-[24px] text-darkslategray-200 placeholder-darkgray-100 inline-block w-full outline-none bg-gray-100"
              placeholder="New Password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
          </div>
          <div className="flex flex-row h-[48px] bg-whitesmoke-100 rounded outline outline-lightslategray-300 outline-[1px]">
            <input
              type="password"
              className="ml-2 text-[16px] md:text-[14px] leading-[24px] text-darkslategray-200 placeholder-darkgray-100 inline-block w-full outline-none bg-gray-100"
              placeholder="Confirm New Password"
              value={password2}
              onChange={(ev) => setPassword2(ev.target.value)}
            />
          </div>
          <div className="flex flex-row justify-center items-center">
            <div
              className="cursor-pointer flex flex-row justify-center items-center bg-mediumspringgreen hover:opacity-90 text-white h-[49px] shrink-0 rounded w-full"
              onClick={ResetSubmit}
            >
              Reset Password
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-2 items-center justify-center">
          <div className="flex bg-lightslategray-300 w-[150px] h-px" />
          <div className="text-smi leading-[22px] text-gray-300 inline-block">
            or
          </div>
          <div className="flex bg-lightslategray-300 w-[150px] h-px" />
        </div>
        <div className="flex flex-col justify-center items-center gap-[16px]">
          <div
            className="cursor-pointer flex flex-row justify-center items-center bg-white hover:opacity-90 text-mediumspringgreen h-[49px] shrink-0 rounded w-full outline outline-mediumspringgreen outline-[1.5px]"
            onClick={() => {
              setRedirect(true);
            }}
          >
            <span className="ml-2"> Continue to Login</span>
          </div>
        </div>

        <div className="flex flex-row gap-2 justify-center">
          <div className="text-smi leading-[22px] text-gray-300 inline-block">
            Already have an account?
          </div>
          <div
            className="cursor-pointer text-smi leading-[22px] text-mediumspringgreen hover:text-opacity-80 inline-block"
            onClick={() => {
              setRedirect(true);
            }}
          >
            Log in
          </div>
        </div>

        <div className="flex flex-row w-full" />
      </div>
    </div>
  );
  return (
    <>
      <div className="h-screen mt-[64px] mb-[64px] overflow-auto">
        <div
          className={`${styles.hero} flex flex-col justify-center items-center`}
        >
          {isError && (
            <>
              <div className="flex flex-row items-start h-screen">
                {toastError}
              </div>
            </>
          )}
          {isSucess && (
            <>
              <div className="flex flex-row items-start h-screen">
                {toastSuccess}
              </div>
            </>
          )}

          {isReset && (
            <>
              <div className="flex flex-row items-start h-screen mt-[64px]">
                {reset}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
