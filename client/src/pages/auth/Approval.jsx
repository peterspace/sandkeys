import React, { useState, useEffect } from 'react';
import { Link, Navigate, useParams, useNavigate } from 'react-router-dom';
import { AiFillApple, AiOutlineClose } from 'react-icons/ai';

import { toast } from 'react-toastify';

import { useDispatch } from 'react-redux';
import Modal from './Modal';

import { getReservationsApproval } from '../../services/apiService';

//eenglishwithpeter@gmail.com
export const Approval = (props) => {
  const { user } = props;
  const navigate = useNavigate();

  const params = useParams();
  const { authId, id } = params;
  const [redirectHome, setRedirectHome] = useState(false);
  const [login, setLogin] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const [status, setStatus] = useState('Pending');
  console.log({ status: status });

  //react-dom.development.js:22932 Uncaught TypeError: destroy is not a function
  // useEffect(async () => {
  //   if (authId && id) {
  //     VerifySubmit();
  //   }
  // }, [authId]);

  //react-dom.development.js:22932 Solution: Remove async from usEffect
  useEffect(() => {
    if (authId && id) {
      setIsActive(true);
    }
    if (id === 'yes') {
      setStatus('Approved');
    }
    if (id === 'no') {
      setStatus('Rejected');
    }
  }, [authId]);

  useEffect(() => {
    if (isActive) {
      VerifySubmit();
      setTimeout(() => {
        navigate('/');
      }, 5000); // 5 seconds later
    }
  }, [isActive]);

  async function VerifySubmit() {
    if (!authId || !id) {
      return toast.error('no token received');
    }

    const userData = {
      authId,
      id,
    };
    await getReservationsApproval(userData);
    setIsActive(false);
  }

  if (login) {
    // return <Navigate to={'/landingPage'} />;
    return <Navigate to={'/account'} />;
  }

  if (redirectHome) {
    // return <Navigate to={'/landingPage'} />;
    return <Navigate to={'/'} />;
  }

  const approvalCard = (
    <div className="flex justify-center rounded-lg bg-white shadow-[0px_2px_4px_rgba(26,_47,_79,_0.2)] w-[375px] md:w-[500px] p-4">
      <div className="flex flex-col gap-[24px]">
        <div className="flex flex-col gap-[8px] md:gap-[12px]">
          <div className="flex flex-row justify-between mt-[24px]">
            <div className="text-[18px] md:text-[24px] font-extrabold leading-[32px] inline-block">
              Approval
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
        {status && (
          <div className="flex flex-col">
            <div className="flex flex-row justify-center items-center">
              <div className="cursor-pointer flex flex-row justify-center items-center bg-mediumspringgreen hover:opacity-90 text-white h-[49px] shrink-0 rounded w-full">
                {status}
              </div>
            </div>
          </div>
        )}
        {!user && (
          <div className="flex flex-row gap-2 justify-end mr-[24px]">
            <div
              className="cursor-pointer text-smi leading-[22px] text-mediumspringgreen hover:text-opacity-80 inline-block"
              onClick={() => {
                setLogin(true);
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
        <Modal visible={true}>{approvalCard}</Modal>
      </div>
    </>
  );
};
