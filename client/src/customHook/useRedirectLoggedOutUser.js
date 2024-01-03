import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SetLogin } from '../redux/features/auth/authSlice';
import { getLoginStatus } from '../services/apiService';
import { toast } from 'react-toastify';

const useRedirectLoggedOutUser = (path) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const redirectLoggedOutUser = async () => {
      const isLoggedIn = await getLoginStatus();
      dispatch(SetLogin(isLoggedIn));

      if (!isLoggedIn) {
        toast.info('Session expired, please login to continue.');
        navigate(path);
        return;
      }
    };
    redirectLoggedOutUser();
  }, [navigate, path, dispatch]);
};

export default useRedirectLoggedOutUser;
