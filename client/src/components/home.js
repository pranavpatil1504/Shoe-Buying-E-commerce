import React, { useState } from 'react';
import './App.css';
import { NavLink } from 'react-router-dom';
import Favorites from './Favorites.js';
import ProductList from './ProductList';
import Cart from './Cart';
import shoesData from '../data/shoesData';
import ProductDetail from './ProductDetail';
import SignUpPage from './SignUpPage';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const [cartItems, setCartItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [currentPage, setCurrentPage] = useState('list');
  const location = useLocation();
  const username = new URLSearchParams(location.search).get('username');
    if(username==null){
        return null
    }
  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
  };

  const addToFavorites = (product) => {
    setFavoriteItems([...favoriteItems, product]);
  };

  const removeFromFavorites = (productId) => {
    const updatedFavorites = favoriteItems.filter(item => item.id !== productId);
    setFavoriteItems(updatedFavorites);
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event) => {
    setSortBy(event.target.value);
  };

  const filteredProducts = shoesData.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.price.toString().includes(searchQuery)
  );

  if (sortBy === 'ascending') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'descending') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  let pageContent;
  switch (currentPage) {
    case 'list':
      pageContent = <ProductList products={filteredProducts} addToCart={addToCart} cartItems={cartItems} addToFavorites={addToFavorites} username={username}/>;
      break;
    case 'favorites':
      pageContent = <Favorites favoriteItems={favoriteItems} removeFromFavorites={removeFromFavorites} />;
      break;
    case 'cart':
      pageContent = <Cart cartItems={cartItems} removeFromCart={removeFromCart} />;
      break;
    default:
      pageContent = null;
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="logo">Shoe E-Commerce</h1>
        <h3 >Welcome, {username}!</h3>
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          <select onChange={handleFilterChange}>
            <option value="">Sort by Price</option>
            <option value="ascending">Price: Low to High</option>
            <option value="descending">Price: High to Low</option>
          </select>
        </div>
        <nav className="nav">
          <ul>
            <li><NavLink to={`/home?username=${username}`} activeClassName="active" onClick={() => setCurrentPage('list')}>Home</NavLink></li>
            <li><NavLink to={`/favorites?username=${username}`} activeClassName="active" onClick={() => setCurrentPage('favorites')}>Favorites</NavLink></li>
            <li><NavLink to={`/cart?username=${username}`} activeClassName="active" onClick={() => setCurrentPage('cart')}>Cart</NavLink></li>
          </ul>
        </nav>
      </header>
      
      {pageContent}
    </div>
  );
};

export default Home;
