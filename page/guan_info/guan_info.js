var config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 默认数据
    guanguan_url: "/page/guanguan/guanguan",
    left_icon: "/resources/left.png",
    right_icon: "/resources/right.png",
    white_icon: "/resources/no_direction.png",
    question_background: "/resources/question_background.png",
    // reset_data 计算数据
    step: 1,
    max_step: -1,
    question: '',
    answers: [],
    back_icon: "",
    front_icon: "", 
    // request 请求数据
    total_step: 4,
    service_url: '/user_info',
    question_dict: {
      1: '你的性别 1/4',
      2: '你的学校 2/4',
      3: '你的身高(cm) 3/4',
      4: '你的年龄(岁) 4/4'
    }, 
    answer_dict: {
      1: [
        {
          'key': '女',  // 展示数据
          'value': 0,  // 入库数据
        },
        {
          'key': '男',
          'value': 1,
        }
      ],
      2: [
        {
          'key': '专科',
          'value': 0,
        },
        {
          'key': '三本',
          'value': 1,
        },
        {
          'key': '二本',
          'value': 2,
        },
        {
          'key': '一本',
          'value': 3,
        },
        {
          'key': '双一流',
          'value': 4,
        },
        {
          'key': '国外大学',
          'value': 5,
        } 
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

  resetData: function (that, step) {
    var val_data_dict = {
       'step': step, 
       'back_icon': that.data.left_icon,
       'front_icon': that.data.right_icon
    } 
    if (step == 1) {
      val_data_dict['back_icon'] = that.data.white_icon
      val_data_dict['front_icon'] = that.data.white_icon
    }
    if (step == that.data.total_step) {
      val_data_dict['front_icon'] = that.data.white_icon
    }
    if (step >= that.data.max_step) {
      val_data_dict['front_icon'] = that.data.white_icon
      val_data_dict['max_step'] = step
    } 
    val_data_dict['question'] = that.data.question_dict[step]
    val_data_dict['answers'] = that.data.answer_dict[step] 
    that.setData(val_data_dict)
  },

  change_step: function (event) {
    var step = Number(this.data.step)
    var incr = Number(event.target.dataset.incr)  
    var that = this
    this.resetData(that, step + incr)
  }, 

  answer_question: function (event) {
    var step = event.target.dataset.step 
    var value = event.target.dataset.value
    var app = getApp()
    var that = this
    var request_data = {
      access_token: app.globalData.access_token,
      value: value,
      step: step
    } 
    wx.request({
      url: config.HTTP_HOST_TEST + that.data.service_url,  
      data: request_data,
      success(res) { 
        if (step == that.data.total_step) {
          wx.reLaunch({ url: that.data.guanguan_url })
        } else {
          step = Number(step) + Number(1) 
          that.resetData(that, step) 
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
    var guan_id = options.guan_id
    // todo: 通过 guan_id 请求对应的 guanguan 信息
    var step = options.step
    var that = this
    this.resetData(that, step)
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
