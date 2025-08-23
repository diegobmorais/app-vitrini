export const formatDate = (dateString) => {
  if (!dateString) return '–'
  const [year, month, day] = dateString.split('-')
  return `${day}/${month}/${year}`
}

export const formatTime = (timeString) => {
  if (!timeString) return '–'
  const [hours, minutes, seconds] = timeString.split(':')
  const date = new Date()
  date.setHours(parseInt(hours))
  date.setMinutes(parseInt(minutes))
  date.setSeconds(parseInt(seconds))
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}
