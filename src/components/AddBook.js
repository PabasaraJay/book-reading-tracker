import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Banner from './Banner';
import { booksApi } from '../services/api';
import './AddBook.css';

const AddBook = () => {
  const [book, setBook] = useState({
    title: '',
    author: '',
    genre: '',
    language: '',
    seriesName: '',
    publicationDate: null,
    edition: '',
    pages: ''
  });

  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingBook, setEditingBook] = useState(null);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await booksApi.getAll();
      setBooks(response.data);
    } catch (error) {
      setError('Failed to fetch books. Please try again.');
    } finally {
      setLoading(false);
    }
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

  const handleAddBook = async () => {
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

    try {
      setLoading(true);
      if (editingBook) {
        // Update existing book
        const response = await booksApi.update(editingBook._id, book);
        setBooks(books.map(b => b._id === editingBook._id ? response.data : b));
        setSuccess('Book updated successfully!');
        setEditingBook(null);
      } else {
        // Add new book
        const response = await booksApi.create(book);
        setBooks([...books, response.data]);
        setSuccess('Book added successfully!');
      }
      resetForm();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditBook = (bookToEdit) => {
    setEditingBook(bookToEdit);
    setBook({
      title: bookToEdit.title,
      author: bookToEdit.author,
      genre: bookToEdit.genre,
      language: bookToEdit.language,
      seriesName: bookToEdit.seriesName || '',
      publicationDate: bookToEdit.publicationDate instanceof Date ? bookToEdit.publicationDate : new Date(bookToEdit.publicationDate),
      edition: bookToEdit.edition,
      pages: bookToEdit.pages.toString()
    });
  };

  const handleDeleteBook = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        setLoading(true);
        await booksApi.delete(id);
        setBooks(books.filter(b => b._id !== id));
        setSuccess('Book deleted successfully!');
      } catch (error) {
        setError('Failed to delete book. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setBook({
      title: '',
      author: '',
      genre: '',
      language: '',
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
      <Banner title="Add Book" />
      <div className="form-card">
        <h2>{editingBook ? 'Edit Book' : 'Add Your Favorite Books Here'}</h2>

        {loading && <div className="loading-spinner">Loading...</div>}
        
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            placeholder="Book Title"
            value={book.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Author *</label>
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={book.author}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Genre *</label>
          <select
            name="genre"
            value={book.genre}
            onChange={handleChange}
          >
            <option value="">Select Genre</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Language *</label>
          <div className="language-options">
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
            <label>
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

        <div className="form-group">
          <label>Series Name (Optional)</label>
          <input
            type="text"
            name="seriesName"
            placeholder="Series Name"
            value={book.seriesName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Publication Date *</label>
          <DatePicker
            selected={book.publicationDate}
            onChange={handleDateChange}
            maxDate={new Date()}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select publication date"
            className="date-picker"
          />
        </div>

        <div className="form-group">
          <label>Edition *</label>
          <select
            name="edition"
            value={book.edition}
            onChange={handleChange}
          >
            <option value="">Select Edition</option>
            {editions.map(edition => (
              <option key={edition} value={edition}>{edition}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Page Count *</label>
          <input
            type="number"
            name="pages"
            placeholder="Page Count"
            value={book.pages}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <button 
            onClick={handleAddBook}
            disabled={!isFormValid()}
            style={{ 
              padding: '0.75rem 1.5rem',
              marginRight: '1rem',
              backgroundColor: isFormValid() ? '#4CAF50' : '#cccccc',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isFormValid() ? 'pointer' : 'not-allowed',
              fontWeight: '600',
              fontSize: '1rem'
            }}
          >
            {editingBook ? 'Update Book' : 'Add Book'}
          </button>
          <button 
            onClick={resetForm}
            style={{ 
              padding: '0.75rem 1.5rem',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem'
            }}
          >
            Reset Form
          </button>
        </div>

        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginTop: '1rem' }}>{success}</p>}
      </div>

      <h3>Book List</h3>
      <div className="book-shelf">
        {books.map((b) => (
          <div key={b._id} className="book-card">
            <div className="book-cover">
              <div className="book-spine"></div>
              <div className="book-title">{b.title}</div>
            </div>
            <div className="book-details">
              <p><strong>Author:</strong> {b.author}</p>
              <p><strong>Genre:</strong> {b.genre}</p>
              <p><strong>Language:</strong> {b.language}</p>
              {b.seriesName && <p><strong>Series:</strong> {b.seriesName}</p>}
              <p><strong>Published:</strong> {new Date(b.publicationDate).toLocaleDateString()}</p>
              <p><strong>Edition:</strong> {b.edition}</p>
              <p><strong>Pages:</strong> {b.pages}</p>
              <div className="book-actions">
                <button 
                  onClick={() => handleEditBook(b)}
                  className="edit-button"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteBook(b._id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddBook;
