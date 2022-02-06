const config = require("../../config.js");
const request = require("../../util/request");

let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    opText: "发送验证邮件"
  },

  sendVerifyMail: function(event) { 
    let email = event.detail.value.email
    let that = this
    wx.request({
      url: config.HTTP_HOST_TEST + config.emailVerifyUrl,
      data: {
        accessToken: app.globalData.accessToken,
        email: email,
      },
      success(res) {
        wx.showModal({
          title: '已发送，如未收到请联系客服',
          showCancel: false,
          confirmText: '确认',
        })
        that.setData(
          {
            opText: "请查询邮箱验证"
          }
        )
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
 
})