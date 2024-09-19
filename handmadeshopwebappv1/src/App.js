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
import About from './layouts/About/About';
import Contact from './layouts/Contact/Contact';
import Blog from './components/Blog/Blog';


ReactDOM.render(<App />, document.getElementById("root"));


function App() {
  return (
    <BrowserRouter>
      <Header />
      <HeaderBottom />
      <Container>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/blog' element={<Blog />} />
        </Routes>
      </Container>
      <Footer />
      <FooterBottom />
    </BrowserRouter>
  );
}

export default App;
