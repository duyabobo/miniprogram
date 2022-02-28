const config = require('../../config.js');
const request = require("../../util/request");
const wxInteractive = require("../../util/wx_interactive");
const enumerate = require("../../util/enumerate");

let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    verifyPhoneSheetHidden: true,   //作为开关控制弹窗是否从底部弹出
    phone: "",  //
    code: "",  // 验证码
    sendCodeButonText: "发送验证码",
    sendPhoneCodeDisabled: false,
   },

   //将输入的内容绑定到 msg 中
  obtainPhone: function(data) {
    this.setData({
      phone: data.detail.value
    });
  },

  obtainCode: function(data) {
    this.setData({
      code: data.detail.value
    });
  },

  updateVerifyPhoneSheetHidden: function() {
    this.setData({
      verifyPhoneSheetHidden: !this.data.verifyPhoneSheetHidden
    });
  },

  verifyPhone: function() {
    this.setData({
      verifyPhoneSheetHidden: false,
      sendCodeButonText: "发送验证码",
      sendPhoneCodeDisabled: false,
    });
  },

  sendPhoneCode: function() { 
    let phone = this.data.phone
    let that = this
    wx.request({
      url: config.HTTP_HOST_TEST + config.sendPhoneCodeUrl,
      data: {
        accessToken: app.globalData.accessToken,
        phone: phone,
      },
      success(res) {
        that.setData({
          sendCodeButonText: "发送成功",
          sendPhoneCodeDisabled: true,
        });
      },
      fail(res) {
        wx.showModal({
          title: res.errMsg,
          showCancel: false,
          confirmText: '确认',
        })
        request.logRequestErr("sendPhoneCodeUrl err:", res)
      }
    })
  },

  checkPhoneCode: function() {
    let url = config.HTTP_HOST_TEST + config.verifyPhoneCodeUrl
    let that = this
    let requestData = { 
      accessToken: app.globalData.accessToken,
      phone: this.data.phone,
      code: this.data.code,
    }
    request.normalUpdateRequest(that, url, requestData)
  },

  updateBirthYear: function(event) {
    console.log('picker发送选择改变，携带值为', event.detail.value)
    let that = this;
    let url = config.HTTP_HOST_TEST + config.myselfUrl
    let requestData = { 
      accessToken: app.globalData.accessToken,
      opType: enumerate.MODEL_USER_OP_TYPE_BIRTH_YEAR,
      value: event.detail.value
    }
    request.normalUpdateRequest(that, url, requestData)
  },

  updateHeight: function(event) {
    console.log('picker发送选择改变，携带值为', event.detail.value)
    let that = this;
    let url = config.HTTP_HOST_TEST + config.myselfUrl
    let requestData = { 
      accessToken: app.globalData.accessToken,
      opType: enumerate.MODEL_USER_OP_TYPE_HEIGHT,
      value: event.detail.value
    }
    request.normalUpdateRequest(that, url, requestData)
  },

  updateWeight: function(event) {
    console.log('picker发送选择改变，携带值为', event.detail.value)
    let that = this;
    let url = config.HTTP_HOST_TEST + config.myselfUrl
    let requestData = {
      accessToken: app.globalData.accessToken,
      opType: enumerate.MODEL_USER_OP_TYPE_WEIGHT,
      value: event.detail.value
    }
    request.normalUpdateRequest(that, url, requestData)
  },

  updateMonthPay: function(event) {
    console.log('picker发送选择改变，携带值为', event.detail.value)
    let that = this;
    let url = config.HTTP_HOST_TEST + config.myselfUrl
    let requestData = {
      accessToken: app.globalData.accessToken,
      opType: enumerate.MODEL_USER_OP_TYPE_MONTH_PAY,
      value: event.detail.value
    }
    request.normalUpdateRequest(that, url, requestData)
  },

  upsertMyself: function(event) {
    let that = this;
    wx.showActionSheet({
      itemList: event.currentTarget.dataset.item_list,
      success (res) {
        let url = config.HTTP_HOST_TEST + config.myselfUrl
        let requestData = {
          accessToken: app.globalData.accessToken,
          opType: event.currentTarget.dataset.op_type,
          value: res.tapIndex
        }
        request.normalUpdateRequest(that, url, requestData)
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wxInteractive.wxCheckToast(options.errMsg)
    let that = this; 
    wx.request({
      url: config.HTTP_HOST_TEST + config.myselfUrl,
      data: {
        accessToken: app.globalData.accessToken,
      },
      success(res) {
        if (request.requestIsSuccess(res)) {
          that.setData(res.data.data)
        }
      },
      fail(res) {
        request.logRequestErr("myselfUrl err:", res)
      }
    })
  },

})