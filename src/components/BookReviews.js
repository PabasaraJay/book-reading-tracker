import React, { useState, useEffect } from 'react';

const BookReviews = () => {
  // Mock user ID for demonstration
  const currentUserId = 'user123';
  
  // State for books (in a real app, this would come from an API or context)
  const [books, setBooks] = useState([
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' },
    { id: 3, title: '1984', author: 'George Orwell' }
  ]);

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
    <div className="book-reviews" style={{ padding: '1rem', border: '1px solid #ccc', marginBottom: '1rem' }}>
      <h2>Book Reviews</h2>
      
      {/* Book Selection */}
      <div style={{ marginBottom: '1rem' }}>
        <select
          value={selectedBook?.id || ''}
          onChange={(e) => {
            const book = books.find(b => b.id === Number(e.target.value));
            setSelectedBook(book);
            setError('');
          }}
          style={{ width: '100%', padding: '0.5rem' }}
        >
          <option value="">Select a book...</option>
          {books.map(book => (
            <option key={book.id} value={book.id}>
              {book.title} by {book.author}
            </option>
          ))}
        </select>
      </div>

      {selectedBook && (
        <>
          {/* Average Rating Display */}
          <div style={{ marginBottom: '1rem' }}>
            <h3>{selectedBook.title}</h3>
            <p>Average Rating: {averageRating.toFixed(1)}/5 ⭐</p>
          </div>

          {/* Review Input */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              Rating:
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  onMouseEnter={() => setNewReview({ ...newReview, rating: star })}
                  style={{ cursor: 'pointer', fontSize: '1.5rem' }}
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
              style={{ width: '100%', marginBottom: '0.5rem' }}
            />
            <div style={{ marginBottom: '0.5rem' }}>
              Characters remaining: {MAX_CHARACTERS - newReview.comment.length}
            </div>
            <button onClick={handleAddReview}>Add Review</button>
          </div>

          {/* Search and Sort */}
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginRight: '1rem' }}
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
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {/* Reviews List */}
          <div>
            {filteredReviews.length === 0 ? (
              <p>Add Your Reviews to See Them Here!</p>
            ) : (
              filteredReviews.map((review) => (
                <div
                  key={review.id}
                  style={{
                    marginBottom: '1rem',
                    padding: '0.5rem',
                    border: '1px solid #eee',
                    backgroundColor: review.userId === currentUserId ? '#f0f0f0' : 'white'
                  }}
                >
                  <p>Rating: {'⭐'.repeat(review.rating)}</p>
                  <p>{review.comment}</p>
                  <p style={{ fontSize: '0.8rem', color: '#666' }}>
                    {new Date(review.timestamp).toLocaleDateString()}
                  </p>
                  {review.userId === currentUserId && (
                    <div>
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
                        style={{ marginLeft: '0.5rem' }}
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
