import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError('All fields are required');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/auth/signup', { username, email, password });
      navigate('/login');
    } catch (error) {
      console.error('Error during signup:', error);
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <>    
    <div className='font-sans h-screen flex justify-center gap-10 items-center w-full overflow-hidden'>
    <div className='h-[800px] flex items-center justify-center'><img className='h-3/4 object-contain' src="/login.jpg" alt="" />  </div>
      <div className='w-[500px] flex flex-col justify-center'>
        <div className='w-full'>
          <form onSubmit={handleSignup} className='flex flex-col align-middle'>
            <h2 className='text-3xl font-bold'>Signup</h2>
            {error && <p className="error text-red-500">{error}</p>}
            <div className='flex justify-center flex-col w-full mb-3'>
              <label className='text-lg mb-3' htmlFor="email">Email</label>
              <input
                className='border-none outline-none bg-gray-100 p-2 rounded-md'
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className='flex justify-center flex-col w-full mb-3'>
              <label className='text-lg mb-3' htmlFor="username">Username</label>
              <input
                className='border-none outline-none bg-gray-100 px-2 py-3 rounded-md'
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className='flex justify-center flex-col w-full mb-3'>
              <label className='text-lg mb-3' htmlFor="password">Password</label>
              <div className='relative'>
                <input
                  className='border-none outline-none bg-gray-100 p-2 rounded-md w-full'
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500'
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
            <button className='login-button bg-yellow-500 border-none outline-none px-2 py-3 rounded-md' type="submit">Signup</button>
          </form>
        </div>
      </div>
    </div>
    </>
    
  );
};

export default Signup;