// In src/components/AdminDashboard.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';


const AdminDashboard = ({ token }) => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publishedDate: '',
    description: '',
    bookCover: null,
    bookFile: null,
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/books', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBooks(response.data);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      }
    };

    fetchBooks();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setNewBook((prevBook) => ({ ...prevBook, [name]: files[0] }));
    } else {
      setNewBook((prevBook) => ({ ...prevBook, [name]: value }));
    }
  };

  const handleAddBook = async () => {
    const formData = new FormData();
    for (const key in newBook) {
      formData.append(key, newBook[key]);
    }

    try {
      await axios.post('http://localhost:5000/api/books', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setNewBook({
        title: '',
        author: '',
        isbn: '',
        publisher: '',
        publishedDate: '',
        description: '',
        bookCover: null,
        bookFile: null,
      });
      setShowAddModal(false);
      const response = await axios.get('http://localhost:5000/api/books', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBooks(response.data);
    } catch (error) {
      console.error('Failed to add book:', error);
    }
  };

  const handleEditBook = async () => {
    const formData = new FormData();
    for (const key in editingBook) {
      formData.append(key, editingBook[key]);
    }

    try {
      await axios.put(`http://localhost:5000/api/books/${editingBook._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setEditingBook(null);
      setShowEditModal(false);
      const response = await axios.get('http://localhost:5000/api/books', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBooks(response.data);
    } catch (error) {
      console.error('Failed to edit book:', error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(`http://localhost:5000/api/books/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const response = await axios.get('http://localhost:5000/api/books', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBooks(response.data);
    } catch (error) {
      console.error('Failed to delete book:', error);
    }
  };

  return (
    <div className="admin-dashboard p-10 font-sans">
      <h1 className="text-4xl font-bold mb-10">Admin Dashboard</h1>
      <button onClick={() => setShowAddModal(true)} className="p-2 bg-blue-500 text-white rounded-md mb-5">
        Add Book
      </button>
      <div className="book-list">
        <h2 className="text-2xl font-semibold mb-5">Book List</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Title</th>
              <th className="border p-2">Author</th>
              <th className="border p-2">ISBN</th>
              <th className="border p-2">Publisher</th>
              <th className="border p-2">Published Date</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book._id} className="border">
                <td className="border p-2">{book.title}</td>
                <td className="border p-2">{book.author}</td>
                <td className="border p-2">{book.isbn}</td>
                <td className="border p-2">{book.publisher}</td>
                <td className="border p-2">{new Date(book.publishedDate).toLocaleDateString()}</td>
                <td className="border p-2">{book.description}</td>
                <td className="border p-2">
                  <button onClick={() => { setEditingBook(book); setShowEditModal(true); }} className="p-1 text-yellow-500 rounded-md mr-2">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleDeleteBook(book._id)} className="p-1 text-red-500 rounded-md">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-10 rounded-md">
            <h2 className="text-2xl font-semibold mb-5">Add New Book</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={newBook.title}
                onChange={handleInputChange}
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="author"
                placeholder="Author"
                value={newBook.author}
                onChange={handleInputChange}
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="isbn"
                placeholder="ISBN"
                value={newBook.isbn}
                onChange={handleInputChange}
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="publisher"
                placeholder="Publisher"
                value={newBook.publisher}
                onChange={handleInputChange}
                className="p-2 border rounded-md"
              />
              <input
                type="date"
                name="publishedDate"
                value={newBook.publishedDate}
                onChange={handleInputChange}
                className="p-2 border rounded-md"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={newBook.description}
                onChange={handleInputChange}
                className="p-2 border rounded-md col-span-1 md:col-span-2"
              ></textarea>
              <input
                type="file"
                name="bookCover"
                onChange={handleInputChange}
                className="p-2 border rounded-md"
              />
              <input
                type="file"
                name="bookFile"
                onChange={handleInputChange}
                className="p-2 border rounded-md"
              />
            </div>
            <div className="flex justify-end">
              <button onClick={() => setShowAddModal(false)} className="p-2 bg-gray-500 text-white rounded-md mr-2">
                Cancel
              </button>
              <button onClick={handleAddBook} className="p-2 bg-blue-500 text-white rounded-md">
                Add Book
              </button>
            </div>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-10 rounded-md">
            <h2 className="text-2xl font-semibold mb-5">Edit Book</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={editingBook.title}
                onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="author"
                placeholder="Author"
                value={editingBook.author}
                onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="isbn"
                placeholder="ISBN"
                value={editingBook.isbn}
                onChange={(e) => setEditingBook({ ...editingBook, isbn: e.target.value })}
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="publisher"
                placeholder="Publisher"
                value={editingBook.publisher}
                onChange={(e) => setEditingBook({ ...editingBook, publisher: e.target.value })}
                className="p-2 border rounded-md"
              />
              <input
                type="date"
                name="publishedDate"
                value={new Date(editingBook.publishedDate).toISOString().split('T')[0]}
                onChange={(e) => setEditingBook({ ...editingBook, publishedDate: e.target.value })}
                className="p-2 border rounded-md"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={editingBook.description}
                onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                className="p-2 border rounded-md col-span-1 md:col-span-2"
              ></textarea>
              <input
                type="file"
                name="bookCover"
                onChange={(e) => setEditingBook({ ...editingBook, bookCover: e.target.files[0] })}
                className="p-2 border rounded-md"
              />
              <input
                type="file"
                name="bookFile"
                onChange={(e) => setEditingBook({ ...editingBook, bookFile: e.target.files[0] })}
                className="p-2 border rounded-md"
              />
            </div>
            <div className="flex justify-end">
              <button onClick={() => setShowEditModal(false)} className="p-2 bg-gray-500 text-white rounded-md mr-2">
                Cancel
              </button>
              <button onClick={handleEditBook} className="p-2 bg-blue-500 text-white rounded-md">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
