import { useState, useMemo } from 'react'
import {
  ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend,
} from 'recharts'
import { formatShort } from '../utils/format'

export default function TemperatureChart({ forecast, historical, showHistorical, unit }) {
  const [showPrecip, setShowPrecip] = useState(false)
  const symbol = unit === 'fahrenheit' ? '°F' : '°C'

  const chartData = useMemo(() => {
    if (!forecast?.daily) return []
    const days = forecast.daily.time.map((date, i) => ({
      date: formatShort(date),
      high: Math.round(forecast.daily.temperature_2m_max[i]),
      low: Math.round(forecast.daily.temperature_2m_min[i]),
      precip: forecast.daily.precipitation_probability_max[i] ?? 0,
      source: 'forecast',
    }))

    if (showHistorical && historical?.daily) {
      const histDays = historical.daily.time.map((date, i) => ({
        date: formatShort(date),
        high: Math.round(historical.daily.temperature_2m_max[i]),
        low: Math.round(historical.daily.temperature_2m_min[i]),
        precip: historical.daily.precipitation_probability_max[i] ?? 0,
        source: 'historical',
      }))
      return [...histDays, ...days]
    }

    return days
  }, [forecast, historical, showHistorical])

  if (!chartData.length) return null

  return (
    <div className="card chart-card">
      <div className="chart-header">
        <h2 className="card-title">Temperature Trend</h2>
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={showPrecip}
            onChange={(e) => setShowPrecip(e.target.checked)}
          />
          <span>Precipitation</span>
        </label>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#e2e8f0',
              fontSize: '13px',
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
          />
          {showPrecip && (
            <Bar dataKey="precip" name="Precip %" fill="#38bdf8" opacity={0.3} radius={[4, 4, 0, 0]} />
          )}
          <Line type="monotone" dataKey="high" name={`High (${symbol})`} stroke="#f97316" strokeWidth={2} dot={{ r: 4, fill: '#f97316' }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="low" name={`Low (${symbol})`} stroke="#38bdf8" strokeWidth={2} dot={{ r: 4, fill: '#38bdf8' }} activeDot={{ r: 6 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
