import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      <h1>📚 Welcome to "Whispering Pages" a gentle, immersive reading experience.</h1>
      <div className="navigation-grid">
        <Link to="/add-book" className="nav-card">
          <h2>Add Book</h2>
          <p>Add new books to your collection</p>
        </Link>
        <Link to="/reading-progress" className="nav-card">
          <h2>Reading Progress</h2>
          <p>Track your reading progress</p>
        </Link>
        <Link to="/quote-collection" className="nav-card">
          <h2>Quote Collection</h2>
          <p>Save your favorite book quotes</p>
        </Link>
        <Link to="/book-reviews" className="nav-card">
          <h2>Book Reviews</h2>
          <p>Write and read book reviews</p>
        </Link>
      </div>
    </div>
  );
};

export default HomePage; 