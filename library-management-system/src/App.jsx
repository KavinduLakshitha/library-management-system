import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import BookList from './components/BookList';
import AdminDashboard from './components/AdminDashboard';
import PasswordResetRequest from './components/PasswordResetRequest';
import PasswordResetForm from './components/PasswordResetForm';
import SignUp from './components/Signup';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (role) {
      localStorage.setItem('role', role);
    } else {
      localStorage.removeItem('role');
    }
  }, [role]);

  const isAdmin = role === 'admin';

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} setRole={setRole} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/books"
            element={token ? <BookList token={token} /> : <Navigate to="/login" replace />}
          />
          <Route path="/reset-password" element={<PasswordResetRequest />} />
          <Route path="/reset-password/:token" element={<PasswordResetForm />} />
          <Route
            path="/admin"
            element={isAdmin ? <AdminDashboard token={token} /> : <Navigate to="/login" replace />}
          />
          <Route path="*" element={<Navigate to={token ? "/books" : "/login"} replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
