import React from 'react';
import './Banner.css';

const Banner = ({ title }) => {
  return (
    <div className="banner">
      <h1>{title}</h1>
    </div>
  );
};

export default Banner; 