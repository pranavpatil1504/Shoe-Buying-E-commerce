// components/Favorites.js
import React from 'react';
import './Favorites.css';

const FavoriteItem = ({ item, removeFromFavorites }) => {
  const handleRemoveFromFavorites = () => {
    removeFromFavorites(item.id);
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

const Favorites = ({ favoriteItems, removeFromFavorites }) => {
  return (
    <div className="favorites-page">
      <div className="favorites-items">
        {favoriteItems && favoriteItems.length > 0 ? (
          favoriteItems.map((item) => (
            <FavoriteItem
              key={item.id}
              item={item}
              removeFromFavorites={removeFromFavorites}
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
