var config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 默认数据
    guanguan_page_url: "/page/guanguan/guanguan",
    left_icon: "/resources/left.png",
    right_icon: "/resources/right.png",
    white_icon: "/resources/no_direction.png",
    question_background: "/resources/question_background.png",
    step: 0,
    // reset_data 计算数据
    max_step: -1,
    question: '',
    answers: [],
    back_icon: "",
    front_icon: "", 
    // request 请求数据
    total_step: 0,
    service_url: '',
    question_dict: {}, 
    answer_dict: {} 
  },

  resetData: function (that, step, data=null) {
    if (data == null) {
      data = that.data
    }
    var val_data_dict = {
       'step': step, 
       'back_icon': data.left_icon,
       'front_icon': data.right_icon
    } 
    if (step == 0) {
      val_data_dict['back_icon'] = data.white_icon 
    }
    if (step == data.total_step) {
      val_data_dict['front_icon'] = data.white_icon
    }
    if (step >= data.max_step) {
      val_data_dict['front_icon'] = data.white_icon
      val_data_dict['max_step'] = step
    } 
    val_data_dict['question'] = data.question_dict[step]
    val_data_dict['answers'] = data.answer_dict[step]
    that.setData(val_data_dict)
  },

  change_step: function (event) {
    var step = Number(this.data.step)
    var max_step = Number(this.data.max_step)
    var incr = Number(event.target.dataset.incr)  
    var that = this
    if (step == 0 && incr == -1) {
      return
    }
    if (step == max_step && incr == 1) {
      return
    }
    if (step <= max_step && step + incr <= max_step) {
      that.resetData(that, step + incr)
    }
 }, 

  answer_question: function (event) { 
    var answer_id = event.target.dataset.answer_id
    var app = getApp()
    var that = this
    var request_data = {
      access_token: app.globalData.access_token,
      answer_id: answer_id
    } 
    wx.request({
      url: config.HTTP_HOST_TEST + config.answer_url,  
      data: request_data,
      method: 'POST',
      success(res) { 
        if (step == that.data.total_step) {
          wx.reLaunch({ url: that.data.guanguan_page_url })
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
    var app = getApp()
    var guan_id = options.guan_id
    var request_data = {
      access_token: app.globalData.access_token,
      guan_id: guan_id
    }
    var that = this
    wx.request({
      url: config.HTTP_HOST_TEST + config.guaninfo_url,
      data: request_data,
      success(res) {
        that.setData(res.data)
        var step = res.data.step
        that.resetData(that, step, res.data)
      },
      fail(res) {
        console.log('guaninfo err')
        console.log(res)
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
