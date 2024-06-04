import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../index.css';

const BookList = ({ token }) => {
  const [books, setBooks] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/books', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBooks(response.data);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      }
    };

    fetchBooks();
  }, [token]);

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div className='booklist-page font-sans h-screen flex flex-col p-10'>
      <h1 className='text-4xl font-bold mb-10 text-left'>Online library</h1>
      <div className='menu-bar flex items-center mb-10'>
        <input
          type='text'
          placeholder='Search...'
          className='search-bar p-2 border rounded-md'
        />
        <a href='/my-books' className='my-books-link text-xl'>
          My Books
        </a>
        <div className='relative'>
          <button onClick={toggleDropdown} className='profile-icon text-xl'>
            Profile
          </button>
          {dropdownVisible && (
            <div className='dropdown-menu absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg'>
              <a href='/settings' className='block px-4 py-2 text-gray-800 hover:bg-gray-100'>
                Settings
              </a>
              <a href='/logout' className='block px-4 py-2 text-gray-800 hover:bg-gray-100'>
                Log Out
              </a>
            </div>
          )}
        </div>
      </div>
      <div className='booklist-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10'>
        {books.map(book => (
          <div key={book._id} className='book-card p-5 bg-white shadow-md rounded-md'>
            <h2 className='text-xl font-semibold mb-3'>{book.title}</h2>
            <p className='text-lg mb-3'>by {book.author}</p>
            {book.bookCover && book.bookCover.data && (
              <img
                src={`data:${book.bookCover.contentType};base64,${arrayBufferToBase64(book.bookCover.data.data)}`}
                alt={`${book.title} cover`}
                className='w-3/4 h-auto mb-3 object-contain'
              />
            )}
            {/* <p className='text-lg'>{book.description}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;
