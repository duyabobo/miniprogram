const assert = require('assert')
const { fillGuanguanList } = require('./mock_guanguan')

const NOW = new Date('2026-11-08T02:00:00')
const USER = { latitude: 39.9, longitude: 116.4 }

function item(id, startTime) {
  return {
    id: id,
    startTime: startTime,
    address: '活动' + id,
    latitude: 31.2,
    longitude: 121.5,
    heartKind: 'empty',
    progressStatus: 0,
  }
}

function testKeepsServerOrderAndDistantItems() {
  const list = fillGuanguanList([
    item(1, '2030-01-01 10:00'),
    { id: -1, address: '占位', time: 'YYYY-MM-DD HH:mm' },
    item(2, '2020-01-01 10:00'),
  ], USER, NOW, '登录后查看')
  assert.deepStrictEqual(list.map(function (row) { return row.id }), [1, -1, 2])
  assert.ok(list[0].friendlyTime)
  assert.strictEqual(list[1].friendlyTime, '登录后查看')
  assert.strictEqual(list[1].needLogin, true)
  assert.ok(list[2].friendlyTime)
}

function testEmptyListStaysEmpty() {
  assert.deepStrictEqual(fillGuanguanList(null, null, NOW), [])
}

testKeepsServerOrderAndDistantItems()
testEmptyListStaysEmpty()
