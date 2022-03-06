const config = require('../../config.js');
const request = require("../../util/request");
const wxInteractive = require("../../util/wx_interactive");
const enumerate = require("../../util/enumerate");

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

    verifyWorkSheetHidden: true,
    email: "",
    emailCode: "",
    sendEmailButonText: "发送验证邮件",
    sendWorkCodeDisabled: false,
    obtainWorkEmailPlaceHolder: "输入企业邮箱",
    obtainWorkCodePlaceHolder: "输入验证码",
   },

   //将输入的内容绑定到 msg 中
  obtainPhone: function(data) {
    this.setData({
      phone: data.detail.value
    });
  },

  obtainWorkEmail: function(data) {
    this.setData({
      email: data.detail.value
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

  updateVerifyWorkSheetHidden: function () {
    this.setData({
      verifyWorkSheetHidden: !this.data.verifyWorkSheetHidden
    });
  },

  verifyPhone: function() {
    this.setData({
      verifyPhoneSheetHidden: false,
      sendCodeButonText: "发送验证码",
      sendPhoneCodeDisabled: false,
    });
  },

  verifyWork: function () {
    this.setData({
      verifyWorkSheetHidden: false,
      sendEmailButonText: "发送验证邮件",
      sendWorkCodeDisabled: false,
    });
  },

  sendPhoneCode: function() { 
    let phone = this.data.phone
    let that = this
    wx.request({
      url: config.HTTP_HOST_TEST + config.phoneVerifyUrl,
      data: {
        accessToken: wx.getStorageSync('accessToken'),
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

  sendEmailCode: function() {
    let email = this.data.email
    let that = this
    wx.request({
      url: config.HTTP_HOST_TEST + config.emailVerifyUrl,
      data: {
        accessToken: wx.getStorageSync('accessToken'),
        email: email,
      },
      success(res) {
        if (request.requestIsSuccess(res)) {
          that.setData({
            sendEmailButonText: "发送成功",
            sendWorkCodeDisabled: true,
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
        request.logRequestErr("emailVerifyUrl err:", res)
      }
    })
  },

  checkPhoneCode: function() {
    let url = config.HTTP_HOST_TEST + config.phoneVerifyUrl
    let that = this
    let requestData = { 
      accessToken: wx.getStorageSync('accessToken'),
      phone: this.data.phone,
      code: this.data.code,
    }
    request.normalUpdateRequest(that, url, requestData)
  },

  checkEmailCode: function () {
    let url = config.HTTP_HOST_TEST + config.emailVerifyUrl
    let that = this
    let requestData = {
      accessToken: wx.getStorageSync('accessToken'),
      email: this.data.email,
      code: this.data.code,
    }
    request.normalUpdateRequest(that, url, requestData)
  },
  
  updateInformation: function (opType, value) {
    let that = this;
    let url = config.HTTP_HOST_TEST + config.informationUrl
    let requestData = {
      accessToken: wx.getStorageSync('accessToken'),
      opType: opType,
      value: value
    }
    request.normalUpdateRequest(that, url, requestData)
  },

  updateSex: function(event) {
    this.updateInformation(enumerate.MODEL_USER_OP_TYPE_SEX, event.detail.value)
  },

  updateBirthYear: function(event) {
    this.updateInformation(enumerate.MODEL_USER_OP_TYPE_BIRTH_YEAR, event.detail.value)
  },

  updateHeight: function(event) {
    this.updateInformation(enumerate.MODEL_USER_OP_TYPE_HEIGHT, event.detail.value)
  },

  updateWeight: function(event) {
    this.updateInformation(enumerate.MODEL_USER_OP_TYPE_WEIGHT, event.detail.value)
  },

  updateMonthPay: function(event) {
    this.updateInformation(enumerate.MODEL_USER_OP_TYPE_MONTH_PAY, event.detail.value)
  },

  updateMartialStatus: function(event) {
    this.updateInformation(enumerate.MODEL_USER_OP_TYPE_MARTIAL_STATUS, event.detail.value)
  },

  updateEducation: function(event) {
    this.updateInformation(enumerate.MODEL_USER_OP_TYPE_EDUCATION, event.detail.value)
  },

  updateExtend1: function(event) {
    this.updateInformation(enumerate.MODEL_USER_OP_TYPE_EXTEND_1, event.detail.value)
  },

  updateExtend2: function(event) {
    this.updateInformation(enumerate.MODEL_USER_OP_TYPE_EXTEND_2, event.detail.value)
  },

  updateExtend3: function(event) {
    this.updateInformation(enumerate.MODEL_USER_OP_TYPE_EXTEND_3, event.detail.value)
  },

  updateExtend4: function(event) {
    this.updateInformation(enumerate.MODEL_USER_OP_TYPE_EXTEND_4, event.detail.value)
  },

  updateExtend5: function(event) {
    this.updateInformation(enumerate.MODEL_USER_OP_TYPE_EXTEND_5, event.detail.value)
  },

  updateExtend6: function(event) {
    this.updateInformation(enumerate.MODEL_USER_OP_TYPE_EXTEND_6, event.detail.value)
  },

  updateExtend7: function(event) {
    this.updateInformation(enumerate.MODEL_USER_OP_TYPE_EXTEND_7, event.detail.value)
  },

  updateExtend8: function(event) {
    this.updateInformation(enumerate.MODEL_USER_OP_TYPE_EXTEND_8, event.detail.value)
  },

  updateExtend9: function(event) {
    this.updateInformation(enumerate.MODEL_USER_OP_TYPE_EXTEND_9, event.detail.value)
  },

  updateExtend10: function(event) {
    this.updateInformation(enumerate.MODEL_USER_OP_TYPE_EXTEND_10, event.detail.value)
  },

  updatePeriodExtend1: function(event) {
    this.updateInformation(enumerate.MODEL_USER_OP_TYPE_PERIOD_EXTEND_1, event.detail.value)
  },

  updatePeriodExtend2: function(event) {
    this.updateInformation(enumerate.MODEL_USER_OP_TYPE_PERIOD_EXTEND_2, event.detail.value)
  },

  updatePeriodExtend3: function(event) {
    this.updateInformation(enumerate.MODEL_USER_OP_TYPE_PERIOD_EXTEND_3, event.detail.value)
  },

  updatePeriodExtend4: function(event) {
    this.updateInformation(enumerate.MODEL_USER_OP_TYPE_PERIOD_EXTEND_4, event.detail.value)
  },

  updatePeriodExtend5: function(event) {
    this.updateInformation(enumerate.MODEL_USER_OP_TYPE_PERIOD_EXTEND_5, event.detail.value)
  },

  updatePeriodExtend6: function(event) {
    this.updateInformation(enumerate.MODEL_USER_OP_TYPE_PERIOD_EXTEND_6, event.detail.value)
  },

  updatePeriodExtend7: function(event) {
    this.updateInformation(enumerate.MODEL_USER_OP_TYPE_PERIOD_EXTEND_7, event.detail.value)
  },

  updatePeriodExtend8: function(event) {
    this.updateInformation(enumerate.MODEL_USER_OP_TYPE_PERIOD_EXTEND_8, event.detail.value)
  },

  updatePeriodExtend9: function(event) {
    this.updateInformation(enumerate.MODEL_USER_OP_TYPE_PERIOD_EXTEND_9, event.detail.value)
  },

  updatePeriodExtend10: function(event) {
    this.updateInformation(enumerate.MODEL_USER_OP_TYPE_PERIOD_EXTEND_10, event.detail.value)
  },
  
  columnChange(e, columnChangeType) {
    let currentColunm = e.detail.column;
    let currentValue = e.detail.value
    let columnChangeTypeIndex = this.data.columnChangeTypeIndexMap[columnChangeType]
    if (currentColunm === 0 || (currentColunm === 1 && currentValue < this.data.informationList[columnChangeTypeIndex].fromAndToSelectValueIndex[0])) {
      this.setData({
        ["informationList["+columnChangeTypeIndex+"].fromAndToSelectValueIndex[0]"]: currentValue,
        ["informationList["+columnChangeTypeIndex+"].fromAndToSelectValueIndex[1]"]: currentValue,
      })
    } else {
      this.setData({
        ["informationList["+columnChangeTypeIndex+"].fromAndToSelectValueIndex[1]"]: currentValue,
      })
    }
  },

  monthPeriodExtend1ColumnChange(e) {
    this.columnChange(e, "PeriodExtend1")
  },

  monthPeriodExtend2ColumnChange(e) {
    this.columnChange(e, "PeriodExtend2")
  },

  monthPeriodExtend3ColumnChange(e) {
    this.columnChange(e, "PeriodExtend3")
  },

  monthPeriodExtend4ColumnChange(e) {
    this.columnChange(e, "PeriodExtend4")
  },

  monthPeriodExtend5ColumnChange(e) {
    this.columnChange(e, "PeriodExtend5")
  },

  monthPeriodExtend6ColumnChange(e) {
    this.columnChange(e, "PeriodExtend6")
  },

  monthPeriodExtend7ColumnChange(e) {
    this.columnChange(e, "PeriodExtend7")
  },

  monthPeriodExtend8ColumnChange(e) {
    this.columnChange(e, "PeriodExtend8")
  },

  monthPeriodExtend9ColumnChange(e) {
    this.columnChange(e, "PeriodExtend9")
  },

  monthPeriodExtend10ColumnChange(e) {
    this.columnChange(e, "PeriodExtend10")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wxInteractive.wxCheckToast(options.errMsg)
    let that = this; 
    wx.request({
      url: config.HTTP_HOST_TEST + config.informationUrl,
      data: {
        accessToken: wx.getStorageSync('accessToken'),
      },
      success(res) {
        if (request.requestIsSuccess(res)) {
          that.setData(res.data.data)
        }
      },
      fail(res) {
        request.logRequestErr("informationUrl err:", res)
      }
    })
  },

})