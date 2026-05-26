import { getWeatherDescription, getWeatherEmoji } from '../utils/api'
import { formatTemp } from '../utils/format'

export default function WeatherCard({ data, unit }) {
  if (!data || !data.current) return null

  const current = data.current
  const daily = data.daily
  const desc = getWeatherDescription(current.weather_code)
  const emoji = getWeatherEmoji(current.weather_code)
  const symbol = unit === 'fahrenheit' ? '°F' : '°C'

  return (
    <div className="card weather-card">
      <div className="weather-main">
        <div className="weather-temp-row">
          <span className="weather-emoji">{emoji}</span>
          <span className="weather-temp">{formatTemp(current.temperature_2m)}</span>
          <span className="weather-unit">{symbol}</span>
        </div>
        <div className="weather-desc">{desc}</div>
      </div>
      <div className="weather-meta">
        <div className="meta-item">
          <span className="meta-label">Feels like</span>
          <span className="meta-value">{formatTemp(current.apparent_temperature)}{symbol}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Humidity</span>
          <span className="meta-value">{current.relative_humidity_2m}%</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Wind</span>
          <span className="meta-value">{current.wind_speed_10m} km/h</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">High / Low</span>
          <span className="meta-value">{formatTemp(daily.temperature_2m_max[0])} / {formatTemp(daily.temperature_2m_min[0])}</span>
        </div>
      </div>
    </div>
  )
}
