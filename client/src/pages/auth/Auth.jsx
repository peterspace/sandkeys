import React, { useEffect, useState } from 'react';
import {
  Link,
  Navigate,
  useNavigate,
  useLocation,
  useParams,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Auth.module.css';

import { Login } from './Login';
import { Register } from './Register';
import { Forgot } from './Forgot';
import Modal from './Modal';
// import { Header } from '../../components/Header';
// import { Footer } from '../../components/Footer';

//w-[370px] ===w-[300px]
//w-[375px] === w-[320px] xs:w-[340px]
import {
  successUserGoogle,
  registerUser,
  registerSocial,
  loginSocial,
} from '../../services/apiService';

import { LoginUser } from '../../redux/features/user/userSlice';
export const Auth = (props) => {
  const params = useParams();
  const { authId, message } = params;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //===============================================================================================
  //============================={Login redirects}===============================================
  const { user } = useSelector((state) => state.user);
  //============================={Login redirects}===============================================
  //=============================================================================================
  // const [isLogin, setIsLogin] = useState(false);
  // initially true
  const isLoginL = localStorage.getItem('isLogin')
    ? JSON.parse(localStorage.getItem('isLogin'))
    : true; // initially true
  const [isLogin, setIsLogin] = useState(isLoginL);
  // initially false
  const isRegisterL = localStorage.getItem('isRegister')
    ? JSON.parse(localStorage.getItem('isRegister'))
    : false;
  const [isRegister, setIsRegister] = useState(isRegisterL);

  const isForgotL = localStorage.getItem('isForgot')
    ? JSON.parse(localStorage.getItem('isForgot'))
    : false;
  const [isForgot, setIsForgot] = useState(isForgotL);

  const [errorMessage, setErrorMessage] = useState();

  console.log({ authId: authId });

  const [redirectLogin, setRedirectLogin] = useState(false);
  const [redirectRegister, setRedirectRegister] = useState(false);
  const [redirectForgot, setRedirectForgot] = useState(false);
  const [redirectHome, setRedirectHome] = useState(false);

  const prevLocation = localStorage.getItem('prevLocation')
    ? JSON.parse(localStorage.getItem('prevLocation'))
    : '/';

  console.log({ prevLocation: prevLocation });
  // useEffect(() => {
  //   if (redirectHome) {
  //     navigate('/');
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [redirectHome]);
  useEffect(() => {
    if (redirectHome) {
      setIsLogin(true);
      setIsRegister(false);
      setIsForgot(false);
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirectHome]);

  useEffect(() => {
    localStorage.setItem('isLogin', JSON.stringify(isLogin));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin]);
  useEffect(() => {
    localStorage.setItem('isRegister', JSON.stringify(isRegister));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRegister]);

  useEffect(() => {
    localStorage.setItem('isForgot', JSON.stringify(isForgot));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isForgot]);

  useEffect(() => {
    getError();
  }, []);

  async function getError() {
    if (message) {
      setErrorMessage(message);
    }
  }

  //=================={Social LOgin}==================

  useEffect(() => {
    if (isLogin) {
      LoginSubmit();
    }
  }, []);

  async function LoginSubmit() {
    if (!authId) {
      return;
    }
    let userData = {
      authId,
    };

    try {
      // const data = await registerSocial(userData);
      const data = await loginSocial(userData);
      console.log({ userData: data });
      if (data) {
        dispatch(LoginUser(data));
        localStorage.setItem('isLoggedIn', JSON.stringify(true));
        localStorage.setItem('user', JSON.stringify(data));
        setTimeout(() => {
          setRedirectLogin(true);
        }, 200);
      }
    } catch (e) {
      alert('Login failed');
    }
  }

  //=================={Registration}==================
  useEffect(() => {
    if (isRegister) {
      SubmitSignupSocial();
    }
  }, []);

  async function SubmitSignupSocial() {
    if (!authId) {
      return;
    }
    let userData = {
      authId,
    };

    try {
      const data = await registerSocial(userData);
      console.log({ userData: data });

      if (data) {
        // localStorage.setItem('user', JSON.stringify(data));
        setTimeout(() => {
          setRedirectRegister(true);
          setIsLogin(true);
          setIsRegister(false);
        }, 200);
      }
    } catch (e) {
      alert('Registration failed. Please try again later');
    }
  }

  //===============================================================================================
  //============================={Login redirects}===============================================

  if (user.token) {
    return window.location.replace(prevLocation);
  }
  //============================={Login redirects}===============================================
  //=============================================================================================

  //====={use source data to reset values here e.g booking app approach like in placeForm }==============

  //====={use source data to reset values here e.g booking app approach like in placeForm }==============
  return (
    <>
      <div className="h-screen mt-[64px] mb-[64px] overflow-auto">
        {message && (
          <>
            <div className="">Error message: {errorMessage}</div>
          </>
        )}
        {isRegister && (
          <div
            className={`${styles.hero} flex flex-col justify-center items-center`}
          >
            <Register
              setIsLogin={setIsLogin}
              setIsRegister={setIsRegister}
              setIsForgot={setIsForgot}
              redirectS={redirectRegister}
              setRedirectHome={setRedirectHome}
            />
          </div>
        )}
        {isLogin && (
          <div
            className={`${styles.hero} flex flex-col justify-center items-center`}
          >
            <Login
              setIsLogin={setIsLogin}
              setIsRegister={setIsRegister}
              setIsForgot={setIsForgot}
              redirectS={redirectLogin}
              setRedirectHome={setRedirectHome}
            />
          </div>
        )}
        {isForgot && (
          <div
            className={`${styles.hero} flex flex-col justify-center items-center`}
          >
            <Forgot
              setIsLogin={setIsLogin}
              setIsRegister={setIsRegister}
              setIsForgot={setIsForgot}
            />
          </div>
        )}
      </div>
    </>
  );
};
