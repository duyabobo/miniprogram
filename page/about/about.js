const config = require("../../config.js");
const request = require("../../util/request");

Page({

  /**
   * 页面的初始数据
   */
  data: { },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title
    })
    
    let that = this
    request.myRequest({
      url: config.aboutUrl,
      data: {},
      success(res) {
        if (request.requestIsSuccess(res)) {
          that.setData(res.data.data)
        }
      },
      fail(res) {
        request.logRequestErr("aboutUrl err:", res)
      }
    })
  },

})