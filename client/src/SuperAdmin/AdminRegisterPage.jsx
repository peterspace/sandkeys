import { Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { SetLogin } from '../redux/features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { registerUser, validateEmail } from '../services/apiService';
import { toast } from 'react-toastify';

export default function AdminRegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const dispatch = useDispatch();

  async function RegisterUser(ev) {
    ev.preventDefault();

    if (!name || !email || !password) {
      return toast.error('All fields are required');
    }
    if (password.length < 6) {
      return toast.error('Passwords must be up to 6 characters');
    }
    if (!validateEmail(email)) {
      return toast.error('Please enter a valid email');
    }

    const userData = {
      name,
      email,
      password,
      role: 'Admin',
    };
    try {
      const data = await registerUser(userData);
      console.log(data);

      if(data){
        localStorage.setItem('isLoggedIn', JSON.stringify(true));
        localStorage.setItem('user', JSON.stringify(data));
      }
      // await dispatch(SetName(data.name));
      alert('Registration successful. Now you can log in');
      setRedirect(true);
    } catch (e) {
      alert('Registration failed. Please try again later');
    }
  }

  if (redirect) {
    // return <Navigate to={'/landingPage'} />;
    return <Navigate to={'/admin/login'} />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Register Admin</h1>
        <form className="max-w-md mx-auto" onSubmit={RegisterUser}>
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
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
          <button className="primary">Register</button>
          <div className="text-center py-2 text-gray-500">
            Already a member?{' '}
            <Link className="underline text-black" to={'/admin/login'}>
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
