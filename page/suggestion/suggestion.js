var config = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: { 
  },

  formSubmit: function (e) {
    var suggestion = e.detail.value.suggestion
    var app = getApp() 
    var request_data = {
      access_token: app.globalData.access_token,
      suggestion_content: suggestion
    }
    wx.request({
      url: config.HTTP_HOST_TEST + config.suggestion_url,
      method: 'POST',
      data: request_data,
      success(res) {
        console.log('success')
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        }) 
      },
      fail(res) {
        console.log('err', res)
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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