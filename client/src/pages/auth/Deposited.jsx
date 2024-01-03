import React, { useState, useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { AiFillApple, AiOutlineClose } from 'react-icons/ai';

import { toast } from 'react-toastify';

import { useDispatch } from 'react-redux';
import Modal from './Modal';

import { getBookingApproval } from '../../services/apiService';

//eenglishwithpeter@gmail.com
export const Deposited = (props) => {
  const { setUser } = props;

  const params = useParams();
  const { authId, id } = params;

  const [redirect, setRedirect] = useState(false);
  const [redirectHome, setRedirectHome] = useState(false);
  const [redirectVerify, setRedirectVerify] = useState(false);

  useEffect(async () => {
    if (authId && id) {
      VerifySubmit()
    }
  }, [authId]);

  async function VerifySubmit() {

    if (!authId || !id) {
      return toast.error('no token received');
    }

    const userData = {
      authId,
      id,
    };

    try {
      const data = await getBookingApproval(userData);
      setUser(data);

      console.log({ userData: data });
      if (data) {
        setTimeout(() => {
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
