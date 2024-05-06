// components/ProductDetail.js
import React, { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom'; // Import Link component
import shoesData from '../data/shoesData';
import './ProductDetail.css';
import { useLocation } from 'react-router-dom';



const ProductDetail = ({ addToCart }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState('UK7');
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const location = useLocation();
  const username = new URLSearchParams(location.search).get('username');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const fetchedProduct = shoesData.find((shoe) => shoe.id.toString() === id);
        setProduct(fetchedProduct);
        setLoading(false);
        setTotalPrice(fetchedProduct.price);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSizeChange = (selectedSize) => {
    setSize(selectedSize);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
      setTotalPrice(product.price * newQuantity);
    }
  };


  const handleBuyNow = async () => {
    const cgst = totalPrice * 0.5;
    const sgst = totalPrice * 0.5;
    const totalAmount = totalPrice + cgst + sgst;
  
    try {
      const response = await fetch('http://127.0.0.1:5000/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: id,
          size,
          quantity,
          totalPrice,
          username
        })
      });
  
      if (response.ok) {
        // Handle successful purchase
        alert('Purchase successful!');
      } else {
        // Handle purchase errors
        alert('Failed to make purchase. Please try again later.');
      }
    } catch (error) {
      console.error('Error making purchase:', error);
      alert('Failed to make purchase. Please try again later.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="details">
          <h2>{product.name}</h2>
          <p>Price: ₹{product.price}</p>
          <div className="size">
            <p className='size1'>Select Size: {size} </p>
            <div className="size-options">
              {['UK7', 'UK8', 'UK9', 'UK10'].map((sizeOption) => (
                <button
                  key={sizeOption}
                  className={size === sizeOption ? 'selected' : ''}
                  onClick={() => handleSizeChange(sizeOption)}
                >
                  {sizeOption}
                </button>
              ))}
            </div>
          </div>
          <div className="quantity">
            <p classname='quantity1'>Quantity:</p>
            <div className="quantity-controls">
              <button classname='minus' onClick={() => handleQuantityChange(-1)}>-</button>
              <span>{quantity}</span>
              <button className='plus' onClick={() => handleQuantityChange(1)}>+</button>
            </div>
          </div>
          <p className='pricebutton'>Total Price: ₹{totalPrice.toFixed(2)}</p>
            <button className='buybutton' onClick={handleBuyNow}>Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
