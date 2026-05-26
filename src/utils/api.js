const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

export async function searchCities(query) {
  if (!query || query.length < 2) return []
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to search cities')
  const data = await res.json()
  return (data.results || []).map((r) => ({
    name: r.name,
    country: r.country,
    state: r.admin1 || '',
    latitude: r.latitude,
    longitude: r.longitude,
    id: r.id,
  }))
}

export async function fetchForecast(latitude, longitude, unit = 'celsius') {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m',
    daily: 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max',
    temperature_unit: unit === 'fahrenheit' ? 'fahrenheit' : 'celsius',
    wind_speed_unit: 'kmh',
    timezone: 'auto',
    forecast_days: 7,
  })
  const res = await fetch(`${FORECAST_URL}?${params}`)
  if (!res.ok) throw new Error('Failed to fetch forecast')
  return res.json()
}

export async function fetchHistorical(latitude, longitude, unit = 'celsius') {
  const today = new Date()
  const past = new Date(today)
  past.setDate(past.getDate() - 14)
  const startDate = past.toISOString().slice(0, 10)
  const endDate = today.toISOString().slice(0, 10)
  const params = new URLSearchParams({
    latitude,
    longitude,
    daily: 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max',
    temperature_unit: unit === 'fahrenheit' ? 'fahrenheit' : 'celsius',
    wind_speed_unit: 'kmh',
    timezone: 'auto',
    start_date: startDate,
    end_date: endDate,
  })
  const res = await fetch(`${FORECAST_URL}?${params}`)
  if (!res.ok) throw new Error('Failed to fetch historical data')
  return res.json()
}

export function getWeatherDescription(code) {
  if (code === 0) return 'Clear'
  if (code <= 3) return 'Cloudy'
  if (code <= 48) return 'Foggy'
  if (code <= 55) return 'Drizzle'
  if (code <= 65) return 'Rain'
  if (code <= 75) return 'Snow'
  if (code <= 82) return 'Showers'
  return 'Thunderstorm'
}

export function getWeatherEmoji(code) {
  if (code === 0) return '\u2600\uFE0F'
  if (code <= 2) return '\u26C5'
  if (code === 3) return '\u2601\uFE0F'
  if (code <= 48) return '\uD83C\uDF2B\uFE0F'
  if (code <= 55) return '\uD83C\uDF26\uFE0F'
  if (code <= 65) return '\uD83C\uDF27\uFE0F'
  if (code <= 75) return '\u2744\uFE0F'
  if (code <= 82) return '\uD83C\uDF26\uFE0F'
  return '\u26C8\uFE0F'
}
