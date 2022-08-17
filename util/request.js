const config = require("../config");
const enumerate = require("./enumerate");
const util = require("./util")
const md5 = require("./md5")
const base64 = require("./base64")

const myRequest = function (requestConfig = {}) {
  requestConfig.data.requestSeq = util.randomString()
  requestConfig.data.accessToken = wx.getStorageSync('accessToken')
  var contentDict = JSON.parse(JSON.stringify(requestConfig.data))
  console.log(contentDict)
  var method = requestConfig.method
  if (typeof(method) == "undefined") {
    method = 'GET' 
  }
  contentDict.path = requestConfig.url
  contentDict.method = method
  contentDict.secret = wx.getStorageSync('secret')
  var sortedKeys = Object.keys(contentDict).sort();　　
  var content = ""
  for (var i = 0; i < sortedKeys.length; i++) {
    var key = base64.Base64.encode(sortedKeys[i])
    var value = base64.Base64.encode(contentDict[sortedKeys[i]].toString())
    if (content === "") {
      content = key + "|" + value
    } else {
      content = content + "|" + key + "|" + value
    }
  }
  let sign = md5.hex_md5(content)
  requestConfig.url = config.HTTP_HOST_TEST + requestConfig.url
  requestConfig.header={
    'sign': sign
  }
  wx.request(requestConfig);
}

function simplePostRequest(url, data) {  // 简单查询请求，不会刷新页面data数据，不会触发弹框。
  myRequest({
    url: url,
    method: 'POST',
    data: data,
    success(res) {
    },
    fail(res) {
      logRequestErr(url + " err:", res)
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
    },
    fail(res) {
      logRequestErr(url + " err:", res)
    }
  })
}

function loginRequest(code, suc_uri) {
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
        wx.setStorageSync('openid', res.data.data.currentUserInfo.openid)
        wx.setStorageSync('hasLogin', true)
        wx.navigateTo({
          url: suc_uri,
        })
      }
    },
    fail(res) {
      logRequestErr("loginUrl err:", res)
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
    },
    fail(res) {
      logRequestErr("guanguanUrl err:", res)
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
  getGuanguanRequest,
  simplePostRequest,
  logRequestErr,
  requestFinishWithCode,
  requestIsSuccess,
  requestFinishWithErr,
  requestFinishBiggerThanCode
}