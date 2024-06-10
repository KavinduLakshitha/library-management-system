import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const PasswordResetForm = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { token } = useParams();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      setMessage('Password reset successful. You can now login with your new password.');
      navigate('/login');
    } catch (error) {
      console.error('Error during password reset:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2>Password Reset Form</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          className='border-none outline-none bg-gray-100 p-2 rounded-md w-full'
          type={passwordVisible ? "text" : "password"}
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className='bg-yellow-500 border-none outline-none px-2 py-3 rounded-md' type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default PasswordResetForm;