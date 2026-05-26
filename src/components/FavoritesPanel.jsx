export default function FavoritesPanel({ favorites, onSelect, onRemove, currentCity }) {
  if (!favorites.length) return null

  return (
    <div className="favorites-panel">
      <h3 className="favorites-title">Favorites</h3>
      <div className="favorites-list">
        {favorites.map((city) => (
          <div
            key={city.id}
            className={`favorite-item ${currentCity?.id === city.id ? 'active' : ''}`}
          >
            <button className="favorite-btn" onClick={() => onSelect(city)}>
              <span className="fav-city-name">{city.name}</span>
              <span className="fav-city-detail">{city.country}</span>
            </button>
            <button
              className="fav-remove"
              onClick={(e) => { e.stopPropagation(); onRemove(city.id) }}
              title="Remove from favorites"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
