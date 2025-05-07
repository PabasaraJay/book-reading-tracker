import React, { useState, useEffect } from 'react';
import Banner from './Banner';
import './BookReviews.css';
import { reviewsApi, booksApi } from '../services/api';

const BookReviews = () => {
  // Mock user ID for demonstration
  const currentUserId = 'user123';
  
  const [books, setBooks] = useState([]);
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
  const [success, setSuccess] = useState('');
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({
    rating: 0,
    comment: ''
  });
  const [editErrors, setEditErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const MAX_CHARACTERS = 250;

  useEffect(() => {
    fetchBooks();
    fetchReviews();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await booksApi.getAll();
      setBooks(response.data);
    } catch (error) {
      setError('Failed to fetch books');
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewsApi.getAll();
      setReviews(response.data);
    } catch (error) {
      setError('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const validateReview = (review) => {
    const errors = {};
    if (!review.rating || review.rating < 1 || review.rating > 5) {
      errors.rating = 'Please select a valid rating (1-5)';
    }
    if (!review.comment.trim()) {
      errors.comment = 'Review cannot be blank';
    }
    if (review.comment.length > MAX_CHARACTERS) {
      errors.comment = `Review cannot exceed ${MAX_CHARACTERS} characters`;
    }
    return errors;
  };

  const handleAddReview = async () => {
    const errors = validateReview(newReview);
    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors)[0]);
      return;
    }

    if (!selectedBook) {
      setError('Please select a book first');
      return;
    }

    try {
      setLoading(true);
      const reviewData = {
        bookId: selectedBook._id,
        userId: currentUserId,
        rating: newReview.rating,
        comment: newReview.comment
      };

      const response = await reviewsApi.create(reviewData);
      setReviews([...reviews, response.data]);
      setNewReview({ rating: 0, comment: '', userId: currentUserId });
      setError('');
      setSuccess(`Your review for "${selectedBook.title}" has been added successfully.`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to add review');
    } finally {
      setLoading(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setEditForm({
      rating: review.rating,
      comment: review.comment
    });
    setEditErrors({});
  };

  const handleUpdateReview = async () => {
    const errors = validateReview(editForm);
    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    try {
      setLoading(true);
      const response = await reviewsApi.update(editingReview._id, editForm);
      setReviews(reviews.map(review => 
        review._id === editingReview._id ? response.data : review
      ));
      setEditingReview(null);
      setEditForm({ rating: 0, comment: '' });
      setEditErrors({});
      setSuccess('Review updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update review');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        setLoading(true);
        await reviewsApi.delete(id);
        setReviews(reviews.filter(review => review._id !== id));
        setSuccess('Review deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('Failed to delete review');
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredReviews = reviews
    .filter(review => {
      const searchLower = searchTerm.toLowerCase();
      return (
        review.comment.toLowerCase().includes(searchLower) ||
        (review.bookId && review.bookId.title && review.bookId.title.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const averageRating = selectedBook
    ? reviews
        .filter(review => review.bookId && review.bookId._id === selectedBook._id)
        .reduce((acc, review) => acc + review.rating, 0) / 
        reviews.filter(review => review.bookId && review.bookId._id === selectedBook._id).length
    : 0;

  return (
    <div className="book-reviews">
      <Banner title="Book Reviews" />
      <h2>Add Your Reviews</h2>
      
      {loading && <div className="loading-spinner">Loading...</div>}
      {success && <p className="success-message">{success}</p>}

      {/* Book Selection */}
      <div className="book-selection">
        <select
          value={selectedBook?._id || ''}
          onChange={(e) => {
            const book = books.find(b => b._id === e.target.value);
            setSelectedBook(book);
            setError('');
          }}
        >
          <option value="">Select a book...</option>
          {books.map(book => (
            <option key={book._id} value={book._id}>
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
                  key={review._id}
                  className={`review-item ${review.userId === currentUserId ? 'user-review' : ''}`}
                >
                  {editingReview?._id === review._id ? (
                    <div className="edit-review-form">
                      <h4>{review.bookId?.title || 'Unknown Book'}</h4>
                      <div className="rating-stars">
                        Rating:
                        {[1, 2, 3, 4, 5].map(star => (
                          <span
                            key={star}
                            onClick={() => setEditForm({ ...editForm, rating: star })}
                            onMouseEnter={() => setEditForm({ ...editForm, rating: star })}
                          >
                            {star <= editForm.rating ? '⭐' : '☆'}
                          </span>
                        ))}
                      </div>
                      {editErrors.rating && <p className="error-message">{editErrors.rating}</p>}
                      <textarea
                        value={editForm.comment}
                        onChange={(e) => {
                          if (e.target.value.length <= MAX_CHARACTERS) {
                            setEditForm({ ...editForm, comment: e.target.value });
                          }
                        }}
                        placeholder="Your review..."
                        className="review-textarea"
                      />
                      {editErrors.comment && <p className="error-message">{editErrors.comment}</p>}
                      <div className="review-actions">
                        <button onClick={handleUpdateReview}>Update Review</button>
                        <button onClick={() => {
                          setEditingReview(null);
                          setEditForm({ rating: 0, comment: '' });
                          setEditErrors({});
                        }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h4>{review.bookId?.title || 'Unknown Book'}</h4>
                      <p>Rating: {'⭐'.repeat(review.rating)}</p>
                      <p>{review.comment}</p>
                      <p className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                      {review.userId === currentUserId && (
                        <div className="review-actions">
                          <button onClick={() => handleEditReview(review)}>Edit</button>
                          <button onClick={() => handleDeleteReview(review._id)}>Delete</button>
                        </div>
                      )}
                    </>
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
