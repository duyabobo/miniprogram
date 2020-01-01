var config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  login: function () {
    wx.login({
      success(res) {
        if (res.code) {
          // 发起网络请求
          wx.request({
            url: config.HTTP_HOST_TEST + config.login_url,
            data: {
              code: res.code,
            },
            success(res) {
              const app = getApp()
              app.globalData.access_token = res.data.access_token
              app.globalData.hasLogin = true  
              console.log(res.data.current_user_info.sex)
              var sex = res.data.current_user_info.sex
              var age = res.data.current_user_info.age
              var degree = res.data.current_user_info.degree
              var height = res.data.current_user_info.height
              var user_info_type = 0
              if (sex == -1) {
                user_info_type = 1
              } else if (degree == -1) {
                user_info_type = 2
              } else if (height == 0) {
                user_info_type = 3
              } else if (age > 40) {
                user_info_type = 4
              }  
              if (user_info_type) {
                wx.redirectTo({
                  url: '/page/base_user_info/base_user_info?user_info_type=' + user_info_type
                })
              } else {
                wx.reLaunch({
                  url: '/page/dating/dating',
                })
              }
            },
            fail(res) {
              console.log('fail')
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
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