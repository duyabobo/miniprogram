const WEEKDAY_SHORT = ['日', '一', '二', '三', '四', '五', '六']
const NEAR_WINDOW_MINUTES = 120
const HALF_HOUR_MINUTES = 30
const LIST_WINDOW_DAYS = 14
const EARTH_RADIUS_KM = 6371
const MINUTES_PER_DAY = 24 * 60
const MS_PER_MINUTE = 60 * 1000
const MS_PER_DAY = MINUTES_PER_DAY * MS_PER_MINUTE
const LIST_WINDOW_MINUTES = LIST_WINDOW_DAYS * MINUTES_PER_DAY
const SATURDAY = 6
const SUNDAY = 0

function periodLabel(hour) {
  if (hour < 6) return '凌晨'
  if (hour < 12) return '上午'
  if (hour < 13) return '中午'
  if (hour < 18) return '下午'
  return '晚上'
}

function clockHourLabel(hour) {
  if (hour > 12) return hour - 12
  if (hour === 0) return 12
  return hour
}

function clockLabel(hour, minute) {
  const displayHour = clockHourLabel(hour)
  if (minute === 0) return displayHour + '点'
  if (minute === HALF_HOUR_MINUTES) return displayHour + '点半'
  return displayHour + '点' + minute + '分'
}

function relativeWithinTwoHours(minutes) {
  if (minutes < 60) {
    return Math.max(1, Math.round(minutes)) + '分钟后'
  }
  return Math.ceil(minutes / 60) + '小时后'
}

function pad2(value) {
  return String(value).padStart(2, '0')
}

function absoluteClockTime(meetDate) {
  return pad2(meetDate.getHours()) + ':' + pad2(meetDate.getMinutes()) + ':' + pad2(meetDate.getSeconds())
}

function mondayOf(date) {
  const weekday = date.getDay()
  const offset = weekday === SUNDAY ? -6 : 1 - weekday
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset)
}

function isWithinListWindow(meetDate, now) {
  const diffMinutes = (meetDate - now) / MS_PER_MINUTE
  return diffMinutes <= LIST_WINDOW_MINUTES
}

function friendlyMeetTime(meetDate, now, options) {
  const current = now || new Date()
  const allowBeyondWindow = options && options.allowBeyondWindow
  if (!allowBeyondWindow && !isWithinListWindow(meetDate, current)) {
    return ''
  }

  const today = new Date(current.getFullYear(), current.getMonth(), current.getDate())
  const meetDay = new Date(meetDate.getFullYear(), meetDate.getMonth(), meetDate.getDate())
  const dayDiff = Math.round((meetDay - today) / MS_PER_DAY)
  const diffMinutes = (meetDate - current) / MS_PER_MINUTE
  const clock = periodLabel(meetDate.getHours()) + clockLabel(meetDate.getHours(), meetDate.getMinutes())

  if (diffMinutes <= 0) {
    return absoluteClockTime(meetDate)
  }

  if (diffMinutes > 0 && diffMinutes <= NEAR_WINDOW_MINUTES) {
    return relativeWithinTwoHours(diffMinutes)
  }
  if (dayDiff === 0) return clock
  if (dayDiff === 1) return '明天' + clock

  const weekDiff = Math.round((mondayOf(meetDay) - mondayOf(today)) / (7 * MS_PER_DAY))
  const weekday = WEEKDAY_SHORT[meetDate.getDay()]
  if (weekDiff === 0) return '这周' + weekday + clock
  if (weekDiff === 1) return '下周' + weekday + clock
  if (weekDiff === 2) return '下下周' + weekday + clock
  return (meetDate.getMonth() + 1) + '月' + meetDate.getDate() + '日' + clock
}

function distanceText(from, latitude, longitude) {
  if (!from || !latitude || !longitude) return '暂无定位'
  const lat1 = from.latitude * Math.PI / 180
  const lat2 = latitude * Math.PI / 180
  const dLat = lat2 - lat1
  const dLng = (longitude - from.longitude) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const km = EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return km.toFixed(2) + 'km'
}

function isWeekend(date) {
  const weekday = date.getDay()
  return weekday === SATURDAY || weekday === SUNDAY
}

module.exports = {
  SATURDAY,
  SUNDAY,
  LIST_WINDOW_MINUTES,
  friendlyMeetTime,
  absoluteClockTime,
  isWithinListWindow,
  distanceText,
  isWeekend,
}
