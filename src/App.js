import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import AddBook from './components/AddBook';
import ReadingProgress from './components/ReadingProgress';
import QuoteCollection from './components/QuoteCollection';
import BookReviews from './components/BookReviews';
import Login from './components/Login';
import './App.css';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  useEffect(() => {
    // Clear authentication state when app starts
    localStorage.removeItem('isAuthenticated');
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-book"
            element={
              <PrivateRoute>
                <AddBook />
              </PrivateRoute>
            }
          />
          <Route
            path="/reading-progress"
            element={
              <PrivateRoute>
                <ReadingProgress />
              </PrivateRoute>
            }
          />
          <Route
            path="/quote-collection"
            element={
              <PrivateRoute>
                <QuoteCollection />
              </PrivateRoute>
            }
          />
          <Route
            path="/book-reviews"
            element={
              <PrivateRoute>
                <BookReviews />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;