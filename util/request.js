const config = require("../config");

function normalUpdateRequest(that, url, data) {
  wx.request({
    url: url,
    data: data,
    success(res) {
      if (res.data.code === 0) {
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

function getGuanguan(that, requestData) {
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
  getGuanguan
}