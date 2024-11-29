import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './src/app';  // Import the App component

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />  {/* Render the App component, which in turn can render Home */}
  </React.StrictMode>
);