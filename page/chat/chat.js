// pages/chat/chat.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    to_user_id: 0,
    left_image: "/resources/logo.png",
    right_image: "/resources/logo.png", 
    message_content: "",
    message_length: 12,
    last_message_id: 'm11',
    message_list: [
      {
        message_id: 'm0',
        position: "right",
        message_content: "街坊邻居法拉盛就发；地方街坊邻居地方街坊邻居法拉盛就发；地方abddsafkjsdlfj;街坊邻居法拉盛就发；地方abddsafkj abddsafkjabd dsafkja bddsafkjabddsafkj",
      },
      {
        message_id: 'm1',
        position: "left",
        message_content: "街坊邻居法拉盛就发；"
      },
      {
        message_id: 'm2',
        position: "right",
        message_content: "地方街坊邻居法拉盛地方街坊邻居"
      },
      {
        message_id: 'm3',
        position: "left",
        message_content: "街坊邻居法拉盛就发；地方街坊邻居居法拉盛就发；地方"
      },
      {
        message_id: 'm4',
        position: "right",
        message_content: "地方街坊邻居法拉盛地方街坊邻居"
      },
      {
        message_id: 'm5',
        position: "left",
        message_content: "街坊邻居法拉盛就发；地方街坊邻居居法拉盛就发；地方"
      },
      {
        message_id: 'm6',
        position: "right",
        message_content: "地方街坊邻居法拉盛地方街坊邻居"
      },
      {
        message_id: 'm7',
        position: "left",
        message_content: "街坊邻居法拉盛就发；地方街坊邻居居法拉盛就发；地方"
      },
      {
        message_id: 'm8',
        position: "right",
        message_content: "地方街坊邻居法拉盛地方街坊邻居"
      },
      {
        message_id: 'm9',
        position: "left",
        message_content: "街坊邻居法拉盛就发；地方街坊邻居居法拉盛就发；地方"
      },
      {
        message_id: 'm10',
        position: "right",
        message_content: "地方街坊邻居法拉盛地方街坊邻居"
      },
      {
        message_id: 'm11',
        position: "left",
        message_content: "街坊邻居法拉盛就发；地方街坊邻居居法拉盛就发；地方"
      }
    ]
  }, 

  // 聊天历史更新
  update_message_list: function (message_content, message_id, position='right') {
    var data = {} 
    var next_message_key = 'message_list[' + this.data.message_length + ']' 
    data[next_message_key] = {
      position: position,
      message_content: message_content,
      message_id: message_id
    }
    this.setData(data)
    this.setData({
      'message_length': this.data.message_length + 1,
      'last_message_id': message_id
    })
  },

  // 发送消息
  send_message: function (event) {  
    var message_content = event.detail.value.message_content
    var message_id = Math.random().toString(36).substr(2, 15)
    var msg = {
      access_token: this.data.access_token,
      message_content: message_content,
      message_id: message_id,
      to_user_id: this.data.to_user_id
    }
    wx.sendSocketMessage({
      data: JSON.stringify(msg)
    })
    this.setData({ message_content: ''})
    message_id = 'local_' + message_id
    this.update_message_list(message_content, message_id)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp()
    this.setData({ access_token: app.globalData.access_token})
    this.setData({ to_user_id: options.to_user_id })
    console.log(options.to_user_id)
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
    wx.onSocketMessage(function (res) {
      var message_json = JSON.parse(res.data)
      var message_id = message_json['message_id']
      var message_content = message_json['message_content']
      message_id = 'remote_' + message_id
      that.update_message_list(message_content, message_id, 'left')
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