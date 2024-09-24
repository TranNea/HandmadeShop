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
import BlogDetail from './components/Blog/BlogDetails';
import Product from './components/Product/Product';
import SpecialCase from './layouts/SpecialCase/SpecialCase';
import ProductDetails from './components/Product/ProductDetails';
import Login from './components/Login';
import { UserContext } from './configs/MyContext';
import UserReducer from './reducers/UserReducer';
import { useReducer } from 'react';
import cookie from 'react-cookies';
import Register from './components/Register';
import Profile from './components/Profile';
import Wishlist from './components/Wishlist';


ReactDOM.render(<App />, document.getElementById("root"));


function App() {
  let current = cookie.load("current-user")
  if (current === undefined)
    current = null

  const [user, dispatch] = useReducer(UserReducer, current)

  return (
    <UserContext.Provider value={[user, dispatch]}>
      <BrowserRouter>
        <Header />
        <HeaderBottom />
        <SpecialCase />
        <Container>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/blogs' element={<Blog />} />
            <Route path='/blogs/:blogId' element={<BlogDetail />} />
            <Route path='/products' element={<Product />} />
            <Route path='/products/:productId' element={<ProductDetails />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/wishlists' element={<Wishlist />} />
          </Routes>
        </Container>
        <Footer />
        <FooterBottom />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
