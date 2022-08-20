// page/secret/secret.js
const config = require("../../config.js");
const request = require("../../util/request");

Page({

  /**
   * 页面的初始数据
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title
    })
    
    let that = this
    request.myRequest({
      url: config.secretUrl,
      data: {},
      success(res) {
        if (request.requestIsSuccess(res)) {
          that.setData(res.data.data)
        }
      }
    })
  },
})