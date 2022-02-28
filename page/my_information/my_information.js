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
    verifyWorkSheetHidden: true,   //作为开关控制弹窗是否从底部弹出
    email: "",  // 
   },

   //将输入的内容绑定到 msg 中
  obtainEmail: function(data) {
    this.setData({
      email: data.detail.value
    });
  },

  updateVerifyWorkSheetHidden: function() {
    this.setData({
      verifyWorkSheetHidden: !this.data.verifyWorkSheetHidden
    });
  },

  //用户输完并点击确认后，输入的信息会打印到控制台上
  sendEmail: function() {
    console.log(this.data.email);
    let email = this.data.email
    wx.request({
      url: config.HTTP_HOST_TEST + config.emailVerifyUrl,
      data: {
        accessToken: app.globalData.accessToken,
        email: email,
      },
      success(res) {
        wx.showModal({
          title: '登录企业邮箱 完成工作认证',
          showCancel: false,
          confirmText: '确认',
        })
      },
      fail(res) {
        wx.showModal({
          title: '发送失败，请联系客服',
          showCancel: false,
          confirmText: '确认',
        })
        request.logRequestErr("myselfUrl err:", res)
      }
    })
  },

  updatePhone: function (event) {
    wx.showModal({
      title: '提示',
      editable: true,
      placeholderText: "这是一个模态弹窗",
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
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