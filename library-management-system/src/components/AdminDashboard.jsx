import React, { useState } from 'react';
import axios from 'axios';

const AdminDashboard = ({ token }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/books',
        { title, author, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Clear the form
      setTitle('');
      setAuthor('');
      setDescription('');
    } catch (error) {
      console.error('Failed to add book:', error);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <form onSubmit={handleAddBook}>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Author:</label>
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
        </div>
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default AdminDashboard;
