const meetLabel = require('./meet_label')
const heartStatus = require('./heart_status')

const TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}:\d{2})/
const PREVIEW_ID_BASE = 90001
const EMPTY_PREVIEW_ID_BASE = 91001
const TWO_HOURS_MS = 2 * 60 * 60 * 1000
const MS_PER_MINUTE = 60 * 1000

/** 天津市中心 fallback（未拿到定位时） */
const TIANJIN_CENTER = { latitude: 39.128, longitude: 117.195 }

/**
 * 无心场次：相对用户坐标偏移（约 1~3km），48~108 分钟内开始
 * 在天津/北京都能落在 100km 与 2h 档规则内
 */
const EMPTY_NEARBY_OFFSETS = [
  { address: '天津 · 滨江道咖啡', latOffset: 0.004, lngOffset: -0.006, minutesFromNow: 16 },
  { address: '天津 · 意式风情区茶馆', latOffset: 0.006, lngOffset: 0.005, minutesFromNow: 28 },
  { address: '天津 · 古文化街小馆', latOffset: 0.012, lngOffset: 0.003, minutesFromNow: 40 },
  { address: '天津 · 南开大学东门', latOffset: -0.022, lngOffset: -0.008, minutesFromNow: 50 },
  { address: '天津 · 之眼河畔', latOffset: 0.018, lngOffset: -0.004, minutesFromNow: 58 },
]
const PERMANENT_HEART_KINDS = { broken: true, solid: true, half: true, double: true }
const PREVIEW_PROGRESS_CYCLE = [5, 2, 1, 0]

function previewProgressStatus(index) {
  if (index === 0) return 4
  return PREVIEW_PROGRESS_CYCLE[(index - 1) % PREVIEW_PROGRESS_CYCLE.length]
}

const PREVIEW_PLACES = [
  { address: '海淀 · 五道口东来顺', clock: '19:00', latitude: 39.992, longitude: 116.338 },
  { address: '朝阳 · 三里屯咖啡', clock: '14:30', latitude: 39.937, longitude: 116.455 },
  { address: '东城 · 国子监茶馆', clock: '15:00', latitude: 39.947, longitude: 116.417 },
  { address: '西城 · 什刹海小馆', clock: '18:30', latitude: 39.941, longitude: 116.386 },
  { address: '海淀 · 颐和园东门', clock: '10:00', latitude: 39.999, longitude: 116.275 },
  { address: '朝阳 · 亮马河步道', clock: '16:00', latitude: 39.949, longitude: 116.462 },
  { address: '东城 · 南锣鼓巷书店', clock: '19:30', latitude: 39.937, longitude: 116.403 },
  { address: '西城 · 白塔寺甜品', clock: '13:00', latitude: 39.924, longitude: 116.363 },
  { address: '海淀 · 中关村书店', clock: '11:00', latitude: 39.983, longitude: 116.316 },
  { address: '朝阳 · 朝阳公园南门', clock: '15:30', latitude: 39.933, longitude: 116.482 },
  { address: '东城 · 雍和宫素食', clock: '12:00', latitude: 39.947, longitude: 116.417 },
  { address: '西城 · 金融街简餐', clock: '18:00', latitude: 39.913, longitude: 116.359 },
  { address: '丰台 · 丽泽咖啡', clock: '14:00', latitude: 39.867, longitude: 116.322 },
  { address: '通州 · 运河公园', clock: '16:30', latitude: 39.908, longitude: 116.685 },
  { address: '海淀 · 圆明园西门', clock: '10:30', latitude: 40.008, longitude: 116.294 },
  { address: '朝阳 · 798艺术区', clock: '15:00', latitude: 39.984, longitude: 116.495 },
  { address: '东城 · 王府井书店', clock: '19:00', latitude: 39.915, longitude: 116.411 },
  { address: '西城 · 月坛公园', clock: '09:30', latitude: 39.915, longitude: 116.352 },
  { address: '昌平 · 回龙观咖啡馆', clock: '14:30', latitude: 40.071, longitude: 116.336 },
  { address: '海淀 · 清华东门', clock: '18:00', latitude: 40.002, longitude: 116.326 },
]

function pad2(value) {
  return String(value).padStart(2, '0')
}

function formatDate(date) {
  return date.getFullYear() + '-' + pad2(date.getMonth() + 1) + '-' + pad2(date.getDate())
}

function parseMeetDate(item) {
  const matched = TIME_PATTERN.exec(item.startTime || item.time || '')
  if (!matched) return null
  return new Date(
    Number(matched[1]),
    Number(matched[2]) - 1,
    Number(matched[3]),
    Number(matched[4].slice(0, 2)),
    Number(matched[4].slice(3, 5))
  )
}

