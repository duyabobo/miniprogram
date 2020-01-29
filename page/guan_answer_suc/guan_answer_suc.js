var config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    guan_id: 0,
    guan_point: 0,
  },

  confirm: function () {
    var that = this
    var app = getApp()
    wx.request({
      url: config.HTTP_HOST_TEST + config.guanpoint_url,
      data: {
        access_token: app.globalData.access_token,
        guan_id: that.data.guan_id
      },
      method: 'POST',
      success(res) {
        wx.reLaunch({ url: '/page/guanguan/guanguan' })
      },
      fail(res) {
        console.log('guan point err')
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var guan_id = options.guan_id
    var guan_point = options.guan_point
    this.setData({ guan_id: guan_id, guan_point: guan_point})
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