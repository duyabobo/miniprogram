const assert = require('assert')

const storage = {}
const modals = []
let loginCall = null
let requestCall = null
let loading = false

global.wx = {
  login(options) { loginCall = options },
  request(options) { requestCall = options },
  getStorageSync(key) { return storage[key] || '' },
  setStorageSync(key, value) { storage[key] = value },
  showModal(options) { modals.push(options) },
  showLoading() { loading = true },
  hideLoading() { loading = false },
  navigateTo() {},
}

const wxLogin = require('./wx_login')

function loginPayload() {
  return {
    statusCode: 200,
    data: {
      code: 0,
      data: {
        accessToken: 'token',
        secret: 'secret',
        openid: 'openid',
        passportId: 9,
        phoneBound: false,
      },
    },
  }
}

function testLoginSuccess() {
  let done = false
  wxLogin.startWxLogin(function () { done = true })
  assert.strictEqual(loading, false)
  assert.strictEqual(loginCall.timeout, undefined)
  loginCall.success({ code: 'code-1' })
  assert.strictEqual(loading, true)
  assert.strictEqual(requestCall.timeout, 20000)
  assert.strictEqual(requestCall.method, 'POST')
  assert.strictEqual(requestCall.data.code, 'code-1')
  assert.strictEqual(requestCall.data.sharePassportId, '')
  assert.strictEqual(requestCall.header['content-type'], 'application/json')
  assert.ok(requestCall.header.sign)
  assert.ok(requestCall.url.endsWith('/login'))
  assert.strictEqual(requestCall.url.includes('code='), false)
  requestCall.success(loginPayload())
  assert.strictEqual(done, true)
  assert.strictEqual(loading, false)
  assert.strictEqual(storage.hasLogin, true)
  assert.strictEqual(storage.accessToken, 'token')
  assert.strictEqual(storage.passportId, 9)
}

function testLoginWithoutCode() {
  let failed = false
  requestCall = null
  wxLogin.startWxLogin(null, function () { failed = true })
  loginCall.success({})
  assert.strictEqual(requestCall, null)
  assert.strictEqual(failed, true)
  assert.strictEqual(loading, false)
  assert.strictEqual(modals[modals.length - 1].title, '登录没有完成')
  assert.strictEqual(modals[modals.length - 1].content, '请再试一次')
}

function testWxLoginFail() {
  let failed = false
  let done = false
  requestCall = null
  wxLogin.startWxLogin(function () { done = true }, function () { failed = true })
  loginCall.fail({ errMsg: 'login:fail timeout' })
  assert.strictEqual(requestCall, null)
  assert.strictEqual(failed, true)
  assert.strictEqual(done, false)
  assert.strictEqual(loading, false)
  assert.strictEqual(modals[modals.length - 1].content, 'login:fail timeout')
}

function testLoginRequestFail() {
  let failed = false
  let done = false
  wxLogin.startWxLogin(function () { done = true }, function () { failed = true })
  loginCall.success({ code: 'code-3' })
  assert.strictEqual(loading, true)
  requestCall.fail({ errMsg: 'request:fail timeout' })
  assert.strictEqual(done, false)
  assert.strictEqual(failed, true)
  assert.strictEqual(loading, false)
  assert.strictEqual(modals[modals.length - 1].content, 'request:fail timeout')
}

function testLoginRejected() {
  let failed = false
  let done = false
  storage.hasLogin = false
  wxLogin.startWxLogin(function () { done = true }, function () { failed = true })
  loginCall.success({ code: 'code-2' })
  requestCall.success({ statusCode: 200, data: { code: 1002, errMsg: '需要登录' } })
  assert.strictEqual(failed, true)
  assert.strictEqual(done, false)
  assert.strictEqual(loading, false)
  assert.strictEqual(storage.hasLogin, false)
  assert.strictEqual(modals[modals.length - 1].content, '需要登录')
}

function testMissingCallback() {
  wxLogin.startWxLogin()
  loginCall.fail({ errMsg: 'login:fail' })
  assert.strictEqual(loading, false)
}

testLoginSuccess()
testLoginWithoutCode()
testWxLoginFail()
testLoginRequestFail()
testLoginRejected()
testMissingCallback()
console.log('wx_login tests ok')
