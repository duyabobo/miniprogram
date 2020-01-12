var config = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_info_list: [
      {
        'key': '哈哈',
        'value': 0,
      },
      {
        'key': '一下',
        'value': 30,
      },
      {
        'key': '测试',
        'value': 30,
      }   
    ]
  },

  user_info_click: function (options) {
    wx.showActionSheet({
      itemList: ['A', 'B', 'C'],
      success(res) {
        console.log(res.tapIndex)
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp()
    var that = this
    wx.request({
      url: config.HTTP_HOST_TEST + config.user_info_url,
      method: 'GET',
      data: {
        access_token: app.globalData.access_token,
      },
      success(res) {
        var ret_data = res.data
        var user_info_data = {
          user_info_list: [
            {
              key: '性别',
              value: ret_data.sex
            },
            {
              key: '学历',
              value: ret_data.degree
            },
            {
              key: '身高',
              value: ret_data.height + 'cm'
            },
            {
              key: '年龄',
              value: ret_data.age
            }
          ]
        }
        that.setData(user_info_data)
      },
      fail(res) {
        console.log('fail of user_info')
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