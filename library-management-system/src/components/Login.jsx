import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css';
import { Link } from 'react-router-dom';

const Login = ({ setToken, setRole }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      const { token } = response.data;
      setToken(token);
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setRole(decodedToken.role);
      navigate('/books');
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className='login-page font-sans h-screen flex justify-center gap-10 items-center w-full overflow-hidden'>
      <div className='h-[800px] flex items-center justify-center'><img className='h-3/4 object-contain' src="/login.jpg" alt="" /></div>    
      <div className='login-container w-[500px] flex flex-col justify-center'>        
        <div className='login-form w-full'>        
          <form onSubmit={handleLogin} className='flex flex-col align-middle'>
          <h2 className='text-3xl font-bold'>Login</h2>            
            <div className='login-input flex justify-center flex-col w-full mb-3'>
              <label className='text-lg mb-3' htmlFor="username">Username</label>
              <input
                className='border-none outline-none bg-gray-100 px-2 py-3 rounded-md'
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className='login-input flex justify-center flex-col w-full mb-6'>
              <label className='text-lg mb-3' htmlFor="password">Password</label>
              <input
                className='border-none outline-none bg-gray-100 p-2 rounded-md'
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
                        
            <button className='login-button bg-yellow-500 border-none outline-none px-2 py-3 rounded-md' type="submit">Login</button>
            
            <div className='login-links text-center mt-5'>
              <p className='login-signup mb-2'>
                Don't have an account? <Link className='login-button-2' to='/signup'>Sign up here</Link>
              </p>
              <Link className='login-button-2' to='/reset-password'>Forgot your password?</Link>            
            </div> 
          </form>                   
        </div>        
      </div>
    </div>
  );
};

export default Login;