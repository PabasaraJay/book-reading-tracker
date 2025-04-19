import React, { useState } from 'react';

const QuoteCollection = () => {
  const [quotes, setQuotes] = useState([]);
  const [newQuote, setNewQuote] = useState('');

  const handleAddQuote = () => {
    if (newQuote.trim()) {
      setQuotes([...quotes, { id: Date.now(), text: newQuote }]);
      setNewQuote('');
    }
  };

  return (
    <div className="quote-collection" style={{ padding: '1rem', border: '1px solid #ccc', marginBottom: '1rem' }}>
      <h2>Quote Collection</h2>
      <div>
        <textarea
          value={newQuote}
          onChange={(e) => setNewQuote(e.target.value)}
          placeholder="Add a new quote..."
          style={{ width: '100%', marginBottom: '0.5rem' }}
        />
        <button onClick={handleAddQuote}>Add Quote</button>
      </div>
      <ul>
        {quotes.map((quote) => (
          <li key={quote.id} style={{ marginBottom: '0.5rem' }}>
            "{quote.text}"
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuoteCollection;
