import { getWeatherDescription, getWeatherEmoji } from '../utils/api'
import { formatTemp, formatDay, formatDate } from '../utils/format'

export default function ForecastTimeline({ data, unit }) {
  if (!data || !data.daily) return null

  const daily = data.daily
  const symbol = unit === 'fahrenheit' ? '°F' : '°C'

  return (
    <div className="card forecast-card">
      <h2 className="card-title">7-Day Forecast</h2>
      <div className="forecast-scroll">
        {daily.time.map((date, i) => {
          const isToday = i === 0
          return (
            <div key={date} className="forecast-day">
              <div className="forecast-day-label">
                <span className="forecast-day-name">{isToday ? 'Today' : formatDay(date)}</span>
                <span className="forecast-day-date">{formatDate(date)}</span>
              </div>
              <div className="forecast-day-icon">
                <span>{getWeatherEmoji(daily.weather_code[i])}</span>
              </div>
              <div className="forecast-day-desc">
                {getWeatherDescription(daily.weather_code[i])}
              </div>
              <div className="forecast-day-temps">
                <span className="forecast-high">{formatTemp(daily.temperature_2m_max[i])}</span>
                <span className="forecast-low">{formatTemp(daily.temperature_2m_min[i])}</span>
              </div>
              <div className="forecast-day-precip">
                {daily.precipitation_probability_max[i] > 0 && (
                  <span className="precip-badge">{daily.precipitation_probability_max[i]}%</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
