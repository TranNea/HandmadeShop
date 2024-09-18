import './App.css';
import React from "react";
import ReactDOM from "react-dom";
import './assets/main.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
// import Header from './layouts/Header/Header';
import Footer from './layouts/Footer/Footer';

ReactDOM.render(<App />, document.getElementById("root"));


function App() {
  return (
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
  );
}

export default App;
