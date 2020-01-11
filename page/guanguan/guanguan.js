var config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    guan_info_url: "/page/guan_info/guan_info",
    question_list: [
      {
        id: 1,
        title: "问题标题，问题标题问题标题标题，问题标题问题标题，问题标题",
        classification: "分类分类",
        point: "+2个积分",
        answers: "10个参与",
        ctime: "1分钟前"
      },
      {
        id: 2,
        title: "问题标题",
        classification: "分分类",
        point: "+2个积分",
        answers: "10个参与",
        ctime: "10分钟前"
      },
      {
        id: 3,
        title: "问题标题",
        classification: "分类",
        point: "+2个积分",
        answers: "10个参与",
        ctime: "1小时前"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const app = getApp()
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
        }
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