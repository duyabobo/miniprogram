// page/practice/practice.js
var config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    unread_icon: '/resources/match/unread_flag.png',
    read_icon: '/resources/match/read_flag.png',
    match_list: [  // 以后有动态推荐和问答，都放到首位推荐，1.0版本暂时不支持在线问答和动态推荐
      {
        id: 0, 
        user_id: 34,
        chat_type: 'dating',
        user_name: '媒体组件', 
        user_img: '/resources/logo.png',
        verify_1: '/resources/image/pause.png',
        verify_2: '/resources/image/play.png',
        verify_3: '/resources/image/plus.png',
        verify_4: '/resources/image/stop.png',
        verify_5: '/resources/image/trash.png',
        verify_6: '/resources/image/trash.png',
        last_msg_time: '1分钟前',
        last_msg: '文本测试内容',
        url: '/page/chat/chat?',
        last_msg_is_unread: 1,
        unread_icon: ''
      },
      {
        id: 1,
        user_id: 2,
        chat_type: 'match',
        user_name: '开放能力', 
        user_img: '/resources/logo.png',
        verify_1: '/resources/image/pause.png',
        verify_2: '/resources/image/play.png',
        verify_3: '/resources/image/trash.png',
        verify_4: '/resources/image/trash.png',
        verify_5: '/resources/image/trash.png',
        verify_6: '/resources/image/trash.png',
        last_msg_time: '1分钟前',
        last_msg: '距离产生美',
        url: '/page/profile/profile?could_op=1&'
      }
    ] 
  },

  update_match_list: function (user_id, last_msg) {
    var match_list = this.data.match_list
    var unread_icon = this.data.unread_icon
    for (var index = 0; index < match_list.length; index ++ ) {
      if (match_list[index]['user_id'] == user_id) {
        match_list[index]['last_msg'] = last_msg 
        match_list[index]['unread_icon'] = unread_icon
        this.setData({
          match_list: match_list
        })
      }
    }
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
      var ws_url = config.WS_HOST_TEST + config.chat_url
      console.log(ws_url)
      wx.connectSocket({
        url: ws_url,
        header: {
          'access_token': app.globalData.access_token
        },
        success: (res) => {
          console.log("进入聊天", res)
        },
        fail: (err) => {
          wx.showToast({
            title: '网络异常！',
          })
          console.log(err)
        }
      }) 
      wx.onSocketOpen(function (res) {
      })
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

  click_match_item: function (event) { 
    var id = Number(event.currentTarget.dataset.id)
    this.setData({
      ['match_list[' + id + '].unread_icon']: this.data.read_icon
    })
    var chat_item = this.data.match_list[id]
    var url = chat_item.url + 'to_user_id=' + chat_item.user_id
    wx.navigateTo({
      url: url,
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
    var that = this
    var match_list = this.data.match_list
    var unread_icon = that.data.unread_icon
    for (var index = 0; index < match_list.length; index++) {
      if (match_list[index]['last_msg_is_unread']) { 
        match_list[index]['unread_icon'] = unread_icon
        match_list[index]['last_msg_is_unread'] = 0
        this.setData({
          match_list: match_list
        })
      }
    }
    wx.onSocketMessage(function (res) {
      var message_json = JSON.parse(res.data) 
      var message_content = message_json['message_content']
      var from_user_id = message_json['from_user_id'] 
      that.update_match_list(from_user_id, message_content)
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