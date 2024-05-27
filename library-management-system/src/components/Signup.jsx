import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/signup', { username, email, password });
      navigate('/login');
    } catch (error) {
      console.error('Error during signup:', error);
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
            <div className='flex justify-center flex-col w-full mb-3'>
              <label className='text-lg mb-3' htmlFor="email">Email</label>
              <input
                className='border-none outline-none bg-gray-100 p-2 rounded-md'
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            />
            </div>
        
            <div className='flex justify-center flex-col w-full mb-3'>
              <label className='text-lg mb-3' htmlFor="password">Password</label>
              <input
              className='border-none outline-none bg-gray-100 p-2 rounded-md'
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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