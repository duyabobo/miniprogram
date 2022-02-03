const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    has_login: true
  },

  logout: function () {
    let app = getApp()
    wx.request({
      url: config.HTTP_HOST_TEST + config.loginUrl,
      method: 'PUT',
      data: {
        access_token: app.globalData.accessToken,
      },
      success(res) {
        console.log('suc')
        app.globalData.hasLogin = false  
        wx.reLaunch({
          url: config.GUANGUAN_PAGE,
        })
      },
      fail(res) {
        console.log('fail')
      }
    })
  },
})