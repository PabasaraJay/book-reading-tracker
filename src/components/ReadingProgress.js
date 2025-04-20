import React, { useState, useEffect } from 'react';
import { sampleBooks, readingDevices } from '../data/sampleBooks';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Banner from './Banner';
import './ReadingProgress.css';

const ReadingProgress = () => {
  const [selectedBook, setSelectedBook] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [targetDate, setTargetDate] = useState(null);
  const [sessionDate, setSessionDate] = useState(new Date());
  const [pagesRead, setPagesRead] = useState('');
  const [readingDevice, setReadingDevice] = useState('');
  const [comment, setComment] = useState('');
  const [showProgress, setShowProgress] = useState(false);
  const [progressLog, setProgressLog] = useState([]);
  const [sortBy, setSortBy] = useState('mostRecent');
  const [filterDevice, setFilterDevice] = useState('');
  const [filterComment, setFilterComment] = useState('');
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const newErrors = {};
    
    if (!selectedBook) newErrors.book = 'Please select a book';
    if (!startDate) newErrors.startDate = 'Please select start date';
    if (!targetDate) newErrors.targetDate = 'Please select target date';
    if (startDate && targetDate && startDate > targetDate) {
      newErrors.dates = 'Target date must be after start date';
    }
    if (!pagesRead || pagesRead <= 0) {
      newErrors.pages = 'Please enter a valid number of pages';
    } else if (selectedBook) {
      const book = sampleBooks.find(b => b.id === selectedBook);
      if (pagesRead > book.totalPages) {
        newErrors.pages = `Cannot exceed total pages (${book.totalPages})`;
      }
    }
    if (!readingDevice) newErrors.device = 'Please select a reading device';
    if (comment.length > 250) newErrors.comment = 'Comment cannot exceed 250 characters';
    
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [selectedBook, startDate, targetDate, pagesRead, readingDevice, comment]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const newEntry = {
      id: Date.now(),
      bookId: selectedBook,
      sessionDate,
      pagesRead,
      readingDevice,
      comment,
      timestamp: new Date()
    };

    setProgressLog([...progressLog, newEntry]);
    resetForm();
  };

  const resetForm = () => {
    setPagesRead('');
    setReadingDevice('');
    setComment('');
    setSessionDate(new Date());
    setErrors({});
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setProgressLog(progressLog.filter(entry => entry.id !== id));
    }
  };

  const handleEdit = (entry) => {
    setSelectedBook(entry.bookId);
    setSessionDate(new Date(entry.sessionDate));
    setPagesRead(entry.pagesRead);
    setReadingDevice(entry.readingDevice);
    setComment(entry.comment);
  };

  const filteredAndSortedLog = progressLog
    .filter(entry => {
      const matchesDevice = !filterDevice || entry.readingDevice === filterDevice;
      const matchesComment = !filterComment || 
        entry.comment.toLowerCase().includes(filterComment.toLowerCase());
      return matchesDevice && matchesComment;
    })
    .sort((a, b) => {
      if (sortBy === 'mostRecent') return b.timestamp - a.timestamp;
      return b.pagesRead - a.pagesRead;
    });

  const selectedBookData = sampleBooks.find(book => book.id === selectedBook);
  const totalPagesRead = progressLog
    .filter(entry => entry.bookId === selectedBook)
    .reduce((sum, entry) => sum + entry.pagesRead, 0);

  return (
    <div className="reading-progress" style={{ padding: '1rem', border: '1px solid #ccc', marginBottom: '1rem' }}>
      <Banner title="Reading Progress" />
      <h2>Reading Progress</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Book</label>
          <select 
            value={selectedBook} 
            onChange={(e) => setSelectedBook(Number(e.target.value))}
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
          <label>Reading Started Date</label>
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            maxDate={new Date()}
            className={errors.startDate ? 'error' : ''}
          />
          {errors.startDate && <span className="error-message">{errors.startDate}</span>}
        </div>

        <div className="form-group">
          <label>Target Completion Date</label>
          <DatePicker
            selected={targetDate}
            onChange={date => setTargetDate(date)}
            minDate={startDate}
            className={errors.targetDate ? 'error' : ''}
          />
          {errors.targetDate && <span className="error-message">{errors.targetDate}</span>}
        </div>

        <div className="form-group">
          <label>Session Date</label>
          <DatePicker
            selected={sessionDate}
            onChange={date => setSessionDate(date)}
            maxDate={new Date()}
          />
        </div>

        <div className="form-group">
          <label>Pages Read</label>
          <input
            type="number"
            value={pagesRead}
            onChange={(e) => setPagesRead(Number(e.target.value))}
            min="1"
            max={selectedBookData?.totalPages}
            className={errors.pages ? 'error' : ''}
          />
          {errors.pages && <span className="error-message">{errors.pages}</span>}
        </div>

        <div className="form-group">
          <label>Reading Device</label>
          <div className="radio-group">
            {readingDevices.map(device => (
              <label key={device.id}>
                <input
                  type="radio"
                  name="readingDevice"
                  value={device.id}
                  checked={readingDevice === device.id}
                  onChange={(e) => setReadingDevice(e.target.value)}
                />
                {device.label}
              </label>
            ))}
          </div>
          {errors.device && <span className="error-message">{errors.device}</span>}
        </div>

        <div className="form-group">
          <label>Comment (Optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={250}
            className={errors.comment ? 'error' : ''}
          />
          <div className="char-counter">
            {comment.length}/250 characters
          </div>
          {errors.comment && <span className="error-message">{errors.comment}</span>}
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={showProgress}
              onChange={(e) => setShowProgress(e.target.checked)}
            />
            Show Progress
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={!isFormValid}>Add Progress</button>
          <button type="button" onClick={resetForm}>Reset Form</button>
        </div>
      </form>

      {showProgress && selectedBookData && (
        <div className="progress-summary">
          <h3>Progress Summary</h3>
          <p>
            You've read {totalPagesRead}/{selectedBookData.totalPages} pages of {selectedBookData.title} 
            ({Math.round((totalPagesRead / selectedBookData.totalPages) * 100)}%)
          </p>
        </div>
      )}

      <div className="progress-log">
        <h3>Reading Log</h3>
        
        <div className="filters">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="mostRecent">Most Recent</option>
            <option value="mostPages">Most Pages Read</option>
          </select>
          
          <select value={filterDevice} onChange={(e) => setFilterDevice(e.target.value)}>
            <option value="">All Devices</option>
            {readingDevices.map(device => (
              <option key={device.id} value={device.id}>{device.label}</option>
            ))}
          </select>
          
          <input
            type="text"
            placeholder="Filter by comment..."
            value={filterComment}
            onChange={(e) => setFilterComment(e.target.value)}
          />
        </div>

        {filteredAndSortedLog.length === 0 ? (
          <p>No reading progress yet. Start your journey!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>Session Date</th>
                <th>Pages Read</th>
                <th>Device</th>
                <th>Comment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedLog.map(entry => {
                const book = sampleBooks.find(b => b.id === entry.bookId);
                return (
                  <tr key={entry.id}>
                    <td>{book.title}</td>
                    <td>{new Date(entry.sessionDate).toLocaleDateString()}</td>
                    <td>{entry.pagesRead}</td>
                    <td>{entry.readingDevice}</td>
                    <td>{entry.comment}</td>
                    <td>
                      <button onClick={() => handleEdit(entry)}>Edit</button>
                      <button onClick={() => handleDelete(entry.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReadingProgress;
