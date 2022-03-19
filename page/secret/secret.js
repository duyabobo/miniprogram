// page/secret/secret.js
const config = require("../../config.js");
const request = require("../../util/request");

Page({

  /**
   * 页面的初始数据
   */
  onLoad: function (options) {
    let that = this
    wx.request({
      url: config.HTTP_HOST_TEST + config.secretUrl,
      data: {},
      success(res) {
        if (request.requestIsSuccess(res)) {
          that.setData(res.data.data)
        }
      },
      fail(res) {
        request.logRequestErr("secretUrl err:", res)
      }
    })
  },
})