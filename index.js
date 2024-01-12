import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Relatief pad
import './index.css'; // Relatief pad, indien je dit bestand hebt

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
