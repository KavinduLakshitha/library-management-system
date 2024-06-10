import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../index.css';
import BookModal from './BookModal';
import HeroSection from './HeroSection';

const BookList = ({ token }) => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/books', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            title: searchTerm,
          },
        });
        setBooks(response.data);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      }
    };

    fetchBooks();
  }, [token, searchTerm]);

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>      
      <div className='booklist-page font-sans h-screen flex flex-col'>      
      <div className='px-6 py-5'>        
        <div className='menu-bar flex items-center justify-center relative'>
          
        <h1 className='text-4xl mr-10 font-bold text-center'>Boundless Books</h1>

          <input
            type='text'
            placeholder='Search by book title'
            className='search-bar p-2 border rounded-md w-1/3 bg-gray-100 outline-none'
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className='ml-auto right-0'>
            <button onClick={handleLogout} className='profile-icon text-xl'>
          Logout
        </button>
        </div>
      </div>     
      
      </div>

      <HeroSection />
          
      <div className='booklist-grid grid grid-cols-1 mt-5 md:grid-cols-2 lg:grid-cols-5 gap-5'>
        {books.map(book => (
          <div key={book._id} className='book-card bg-white shadow-md rounded-md cursor-pointer flex flex-col items-center' onClick={() => handleBookClick(book)}>
            {book.bookCover && book.bookCover.data && (
              <img
                src={`data:${book.bookCover.contentType};base64,${arrayBufferToBase64(book.bookCover.data.data)}`}
                alt={`${book.title} cover`}
                className='w-3/4 h-auto mt-3 mb-3 object-contain rounded-xl'
              />
            )}
            <h2 className='text-xl font-semibold mb-3 text-center'>{book.title}</h2>
            <p className='text-lg mb-3 text-center'>by {book.author}</p>
          </div>
        ))}
      </div>
      {isModalOpen && selectedBook && (
        <BookModal book={selectedBook} onClose={closeModal} />
      )}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-10 rounded-md">
            <h2 className="text-2xl font-semibold mb-5 text-center">Are you sure you want to logout?</h2>
            <div className="flex justify-center">
              <button onClick={confirmLogout} className="p-2 bg-yellow-500 text-white rounded-md mr-2">
                Yes
              </button>
              <button onClick={cancelLogout} className="p-2 bg-gray-500 text-white rounded-md">
                No
              </button>
            </div>
          </div>
        </div>
        )}
    </div>
  </>
    
  );
};

export default BookList;
