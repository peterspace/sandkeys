import React, { useState, useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { AiFillApple, AiOutlineClose } from 'react-icons/ai';
import {
  resetPassword,
  forgotOtp,
  verifyOtp,
  validateEmail,
} from '../../services/apiService';

import { toast } from 'react-toastify';

import { useDispatch } from 'react-redux';
import Modal from './Modal';

//eenglishwithpeter@gmail.com
export const Otp = (props) => {
  const { setUser } = props;

  const params = useParams();
  const { authId } = params;
  console.log({ authId: authId });
  // initially true
  const isForgotOtpL = localStorage.getItem('isForgotOtp')
    ? JSON.parse(localStorage.getItem('isForgotOtp'))
    : true;
  const [isForgotOtp, setIsForgotOtp] = useState(isForgotOtpL);

  // initially false
  const isVerifyOtpL = localStorage.getItem('isVerifyOtp')
    ? JSON.parse(localStorage.getItem('isVerifyOtp'))
    : false;
  const [isVerifyOtp, setIsVerifyOtp] = useState(isVerifyOtpL);

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  console.log({ message: message });

  const [otp, setOtp] = useState('');
  const [otp1, setOtp1] = useState('');
  const [otp2, setOtp2] = useState('');
  const [otp3, setOtp3] = useState('');
  const [otp4, setOtp4] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [redirectHome, setRedirectHome] = useState(false);
  const [redirectVerify, setRedirectVerify] = useState(false);

  const fullOtp = `${otp1}${otp2}${otp3}${otp4}`;
  console.log({ fullOtp: fullOtp });

  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.setItem('isVerifyOtp', JSON.stringify(isVerifyOtp));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVerifyOtp]);

  useEffect(() => {
    localStorage.setItem('isForgotOtp', JSON.stringify(isForgotOtp));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isForgotOtp]);

  // useEffect(() => {
  //   localStorage.setItem('authId', JSON.stringify(authId));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [authId]);

  // async function LoginSubmit() {

  async function ForgotSubmit() {
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
      const data = await forgotOtp(userData);
      if (data) {
        toast.success(data.message);
        setEmail('');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async function VerifySubmit(ev) {
    ev.preventDefault();

    if (!authId) {
      return toast.error('otp must be authorized');
    }

    // if (otp.length === 5) {
    //   return toast.error('otp must be up to 4 characters');
    // }

    if (!otp1 || !otp2 || !otp3 || !otp4) {
      return toast.error('all fieilds are required');
    }

    if (
      otp1.length > 1 ||
      otp2.length > 1 ||
      otp3.length > 1 ||
      otp4.length > 1
    ) {
      return toast.error('otp must be only 4 characters');
    }

    const fullOtp = `${otp1}${otp2}${otp3}${otp4}`;
    const userData = {
      otp: fullOtp,
      authId,
    };

    try {
      const data = await verifyOtp(userData);
      console.log({ userData: data });
      if (data) {
        // localStorage.setItem('isLoggedIn', JSON.stringify(true));
        // localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        setOtp1('');
        setOtp2('');
        setOtp3('');
        setOtp4('');
        setTimeout(() => {
          setIsVerifyOtp(false);
          setIsForgotOtp(true);
          setRedirectVerify(true);
        }, 200);

        // window.location.reload(); // relaod to update changes m,ade by localStoarge
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  if (redirect) {
    // return <Navigate to={'/landingPage'} />;
    return <Navigate to={'/auth'} />;
  }

  if (redirectVerify) {
    // return <Navigate to={'/landingPage'} />;
    return <Navigate to={'/account'} />;
  }

  if (redirectHome) {
    // return <Navigate to={'/landingPage'} />;
    return <Navigate to={'/'} />;
  }

  const login = (
    <div className="flex justify-center rounded-lg bg-white shadow-[0px_2px_4px_rgba(26,_47,_79,_0.2)] w-[375px] md:w-[500px] p-4">
      <div className="flex flex-col gap-[24px]">
        <div className="flex flex-col gap-[8px] md:gap-[12px]">
          <div className="flex flex-row justify-between mt-[24px]">
            <div className="text-[18px] md:text-[24px] font-extrabold leading-[32px] inline-block">
              Verify account
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
        {isForgotOtp && (
          <>
            <div className="flex flex-col">
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
                  // onClick={ForgotSubmit}

                  onClick={() => {
                    ForgotSubmit();
                    setIsForgotOtp(false);
                    setIsVerifyOtp(true);
                  }}
                >
                  {message ? <>{message}</> : <>{'Get OTP'}</>}
                </div>
              </div>
            </div>
          </>
        )}
        {isVerifyOtp && (
          <>
            <div className="flex flex-col">
              <div className="flex flex-row justify-center items-center">
                <div className="flex flex-row justify-center items-center gap-[24px] mb-[24px] w-[200px]">
                  <div className="flex flex-row justify-center items-center">
                    <input
                      type="text"
                      className="text-center text-[16px] md:text-[18px] text-darkslategray-200 placeholder-darkgray-100 outline-none bg-gray-100"
                      placeholder="x"
                      value={otp1}
                      onChange={(ev) => setOtp1(ev.target.value)}
                    />
                  </div>
                  <div className="flex flex-row justify-center items-center">
                    <input
                      type="text"
                      className="text-center text-[16px] md:text-[18px] text-darkslategray-200 placeholder-darkgray-100 outline-none bg-gray-100"
                      placeholder="x"
                      value={otp2}
                      onChange={(ev) => setOtp2(ev.target.value)}
                    />
                  </div>
                  <div className="flex flex-row justify-center items-center">
                    {' '}
                    <input
                      type="text"
                      className="text-center text-[16px] md:text-[18px] text-darkslategray-200 placeholder-darkgray-100 outline-none bg-gray-100"
                      placeholder="x"
                      value={otp3}
                      onChange={(ev) => setOtp3(ev.target.value)}
                    />
                  </div>
                  <div className="flex flex-row justify-center items-center">
                    <input
                      type="text"
                      className="text-center text-[16px] md:text-[18px] text-darkslategray-200 placeholder-darkgray-100 outline-none bg-gray-100"
                      placeholder="x"
                      value={otp4}
                      onChange={(ev) => setOtp4(ev.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-row justify-center items-center">
                <div
                  className="cursor-pointer flex flex-row justify-center items-center bg-mediumspringgreen hover:opacity-90 text-white h-[49px] shrink-0 rounded w-full"
                  onClick={VerifySubmit}
                >
                  Verify
                </div>
              </div>
            </div>
          </>
        )}
        {isVerifyOtp && (
          <div className="flex flex-row gap-2 justify-end mr-[24px]">
            <div className="text-smi leading-[22px] text-gray-300 inline-block">
              OTP expired?
            </div>
            <div
              className="cursor-pointer text-smi leading-[22px] text-mediumspringgreen hover:text-opacity-80 inline-block"
              onClick={() => {
                setIsVerifyOtp(false);
                setIsForgotOtp(true);
              }}
            >
              Resend
            </div>
          </div>
        )}

        {isForgotOtp && (
          <div className="flex flex-row gap-2 justify-end mr-[24px]">
            <div className="text-smi leading-[22px] text-gray-300 inline-block">
              Already have an account?
            </div>
            <div
              className="cursor-pointer text-smi leading-[22px] text-mediumspringgreen hover:text-opacity-80 inline-block"
              onClick={() => {
                setRedirectVerify(true);
              }}
            >
              Login
            </div>
          </div>
        )}

        <div className="flex flex-row w-full" />
      </div>
    </div>
  );
  return (
    <>
      <div className="h-screen mt-[64px] mb-[64px] overflow-auto">
        <Modal visible={true}>{login}</Modal>
      </div>
    </>
  );
};
