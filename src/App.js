//App.js
import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, NavLink, Route, Routes } from 'react-router-dom';
import Favorites from './components/Favorites';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import shoesData from './data/shoesData';
import ProductDetail from './components/ProductDetail';
import SignUpPage from './components/SignUpPage';
const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');

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

  return (
    <Router>
      <div className="app">
        <header className="header">
          <h1 className="logo">Shoe E-Commerce</h1>
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            <select onChange={handleFilterChange}>
              <option className= 'option1'value="">Sort by Price</option>
              <option value="ascending">Price: Low to High</option>
              <option value="descending">Price: High to Low</option>
            </select>
          </div>
          <nav className="nav">
            <ul>
              <li><NavLink to="/" activeClassName="active">Home</NavLink></li>
              <li><NavLink to="/favorites" activeClassName="active">Favorites</NavLink></li>
              <li><NavLink to="/cart" activeClassName="active">Cart</NavLink></li>
              <li><NavLink to="/signup" activeClassName="active">Sign Up</NavLink></li> {/* Added Sign Up link */}
            </ul>
          </nav>
        </header>
        <Routes>
          <Route
            path="/"
            element={<ProductList products={filteredProducts} addToCart={addToCart} cartItems={cartItems} addToFavorites={addToFavorites} />}
          />
          <Route
            path="/favorites"
            element={<Favorites favoriteItems={favoriteItems} removeFromFavorites={removeFromFavorites} />}
          />
          <Route
            path="/cart"
            element={<Cart cartItems={cartItems} removeFromCart={removeFromCart} />}
          />
          <Route
            path="/product/:id"
            element={<ProductDetail addToCart={addToCart} />}
          />
          <Route
            path="/signup"
            element={<SignUpPage />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
