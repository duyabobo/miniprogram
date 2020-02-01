// page/guan_evaluation/guan_evaluation.js
var config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    guan_evaluations: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var answer_user_id = options.answer_user_id
    var app = getApp()
    var request_data = {
      access_token: app.globalData.access_token,
      answer_user_id: answer_user_id
    }
    var that = this
    wx.request({
      url: config.HTTP_HOST_TEST + config.evaluation_url,
      data: request_data,
      success(res) {
        that.setData(res.data)
      },
      fail(res) {
        console.log('guan_evaluation err')
        console.log(res)
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
