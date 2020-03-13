var config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    guan_id: 0,
    guan_point: 0,
    guan_type_id: 0,
    guanguan_page_url: "/page/guanguan/guanguan",
    // 默认数据 
    left_icon: "http://img.ggjjzhzz.cn/left.png",
    right_icon: "http://img.ggjjzhzz.cn/right.png",
    white_icon: "http://img.ggjjzhzz.cn/no_direction.png",
    question_background: "http://img.ggjjzhzz.cn/question_background.png",
    step: 0,
    // reset_data 计算数据
    max_step: -1,
    question: '',
    answers: [],
    back_icon: "",
    front_icon: "", 
    // request 请求数据
    total_step: 0,
    meeting_time: '',
    meeting_address: '',
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

  self_answer: function (event) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '你已报名该席位，希望做什么呢？',
      confirmText: '准时参加',
      cancelText: '取消报名',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          var answer_info_id = event.target.dataset.answer_info_id
          var app = getApp()
          var guan_id = that.data.guan_id
          var request_data = {
            access_token: app.globalData.access_token,
            answer_info_id: answer_info_id,
            guan_id: guan_id
          } 
          wx.request({
            url: config.HTTP_HOST_TEST + config.guananswer_url,
            data: request_data,
            method: 'PUT',
            success(res) {
              wx.reLaunch({ url: '/page/guanguan/guanguan' })
            },
            fail(res) {
              console.log('guan point err')
            }
          })
        }
      }
    })
  },

  has_answered: function (event) {
    var answer_user_id = event.target.dataset.answer_user_id
    wx.navigateTo({
      url: '/page/guan_evaluation/guan_evaluation?answer_user_id=' + answer_user_id,
    })
  },

  could_not_answer: function (event) {
    wx.showToast({
      title: '该名额不可报名',
      icon: 'loading',
      duration: 600,
      mask: true
    })
  },

  answer_question: function (event) { 
    var answer_info_id = event.target.dataset.answer_info_id 
    var app = getApp()
    var guan_id = this.data.guan_id
    var that = this
    var request_data = {
      access_token: app.globalData.access_token,
      answer_info_id: answer_info_id,
      guan_id: guan_id
    } 
    wx.request({
      url: config.HTTP_HOST_TEST + config.guananswer_url,  
      data: request_data,
      method: 'POST',
      success(res) { 
        var guan_answer_id = res.data.guan_answer_id
        var errmsg = res.data.errmsg
        var step = that.data.step
        if (guan_answer_id == 0) {
          wx.showToast({
            title: errmsg,
            icon: 'loading',
            duration: 400,
            mask: true
          })
        } else if (step == that.data.total_step) { 
          wx.request({
            url: config.HTTP_HOST_TEST + config.guanpoint_url,
            data: {
              access_token: app.globalData.access_token,
              guan_id: guan_id
            },
            method: 'POST',
            success(res) {
              wx.reLaunch({ url: '/page/guanguan/guanguan' })
            },
            fail(res) {
              console.log('guan point err')
            }
          })
          if (that.data.guan_type_id == 2) {
            console.log('abc')
            wx.requestSubscribeMessage({
              tmplIds: [config.subscribe_offline_noti_tid],
              success(res) { }
            })
          }
        } else {
          step = Number(step) + Number(1) 
          that.resetData(that, step) 
        }
      },
      fail(res) {
        console.log('guan answer err')
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp()
    if (!app.globalData.hasLogin) {
      wx.reLaunch({
        url: '/page/login/login'
      })
    } else {
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
          var code = res.data.code
          if (code!=0){
            var errmsg = res.data.errmsg
            wx.reLaunch({
              url: '/page/guanguan/guanguan?errmsg=' + errmsg,
            })
          }
          that.setData(res.data)
          var step = res.data.step
          that.resetData(that, step, res.data)
        },
        fail(res) {
          console.log('guaninfo err')
          console.log(res)
        }
      })
    }
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
