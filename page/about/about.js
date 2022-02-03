const config = require("../../config.js");
const request = require("../../util/request");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    realLogoUrl: config.CDN_QINIU_URL + '/real_logo.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.request({
      url: config.HTTP_HOST_TEST + config.aboutUrl,
      data: {},
      success(res) {
        if (request.requestIsSuccess(res)) {
          that.setData(res.data)
        }
      },
      fail(res) {
        request.logRequestErr("aboutUrl err:", res)
      }
    })
  },

})