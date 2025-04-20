import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { sampleBooks } from '../data/sampleBooks';
import Banner from './Banner';
import './QuoteCollection.css';

const QuoteCollection = () => {
  const [quotes, setQuotes] = useState([]);
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

  const MAX_QUOTE_LENGTH = 500;
  const MAX_NOTE_LENGTH = 200;

  useEffect(() => {
    const newErrors = {};
    
    if (!selectedBook) newErrors.book = 'Please select a book';
    if (!pageNumber || pageNumber <= 0) {
      newErrors.page = 'Please enter a valid page number';
    } else if (selectedBook) {
      const book = sampleBooks.find(b => b.id === Number(selectedBook));
      if (pageNumber > book.totalPages) {
        newErrors.page = `Page number cannot exceed total pages (${book.totalPages})`;
      }
    }
    if (!quoteText.trim()) newErrors.quote = 'Quote cannot be empty';
    if (quoteText.length > MAX_QUOTE_LENGTH) {
      newErrors.quote = `Quote cannot exceed ${MAX_QUOTE_LENGTH} characters`;
    }
    if (noteText.length > MAX_NOTE_LENGTH) {
      newErrors.note = `Note cannot exceed ${MAX_NOTE_LENGTH} characters`;
    }
    
    // Check for duplicate quotes
    const isDuplicate = quotes.some(q => 
      q.bookId === Number(selectedBook) && 
      q.pageNumber === Number(pageNumber) && 
      q.text.toLowerCase() === quoteText.toLowerCase() &&
      q.id !== editingQuote?.id
    );
    if (isDuplicate) {
      newErrors.duplicate = 'This quote already exists for this book and page';
    }

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [selectedBook, pageNumber, quoteText, noteText, quotes, editingQuote]);

  const handleAddQuote = () => {
    if (!isFormValid) return;

    const newQuote = {
      id: Date.now(),
      bookId: Number(selectedBook),
      bookTitle: sampleBooks.find(b => b.id === Number(selectedBook)).title,
      text: quoteText,
      note: noteText,
      pageNumber: Number(pageNumber),
      date: quoteDate,
      timestamp: new Date(),
      sentiment: sentiment
    };

    if (editingQuote) {
      setQuotes(quotes.map(q => q.id === editingQuote.id ? newQuote : q));
      setSuccessMessage('Quote updated successfully!');
      setEditingQuote(null);
    } else {
      setQuotes([...quotes, newQuote]);
      setSuccessMessage('Quote added successfully!');
    }

    resetForm();
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  const handleEditQuote = (quote) => {
    setEditingQuote(quote);
    setSelectedBook(quote.bookId.toString());
    setPageNumber(quote.pageNumber.toString());
    setQuoteText(quote.text);
    setNoteText(quote.note || '');
    setQuoteDate(new Date(quote.date));
    setSentiment(quote.sentiment || 'neutral');
  };

  const handleDeleteQuote = (id) => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      setQuotes(quotes.filter(q => q.id !== id));
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
  };

  const filteredQuotes = quotes
    .filter(q => selectedBook ? q.bookId === Number(selectedBook) : true)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

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
        bookTitle: quote.bookTitle
      }));
  };

  return (
    <div className="quote-collection">
      <Banner title="Quote Collection" />
      <h2> Add Your Quote</h2>
      
      <div className="quote-form">
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        <div className="form-group">
          <label>Select Book *</label>
          <select
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            className={errors.book ? 'error' : ''}
          >
            <option value="">Choose a book</option>
            {sampleBooks.map(book => (
              <option key={book.id} value={book.id}>
                {book.title} ({book.totalPages} pages)
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
            onChange={(e) => setPageNumber(e.target.value)}
            min="1"
            max={selectedBook ? sampleBooks.find(b => b.id === Number(selectedBook)).totalPages : ''}
            className={errors.page ? 'error' : ''}
          />
          {errors.page && <span className="error-message">{errors.page}</span>}
        </div>

        <div className="form-group">
          <label>Quote Date</label>
          <DatePicker
            selected={quoteDate}
            onChange={date => setQuoteDate(date)}
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
            onChange={(e) => setQuoteText(e.target.value)}
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
            onChange={(e) => setNoteText(e.target.value)}
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
              <li key={quote.id} className={`quote-item ${quote.sentiment}`}>
                <div className="quote-content">
                  <p className="quote-text">"{quote.text}"</p>
                  {quote.note && (
                    <p className="quote-note">📝 {quote.note}</p>
                  )}
                  <p className="quote-meta">
                    <span className="book-title">{quote.bookTitle}</span>
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
                    onClick={() => handleDeleteQuote(quote.id)}
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
