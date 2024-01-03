import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookSquare } from 'react-icons/fa';
import { AiFillApple, AiOutlineClose } from 'react-icons/ai';
import { IoIosClose } from 'react-icons/io';
import {
  loginUser,
  validateEmail,
  forgotPassword,
  resetPassword,
} from '../../services/apiService';

import { toast } from 'react-toastify';

import { useDispatch } from 'react-redux';

export const Forgot = (props) => {
  const { setIsLogin, setIsRegister, setIsForgot } = props;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [redirectHome, setRedirectHome] = useState(false);

  const dispatch = useDispatch();


  // async function LoginSubmit() {
  async function forgot(ev) {
    ev.preventDefault();
    if (!email) {
      return toast.error('Please enter an email');
    }

    if (!validateEmail(email)) {
      return toast.error('Please enter a valid email');
    }

    const userData = {
      email,
    };

    try {
      const data = forgotPassword(userData);
      console.log({ userData: data });
      setEmail('');
      if (data) {
        setMessage('Request sent');
        setTimeout(() => {
          setMessage('');
          setIsLogin(true);
          setIsRegister(false);
          setIsForgot(false);
        }, 10000); // 10 secs

        // window.location.reload(); // relaod to update changes m,ade by localStoarge
      }
    } catch (e) {
      alert('Password reset failed');
    }
  }

  if (redirectHome) {
    // return <Navigate to={'/landingPage'} />;
    return <Navigate to={'/'} />;
  }

  const login = (
    <div className="flex justify-center rounded-lg bg-white shadow-[0px_2px_4px_rgba(26,_47,_79,_0.2)] w-[375px] md:w-[500px] p-4 mt-[64px]">
      <div className="flex flex-col gap-[24px]">
        <div className="flex flex-col gap-[8px] md:gap-[12px]">
          <div className="flex flex-row justify-between mt-[24px]">
            <div className="text-[18px] md:text-[24px] font-extrabold leading-[32px] inline-block">
              Forgot Password
            </div>
            <div
              className="cursor-pointer"
              onClick={() => {
                setRedirectHome(true);
              }}
            >
              <AiOutlineClose size={16} />
            </div>
          </div>

          <div className="flex bg-lightslategray-300 md:w-[452px] w-[370px] h-px" />
        </div>
        <div
          className="flex flex-col"
          onClick={() => {
            setIsLocal(true);
            setIsFacebook(false);
            setIsGoogle(false);
          }}
        >
          <div className="flex flex-row h-[48px] bg-whitesmoke-100 rounded outline outline-lightslategray-300 outline-[1px]">
            <input
              type="email"
              className="ml-2 text-[16px] md:text-[14px] leading-[24px] text-darkslategray-200 placeholder-darkgray-100 inline-block w-full outline-none bg-gray-100"
              placeholder="your@email.com"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
          </div>
          <div className="flex flex-row justify-center items-center">
            <div
              className="cursor-pointer flex flex-row justify-center items-center bg-mediumspringgreen hover:opacity-90 text-white h-[49px] shrink-0 rounded w-full"
              onClick={forgot}
            >
              {message ? <>{message}</> : <>{'Get Reset Email'}</>}
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-2 justify-end">
          <div className="text-smi leading-[22px] text-gray-300 inline-block">
            {'Remember your email and password?'}
          </div>
          <div
            className="cursor-pointer text-smi leading-[22px] text-mediumspringgreen hover:text-opacity-80 inline-block"
            onClick={() => {
              setIsLogin(true);
              setIsRegister(false);
              setIsForgot(false);
            }}
          >
            Login!
          </div>
        </div>

        <div className="flex flex-row w-full" />
      </div>
    </div>
  );
  return <>{login}</>;
};
