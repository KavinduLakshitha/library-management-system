import React, { useState } from 'react';
import { Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import BookList from './components/BookList';
import AdminDashboard from './components/AdminDashboard';
import PasswordResetRequest from './components/PasswordResetRequest';
import PasswordResetForm from './components/PasswordResetForm';
import SignUp from './components/Signup';

const App = () => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  // Extract role from token after login
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
