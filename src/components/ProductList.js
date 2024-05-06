// components/ ProductList.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css';

const Product = ({ product, addToCart, addToFavorites, addedToCart, addedToFavorites }) => {
  return (
    <div className="product">
      <Link to={`/product/${product.id}`} className="product-link">
        <img src={product.image} alt={product.name} />
        <h3 className="product-name">{product.name}</h3>
      </Link>
      <p>₹{product.price}</p>
      <div className="buttons">
        <button onClick={() => addToCart(product)} disabled={addedToCart.includes(product.id)}>
          {addedToCart.includes(product.id) ? 'Added to Cart' : 'Add to Cart'}
        </button>
        <button onClick={() => addToFavorites(product)} disabled={addedToFavorites.includes(product.id)}>
          {addedToFavorites.includes(product.id) ? 'Added to Favorites' : 'Add to Favorites'}
        </button>
      </div>
    </div>
  );
};

const ProductList = ({ products, addToCart, cartItems, addToFavorites, favoriteItems }) => {
  const [addedToCart, setAddedToCart] = useState([]);
  const [addedToFavorites, setAddedToFavorites] = useState([]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedToCart([...addedToCart, product.id]);
  };

  const handleAddToFavorites = (product) => {
    addToFavorites(product);
    setAddedToFavorites([...addedToFavorites, product.id]);
  };

  return (
      <div className="products">
        {products.map((product) => (
          <Product
            key={product.id}
            product={product}
            addToCart={handleAddToCart}
            addToFavorites={handleAddToFavorites}
            addedToCart={addedToCart}
            addedToFavorites={addedToFavorites}
          />
        ))}
      </div>
  );
};

export default ProductList;
