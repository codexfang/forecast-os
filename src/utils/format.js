import { format, fromUnixTime } from 'date-fns'

export function formatDate(dateStr) {
  return format(new Date(dateStr), 'EEE, MMM d')
}

export function formatDay(dateStr) {
  return format(new Date(dateStr), 'EEE')
}

export function formatShort(dateStr) {
  return format(new Date(dateStr), 'MMM d')
}

export function formatTemp(temp) {
  return `${Math.round(temp)}\u00B0`
}

export function formatTime(isoString) {
  const d = new Date(isoString)
  return format(d, 'h:mm a')
}

export function formatUnixTime(unixSeconds) {
  return format(fromUnixTime(unixSeconds), 'h:mm a')
}
