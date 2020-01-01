var config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {   
    question: '',
    answers: [],
    back_icon: "",
    front_icon: "",
    user_info_type: 1,
    user_info_key: '',
    max_user_info_step: -1,
    match_url: "/page/match/match",
    left_icon: "/resources/base_user_info/left.png",
    right_icon: "/resources/base_user_info/right.png",
    white_icon: "/resources/base_user_info/no_direction.png",
    question_background: "/resources/base_user_info/question_background.png",
    question_dict: {
      1: '你的性别 1/4',
      2: '你的学历 2/4',
      3: '你的身高(cm) 3/4',
      4: '你的年龄(岁) 4/4'
    },
    user_info_key_dict: {
      1: 'sex',
      2: 'degree',
      3: 'height',
      4: 'age'
    },
    answer_dict: {
      1: [
        {
          'key': '女',
          'value': 0,
        },
        {
          'key': '男',
          'value': 1,
        }
      ],
      2: [
        {
          'key': '小学',
          'value': 0,
        },
        {
          'key': '中学',
          'value': 1,
        },
        {
          'key': '高中',
          'value': 2,
        },
        {
          'key': '专科',
          'value': 3,
        },
        {
          'key': '本科',
          'value': 4,
        },
        {
          'key': '研究生',
          'value': 5,
        },
        {
          'key': '博士',
          'value': 6,
        },
        {
          'key': '博士后',
          'value': 7,
        },
      ],
      3: [
        {
          'key': 140,
          'value': 140,
        },
        {
          'key': 145,
          'value': 145,
        },
        {
          'key': 150,
          'value': 150,
        },
        {
          'key': 155,
          'value': 155,
        },
        {
          'key': 160,
          'value': 160,
        },
        {
          'key': 165,
          'value': 165,
        },
        {
          'key': 170,
          'value': 170,
        },
        {
          'key': 175,
          'value': 175,
        },
        {
          'key': 180,
          'value': 180,
        },
        {
          'key': 185,
          'value': 185,
        },
        {
          'key': 190,
          'value': 190,
        },
        {
          'key': 195,
          'value': 195,
        },
      ],
      4: [
        {
          'key': 18,
          'value': 18,
        },
        {
          'key': 19,
          'value': 19,
        },
        {
          'key': 20,
          'value': 20,
        },
        {
          'key': 21,
          'value': 21,
        },
        {
          'key': 22,
          'value': 22,
        },
        {
          'key': 23,
          'value': 23,
        },
        {
          'key': 24,
          'value': 24,
        },
        {
          'key': 25,
          'value': 25,
        },
        {
          'key': 26,
          'value': 26,
        },
        {
          'key': 27,
          'value': 27,
        },
        {
          'key': 28,
          'value': 28,
        },
        {
          'key': 29,
          'value': 28,
        },
        {
          'key': 30,
          'value': 30,
        },
        {
          'key': 31,
          'value': 31,
        },
        {
          'key': 32,
          'value': 32,
        },
        {
          'key': 33,
          'value': 33,
        },
        {
          'key': 34,
          'value': 34,
        },
        {
          'key': 35,
          'value': 35,
        },
        {
          'key': 36,
          'value': 36,
        },
        {
          'key': 37,
          'value': 37,
        },
        {
          'key': 38,
          'value': 38,
        },
        {
          'key': 39,
          'value': 39,
        },
      ]
    } 
  },

  resetData: function (that, user_info_type) {
    var val_data_dict = {
       'user_info_type': user_info_type, 
       'back_icon': this.data.left_icon,
       'front_icon': this.data.right_icon
    } 
    if (user_info_type == 1) {
      val_data_dict['back_icon'] = this.data.white_icon
      val_data_dict['front_icon'] = this.data.white_icon
    }
    if (user_info_type == 4) {
      val_data_dict['front_icon'] = this.data.white_icon
    }
    if (user_info_type >= that.data.max_user_info_step) {
      val_data_dict['front_icon'] = this.data.white_icon
      val_data_dict['max_user_info_step'] = user_info_type
    }
    val_data_dict['question'] = this.data.question_dict[user_info_type]
    val_data_dict['answers'] = this.data.answer_dict[user_info_type]
    val_data_dict['user_info_key'] = this.data.user_info_key_dict[user_info_type]
    that.setData(val_data_dict)
  },

  change_step: function (event) {
    var user_info_type = Number(this.data.user_info_type)
    var incr = Number(event.target.dataset.incr) 
    var max_user_info_step = Number(this.data.max_user_info_step)
    if (user_info_type == 1) { 
      return
    }
    if (user_info_type == 4 && incr == 1) {
      return
    }
    console.log(max_user_info_step)
    console.log(user_info_type)
    if (user_info_type <= max_user_info_step && user_info_type + incr <= max_user_info_step) {
      var that = this
      user_info_type = user_info_type + incr  
      this.resetData(that, user_info_type)
    }
  }, 

  change_base_user_info: function (event) {
    var user_info_type = event.target.dataset.user_info_type
    var key = event.target.dataset.key
    var value = event.target.dataset.value
    var app = getApp()
    var that = this
    var request_data = {
      access_token: app.globalData.access_token
    }
    request_data[key] = value 
    wx.request({
      url: config.HTTP_HOST_TEST + config.update_user_url,
      method: 'POST',
      data: request_data,
      success(res) {
        console.log('succ')
        if (user_info_type == 4) {
          wx.reLaunch({ url: '/page/match/match' })
        } else {
          user_info_type = Number(user_info_type) + Number(1)
          that.resetData(that, user_info_type) 
        }
      },
      fail(res) {
        console.log('err')
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var user_info_type = options.user_info_type
    var that = this
    this.resetData(that, user_info_type)
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
