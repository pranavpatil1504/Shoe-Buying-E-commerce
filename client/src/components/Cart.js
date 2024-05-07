import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Cart.css';
import { useLocation } from 'react-router-dom';
import shoesData from '../data/shoesData';
import { Link } from 'react-router-dom';

const CartItem = ({ itemId, removeFromCart }) => {
  const location = useLocation();
  const username = new URLSearchParams(location.search).get('username');
  const item = shoesData.find(item => item.id === itemId);

  const handleRemoveFromCart = () => {
    removeFromCart(itemId);
  };

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} />
      <h3>{item.name}</h3>
      <p>₹{item.price}</p>
      <div className="buttons">
        <button onClick={handleRemoveFromCart}>Remove from Cart</button>
        <br></br>
        <br></br>
        <Link to={`/product/${item.id}?username=${username}`} className="buy-now-button">Buy Now</Link>
      </div>
    </div>
  );
};

const Cart = ({ removeFromCart }) => {
  const location = useLocation();
  const username = new URLSearchParams(location.search).get('username');
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/cart-items?username=${username}`);
        const data = await response.json();
        if (response.ok) {
          if (data && data.cart_items && Array.isArray(data.cart_items)) {
            const itemIds = data.cart_items.map(item => item[0]); // Extracting item ids from the array
            setCartItems(itemIds);
          } else {
            console.error('Invalid data format received from server:', data);
          }
        } else {
          console.error('Failed to fetch cart items:', data.message);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };
    fetchCartItems();
  }, [username]);

  return (
    <div className="cart-page">
      <nav className="nav">
        <ul>
          <li><NavLink to={`/home?username=${username}`} activeClassName="active" >Home</NavLink></li>
          <li><NavLink to={`/favorites?username=${username}`} activeClassName="active" >Favorites</NavLink></li>
          <li><NavLink to={`/cart?username=${username}`} activeClassName="active" >Cart</NavLink></li>
          </ul>
        </nav>
      <div className="cart-items">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((itemId) => (
            <CartItem
              key={itemId}
              itemId={itemId}
              removeFromCart={removeFromCart}
              username={username}
            />
          ))
        ) : (
          <p>!! Your cart is empty !!</p>
        )}
      </div>
    </div>
  );
};

export default Cart;
