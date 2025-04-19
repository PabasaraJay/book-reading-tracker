import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './AddBook.css';

const AddBook = () => {
  const [book, setBook] = useState({
    title: '',
    author: '',
    genre: '',
    language: 'English',
    seriesName: '',
    publicationDate: null,
    edition: '',
    pages: ''
  });

  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingBook, setEditingBook] = useState(null);

  const genres = [
    'Short Story',
    'Novel',
    'Adventure',
    'Horror',
    'Mystery',
    'Science Fiction',
    'Fantasy',
    'Romance',
    'Biography',
    'History'
  ];

  const editions = [
    '1st Edition',
    '2nd Edition',
    '3rd Edition',
    '4th Edition',
    'Revised Edition',
    'Special Edition'
  ];

  const validateTitle = (title) => {
    return /^[a-zA-Z\s\-']+$/.test(title);
  };

  const validateAuthor = (author) => {
    return /^[a-zA-Z\s\-'.]+$/.test(author);
  };

  const validateDate = (date) => {
    if (!date) return false;
    const today = new Date();
    return date <= today;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
    setError('');
    setSuccess('');
  };

  const handleDateChange = (date) => {
    setBook({ ...book, publicationDate: date });
    setError('');
    setSuccess('');
  };

  const handleAddBook = () => {
    // Reset messages
    setError('');
    setSuccess('');

    // Validate required fields
    if (!book.title || !book.author || !book.genre || !book.language || !book.publicationDate || !book.edition || !book.pages) {
      setError('All required fields must be filled out.');
      return;
    }

    // Validate title
    if (!validateTitle(book.title)) {
      setError('Title must only contain letters, spaces, hyphens, and apostrophes.');
      return;
    }

    // Validate author
    if (!validateAuthor(book.author)) {
      setError('Author name must only contain letters, spaces, hyphens, dots, and apostrophes.');
      return;
    }

    // Validate page count
    if (isNaN(book.pages) || Number(book.pages) <= 0) {
      setError('Page count must be a positive number.');
      return;
    }

    // Validate publication date
    if (!validateDate(book.publicationDate)) {
      setError('Publication date cannot be in the future.');
      return;
    }

    // Check for duplicate book (excluding the book being edited)
    const isDuplicate = books.some(
      b => b.title.toLowerCase() === book.title.toLowerCase() && 
           b.author.toLowerCase() === book.author.toLowerCase() &&
           b.id !== editingBook?.id
    );

    if (isDuplicate) {
      setError('A book with the same title and author already exists.');
      return;
    }

    if (editingBook) {
      // Update existing book
      setBooks(books.map(b => b.id === editingBook.id ? { ...book, id: editingBook.id } : b));
      setSuccess('Book updated successfully!');
      setEditingBook(null);
    } else {
      // Add new book
      setBooks([...books, { ...book, id: Date.now() }]);
      setSuccess('Book added successfully!');
    }
    resetForm();
  };

  const handleEditBook = (bookToEdit) => {
    setEditingBook(bookToEdit);
    setBook({
      title: bookToEdit.title,
      author: bookToEdit.author,
      genre: bookToEdit.genre,
      language: bookToEdit.language,
      seriesName: bookToEdit.seriesName,
      publicationDate: new Date(bookToEdit.publicationDate),
      edition: bookToEdit.edition,
      pages: bookToEdit.pages
    });
  };

  const handleDeleteBook = (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      setBooks(books.filter(b => b.id !== id));
      setSuccess('Book deleted successfully!');
    }
  };

  const resetForm = () => {
    setBook({
      title: '',
      author: '',
      genre: '',
      language: 'English',
      seriesName: '',
      publicationDate: null,
      edition: '',
      pages: ''
    });
    setEditingBook(null);
  };

  const isFormValid = () => {
    return (
      book.title &&
      book.author &&
      book.genre &&
      book.language &&
      book.publicationDate &&
      book.edition &&
      book.pages &&
      validateTitle(book.title) &&
      validateAuthor(book.author) &&
      !isNaN(book.pages) &&
      Number(book.pages) > 0 &&
      validateDate(book.publicationDate)
    );
  };

  return (
    <div className="add-book-ui">
      <h2>{editingBook ? 'Edit Book' : 'Add Book'}</h2>

      <div style={{ marginBottom: '0.5rem' }}>
        <label>Title *</label>
        <input
          type="text"
          name="title"
          placeholder="Book Title"
          value={book.title}
          onChange={handleChange}
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <label>Author *</label>
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={book.author}
          onChange={handleChange}
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <label>Genre *</label>
        <select
          name="genre"
          value={book.genre}
          onChange={handleChange}
          style={{ width: '100%', padding: '0.5rem' }}
        >
          <option value="">Select Genre</option>
          {genres.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <label>Language *</label>
        <div>
          <label>
            <input
              type="radio"
              name="language"
              value="English"
              checked={book.language === 'English'}
              onChange={handleChange}
            />
            English
          </label>
          <label style={{ marginLeft: '1rem' }}>
            <input
              type="radio"
              name="language"
              value="Sinhala"
              checked={book.language === 'Sinhala'}
              onChange={handleChange}
            />
            Sinhala
          </label>
        </div>
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <label>Series Name (Optional)</label>
        <input
          type="text"
          name="seriesName"
          placeholder="Series Name"
          value={book.seriesName}
          onChange={handleChange}
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <label>Publication Date *</label>
        <DatePicker
          selected={book.publicationDate}
          onChange={handleDateChange}
          maxDate={new Date()}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select publication date"
          className="date-picker"
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <label>Edition *</label>
        <select
          name="edition"
          value={book.edition}
          onChange={handleChange}
          style={{ width: '100%', padding: '0.5rem' }}
        >
          <option value="">Select Edition</option>
          {editions.map(edition => (
            <option key={edition} value={edition}>{edition}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <label>Page Count *</label>
        <input
          type="number"
          name="pages"
          placeholder="Page Count"
          value={book.pages}
          onChange={handleChange}
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={handleAddBook}
          disabled={!isFormValid()}
          style={{ 
            padding: '0.5rem 1rem',
            marginRight: '0.5rem',
            backgroundColor: isFormValid() ? '#4CAF50' : '#cccccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isFormValid() ? 'pointer' : 'not-allowed'
          }}
        >
          {editingBook ? 'Update Book' : 'Add Book'}
        </button>
        <button 
          onClick={resetForm}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset Form
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <h3>Book List</h3>
      <ul className="book-list">
        {books.map((b) => (
          <li key={b.id} className="book-item">
            <div className="book-info">
              <strong>{b.title}</strong> by {b.author} – {b.genre}, {b.language}, {b.pages} pages
              {b.seriesName && ` (Part of: ${b.seriesName})`}
            </div>
            <div className="book-actions">
              <button 
                onClick={() => handleEditBook(b)}
                className="edit-button"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDeleteBook(b.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddBook;
