const config = require("../config");
const enumerate = require("./enumerate");

function normalUpdateRequest(that, url, data) {
  wx.request({
    url: url,
    data: data,
    success(res) {
      if (res.data.code === enumerate.SUCESS_CODE) {
        that.setData(res.data)  // 有性能问题
      }
      else {
        const errMsg = res.data.errMsg;
        console.log(errMsg)
        if (errMsg !== undefined) {
          wx.showToast({
            title: errMsg,
            icon: 'loading',
            duration: 800,
            mask: true
          })
        }
      }
    },
    fail(res) {
      console.log('normal_update fail')
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
      const app = getApp()
      app.globalData.accessToken = res.data.accessToken
      app.globalData.hasLogin = true
      wx.navigateTo({
        url: suc_uri,
      })
    },
    fail(res) {
      console.log('login fail')
    }
  })
}

function getGuanguanRequest(that, requestData) {
  wx.request({
    url: config.HTTP_HOST_TEST + config.guanguanUrl,
    data: requestData,
    success(res) {
      that.setData(res.data)
    },
    fail(res) {
      console.log('guanguan err')
      console.log(res)
    }
  })
}

module.exports = {
  normalUpdateRequest,
  loginRequest,
  getGuanguanRequest
}