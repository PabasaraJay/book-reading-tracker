import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ReadingProgress.css';
import { readingProgressApi, booksApi } from '../services/api';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      <div className="toast-content">
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

const ReadingProgress = () => {
  const [formData, setFormData] = useState({
    bookId: '',
    startDate: new Date(),
    targetDate: new Date(),
    currentPage: 0,
    readingDevice: 'paper',
    comment: '',
  });

  const [errors, setErrors] = useState({
    bookId: '',
    startDate: '',
    targetDate: '',
    currentPage: '',
    comment: ''
  });

  const [entries, setEntries] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBookId, setFilterBookId] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const readingDevices = [
    { id: 'paper', label: 'Physical Book' },
    { id: 'ebook', label: 'E-Book' },
    { id: 'audiobook', label: 'Audiobook' },
    { id: 'tablet', label: 'Tablet' },
    { id: 'phone', label: 'Phone' }
  ];

  useEffect(() => {
    fetchEntries();
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await booksApi.getAll();
      setBooks(response.data);
    } catch (error) {
      showToast('Failed to fetch books', 'error');
    }
  };

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await readingProgressApi.getAll();
      setEntries(response.data);
    } catch (error) {
      showToast('Failed to fetch reading progress entries', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Update form's current page when selecting a book
  useEffect(() => {
    if (selectedBook) {
      const latestPage = getLatestPage();
      setFormData(prev => ({
        ...prev,
        currentPage: latestPage
      }));
    }
  }, [selectedBook]);

  const calculateProgress = (currentPage, totalPages) => {
    return Math.min(Math.round((currentPage / totalPages) * 100), 100);
  };

  const validateForm = () => {
    const newErrors = {
      bookId: '',
      startDate: '',
      targetDate: '',
      currentPage: '',
      comment: ''
    };
    
    if (!formData.bookId) {
      newErrors.bookId = 'Please select a book';
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    if (formData.startDate > now) {
      newErrors.startDate = 'Start date cannot be in the future';
    }

    if (formData.startDate > formData.targetDate) {
      newErrors.targetDate = 'Target date must be after start date';
    }

    if (formData.currentPage <= 0) {
      newErrors.currentPage = 'Current page must be greater than 0';
    }

    if (selectedBook && formData.currentPage > selectedBook.pages) {
      newErrors.currentPage = `Cannot exceed total pages (${selectedBook.pages})`;
    }

    const latestPage = getLatestPage();
    if (!editingEntry && formData.currentPage < latestPage) {
      newErrors.currentPage = `New page must be greater than the last recorded page (${latestPage})`;
    }

    if (formData.comment.length > 250) {
      newErrors.comment = 'Comment cannot exceed 250 characters';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setLoading(true);
        if (editingEntry) {
          // Update existing entry
          const response = await readingProgressApi.update(editingEntry._id, formData);
          setEntries(entries.map(entry => 
            entry._id === editingEntry._id ? response.data : entry
          ));
          showToast('Reading progress updated successfully!', 'success');
        } else {
          // Create new entry
          const response = await readingProgressApi.create(formData);
          setEntries([...entries, response.data]);
          showToast('Reading progress saved successfully!', 'success');
        }
        
        // Reset the form
        setFormData({
          bookId: '',
          startDate: new Date(),
          targetDate: new Date(),
          currentPage: 0,
          readingDevice: 'paper',
          comment: '',
        });
        setSelectedBook(null);
        setEditingEntry(null);
      } catch (error) {
        showToast(error.response?.data?.message || 'Failed to save reading progress', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (entry) => {
    setSelectedBook(entry.bookId);
    setFormData({
      bookId: entry.bookId._id,
      startDate: new Date(entry.startDate),
      targetDate: new Date(entry.targetDate),
      currentPage: entry.currentPage,
      readingDevice: entry.readingDevice,
      comment: entry.comment || '',
    });
    setEditingEntry(entry);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        setLoading(true);
        await readingProgressApi.delete(id);
        setEntries(entries.filter(entry => entry._id !== id));
        showToast('Entry deleted successfully!', 'success');
      } catch (error) {
        showToast('Failed to delete entry', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBookSelect = (e) => {
    const bookId = e.target.value;
    const book = books.find(b => b._id === bookId);
    setSelectedBook(book);
    setFormData(prev => ({
      ...prev,
      bookId,
      currentPage: 0
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'currentPage' ? Number(value) || 0 : value
    }));
  };

  const getBookProgress = () => {
    if (!selectedBook) return [];
    return entries
      .filter(entry => entry.bookId._id === formData.bookId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getLatestPage = () => {
    if (!selectedBook) return 0;
    const bookEntries = getBookProgress();
    if (bookEntries.length === 0) return 0;
    return bookEntries[0].currentPage;
  };

  const getRemainingPages = () => {
    if (!selectedBook) return 0;
    const currentPage = getLatestPage();
    return selectedBook.pages - currentPage;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredEntries = entries
    .filter(entry => {
      const matchesSearch = entry.bookId.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          entry.comment?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = !filterBookId || entry.bookId._id === filterBookId;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const uniqueBooks = [...new Set(entries.map(entry => entry.bookId._id))]
    .map(bookId => books.find(book => book._id === bookId))
    .filter(book => book);

  const resetForm = () => {
    setFormData({
      bookId: '',
      startDate: new Date(),
      targetDate: new Date(),
      currentPage: 0,
      readingDevice: 'paper',
      comment: '',
    });
    setSelectedBook(null);
    setEditingEntry(null);
  };

  return (
    <div className="reading-progress">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="reading-progress-container">
        <div className="form-illustration">
          <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="120" cy="120" r="120" fill="#F3F9F8"/>
            <path d="M60 80C60 71.7157 66.7157 65 75 65H165C173.284 65 180 71.7157 180 80V160C180 168.284 173.284 175 165 175H75C66.7157 175 60 168.284 60 160V80Z" fill="#2A9D8F"/>
            <rect x="75" y="80" width="90" height="80" fill="white"/>
            <rect x="85" y="95" width="70" height="4" rx="2" fill="#E0E0E0"/>
            <rect x="85" y="105" width="50" height="4" rx="2" fill="#E0E0E0"/>
            <rect x="85" y="115" width="60" height="4" rx="2" fill="#E0E0E0"/>
            <rect x="85" y="125" width="40" height="4" rx="2" fill="#E0E0E0"/>
            <rect x="85" y="145" width="70" height="8" rx="4" fill="#F0F0F0"/>
            <rect x="85" y="145" width="45" height="8" rx="4" fill="#2A9D8F"/>
            <circle cx="190" cy="70" r="15" fill="#E9C46A" fillOpacity="0.3"/>
            <circle cx="50" cy="170" r="20" fill="#2A9D8F" fillOpacity="0.2"/>
          </svg>
        </div>
        
        <div className="form-content">
          <div className="form-title">
            <h1>Track Your Reading</h1>
            <p>Keep track of your reading journey and progress</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="bookId">Select Book</label>
              <select
                id="bookId"
                name="bookId"
                value={formData.bookId}
                onChange={handleBookSelect}
                className={errors.bookId ? 'error' : ''}
                disabled={editingEntry !== null}
              >
                <option value="">Choose a book</option>
                {books.map(book => (
                  <option key={book._id} value={book._id}>
                    {book.title} ({book.pages} pages)
                  </option>
                ))}
              </select>
              {errors.bookId && <div className="error-message">{errors.bookId}</div>}
            </div>

            {selectedBook && (
              <>
                {getLatestPage() > 0 && (
                  <div className="overall-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${calculateProgress(getLatestPage(), selectedBook.pages)}%` }}
                      ></div>
                    </div>
                    <div className="progress-info">
                      <span>Current Page: {getLatestPage()} of {selectedBook.pages}</span>
                      <span>{calculateProgress(getLatestPage(), selectedBook.pages)}% complete</span>
                    </div>
                    <div className="remaining-pages">
                      {getRemainingPages()} pages remaining
                    </div>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startDate">Reading Started Date</label>
                    <DatePicker
                      selected={formData.startDate}
                      onChange={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                      maxDate={new Date()}
                      className={`date-picker ${errors.startDate ? 'error' : ''}`}
                      dateFormat="MMMM d, yyyy"
                      id="startDate"
                    />
                    {errors.startDate && <div className="error-message">{errors.startDate}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="targetDate">Target Completion Date</label>
                    <DatePicker
                      selected={formData.targetDate}
                      onChange={(date) => setFormData(prev => ({ ...prev, targetDate: date }))}
                      className={`date-picker ${errors.targetDate ? 'error' : ''}`}
                      dateFormat="MMMM d, yyyy"
                      id="targetDate"
                      minDate={formData.startDate}
                    />
                    {errors.targetDate && <div className="error-message">{errors.targetDate}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="currentPage">Current Reading Page</label>
                  <input
                    type="number"
                    id="currentPage"
                    name="currentPage"
                    value={formData.currentPage || ''}
                    onChange={handleInputChange}
                    className={errors.currentPage ? 'error' : ''}
                    min="1"
                    max={selectedBook.pages}
                  />
                  {errors.currentPage && <div className="error-message">{errors.currentPage}</div>}
                </div>

                <div className="form-group">
                  <label>Reading Device</label>
                  <div className="reading-devices">
                    {readingDevices.map(device => (
                      <label key={device.id} className="device-option">
                        <input
                          type="radio"
                          name="readingDevice"
                          value={device.id}
                          checked={formData.readingDevice === device.id}
                          onChange={handleInputChange}
                        />
                        <span>{device.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="comment">
                    Comment (Optional) - {250 - formData.comment.length} characters remaining
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    placeholder="Add any notes about your reading session..."
                    maxLength="250"
                    className={errors.comment ? 'error' : ''}
                  />
                  {errors.comment && <div className="error-message">{errors.comment}</div>}
                </div>

                <div className="form-actions">
                  <button type="submit">
                    {editingEntry ? 'Update Progress' : 'Save Progress'}
                  </button>
                  {editingEntry && (
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </>
            )}
          </form>

          {loading && <div className="loading-spinner">Loading...</div>}
          
          {entries.length > 0 && (
            <div className="entries-section">
              <div className="entries-header">
                <h2>Reading History</h2>
                
                <div className="history-controls">
                  <div className="search-box">
                    <input
                      type="text"
                      placeholder="Search entries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                  </div>

                  <div className="filter-box">
                    <select
                      value={filterBookId}
                      onChange={(e) => setFilterBookId(e.target.value)}
                      className="filter-select"
                    >
                      <option value="">All Books</option>
                      {uniqueBooks.map(book => (
                        <option key={book._id} value={book._id}>
                          {book.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="history-summary">
                  <p>Total Entries: {filteredEntries.length}</p>
                  {filterBookId && (
                    <p>Showing entries for: {books.find(b => b._id === filterBookId)?.title}</p>
                  )}
                </div>
              </div>

              <div className="entries-list">
                {filteredEntries.map((entry) => {
                  const book = books.find(b => b._id === entry.bookId._id);
                  if (!book) return null;
                  
                  const progress = calculateProgress(entry.currentPage, book.pages);
                  const remainingPages = book.pages - entry.currentPage;

                  return (
                    <div key={entry._id} className="entry-card">
                      <div className="entry-header">
                        <div className="entry-info">
                          <h3>{entry.bookId.title}</h3>
                          <p className="entry-date">{formatDate(entry.createdAt)}</p>
                          <div className="page-info">
                            <div className="progress-stats">
                              <p className="current-page">
                                Page {entry.currentPage} of {book.pages}
                              </p>
                              <p className="progress-percentage">
                                {progress}% complete
                              </p>
                            </div>
                            <p className="remaining-pages">
                              {remainingPages} pages remaining
                            </p>
                          </div>
                        </div>
                        <div className="entry-actions">
                          <button className="edit-btn" onClick={() => handleEdit(entry)}>Edit</button>
                          <button className="delete-btn" onClick={() => handleDelete(entry._id)}>Delete</button>
                        </div>
                      </div>
                      
                      <div className="entry-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="entry-details">
                        <div className="detail-row">
                          <span className="label">Reading Device:</span>
                          <span className="value">{entry.readingDevice}</span>
                        </div>
                        {entry.comment && (
                          <div className="detail-row notes">
                            <span className="label">Notes:</span>
                            <p className="value">{entry.comment}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadingProgress;
