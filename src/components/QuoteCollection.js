import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Banner from './Banner';
import './QuoteCollection.css';
import { quotesApi, booksApi } from '../services/api';

const QuoteCollection = () => {
  const [quotes, setQuotes] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [pageNumber, setPageNumber] = useState('');
  const [quoteText, setQuoteText] = useState('');
  const [quoteDate, setQuoteDate] = useState(new Date());
  const [noteText, setNoteText] = useState('');
  const [sentiment, setSentiment] = useState('neutral');
  const [errors, setErrors] = useState({});
  const [editingQuote, setEditingQuote] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [interactedFields, setInteractedFields] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const MAX_QUOTE_LENGTH = 500;
  const MAX_NOTE_LENGTH = 200;

  useEffect(() => {
    fetchBooks();
    fetchQuotes();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await booksApi.getAll();
      setBooks(response.data);
    } catch (error) {
      setErrors({ fetch: 'Failed to fetch books' });
    }
  };

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const response = await quotesApi.getAll();
      setQuotes(response.data);
    } catch (error) {
      setErrors({ fetch: 'Failed to fetch quotes' });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (interactedFields.size < 2) return;

    const newErrors = {};
    
    if (!selectedBook && interactedFields.has('book')) newErrors.book = 'Please select a book';
    if ((!pageNumber || pageNumber <= 0) && interactedFields.has('page')) {
      newErrors.page = 'Please enter a valid page number';
    } else if (selectedBook && pageNumber && interactedFields.has('page')) {
      const book = books.find(b => b._id === selectedBook);
      if (book && pageNumber > book.pages) {
        newErrors.page = `Page number cannot exceed total pages (${book.pages})`;
      }
    }
    if (!quoteText.trim() && interactedFields.has('quote')) newErrors.quote = 'Quote cannot be empty';
    if (quoteText.length > MAX_QUOTE_LENGTH && interactedFields.has('quote')) {
      newErrors.quote = `Quote cannot exceed ${MAX_QUOTE_LENGTH} characters`;
    }
    if (noteText.length > MAX_NOTE_LENGTH && interactedFields.has('note')) {
      newErrors.note = `Note cannot exceed ${MAX_NOTE_LENGTH} characters`;
    }
    
    // Check for duplicate quotes
    if (interactedFields.has('quote') && interactedFields.has('book') && interactedFields.has('page')) {
      const isDuplicate = quotes.some(q => 
        q.bookId._id === selectedBook && 
        q.pageNumber === Number(pageNumber) && 
        q.text.toLowerCase() === quoteText.toLowerCase() &&
        q._id !== editingQuote?._id
      );
      if (isDuplicate) {
        newErrors.duplicate = 'This quote already exists for this book and page';
      }
    }

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  useEffect(() => {
    validateForm();
  }, [selectedBook, pageNumber, quoteText, noteText, quotes, editingQuote, interactedFields]);

  const handleInputChange = (setter, fieldName) => (e) => {
    setInteractedFields(prev => new Set(prev).add(fieldName));
    setter(e.target.value);
  };

  const handleDateChange = (date) => {
    setInteractedFields(prev => new Set(prev).add('date'));
    setQuoteDate(date);
  };

  const handleAddQuote = async () => {
    if (interactedFields.size < 2) {
      setInteractedFields(new Set(['book', 'page', 'quote']));
      validateForm();
      return;
    }

    if (!isFormValid) return;

    try {
      setLoading(true);
      const quoteData = {
        bookId: selectedBook,
        text: quoteText,
        note: noteText,
        pageNumber: Number(pageNumber),
        date: quoteDate,
        sentiment: sentiment
      };

      if (editingQuote) {
        const response = await quotesApi.update(editingQuote._id, quoteData);
        setQuotes(quotes.map(q => q._id === editingQuote._id ? response.data : q));
        setSuccessMessage('Quote updated successfully!');
        setEditingQuote(null);
      } else {
        const response = await quotesApi.create(quoteData);
        setQuotes([...quotes, response.data]);
        setSuccessMessage('Quote added successfully!');
      }

      resetForm();
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (error) {
      setErrors({ submit: 'Failed to save quote' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuote = (quote) => {
    setInteractedFields(new Set());
    setEditingQuote(quote);
    setSelectedBook(quote.bookId._id);
    setPageNumber(quote.pageNumber.toString());
    setQuoteText(quote.text);
    setNoteText(quote.note || '');
    setQuoteDate(new Date(quote.date));
    setSentiment(quote.sentiment || 'neutral');
  };

  const handleDeleteQuote = async (id) => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      try {
        setLoading(true);
        await quotesApi.delete(id);
        setQuotes(quotes.filter(q => q._id !== id));
        setSuccessMessage('Quote deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 5000);
      } catch (error) {
        setErrors({ delete: 'Failed to delete quote' });
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setSelectedBook('');
    setPageNumber('');
    setQuoteText('');
    setNoteText('');
    setQuoteDate(new Date());
    setSentiment('neutral');
    setErrors({});
    setSuccessMessage('');
    setInteractedFields(new Set());
    setIsFormValid(false);
  };

  const filteredQuotes = quotes
    .filter(q => selectedBook ? q.bookId._id === selectedBook : true)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Helper function to get dates with quotes
  const getHighlightedDates = () => {
    return quotes.map(quote => new Date(quote.date));
  };

  // Helper function to get notes for a specific date
  const getNotesForDate = (date) => {
    return quotes
      .filter(quote => 
        new Date(quote.date).toDateString() === date.toDateString()
      )
      .map(quote => ({
        text: quote.text,
        note: quote.note,
        bookTitle: quote.bookId.title
      }));
  };

  return (
    <div className="quote-collection">
      <Banner title="Quote Collection" />
      <h2>Add Your Quote</h2>
      
      <div className="quote-form">
        {loading && <div className="loading-spinner">Loading...</div>}
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        {errors.fetch && <div className="error-message">{errors.fetch}</div>}
        {errors.submit && <div className="error-message">{errors.submit}</div>}
        {errors.delete && <div className="error-message">{errors.delete}</div>}

        <div className="form-group">
          <label>Select Book *</label>
          <select
            value={selectedBook}
            onChange={handleInputChange(setSelectedBook, 'book')}
            className={errors.book ? 'error' : ''}
          >
            <option value="">Choose a book</option>
            {books.map(book => (
              <option key={book._id} value={book._id}>
                {book.title} ({book.pages} pages)
              </option>
            ))}
          </select>
          {errors.book && <span className="error-message">{errors.book}</span>}
        </div>

        <div className="form-group">
          <label>Page Number *</label>
          <input
            type="number"
            value={pageNumber}
            onChange={handleInputChange(setPageNumber, 'page')}
            min="1"
            max={selectedBook ? books.find(b => b._id === selectedBook)?.pages : ''}
            className={errors.page ? 'error' : ''}
          />
          {errors.page && <span className="error-message">{errors.page}</span>}
        </div>

        <div className="form-group">
          <label>Quote Date</label>
          <DatePicker
            selected={quoteDate}
            onChange={handleDateChange}
            maxDate={new Date()}
            highlightDates={getHighlightedDates()}
            renderDayContents={(day, date) => {
              const notes = getNotesForDate(date);
              return (
                <div className={`day-container ${notes.length > 0 ? 'has-notes' : ''}`}>
                  {day}
                  {notes.length > 0 && <span className="note-indicator">📝</span>}
                </div>
              );
            }}
          />
        </div>

        <div className="form-group">
          <label>Quote Text *</label>
          <textarea
            value={quoteText}
            onChange={handleInputChange(setQuoteText, 'quote')}
            maxLength={MAX_QUOTE_LENGTH}
            className={errors.quote ? 'error' : ''}
            placeholder="Enter your quote..."
          />
          <div className="char-counter">
            {quoteText.length}/{MAX_QUOTE_LENGTH} characters
          </div>
          {errors.quote && <span className="error-message">{errors.quote}</span>}
          {errors.duplicate && <span className="error-message">{errors.duplicate}</span>}
        </div>

        <div className="form-group">
          <label>Note (Optional)</label>
          <textarea
            value={noteText}
            onChange={handleInputChange(setNoteText, 'note')}
            maxLength={MAX_NOTE_LENGTH}
            className={errors.note ? 'error' : ''}
            placeholder="Add a note about this quote..."
          />
          <div className="char-counter">
            {noteText.length}/{MAX_NOTE_LENGTH} characters
          </div>
          {errors.note && <span className="error-message">{errors.note}</span>}
        </div>

        <div className="form-group">
          <label>Quote Sentiment</label>
          <div className="sentiment-options">
            <label className="radio-label">
              <input
                type="radio"
                value="positive"
                checked={sentiment === 'positive'}
                onChange={(e) => setSentiment(e.target.value)}
              />
              Positive
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="neutral"
                checked={sentiment === 'neutral'}
                onChange={(e) => setSentiment(e.target.value)}
              />
              Neutral
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="negative"
                checked={sentiment === 'negative'}
                onChange={(e) => setSentiment(e.target.value)}
              />
              Negative
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button 
            onClick={handleAddQuote}
            disabled={!isFormValid}
          >
            {editingQuote ? 'Update Quote' : 'Add Quote'}
          </button>
          <button 
            type="button" 
            onClick={resetForm}
            className="secondary"
          >
            Reset Form
          </button>
        </div>
      </div>

      <div className="quotes-list">
        <h3>Saved Quotes</h3>
        {filteredQuotes.length === 0 ? (
          <p className="empty-message">No quotes saved yet</p>
        ) : (
          <ul>
            {filteredQuotes.map(quote => (
              <li key={quote._id} className={`quote-item ${quote.sentiment}`}>
                <div className="quote-content">
                  <p className="quote-text">"{quote.text}"</p>
                  {quote.note && (
                    <p className="quote-note">📝 {quote.note}</p>
                  )}
                  <p className="quote-meta">
                    <span className="book-title">{quote.bookId.title}</span>
                    <span className="page-number">Page {quote.pageNumber}</span>
                    <span className="date">
                      {new Date(quote.date).toLocaleDateString()}
                    </span>
                    <span className={`sentiment ${quote.sentiment}`}>
                      {quote.sentiment.charAt(0).toUpperCase() + quote.sentiment.slice(1)}
                    </span>
                  </p>
                </div>
                <div className="quote-actions">
                  <button 
                    onClick={() => handleEditQuote(quote)}
                    className="edit"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteQuote(quote._id)}
                    className="delete"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default QuoteCollection;
