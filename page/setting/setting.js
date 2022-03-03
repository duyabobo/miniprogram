const config = require('../../config.js')
const request = require("../../util/request");

let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: { },

  logout: function () {
    wx.request({
      url: config.HTTP_HOST_TEST + config.loginUrl,
      method: 'PUT',
      data: {
        accessToken: app.globalData.accessToken,
      },
      success(res) {
        if (request.requestIsSuccess(res)) {
          app.globalData.hasLogin = false
          wx.reLaunch({
            url: config.GUANGUAN_PAGE,
          })
        }
      },
      fail(res) {
        request.logRequestErr("loginUrl err:", res)
      }
    })
  },

})