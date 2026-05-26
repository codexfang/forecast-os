import { useState, useEffect, useCallback } from 'react'
import SearchBar from './components/SearchBar.jsx'
import WeatherCard from './components/WeatherCard.jsx'
import ForecastTimeline from './components/ForecastTimeline.jsx'
import TemperatureChart from './components/TemperatureChart.jsx'
import FavoritesPanel from './components/FavoritesPanel.jsx'
import { useWeather } from './hooks/useWeather.js'
import { fetchForecast, fetchHistorical } from './utils/api.js'

const DEFAULT_CITY = { name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, id: 2643743 }

function loadFavorites() {
  try {
    const stored = localStorage.getItem('forecast-os-favorites')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function loadUnit() {
  try {
    return localStorage.getItem('forecast-os-unit') || 'celsius'
  } catch {
    return 'celsius'
  }
}

function App() {
  const [city, setCity] = useState(() => {
    try {
      const saved = localStorage.getItem('forecast-os-city')
      return saved ? JSON.parse(saved) : DEFAULT_CITY
    } catch {
      return DEFAULT_CITY
    }
  })
  const [favorites, setFavorites] = useState(loadFavorites)
  const [unit, setUnit] = useState(loadUnit)
  const [showHistorical, setShowHistorical] = useState(false)
  const [historicalData, setHistoricalData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadData = useCallback(async (lat, lon, u) => {
    setLoading(true)
    setError(null)
    setHistoricalData(null)
    try {
      const data = await fetchForecast(lat, lon, u)
      setForecastData(data)
    } catch (err) {
      setError(err.message)
      setForecastData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadHistorical = useCallback(async (lat, lon, u) => {
    try {
      const data = await fetchHistorical(lat, lon, u)
      setHistoricalData(data)
    } catch {
      setHistoricalData(null)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('forecast-os-city', JSON.stringify(city))
    loadData(city.latitude, city.longitude, unit)
  }, [city])

  useEffect(() => {
    localStorage.setItem('forecast-os-unit', unit)
    if (forecastData) {
      loadData(city.latitude, city.longitude, unit)
    }
  }, [unit])

  useEffect(() => {
    localStorage.setItem('forecast-os-favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    if (showHistorical && forecastData) {
      loadHistorical(city.latitude, city.longitude, unit)
    } else if (!showHistorical) {
      setHistoricalData(null)
    }
  }, [showHistorical, city, unit])

  function handleSelect(city) {
    setCity(city)
  }

  function toggleFavorite() {
    setFavorites((prev) => {
      const exists = prev.find((f) => f.id === city.id)
      if (exists) return prev.filter((f) => f.id !== city.id)
      return [...prev, { id: city.id, name: city.name, country: city.country, state: city.state, latitude: city.latitude, longitude: city.longitude }]
    })
  }

  function removeFavorite(id) {
    setFavorites((prev) => prev.filter((f) => f.id !== id))
  }

  const isFavorite = favorites.some((f) => f.id === city.id)

  return (
    <div className="app">
      <header className="header">
        <div className="header-top">
          <h1 className="app-title">Forecast OS</h1>
          <div className="header-controls">
            <label className="unit-toggle">
              <span className={`unit-opt ${unit === 'celsius' ? 'active' : ''}`} onClick={() => setUnit('celsius')}>&deg;C</span>
              <span className="unit-divider">/</span>
              <span className={`unit-opt ${unit === 'fahrenheit' ? 'active' : ''}`} onClick={() => setUnit('fahrenheit')}>&deg;F</span>
            </label>
          </div>
        </div>
        <div className="header-search-row">
          <SearchBar onSelect={handleSelect} />
          <button
            className={`fav-toggle ${isFavorite ? 'active' : ''}`}
            onClick={toggleFavorite}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '\u2605' : '\u2606'}
          </button>
        </div>
      </header>

      <FavoritesPanel
        favorites={favorites}
        onSelect={handleSelect}
        onRemove={removeFavorite}
        currentCity={city}
      />

      <main className="main">
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        {loading && !forecastData && (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading weather data...</p>
          </div>
        )}

        {forecastData && (
          <>
            <div className="city-label">
              {city.name}, {city.country}
            </div>

            <div className="dashboard">
              <WeatherCard data={forecastData} unit={unit} />

              <ForecastTimeline data={forecastData} unit={unit} />

              <TemperatureChart
                forecast={forecastData}
                historical={historicalData}
                showHistorical={showHistorical}
                unit={unit}
              />

              <div className="card historical-toggle-card">
                <label className="toggle-row">
                  <input
                    type="checkbox"
                    checked={showHistorical}
                    onChange={(e) => setShowHistorical(e.target.checked)}
                  />
                  <span>Show historical data (past 14 days)</span>
                </label>
              </div>
            </div>
          </>
        )}

        {!loading && !forecastData && !error && (
          <div className="empty-state">
            <p>Search for a city to view weather data.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
