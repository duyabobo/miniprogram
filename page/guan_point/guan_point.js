var config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    guan_point: '',
    information_1: '',
    information_2: '',
    point_background: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp()
    var that = this
    wx.request({
      url: config.HTTP_HOST_TEST + config.user_url,
      data: {
        access_token: app.globalData.access_token
      },
      method: 'GET',
      success(res) {
        var guan_point = res.data.guan_point
        var information_1 = res.data.information_1
        var information_2 = res.data.information_2
        var point_background = res.data.point_background
        console.log('point_background', res)
        that.setData(
          {
            guan_point: guan_point,
            information_1: information_1,
            information_2: information_2,
            point_background: point_background
          }
        )
      },
      fail(res) {
        console.log('guan point err')
      }
    })
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