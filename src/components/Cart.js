// components/Cart.js
import React from 'react';
import './Cart.css';
import { Link } from 'react-router-dom';

const CartItem = ({ item, removeFromCart }) => {
  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} />
      <h3>{item.name}</h3>
      <p>₹{item.price}</p>
      <div className="buttons">
        <button onClick={() => removeFromCart(item.id)}>Remove from Cart</button>
        <Link to={`/product/${item.id}`} className="checkout-button">Proceed to Checkout</Link>
      </div>
    </div>
  );
};

const Cart = ({ cartItems, removeFromCart }) => {

  return (
    <div className="cart-page">
      <div className="cart-items">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              removeFromCart={removeFromCart}
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
