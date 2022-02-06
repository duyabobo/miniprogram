const config = require('../../config.js')
const enumerate = require("../../util/enumerate");
const request = require("../../util/request");

let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {},

  operate: function (event) {
    let that = this
    let guanId = event.currentTarget.dataset.guan_id;
    wx.request({
      url: config.HTTP_HOST_TEST + config.guaninfoUrl,
      method: 'PUT',
      data: {
        accessToken: app.globalData.accessToken,
        guanId: guanId,
        opType: event.currentTarget.dataset.op_type,
      },
      success(res) {
        if (request.requestIsSuccess(res)) {
          that.setData(res.data.data)
        } else if (request.requestFinishWithCode(res, enumerate.NEED_FILL_INFORMATION_CODE)) {
          wx.navigateTo({
            url: config.MYINFORMATION_PAGE + res.data.errMsg,
          })
        } else {
          wx.reLaunch({
            url: config.GUANGUAN_PAGE + res.data.errMsg,
          })
        }
      },
      fail(res) {
        request.logRequestErr("guaninfoUrl err:", res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.state
    })

    let that = this
    wx.request({
      url: config.HTTP_HOST_TEST + config.guaninfoUrl,
      data: {
        accessToken: app.globalData.accessToken,
        guanId: options.guanId
      },
      success(res) {
        if (request.requestIsSuccess(res)) {
          that.setData(res.data.data)
        }
      },
      fail(res) {
        request.logRequestErr("guaninfoUrl err:", res)
      }
    })
  },

})
