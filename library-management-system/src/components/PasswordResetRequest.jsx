import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const PasswordResetRequest = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setMessage('All fields are required');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', { username, password });
      setMessage('Password reset successful.');
      navigate('/login');
    } catch (error) {
      console.error('Error during password reset request:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className='login-page font-sans h-screen flex justify-center items-center w-full overflow-hidden'>
      <div className='login-container w-[500px] flex flex-col justify-center'>
        <div className='login-form w-full'>
          <h2 className='text-3xl font-bold'>Reset your password</h2>
          {message && <p>{message}</p>}
          <form onSubmit={handleSubmit}>
            <div className='login-input flex justify-center flex-col w-full mb-3'>
              <label className='text-lg mb-3' htmlFor="username">Username</label>
              <input
                className='border-none outline-none bg-gray-100 px-2 py-3 rounded-md'
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className='login-input flex justify-center flex-col w-full mb-6'>
              <label className='text-lg mb-3' htmlFor="password">Enter a new password</label>
              <div className='relative'>
                <input
                  className='border-none outline-none bg-gray-100 p-2 rounded-md w-full'
                  type={passwordVisible ? "text" : "password"}
                  placeholder="New Password"
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
            <button className='login-button bg-yellow-500 border-none outline-none px-2 py-3 rounded-md w-full' type="submit">Reset Password</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetRequest;
