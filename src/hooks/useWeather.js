import { useState, useCallback } from 'react'
import { fetchForecast, fetchHistorical } from '../utils/api'

export function useWeather() {
  const [data, setData] = useState(null)
  const [historical, setHistorical] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async (lat, lon, unit = 'celsius') => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchForecast(lat, lon, unit)
      setData(result)
    } catch (err) {
      setError(err.message)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchHistoricalData = useCallback(async (lat, lon, unit = 'celsius') => {
    try {
      const result = await fetchHistorical(lat, lon, unit)
      setHistorical(result)
    } catch {
      setHistorical(null)
    }
  }, [])

  return { data, historical, loading, error, fetchData, fetchHistoricalData }
}
