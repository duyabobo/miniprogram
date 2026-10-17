const FIELD_ORDER = ['性别', '出生年份', '身高', '体重', '籍贯', '学历', '学校地址', '学校', '入学时间', '专业']

const LABEL_ALIAS = {
  '性别': '性别',
  '出生年份': '出生年份',
  '出生年份区间': '出生年份',
  '身高': '身高',
  '身高区间': '身高',
  '体重': '体重',
  '体重区间': '体重',
  '籍贯': '籍贯',
  '籍贯范围': '籍贯',
  '最高第一学历': '学历',
  '最低第一学历': '学历',
  '学校地址': '学校地址',
  '学校地址范围': '学校地址',
  '学校': '学校',
  '入学时间': '入学时间',
  '入学时间区间': '入学时间',
  '专业信息': '专业',
}

const MISSING_MARK = '—'

function shortLabel(desc) {
  if (LABEL_ALIAS[desc]) return LABEL_ALIAS[desc]
  return desc || ''
}

function tightenValue(value) {
  return String(value || '').replace(/(北京市|天津市|上海市|重庆市)\1/g, '$1')
}

function isBlankValue(value) {
  const text = tightenValue(value)
  if (!text) return true
  return text.replace(/全部/g, '') === ''
}

/** 语音页是扁平列表，见面详情是按组嵌套，收成同一种行再按字段对齐 */
function flattenPairs(pairs) {
  const rows = []
  const groups = Array.isArray(pairs) ? pairs : []
  groups.forEach(function (entry) {
    const items = Array.isArray(entry) ? entry : [entry]
    items.forEach(function (item) {
      if (!item) return
      const value = tightenValue(String(item.value || '') + (item.subDesc || ''))
      if (isBlankValue(value)) return
      rows.push({
        label: shortLabel(item.desc || ''),
        value: value,
      })
    })
  })
  return rows
}

function alignRows(infoRows, requirementRows) {
  const infoMap = {}
  const requirementMap = {}
  infoRows.forEach(function (row) {
    if (row.label) infoMap[row.label] = row.value
  })
  requirementRows.forEach(function (row) {
    if (row.label) requirementMap[row.label] = row.value
  })
  const labels = []
  FIELD_ORDER.forEach(function (label) {
    if (infoMap[label] || requirementMap[label]) labels.push(label)
  })
  infoRows.concat(requirementRows).forEach(function (row) {
    if (row.label && labels.indexOf(row.label) === -1) labels.push(row.label)
  })
  return labels.map(function (label) {
    const infoValue = infoMap[label] || ''
    const requirementValue = requirementMap[label] || ''
    return {
      label: label,
      infoValue: infoValue || MISSING_MARK,
      requirementValue: requirementValue || MISSING_MARK,
      infoMissing: !infoValue,
      requirementMissing: !requirementValue,
    }
  })
}

function sameRows(left, right) {
  if (left.length !== right.length) return false
  for (let i = 0; i < left.length; i++) {
    if (left[i].label !== right[i].label) return false
    if (left[i].infoValue !== right[i].infoValue) return false
    if (left[i].requirementValue !== right[i].requirementValue) return false
  }
  return true
}

Component({
  properties: {
    infoPairs: {
      type: Array,
      value: [],
    },
    requirementPairs: {
      type: Array,
      value: [],
    },
    emptyText: {
      type: String,
      value: '',
    },
    infoTitle: {
      type: String,
      value: '',
    },
    requirementTitle: {
      type: String,
      value: '',
    },
  },

  data: {
    rows: [],
  },

  observers: {
    'infoPairs, requirementPairs': function (infoPairs, requirementPairs) {
      const rows = alignRows(flattenPairs(infoPairs), flattenPairs(requirementPairs))
      if (sameRows(this.data.rows, rows)) return
      console.log('资料对列刷新', rows.length)
      this.setData({ rows: rows })
    },
  },
})
