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
    this.updateInformation(util.getFunName(this.updateSex), event.detail.value)
  },

  updateBirthYear: function(event) {
    this.updateInformation(util.getFunName(this.updateBirthYear), event.detail.value)
  },

  updateHeight: function(event) {
    this.updateInformation(util.getFunName(this.updateHeight), event.detail.value)
  },

  updateWeight: function(event) {
    this.updateInformation(util.getFunName(this.updateWeight), event.detail.value)
  },

  updateMonthPay: function(event) {
    this.updateInformation(util.getFunName(this.updateMonthPay), event.detail.value)
  },

  updateMartialStatus: function(event) {
    this.updateInformation(util.getFunName(this.updateMartialStatus), event.detail.value)
  },

  updateEducation: function(event) {
    this.updateInformation(util.getFunName(this.updateEducation), event.detail.value)
  },

  updateExtend1: function(event) {
    this.updateInformation(util.getFunName(this.updateExtend1), event.detail.value)
  },

  updateExtend2: function(event) {
    this.updateInformation(util.getFunName(this.updateExtend2), event.detail.value)
  },

  updateExtend3: function(event) {
    this.updateInformation(util.getFunName(this.updateExtend3), event.detail.value)
  },

  updateExtend4: function(event) {
    this.updateInformation(util.getFunName(this.updateExtend4), event.detail.value)
  },

  updateExtend5: function(event) {
    this.updateInformation(util.getFunName(this.updateExtend5), event.detail.value)
  },

  updateExtend6: function(event) {
    this.updateInformation(util.getFunName(this.updateExtend6), event.detail.value)
  },

  updateExtend7: function(event) {
    this.updateInformation(util.getFunName(this.updateExtend7), event.detail.value)
  },

  updateExtend8: function(event) {
    this.updateInformation(util.getFunName(this.updateExtend8), event.detail.value)
  },

  updateExtend9: function(event) {
    this.updateInformation(util.getFunName(this.updateExtend9), event.detail.value)
  },

  updateExtend10: function(event) {
    this.updateInformation(util.getFunName(this.updateExtend10), event.detail.value)
  },

  updatePeriodExtend1: function(event) {
    this.updateInformation(util.getFunName(this.updatePeriodExtend1), event.detail.value)
  },

  updatePeriodExtend2: function(event) {
    this.updateInformation(util.getFunName(this.updatePeriodExtend2), event.detail.value)
  },

  updatePeriodExtend3: function(event) {
    this.updateInformation(util.getFunName(this.updatePeriodExtend3), event.detail.value)
  },

  updatePeriodExtend4: function(event) {
    this.updateInformation(util.getFunName(this.updatePeriodExtend4), event.detail.value)
  },

  updatePeriodExtend5: function(event) {
    this.updateInformation(util.getFunName(this.updatePeriodExtend5), event.detail.value)
  },

  updatePeriodExtend6: function(event) {
    this.updateInformation(util.getFunName(this.updatePeriodExtend6), event.detail.value)
  },

  updatePeriodExtend7: function(event) {
    this.updateInformation(util.getFunName(this.updatePeriodExtend7), event.detail.value)
  },

  updatePeriodExtend8: function(event) {
    this.updateInformation(util.getFunName(this.updatePeriodExtend8), event.detail.value)
  },

  updatePeriodExtend9: function(event) {
    this.updateInformation(util.getFunName(this.updatePeriodExtend9), event.detail.value)
  },

  updatePeriodExtend10: function(event) {
    this.updateInformation(util.getFunName(this.updatePeriodExtend10), event.detail.value)
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

  periodExtend1ColumnChange: function(e) {
    this.columnChange(e, util.getFunName(this.periodExtend1ColumnChange))
  },

  periodExtend2ColumnChange: function(e) {
    this.columnChange(e, util.getFunName(this.periodExtend2ColumnChange))
  },

  periodExtend3ColumnChange: function(e) {
    this.columnChange(e, util.getFunName(this.periodExtend3ColumnChange))
  },

  periodExtend4ColumnChange: function(e) {
    this.columnChange(e, util.getFunName(this.periodExtend4ColumnChange))
  },

  periodExtend5ColumnChange: function(e) {
    this.columnChange(e, util.getFunName(this.periodExtend5ColumnChange))
  },

  periodExtend6ColumnChange: function(e) {
    this.columnChange(e, util.getFunName(this.periodExtend6ColumnChange))
  },

  periodExtend7ColumnChange: function(e) {
    this.columnChange(e, util.getFunName(this.periodExtend7ColumnChange))
  },

  periodExtend8ColumnChange: function(e) {
    this.columnChange(e, util.getFunName(this.periodExtend8ColumnChange))
  },

  periodExtend9ColumnChange: function(e) {
    this.columnChange(e, util.getFunName(this.periodExtend9ColumnChange))
  },

  periodExtend10ColumnChange: function(e) {
    this.columnChange(e, util.getFunName(this.periodExtend10ColumnChange))
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