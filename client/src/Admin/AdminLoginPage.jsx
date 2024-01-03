import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  SetLogin,
  SetName,
  SetEmail,
  SetRole,
  SetUserId,
} from '../redux/features/auth/authSlice';
import { loginUser, validateEmail } from '../services/apiService';
import { setOwnerId } from '../redux/features/auth/bookingSlice';
// import { useSelector } from 'react-redux';

import { toast } from 'react-toastify';

import { useDispatch } from 'react-redux';

export default function AdminLoginPage(props) {
  const { setUser, user } = props;
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  async function handleLoginSubmit(ev) {
    ev.preventDefault();

    if (!email || !password) {
      return toast.error('All fields are required');
    }

    if (!validateEmail(email)) {
      return toast.error('Please enter a valid email');
    }

    const userData = {
      email,
      password,
    };

    try {
      const data = await loginUser(userData);
      console.log(data);

      if (data) {
        setUser(data);
        setTimeout(() => {
          navigate('/admin/account/places');
        }, 400);
      }
      alert('Login successful');
    } catch (e) {
      alert('Login failed');
    }
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login Partner</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <button className="primary">Login</button>
          <div className="text-center py-2 text-gray-500">
            Don't have an account yet?{' '}
            <Link className="underline text-black" to={'/admin/register'}>
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
