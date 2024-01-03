import { Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { loginUser, validateEmail } from '../services/apiService';
// import { setOwnerId, selectOwnerId } from '../redux/features/auth/bookingSlice';
// import { useSelector } from 'react-redux';

import { toast } from 'react-toastify';

import { useDispatch } from 'react-redux';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);

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
      console.log({ userData: data });
      if (data) {
        localStorage.setItem('isLoggedIn', JSON.stringify(true));
        localStorage.setItem('user', JSON.stringify(data));
        window.location.reload(); // relaod to update changes m,ade by localStoarge
      }
      alert('Login successful');
      setRedirect(true);
    } catch (e) {
      alert('Login failed');
    }
  }

  if (redirect) {
    // return <Navigate to={'/landingPage'} />;
    return <Navigate to={'/account'} />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
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
            <Link className="underline text-black" to={'/register'}>
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
