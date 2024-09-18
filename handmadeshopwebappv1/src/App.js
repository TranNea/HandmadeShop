import './App.css';
import React from "react";
import ReactDOM from "react-dom";
import './assets/main.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './layouts/Header/Header';
import Footer from './layouts/Footer/Footer';
import Home from './components/Home';
import HeaderBottom from './layouts/Header/HeaderBottom';
import FooterBottom from './layouts/Footer/FooterBottom';

ReactDOM.render(<App />, document.getElementById("root"));


function App() {
  return (
    <BrowserRouter>
      <Header />
      <HeaderBottom />
      <Container>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </Container>
      <Footer />
      <FooterBottom />
    </BrowserRouter>
  );
}

export default App;
