import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import "./bootstrap/sketchy_bootstrap.min.css"
import './index.css';
import reportWebVitals from './reportWebVitals';

import { Container } from "react-bootstrap";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <Container>
    <React.StrictMode>
      <App />
    </React.StrictMode>

  </Container>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
