import React from 'react';
import axios from 'axios';

const BookModal = ({ book, onClose, token }) => {
  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const downloadBook = async () => {
    const base64Book = arrayBufferToBase64(book.bookFile.data.data);
    const linkSource = `data:${book.bookFile.contentType};base64,${base64Book}`;
    const downloadLink = document.createElement('a');
    const fileName = `${book.title}.pdf`;
  
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  
    try {
      await axios.post(`http://localhost:5000/api/books/${book._id}/download`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Book downloaded successfully');
    } catch (error) {
      console.error('Failed to download book:', error);
    }
  };

  const bookCoverBase64 = book.bookCover ? arrayBufferToBase64(book.bookCover.data.data) : '';
  const backgroundStyle = bookCoverBase64 ? {
    backgroundImage: `url(data:${book.bookCover.contentType};base64,${bookCoverBase64})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: 0.1,
  } : {};

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative bg-white p-8 rounded-md shadow-md w-3/4 max-w-lg">
        {bookCoverBase64 && (
          <div className="absolute inset-0 z-0" style={backgroundStyle}></div>
        )}
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4">{book.title}</h2>
          <p className="text-lg mb-2"><strong>Author:</strong> {book.author}</p>
          <p className="text-lg mb-2"><strong>ISBN:</strong> {book.isbn}</p>
          <p className="text-lg mb-2"><strong>Publisher:</strong> {book.publisher}</p>
          <p className="text-lg mb-2"><strong>Published Date:</strong> {new Date(book.publishedDate).toLocaleDateString()}</p>
          <p className="text-lg mb-4"><strong>Description:</strong> {book.description}</p>
          <button onClick={downloadBook} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Download PDF
          </button>
          <button onClick={onClose} className="ml-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookModal;
