const request = require('./request')

function phoneIsBound(page) {
  if (page.data.phoneBound === true || page.data.phoneBound === false) {
    return page.data.phoneBound
  }
  return !!wx.getStorageSync('phoneBound')
}

function rememberBound(bound) {
  wx.setStorageSync('phoneBound', !!bound)
}

/** 未登录先登录。未绑定则打开页面上的 phoneGate，绑定成功后再执行 done。 */
function requireBound(page, done) {
  const openGate = function () {
    if (phoneIsBound(page)) {
      done()
      return
    }
    page._afterPhone = done
    page.setData({ phoneGate: true })
  }
  if (wx.getStorageSync('hasLogin')) {
    openGate()
    return
  }
  wx.login({
    success(res) {
      if (!res.code) {
        wx.showToast({ title: '登录没有完成', icon: 'none' })
        return
      }
      request.loginRequest(res.code, openGate)
    }
  })
}

function onPhoneBound(page) {
  const next = page._afterPhone
  page._afterPhone = null
  rememberBound(true)
  page.setData({ phoneGate: false, phoneBound: true })
  if (next) next()
}

function closePhoneGate(page) {
  page._afterPhone = null
  page.setData({ phoneGate: false })
}

function markUnbound(page) {
  rememberBound(false)
  page.setData({ phoneBound: false, phoneGate: true })
}

module.exports = {
  phoneIsBound,
  rememberBound,
  requireBound,
  onPhoneBound,
  closePhoneGate,
  markUnbound,
}
