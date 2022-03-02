const config = require("../config");
const enumerate = require("./enumerate");
const wxInteractive = require("./wx_interactive");

let app = getApp()

function normalUpdateRequest(that, url, data) {
  wx.request({
    url: url,
    method: 'PUT',
    data: data,
    success(res) {
      if (requestIsSuccess(res)) {
        that.setData(res.data.data)  // 有性能问题
      }
      else {
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
  wx.request({
    url: config.HTTP_HOST_TEST + config.loginUrl,
    data: {
      code: code,
    },
    success(res) {
      if (requestIsSuccess(res)) {
        app.globalData.accessToken = res.data.data.accessToken
        app.globalData.hasLogin = true
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
  wx.request({
    url: config.HTTP_HOST_TEST + config.guanguanUrl,
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

function requestIsSuccess(res) {
  return requestFinishWithCode(res, enumerate.SUCESS_CODE)
}

function requestFinishWithErr(res) {
  return res.statusCode === 200 && res.data.code !== enumerate.SUCESS_CODE
}

module.exports = {
  normalUpdateRequest,
  loginRequest,
  getGuanguanRequest,
  logRequestErr,
  requestFinishWithCode,
  requestIsSuccess,
  requestFinishWithErr
}