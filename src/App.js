import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import AddBook from './components/AddBook';
import ReadingProgress from './components/ReadingProgress';
import QuoteCollection from './components/QuoteCollection';
import BookReviews from './components/BookReviews';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-book" element={<AddBook />} />
          <Route path="/reading-progress" element={<ReadingProgress />} />
          <Route path="/quote-collection" element={<QuoteCollection />} />
          <Route path="/book-reviews" element={<BookReviews />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
