import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../index.css';
import BookModal from './BookModal';

const BookList = ({ token }) => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className='booklist-page font-sans h-screen flex flex-col p-10'>
      <h1 className='text-4xl font-bold mb-10 text-left'>Online library</h1>
      <div className='menu-bar flex items-center justify-between mb-10'>
        <input
          type='text'
          placeholder='Search...'
          className='search-bar p-2 border rounded-md'
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div>
          <a href='/my-books' className='my-books-link text-xl'>
            My Books
          </a>
          <button className='profile-icon text-xl ml-5'>
            Logout
          </button>
        </div>
      </div>
      <div className='booklist-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5'>
        {books.map(book => (
          <div key={book._id} className='book-card bg-white shadow-md rounded-md cursor-pointer flex flex-col items-center' onClick={() => handleBookClick(book)}>
            <h2 className='text-xl font-semibold mb-3 text-center'>{book.title}</h2>
            <p className='text-lg mb-3 text-center'>by {book.author}</p>
            {book.bookCover && book.bookCover.data && (
              <img
                src={`data:${book.bookCover.contentType};base64,${arrayBufferToBase64(book.bookCover.data.data)}`}
                alt={`${book.title} cover`}
                className='w-3/4 h-auto mb-3 object-contain'
              />
            )}
          </div>
        ))}
      </div>
      {isModalOpen && selectedBook && (
        <BookModal book={selectedBook} onClose={closeModal} />
      )}
    </div>
  );
};

export default BookList;
