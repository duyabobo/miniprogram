const meetLabel = require('./meet_label')

const HEART_KIND_EMPTY = 'empty'
const HEART_KIND_SINGLE = 'single'
const HEART_KIND_DOUBLE = 'double'
const HEART_KIND_SOLID = 'solid'
const HEART_KIND_BROKEN = 'broken'

const PERMANENT_HEART_KINDS = {
  broken: true,
  solid: true,
  double: true,
}

// 实心 > 心碎 > 双心 > 单心 > 无心；同级按 10km 距离档、开始时间升序
const HEART_SORT_ORDER = {
  solid: 0,
  broken: 1,
  double: 2,
  single: 3,
  empty: 4,
}

const DISTANCE_BUCKET_KM = 10
const MAX_LIST_DISTANCE_KM = 100
const LEAD_MINUTES_PER_DISTANCE_BUCKET = 120

function distanceKm(userLocation, latitude, longitude) {
  if (!userLocation || !latitude || !longitude) return null
  const lat1 = userLocation.latitude * Math.PI / 180
  const lat2 = latitude * Math.PI / 180
  const dLat = (latitude - userLocation.latitude) * Math.PI / 180
  const dLng = (longitude - userLocation.longitude) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function distanceBucket(distanceKm) {
  if (distanceKm === null) return 999
  if (distanceKm <= 0) return 1
  return Math.floor(distanceKm / DISTANCE_BUCKET_KM) + 1
}

function maxLeadMinutesForTransient(distanceKm) {
  return distanceBucket(distanceKm) * LEAD_MINUTES_PER_DISTANCE_BUCKET
}

function heartKindOf(progressStatus, hasMatch) {
  if (progressStatus === 5) return HEART_KIND_BROKEN
  if (progressStatus === 4 || progressStatus === 3) return HEART_KIND_SOLID
  if (progressStatus === 2) return HEART_KIND_DOUBLE
  if (progressStatus === 1) return HEART_KIND_SINGLE
  if (progressStatus === 0) return hasMatch ? HEART_KIND_SINGLE : HEART_KIND_EMPTY
  return HEART_KIND_EMPTY
}

function resolveHeartKind(item) {
  if (item.heartKind) return item.heartKind
  return heartKindOf(item.progressStatus, !!item.hasMatch)
}

function shouldShowItem(heartKind, distanceKm, minutesUntil) {
  if (PERMANENT_HEART_KINDS[heartKind]) return true
  if (distanceKm === null || distanceKm > MAX_LIST_DISTANCE_KM) return false
  if (minutesUntil === null || minutesUntil < 0) return false
  if (minutesUntil > meetLabel.LIST_WINDOW_MINUTES) return false
  if (heartKind === HEART_KIND_EMPTY || heartKind === HEART_KIND_SINGLE) {
    return minutesUntil <= maxLeadMinutesForTransient(distanceKm)
  }
  return false
}

function sortKey(heartKind, distanceKm, meetDate, now) {
  const minutesUntil = meetDate ? (meetDate - now) / 60000 : 999999
  return [
    HEART_SORT_ORDER[heartKind] === undefined ? 9 : HEART_SORT_ORDER[heartKind],
    distanceBucket(distanceKm),
    minutesUntil,
  ]
}

function compareSortKey(a, b) {
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] - b[i]
  }
  return 0
}

function shouldIncludeForMatch(item, heartKind) {
  if (heartKind === HEART_KIND_EMPTY) return true
  if (heartKind === HEART_KIND_SINGLE) return !!item.matched || !!item.hasMatch
  return true
}

function filterAndSortList(list, now, userLocation, parseMeetDate) {
  const current = now || new Date()
  const ranked = []
  ;(list || []).forEach(function (item) {
    const meetDate = parseMeetDate(item)
    const heartKind = resolveHeartKind(item)
    if (!shouldIncludeForMatch(item, heartKind)) return
    const km = distanceKm(userLocation, item.latitude, item.longitude)
    const minutesUntil = meetDate ? (meetDate - current) / 60000 : null
    if (!shouldShowItem(heartKind, km, minutesUntil)) return
    ranked.push({
      item: item,
      key: sortKey(heartKind, km, meetDate, current),
    })
  })
  ranked.sort(function (a, b) { return compareSortKey(a.key, b.key) })
  let solidSeen = false
  const limited = []
  ranked.forEach(function (entry) {
    const heartKind = resolveHeartKind(entry.item)
    if (heartKind === HEART_KIND_SOLID) {
      if (solidSeen) return
      solidSeen = true
    }
    limited.push(entry)
  })
  return limited.map(function (entry) { return entry.item })
}

module.exports = {
  HEART_KIND_EMPTY,
  HEART_KIND_SINGLE,
  HEART_KIND_DOUBLE,
  HEART_KIND_SOLID,
  HEART_KIND_BROKEN,
  distanceKm,
  distanceBucket,
  sortKey,
  resolveHeartKind,
  filterAndSortList,
}
