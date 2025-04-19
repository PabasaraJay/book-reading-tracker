import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { sampleBooks } from '../data/sampleBooks';
import './QuoteCollection.css';

const QuoteCollection = () => {
  const [quotes, setQuotes] = useState([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [pageNumber, setPageNumber] = useState('');
  const [quoteText, setQuoteText] = useState('');
  const [quoteDate, setQuoteDate] = useState(new Date());
  const [errors, setErrors] = useState({});
  const [editingQuote, setEditingQuote] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const MAX_QUOTE_LENGTH = 500;

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
  }, [selectedBook, pageNumber, quoteText, quotes, editingQuote]);

  const handleAddQuote = () => {
    if (!isFormValid) return;

    const newQuote = {
      id: Date.now(),
      bookId: Number(selectedBook),
      bookTitle: sampleBooks.find(b => b.id === Number(selectedBook)).title,
      text: quoteText,
      pageNumber: Number(pageNumber),
      date: quoteDate,
      timestamp: new Date()
    };

    if (editingQuote) {
      setQuotes(quotes.map(q => q.id === editingQuote.id ? newQuote : q));
      setEditingQuote(null);
    } else {
      setQuotes([...quotes, newQuote]);
    }

    resetForm();
  };

  const handleEditQuote = (quote) => {
    setEditingQuote(quote);
    setSelectedBook(quote.bookId.toString());
    setPageNumber(quote.pageNumber.toString());
    setQuoteText(quote.text);
    setQuoteDate(new Date(quote.date));
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
    setQuoteDate(new Date());
    setErrors({});
  };

  const filteredQuotes = quotes
    .filter(q => selectedBook ? q.bookId === Number(selectedBook) : true)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="quote-collection">
      <h2>Quote Collection</h2>
      
      <div className="quote-form">
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
              <li key={quote.id} className="quote-item">
                <div className="quote-content">
                  <p className="quote-text">"{quote.text}"</p>
                  <p className="quote-meta">
                    <span className="book-title">{quote.bookTitle}</span>
                    <span className="page-number">Page {quote.pageNumber}</span>
                    <span className="date">
                      {new Date(quote.date).toLocaleDateString()}
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
