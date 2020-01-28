var config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: { 
    guanguan_list: []
  },

  getPhoneNumber(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
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
    const app = getApp()
    var that = this
    if (!app.globalData.hasLogin) {
      wx.redirectTo({
        url: '/page/login/login'
      })
    } else {
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          const latitude = res.latitude
          const longitude = res.longitude
          const speed = res.speed
          const accuracy = res.accuracy
          console.log(latitude)
          console.log(longitude)
        }
      })
      var request_data = {
        access_token: app.globalData.access_token
      }
      wx.request({
        url: config.HTTP_HOST_TEST + config.guanguan_url,
        data: request_data,
        success(res) {
          that.setData({
            guanguan_list: res.data.guanguan_list
          })
        },
        fail(res) {
          console.log('guanguan err')
          console.log(res)
        }
      })
    }
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