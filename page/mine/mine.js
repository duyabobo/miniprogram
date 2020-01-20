var config = require('../../config.js')

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    has_login: app.hasLogin, 
    mobile: '',
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
    var sex = -1
    var mobile = ''
    var that = this
    var request_data = {
      access_token: app.globalData.access_token 
    }
    wx.request({
      url: config.HTTP_HOST_TEST + config.userinfo_url,
      data: request_data,
      success(res) {
        sex = res.data.sex_int
        mobile = res.data.mobile
        var head_img_url = that.data.head_img_url
        console.log(sex)
        console.log(mobile)
        if (sex in [0, 1]) {
          var head_img_url = {
            0: '/resources/girl.jpg',
            1: '/resources/boy.jpg'
          }[sex]
        }
        that.setData({
          head_img_url: head_img_url,
          mobile: mobile
        })
      },
      fail(res) {
        console.log('login fail')
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