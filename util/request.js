const config = require("../config");
const enumerate = require("./enumerate");
const util = require("./util")
const md5 = require("./md5")
const base64 = require("./base64")
const {RESP_SIGN_INVALID} = require("./enumerate");

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
  requestConfig.header={
    'sign': sign
  }

  let localFail = requestConfig.fail
  requestConfig.fail = function (res) {
    localFail(res)
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

function loginRequest(code, sucJumpFunc) {
  let shareOpenid = wx.getStorageSync('shareOpenid');
  myRequest({
    url: config.loginUrl,
    data: {
      code: code,
      shareOpenid: shareOpenid,
    },
    success(res) {
      if (requestIsSuccess(res)) {
        wx.setStorageSync('accessToken', res.data.data.accessToken)
        wx.setStorageSync('secret', res.data.data.secret)
        wx.setStorageSync('openid', res.data.data.openid)
        wx.setStorageSync('hasLogin', true)
        sucJumpFunc()
      }
    }
  })
}

function getLocationAllowState(that, requestData) {
  myRequest({
    url: config.locationStateUrl,
    data: requestData,
    success(res) {
      if (requestIsSuccess(res)) {
        that.setData(res.data.data)
      }
    }
  })
}

function getGuanguanRequest(that, requestData) {
  myRequest({
    url: config.guanguanUrl,
    data: requestData,
    success(res) {
      if (requestIsSuccess(res)) {
        that.setData(res.data.data)
      }
    }
  })
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
  normalUpdateRequest,
  loginRequest,
  getLocationAllowState,
  getGuanguanRequest,
  simplePostRequest,
  logRequestErr,
  requestFinishWithCode,
  requestIsSuccess,
  requestFinishWithErr,
  requestFinishBiggerThanCode
}