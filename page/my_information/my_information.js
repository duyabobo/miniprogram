const config = require('../../config.js');
const request = require("../../util/request");
const wxInteractive = require("../../util/wx_interactive");
const util = require("../../util/util");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    verifyPhoneSheetHidden: true,   //作为开关控制弹窗是否从底部弹出
    phone: "",  //
    code: "",  // 验证码
    sendCodeButtonText: "发送验证码",
    sendPhoneCodeDisabled: false,
    obtainPhonePlaceHolder: "输入手机号",
    obtainCodePlaceHolder: "输入验证码",
   },

   //将输入的内容绑定到 msg 中
  obtainPhone: function(data) {
    this.setData({
      phone: data.detail.value
    });
  },

  obtainCode: function(data) {
    this.setData({
      emailCode: data.detail.value
    });
  },

  obtainWorkCode: function(data) {
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
    request.myRequest({
      url: config.phoneVerifyUrl,
      data: {
        phone: phone,
      },
      success(res) {
        if (request.requestIsSuccess(res)) {
          that.setData({
            sendCodeButonText: "发送成功",
            sendPhoneCodeDisabled: true,
          });
        } else {
          wx.showModal({
            title: res.data.errMsg,
            showCancel: false,
            confirmText: '确认',
          })
        }
      },
      fail(res) {
        wx.showModal({
          title: res.data.errMsg,
          showCancel: false,
          confirmText: '确认',
        })
        request.logRequestErr("phoneVerifyUrl err:", res)
      }
    })
  },

  checkPhoneCode: function() {
    let url = config.phoneVerifyUrl
    let that = this
    let requestData = {
      phone: this.data.phone,
      code: this.data.code,
    }
    request.normalUpdateRequest(that, url, requestData)
  },
  
  updateInformation: function (op, e) {
    let opType = util.getFunName(op)
    let column = e.detail.column
    let value = e.detail.value
    let that = this;
    let url = config.informationUrl
    let requestData = {
      opType: opType,
      column: column,
      value: value
    }
    request.normalUpdateRequest(that, url, requestData)
  },

  updateSex: function(event) {
    this.updateInformation(this.updateSex, event)
  },

  updateBirthYear: function(event) {
    this.updateInformation(this.updateBirthYear, event)
  },

  updateHeight: function(event) {
    this.updateInformation(this.updateHeight, event)
  },

  updateWeight: function(event) {
    this.updateInformation(this.updateWeight, event)
  },

  updateEducationLevel: function(event) {
    this.updateInformation(this.updateEducationLevel, event)
  },

  updateMonthPay: function(event) {
    this.updateInformation(this.updateMonthPay, event)
  },

  updateStudyFromYear: function(event) {
    this.updateInformation(this.updateStudyFromYear, event)
  },

  updateMartialStatus: function(event) {
    this.updateInformation(this.updateMartialStatus, event)
  },

  updateHomeRegion: function (event) {
    this.updateInformation(this.updateHomeRegion, event)
  },

  updateStudyRegion: function (event) {
    this.updateInformation(this.updateStudyRegion, event)
  },

  updateStudySchool: function (event) {
    this.updateInformation(this.updateStudySchool, event)
  },

  updateWorkRegion: function (event) {
    this.updateInformation(this.updateWorkRegion, event)
  },

  updateEducationMulti: function (event) {
    this.updateInformation(this.updateEducationMulti, event)
  },

  updateEducationMultiColumnChange: function (event) {
    this.updateInformation(this.updateEducationMultiColumnChange, event)
  },

  updateWorkMulti: function (event) {
    this.updateInformation(this.updateWorkMulti, event)
  },

  updateWorkMultiColumnChange: function (event) {
    this.updateInformation(this.updateWorkMultiColumnChange, event)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title
    })

    wxInteractive.wxCheckToast(options.errMsg)
    let that = this; 
    request.myRequest({
      url: config.informationUrl,
      data: {
      },
      success(res) {
        if (request.requestIsSuccess(res)) {
          that.setData(res.data.data)
        }
      }
    })
  },

})