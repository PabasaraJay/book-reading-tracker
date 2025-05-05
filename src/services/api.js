import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Books API
export const booksApi = {
  getAll: () => axios.get(`${API_URL}/books`),
  getOne: (id) => axios.get(`${API_URL}/books/${id}`),
  create: (data) => axios.post(`${API_URL}/books`, data),
  update: (id, data) => axios.put(`${API_URL}/books/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/books/${id}`)
};

// Reading Progress API
export const readingProgressApi = {
  getAll: () => axios.get(`${API_URL}/reading-progress`),
  getByBook: (bookId) => axios.get(`${API_URL}/reading-progress/book/${bookId}`),
  create: (data) => axios.post(`${API_URL}/reading-progress`, data),
  update: (id, data) => axios.put(`${API_URL}/reading-progress/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/reading-progress/${id}`)
};

// Reviews API
export const reviewsApi = {
  getAll: () => axios.get(`${API_URL}/reviews`),
  getByBook: (bookId) => axios.get(`${API_URL}/reviews/book/${bookId}`),
  create: (data) => axios.post(`${API_URL}/reviews`, data),
  update: (id, data) => axios.put(`${API_URL}/reviews/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/reviews/${id}`)
};

// Quotes API
export const quotesApi = {
  getAll: () => axios.get(`${API_URL}/quotes`),
  getByBook: (bookId) => axios.get(`${API_URL}/quotes/book/${bookId}`),
  create: (data) => axios.post(`${API_URL}/quotes`, data),
  update: (id, data) => axios.put(`${API_URL}/quotes/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/quotes/${id}`)
}; 