const config = require('../../config.js')
const enumerate = require("../../util/enumerate");
const request = require("../../util/request");

let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: config.CDN_QINIU_URL + "202010201143196086.png",
    address: "玉檀园公园",
    time: "2月12日",
    personInfos: [{"text": "汉服爱好者"},{"text": "汉好者"},{"text": "汉服好者"},{"text": "汉服爱好者"},{"text": "汉服爱好者"},{"text": "者"},{"text": "汉好者"}],
    opDesc: "报名参加",
    timeImg: config.CDN_QINIU_URL + "202010201143196086.png",
    addressImg: config.CDN_QINIU_URL + "202010201143196086.png",
    personImg: config.CDN_QINIU_URL + "202010201143196086.png",
  },

  operate: function (event) {
    let guanId = event.currentTarget.dataset.guan_id;
    wx.request({
      url: config.HTTP_HOST_TEST + config.operateUrl,
      data: {
        accessToken: app.globalData.accessToken,
        guanId: guanId,
        opType: event.currentTarget.dataset.op_type,
      },
      success(res) {
        if (request.requestIsSuccess(res)) {
          wx.reLaunch({
            url: config.GUANINFO_PAGE + guanId,
          })
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
        request.logRequestErr("operateUrl err:", res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: config.HTTP_HOST_TEST + config.guaninfoUrl,
      data: {
        accessToken: app.globalData.accessToken,
        guanId: options.guanId
      },
      success(res) {
        if (request.requestIsSuccess(res)) {
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

})
