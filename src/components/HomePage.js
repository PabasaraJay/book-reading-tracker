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
      <div className="description-section">
        <p>Brew a warm cup of tea, find your favorite corner, and settle in.</p>
        <p>This little nook of the internet is your space to collect stories, trace your reading journey, and keep the words that moved you.</p>
        <p>Here, books aren't just read — they're experienced, cherished, and remembered.</p>
        <div className="features-list">
          <p>✨ Add your books like treasured keepsakes.</p>
          <p>📖 Record your reading moments, one chapter at a time.</p>
          <p>💬 Save quotes that linger in your heart.</p>
          <p>⭐ Share quiet reflections and honest reviews.</p>
        </div>
        <p>Whether you're savoring slow reads or flying through pages, this is your cozy corner to make every book a part of you.</p>
      </div>
    </div>
  );
};

export default HomePage; 