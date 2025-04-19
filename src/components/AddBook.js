import React, { useState } from 'react';

const AddBook = () => {
  const [book, setBook] = useState({
    title: '',
    author: '',
    genre: '',
    pages: ''
  });

  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
    setError('');
  };

  const handleAddBook = () => {
    const { title, author, genre, pages } = book;

    // Validation
    if (!title || !author || !genre || !pages) {
      setError('All fields are required.');
      return;
    }

    if (isNaN(pages) || Number(pages) <= 0) {
      setError('Page count must be a positive number.');
      return;
    }

    // Add book to list
    setBooks([...books, { ...book, id: Date.now() }]);
    setBook({ title: '', author: '', genre: '', pages: '' });
  };

  return (
    <div className="add-book-ui" style={{ padding: '1rem', border: '1px solid #ccc', marginBottom: '1rem' }}>
      <h2>Add Book</h2>

      <div style={{ marginBottom: '0.5rem' }}>
        <input
          type="text"
          name="title"
          placeholder="Book Title"
          value={book.title}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={book.author}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <input
          type="text"
          name="genre"
          placeholder="Genre"
          value={book.genre}
          onChange={handleChange}
        />
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <input
          type="number"
          name="pages"
          placeholder="Page Count"
          value={book.pages}
          onChange={handleChange}
        />
      </div>

      <button onClick={handleAddBook}>Add Book</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Book List</h3>
      <ul>
        {books.map((b) => (
          <li key={b.id}>
            <strong>{b.title}</strong> by {b.author} – {b.genre}, {b.pages} pages
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddBook;
