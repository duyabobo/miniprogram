var config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  logout: function () {
    var app = getApp()
    wx.request({
      url: config.HTTP_HOST_TEST + config.login_url,
      method: 'PUT',
      data: {
        access_token: app.globalData.access_token,
      },
      success(res) {
        console.log('suc')
        app.globalData.hasLogin = false  
        wx.reLaunch({
          url: '/page/login/login',
        })
      },
      fail(res) {
        console.log('fail')
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp()
    var that = this
    if (!app.globalData.hasLogin) {
      wx.reLaunch({
        url: '/page/login/login'
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})