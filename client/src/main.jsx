// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import './App.css';

import App from './App'; // App.jsx will contain your routing and auth logic

ReactDOM.createRoot(document.getElementById('root')).render(
 <BrowserRouter>
    <App />
  </BrowserRouter>

);
