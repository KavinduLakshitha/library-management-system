import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyBooks = ({ token }) => {
  const [downloadedBooks, setDownloadedBooks] = useState([]);

  useEffect(() => {
    const fetchDownloadedBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/downloaded-books', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDownloadedBooks(response.data);
      } catch (error) {
        console.error('Failed to fetch downloaded books:', error);
      }
    };

    fetchDownloadedBooks();
  }, [token]);

  return (
    <div>
      <h2>My Downloaded Books</h2>
      {downloadedBooks.map(downloadedBook => (
        <div key={downloadedBook._id}>
          <h3>{downloadedBook.book.title}</h3>
          <p>Downloaded At: {new Date(downloadedBook.downloadedAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default MyBooks;