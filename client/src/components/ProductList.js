import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css';

const Product = ({ product, addToCart, addToFavorites, addedToCart, addedToFavorites, username }) => {
  return (
    <div className="product">
      <Link to={`/product/${product.id}?username=${username}`} className="product-link">
        <img src={product.image} alt={product.name} />
        <h3 className="product-name">{product.name}</h3>
      </Link>
      <p>₹{product.price}</p>
      <div className="buttons">
        <button onClick={() => addToCart(product)} disabled={addedToCart} className={addedToCart ? 'added-to-cart' : ''}>
          {addedToCart ? 'Added to Cart' : 'Add to Cart'}
        </button>
        <button onClick={() => addToFavorites(product)} disabled={addedToFavorites}>
          {addedToFavorites ? 'Added to Favorites' : 'Add to Favorites'}
        </button>
      </div>
    </div>
  );
};

const ProductList = ({ products, addToCart, cartItems, addToFavorites, favoriteItems, username }) => {
  const [addedToCartMap, setAddedToCartMap] = useState({});

  const handleAddToCart = async (product) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/add-to-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: product.id,
          username,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setAddedToCartMap((prevMap) => ({
          ...prevMap,
          [product.id]: true,
        }));
        addToCart(product);
      } else {
        console.error('Failed to add to cart:', data.message);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleAddToFavorites = async (product) => {
    // Similar implementation for addToFavorites
  };

  return (
    <div className="products">
      {products.map((product) => (
        <Product
          key={product.id}
          product={product}
          addToCart={handleAddToCart}
          addToFavorites={handleAddToFavorites}
          addedToCart={addedToCartMap[product.id] || false}
          addedToFavorites={false} // Assuming addToFavorites behavior doesn't affect addedToFavorites state
          username={username}
        />
      ))}
    </div>
  );
};

export default ProductList;
