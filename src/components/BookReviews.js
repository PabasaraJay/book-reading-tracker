import React, { useState, useEffect } from 'react';
import { sampleBooks } from '../data/sampleBooks';
import Banner from './Banner';
import './BookReviews.css';

const BookReviews = () => {
  // Mock user ID for demonstration
  const currentUserId = 'user123';
  
  // State for books (now using sampleBooks)
  const [books, setBooks] = useState(sampleBooks);

  const [selectedBook, setSelectedBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    userId: currentUserId
  });
  const [sortBy, setSortBy] = useState('recent');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const MAX_CHARACTERS = 250;

  const handleAddReview = () => {
    if (!selectedBook) {
      setError('Please select a book first');
      return;
    }
    if (newReview.rating === 0) {
      setError('Please select a rating');
      return;
    }
    if (!newReview.comment.trim()) {
      setError('Review cannot be blank');
      return;
    }

    const review = {
      id: Date.now(),
      bookId: selectedBook.id,
      bookTitle: selectedBook.title,
      ...newReview,
      timestamp: new Date().toISOString()
    };

    setReviews([...reviews, review]);
    setNewReview({ rating: 0, comment: '', userId: currentUserId });
    setError('');
  };

  const handleEditReview = (reviewId, updatedReview) => {
    setReviews(reviews.map(review => 
      review.id === reviewId ? { ...review, ...updatedReview } : review
    ));
  };

  const handleDeleteReview = (reviewId) => {
    setReviews(reviews.filter(review => review.id !== reviewId));
  };

  const filteredReviews = reviews
    .filter(review => 
      selectedBook ? review.bookId === selectedBook.id : true
    )
    .filter(review => 
      review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return new Date(b.timestamp) - new Date(a.timestamp);
      }
    });

  const averageRating = selectedBook
    ? reviews
        .filter(review => review.bookId === selectedBook.id)
        .reduce((acc, review) => acc + review.rating, 0) / 
        reviews.filter(review => review.bookId === selectedBook.id).length
    : 0;

  return (
    <div className="book-reviews">
      <Banner title="Book Reviews" />
      <h2>Book Reviews</h2>
      
      {/* Book Selection */}
      <div className="book-selection">
        <select
          value={selectedBook?.id || ''}
          onChange={(e) => {
            const book = books.find(b => b.id === Number(e.target.value));
            setSelectedBook(book);
            setError('');
          }}
        >
          <option value="">Select a book...</option>
          {books.map(book => (
            <option key={book.id} value={book.id}>
              {book.title}
            </option>
          ))}
        </select>
      </div>

      {selectedBook && (
        <>
          {/* Average Rating Display */}
          <div className="book-title">
            <h3>{selectedBook.title}</h3>
            <p>Average Rating: {averageRating.toFixed(1)}/5 ⭐</p>
          </div>

          {/* Review Input */}
          <div className="review-input">
            <div className="rating-stars">
              Rating:
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  onMouseEnter={() => setNewReview({ ...newReview, rating: star })}
                >
                  {star <= newReview.rating ? '⭐' : '☆'}
                </span>
              ))}
            </div>
            <textarea
              value={newReview.comment}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARACTERS) {
                  setNewReview({ ...newReview, comment: e.target.value });
                }
              }}
              placeholder="Your review..."
              className="review-textarea"
            />
            <div className="characters-remaining">
              Characters remaining: {MAX_CHARACTERS - newReview.comment.length}
            </div>
            <button onClick={handleAddReview}>Add Review</button>
          </div>

          {/* Search and Sort */}
          <div className="search-sort">
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>

          {/* Error Message */}
          {error && <p className="error-message">{error}</p>}

          {/* Reviews List */}
          <div>
            {filteredReviews.length === 0 ? (
              <p>Add Your Reviews to See Them Here!</p>
            ) : (
              filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className={`review-item ${review.userId === currentUserId ? 'user-review' : ''}`}
                >
                  <p>Rating: {'⭐'.repeat(review.rating)}</p>
                  <p>{review.comment}</p>
                  <p className="review-date">
                    {new Date(review.timestamp).toLocaleDateString()}
                  </p>
                  {review.userId === currentUserId && (
                    <div className="review-actions">
                      <button
                        onClick={() => handleEditReview(review.id, {
                          comment: prompt('Edit your review:', review.comment),
                          rating: Number(prompt('Edit your rating (1-5):', review.rating))
                        })}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BookReviews;
