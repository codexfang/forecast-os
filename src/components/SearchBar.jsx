import { useState, useEffect, useRef } from 'react'
import { useDebounce } from '../hooks/useDebounce'
import { searchCities } from '../utils/api'

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 250)
  const ref = useRef(null)

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setSuggestions([])
      return
    }
    let cancelled = false
    setLoading(true)
    searchCities(debouncedQuery).then((results) => {
      if (!cancelled) {
        setSuggestions(results)
        setOpen(results.length > 0)
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [debouncedQuery])

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(city) {
    setQuery(`${city.name}, ${city.country}`)
    setOpen(false)
    setSuggestions([])
    onSelect(city)
  }

  return (
    <div className="search-bar" ref={ref}>
      <div className="search-input-wrapper">
        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (suggestions.length) setOpen(true) }}
        />
        {loading && <span className="search-spinner" />}
      </div>
      {open && (
        <ul className="search-suggestions">
          {suggestions.map((city) => (
            <li key={city.id} onClick={() => handleSelect(city)}>
              <span className="city-name">{city.name}</span>
              <span className="city-detail">{city.state ? `${city.state}, ` : ''}{city.country}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
