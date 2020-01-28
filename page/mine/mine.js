var config = require('../../config.js')

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    has_login: app.hasLogin, 
    head_img_url: '/resources/unknown.jpg',
    func_group_list: [ 
      [
        {
          id: 1,
          img_url: '/resources/foursquare.png',
          url: '/page/guan_evaluation/guan_evaluation',
          name: '我的关关'
        },
        {
          id: 2,
          img_url: '/resources/diamond.png',
          url: '/page/guan_point/guan_point',
          name: '我的积分'
        }
      ],
      [
        {
          id: 1,
          img_url: '/resources/triangle.png',
          url: '/page/suggestion/suggestion',
          name: '意见给我们',
        }, 
        {
          id: 2,
          img_url: '/resources/cicle.png',
          url: '/page/share/share',
          name: '分享给好友',
        }
      ], 
      [
        {
          id: 4,
          img_url: '/resources/octagon.png',
          url: '/page/setting/setting',
          name: '设置',
        }
      ]
    ]
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
    var that = this
    var request_data = {
      access_token: app.globalData.access_token,
      guan_info_id: 1 
    }
    wx.request({
      url: config.HTTP_HOST_TEST + config.guananswer_url,
      data: request_data,
      success(res) {
        var answer_info_id = res.data.answer_info_id 
        var head_img_url = that.data.head_img_url
        var head_img_url = {
          0: '',
          1: '/resources/girl.jpg',
          2: '/resources/boy.jpg'
        }[answer_info_id]
        that.setData({
          head_img_url: head_img_url
        })
      },
      fail(res) {
        console.log('user_info fail')
      }
    })
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