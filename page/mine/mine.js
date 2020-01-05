// page/practice/practice.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    has_login: app.hasLogin, 
    head_img_url: '/resources/logo.png',
    nickname: '昵称',
    mobile: '133******55',
    verify_1: '',
    verify_2: '',
    verify_3: '',
    verify_4: '',
    verify_5: '',
    verify_6: '',
    user_info_detail_list: [
      {
        id: 1,
        url: '/page/detail_info/detail_info',
        name: '基本信息'
      },
      {
        id: 2,
        // url: '/page/expected_info/expected_info',
        name: '身份认证'
      },
      {
        id: 3,
        url: '/page/guan_point/guan_point',
        name: '关关积分'
      }
    ],
    func_group_list: [ 
      [
        {
          id: 1,
          name: '意见给我们',
        }, 
        {
          id: 2,
          name: '分享给好友',
        }
      ], 
      [
        {
          id: 4,
          name: '设置',
        }
      ]
    ]
  },

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.target.id)
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