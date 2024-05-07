import React from 'react';
import './Favorites.css';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import shoesData from '../data/shoesData';
import { useState, useEffect } from 'react';

const FavoriteItem = ({ itemId, removeFromFavorites }) => {
  const location = useLocation();
  const username = new URLSearchParams(location.search).get('username');
  const item = shoesData.find(item => item.id === itemId);
  if(username==null){
    return null
}
  const handleRemoveFromFavorites = () => {
    removeFromFavorites(itemId);
  };

  return (
    <div className="favorite-item">
      <img src={item.image} alt={item.name} />
      <h3>{item.name}</h3>
      <p>₹{item.price}</p>
      <button onClick={handleRemoveFromFavorites}>Remove from Favorites</button>
    </div>
  );
};

const Favorites = ({ removeFromFavorites }) => {
  const location = useLocation();
  const username = new URLSearchParams(location.search).get('username');
  const [favoriteItems, setFavoriteItems] = useState([]);

  useEffect(() => {
    const fetchFavoriteItems = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/favorite-items?username=${username}`);
        const data = await response.json();
        if (response.ok) {
          if (data && data.favorite_items && Array.isArray(data.favorite_items)) {
            const favoriteIds = data.favorite_items.map(item => item[0]);
            setFavoriteItems(favoriteIds);
          } else {
            console.error('Invalid data format received from server:', data);
          }
        } else {
          console.error('Failed to fetch favorite items:', data.message);
        }
      } catch (error) {
        console.error('Error fetching favorite items:', error);
      }
    };
    fetchFavoriteItems();
  }, [username]);
  

  return (
    <div className="favorites-page">
      <nav className="nav">
        <ul>
          <li><NavLink to={`/home?username=${username}`} activeClassName="active" >Home</NavLink></li>
          <li><NavLink to={`/favorites?username=${username}`} activeClassName="active" >Favorites</NavLink></li>
          <li><NavLink to={`/cart?username=${username}`} activeClassName="active" >Cart</NavLink></li>
          </ul>
      </nav>
      <div className="favorites-items">
        {favoriteItems && favoriteItems.length > 0 ? (
          favoriteItems.map((itemId) => (
            <FavoriteItem
              key={itemId}
              itemId={itemId}
              removeFromFavorites={removeFromFavorites}
              username={username}
            />
          ))
        ) : (
          <p>!! Your favorites list is empty !!</p>
        )}
      </div>
    </div>
  );
};

export default Favorites;
