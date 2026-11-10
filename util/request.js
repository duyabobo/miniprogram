const config = require("../config");
const enumerate = require("./enumerate");
const util = require("./util")
const md5 = require("./md5")
const base64 = require("./base64")
const {RESP_SIGN_INVALID} = require("./enumerate");

const LOGIN_REQUEST_TIMEOUT_MS = 20000

function getContentFromQuery(data, sep) {
  if (typeof (data) == "string") {
    return base64.Base64.encode(data)
  }
  if (typeof (data) == "number") {
    return base64.Base64.encode(data.toString())
  }
  if (typeof (data) == "object") {
    let sortedKeys = Object.keys(data).sort()
    let contentList = []
    for (var i = 0; i < sortedKeys.length; i++) {
      let k = sortedKeys[i]
      contentList[i] = getContentFromQuery(k, sep) + sep + getContentFromQuery(data[k], sep)
    }
    return contentList.join(sep)
  }
  return ""
}

const myRequest = function (requestConfig = {}) {
  requestConfig.data.requestSeq = util.randomString()
  requestConfig.data.accessToken = wx.getStorageSync('accessToken')
  var contentDict = JSON.parse(JSON.stringify(requestConfig.data))
  var method = requestConfig.method
  if (typeof(method) == "undefined") {
    method = 'GET' 
  }
  contentDict.path = requestConfig.url
  contentDict.method = method
  contentDict.secret = wx.getStorageSync('secret')
  var content = getContentFromQuery(contentDict, "|")
  let sign = md5.hex_md5(content)
  requestConfig.url = config.HTTP_HOST_TEST + requestConfig.url
  var header = requestConfig.header || {}
  header.sign = sign
  requestConfig.header = header

  let localFail = requestConfig.fail
  requestConfig.fail = function (res) {
    if (typeof localFail === 'function') {
      localFail(res)
    }
    logRequestErr(requestConfig.url + " err:", res)
  }

  let localSuccess = requestConfig.success
  requestConfig.success = function (res) {
    localSuccess(res)
    if (requestFinishWithCode(res, RESP_SIGN_INVALID)) {
      wx.setStorageSync('hasLogin', false)
      wx.setStorageSync('accessToken', "")
      wx.setStorageSync('secret', "")
      wx.setStorageSync('openid', "")
      wx.setStorageSync('passportId', "")
      wx.setStorageSync('phoneBound', false)
    }
  }
  wx.request(requestConfig);
}

function simplePostRequest(url, data) {  // 简单查询请求，不会刷新页面data数据，不会触发弹框。
  myRequest({
    url: url,
    method: 'POST',
    data: data,
    success(res) {
    }
  })
}

function normalUpdateRequest(that, url, data) {
  console.log(data)
  myRequest({
    url: url,
    method: 'PUT',
    data: data,
    success(res) {
      if (requestIsSuccess(res)) {
        that.setData(res.data.data)  // 有性能问题
      } else if (requestFinishBiggerThanCode(res, enumerate.GUAN_SUCCESS_WITH_NOTI_MIN_CODE)) {
        that.setData(res.data.data)
        wx.showModal({
          title: res.data.errMsg,
          showCancel: false,
          confirmText: '确认',
        })
      } else {
        wx.showModal({
          title: res.data.errMsg,
          showCancel: false,
          confirmText: '确认',
        })
      }
    }
  })
}

function loginFailed(res, onFail) {
  const detail = (res && res.data && res.data.errMsg) || (res && res.errMsg) || ''
  console.log('登录没有完成', detail)
  if (typeof onFail === 'function') onFail()
  wx.showModal({
    title: '登录没有完成',
    content: detail || '请再试一次',
    showCancel: false,
    confirmText: '知道了',
  })
}

function loginRequest(code, sucJumpFunc, onFail) {
  let sharePassportId = wx.getStorageSync('sharePassportId')
  console.log('提交微信登录 codeLen=%s', code ? String(code).length : 0)
  myRequest({
    url: config.loginUrl,
    method: 'POST',
    timeout: LOGIN_REQUEST_TIMEOUT_MS,
    header: {
      'content-type': 'application/json',
    },
    data: {
      code: code,
      sharePassportId: sharePassportId || '',
    },
    success(res) {
      if (requestIsSuccess(res)) {
        wx.setStorageSync('accessToken', res.data.data.accessToken)
        wx.setStorageSync('secret', res.data.data.secret)
        wx.setStorageSync('openid', res.data.data.openid)
        wx.setStorageSync('passportId', res.data.data.passportId)
        wx.setStorageSync('hasLogin', true)
        wx.setStorageSync('phoneBound', !!(res.data.data && res.data.data.phoneBound))
        if (typeof sucJumpFunc === 'function') sucJumpFunc()
        return
      }
      loginFailed(res, onFail)
    },
    fail(res) {
      loginFailed(res, onFail)
    }
  })
}

function sendPhoneCodeRequest(phone, done) {
  myRequest({
    url: config.phoneCodeUrl,
    method: 'POST',
    data: {
      phone: phone,
    },
    success(res) {
      if (requestIsSuccess(res)) {
        done((res.data.data && res.data.data.retryAfter) || 0)
        return
      }
      wx.showToast({
        title: (res.data && res.data.errMsg) || '验证码没有发出',
        icon: 'none',
      })
    }
  })
}

function bindPhoneRequest(phone, code, done) {
  myRequest({
    url: config.phoneUrl,
    method: 'POST',
    data: {
      phone: phone,
      code: code,
    },
    success(res) {
      if (requestIsSuccess(res)) {
        wx.setStorageSync('phoneBound', true)
        done()
        return
      }
      wx.showToast({
        title: (res.data && res.data.errMsg) || '验证码不正确',
        icon: 'none',
      })
    }
  })
}

function getGuanguanRequest(that, requestData, stamp) {
  myRequest({
    url: config.guanguanUrl,
    data: requestData,
    success(res) {
      if (stamp !== that._listStamp) return
      if (requestIsSuccess(res)) {
        // 首页自己决定用接口列表还是预览数据
        if (typeof that.applyGuanguanData === 'function') {
          that.applyGuanguanData(res.data.data)
        } else {
          that.setData(res.data.data)
        }
      }
    }
  })
}

function signedForm(url, method, formData) {
  formData.requestSeq = util.randomString()
  formData.accessToken = wx.getStorageSync('accessToken')
  var contentDict = JSON.parse(JSON.stringify(formData))
  contentDict.path = url
  contentDict.method = method
  contentDict.secret = wx.getStorageSync('secret')
  return {
    header: { sign: md5.hex_md5(getContentFromQuery(contentDict, "|")) },
    formData: formData,
  }
}

function logRequestErr(msg, res) {
  console.log(msg + JSON.stringify(res))
}

function requestFinishWithCode(res, code) {
  return res.statusCode === 200 && res.data.code === code
}

function requestFinishBiggerThanCode(res, code) {
  return res.statusCode === 200 && res.data.code > code
}

function requestIsSuccess(res) {
  return requestFinishWithCode(res, enumerate.SUCESS_CODE)
}

function requestFinishWithErr(res) {
  return res.statusCode === 200 && res.data.code !== enumerate.SUCESS_CODE
}

module.exports = {
  myRequest,
  signedForm,
  normalUpdateRequest,
  loginRequest,
  loginFailed,
  sendPhoneCodeRequest,
  bindPhoneRequest,
  getGuanguanRequest,
  simplePostRequest,
  logRequestErr,
  requestFinishWithCode,
  requestIsSuccess,
  requestFinishWithErr,
  requestFinishBiggerThanCode
}