function decorateGuanguanItem(item, now, userLocation) {
  const meetDate = parseMeetDate(item)
  const heartKind = heartStatus.resolveHeartKind(item)
  const km = heartStatus.distanceKm(userLocation, item.latitude, item.longitude)
  const monthLabel = meetDate ? (meetDate.getMonth() + 1) + '月' : ''
  const dayLabel = meetDate ? String(meetDate.getDate()) : ''
  return Object.assign({}, item, {
    monthLabel: monthLabel,
    dayLabel: dayLabel,
    friendlyTime: meetDate
      ? meetLabel.friendlyMeetTime(meetDate, now, { allowBeyondWindow: PERMANENT_HEART_KINDS[heartKind] })
      : (item.time || ''),
    distanceText: meetLabel.distanceText(userLocation, item.latitude, item.longitude),
    heartKind: heartKind,
    distanceKm: km,
  })
}

function sortAndDecorateList(rawList, now, userLocation) {
  const current = now || new Date()
  const sorted = heartStatus.filterAndSortList(rawList, current, userLocation, function (item) {
    return parseMeetDate(item)
  })
  return sorted.map(function (item) {
    return decorateGuanguanItem(item, current, userLocation)
  }).filter(function (item) {
    return !!item.friendlyTime || PERMANENT_HEART_KINDS[item.heartKind]
  })
}

function decorateGuanguanList(list, now, userLocation) {
  return sortAndDecorateList(list || [], now, userLocation)
}

function weekendSlotsWithinTwoWeeks(now) {
  const slots = []
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const cursor = new Date(start.getTime())
  const end = start.getTime() + meetLabel.LIST_WINDOW_MINUTES * 60 * 1000
  while (cursor.getTime() < end) {
    if (meetLabel.isWeekend(cursor)) {
      slots.push(new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate()))
    }
    cursor.setDate(cursor.getDate() + 1)
  }
  return slots
}

function previewMeetDate(index, weekendSlots, now) {
  const place = PREVIEW_PLACES[index]
  const clock = place.clock.split(':')
  const hour = Number(clock[0])
  const minute = Number(clock[1])

  if (index === 0) {
    return new Date(now.getTime() + TWO_HOURS_MS)
  }
  if (index === 1) {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute)
    if (today > now) return today
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, hour, minute)
    return tomorrow
  }

  const slot = weekendSlots[(index - 2) % weekendSlots.length]
  return new Date(slot.getFullYear(), slot.getMonth(), slot.getDate(), hour, minute)
}

function resolveNearbyBase(userLocation) {
  if (userLocation && typeof userLocation.latitude === 'number' && typeof userLocation.longitude === 'number') {
    return userLocation
  }
  return TIANJIN_CENTER
}

function buildEmptyPreviewRaw(now, userLocation) {
  const current = now || new Date()
  const base = resolveNearbyBase(userLocation)
  return EMPTY_NEARBY_OFFSETS.map(function (slot, index) {
    const meet = new Date(current.getTime() + slot.minutesFromNow * MS_PER_MINUTE)
    return {
      id: EMPTY_PREVIEW_ID_BASE + index,
      time: formatDate(meet) + ' ' + pad2(meet.getHours()) + ':' + pad2(meet.getMinutes()),
      startTime: formatDate(meet) + ' ' + pad2(meet.getHours()) + ':' + pad2(meet.getMinutes()),
      address: slot.address,
      latitude: base.latitude + slot.latOffset,
      longitude: base.longitude + slot.lngOffset,
      img: '',
      progressStatus: 0,
      hasMatch: false,
      heartKind: 'empty',
      progressDesc: '',
    }
  })
}

function buildPreviewRaw(now, userLocation) {
  const current = now || new Date()
  const weekendSlots = weekendSlotsWithinTwoWeeks(current)
  const places = PREVIEW_PLACES.map(function (place, index) {
    const meet = previewMeetDate(index, weekendSlots, current)
    const progressStatus = previewProgressStatus(index)
    return {
      id: PREVIEW_ID_BASE + index,
      time: formatDate(meet) + ' ' + pad2(meet.getHours()) + ':' + pad2(meet.getMinutes()),
      startTime: formatDate(meet) + ' ' + pad2(meet.getHours()) + ':' + pad2(meet.getMinutes()),
      address: place.address,
      latitude: place.latitude,
      longitude: place.longitude,
      img: '',
      progressStatus: progressStatus,
      hasMatch: progressStatus === 0 && index % 4 === 0,
      progressDesc: '',
    }
  })
  return places.concat(buildEmptyPreviewRaw(current, userLocation))
}

function mergeGuanguanRaw(realList, now, userLocation) {
  const mergedById = {}
  ;(realList || []).forEach(function (item) {
    if (item && item.id > 0) mergedById[item.id] = item
  })
  buildPreviewRaw(now, userLocation).forEach(function (item) {
    if (!mergedById[item.id]) mergedById[item.id] = item
  })
  return Object.keys(mergedById).map(function (id) { return mergedById[id] })
}

function buildPreviewGuanguanList(now, userLocation) {
  return fillGuanguanList([], userLocation, now)
}

function fillGuanguanList(realList, userLocation, now) {
  const current = now || new Date()
  return sortAndDecorateList(realList || [], current, userLocation)
}

module.exports = {
  decorateGuanguanList,
  buildPreviewGuanguanList,
  fillGuanguanList,
}
