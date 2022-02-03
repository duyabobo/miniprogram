const config = require("../config");
const enumerate = require("./enumerate");
const wxInteractive = require("./wx_interactive");

let app = getApp()

function normalUpdateRequest(that, url, data) {
  wx.request({
    url: url,
    data: data,
    success(res) {
      if (requestIsSuccess(res)) {
        that.setData(res.data)  // 有性能问题
      }
      else {
        wxInteractive.wxCheckToast(res.data.errMsg)
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
        app.globalData.accessToken = res.data.accessToken
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
        that.setData(res.data)
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