const config = require('../../config.js')
const enumerate = require("../../util/enumerate");
const request = require("../../util/request");
const pageUrl = require("../../util/page_url")

let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: { },

  operate: function (event) {
    let that = this
    let guanId = event.currentTarget.dataset.guan_id;
    request.myRequest({
      url: config.guaninfoUrl,
      method: 'PUT',
      data: {
        guanId: guanId,
        opType: event.currentTarget.dataset.op_type,
      },
      success(res) {
        if (request.requestIsSuccess(res)) {
          that.setData(res.data.data)
          if (that.data.operate.subscribeTemplateIds.length > 0) {
            wx.requestSubscribeMessage({
              tmplIds: that.data.subscribeTemplateIds,
              complete (res) {
                console.log('用户订阅消息结束', res)
                request.simplePostRequest(config.subscribeCBUrl, {
                  guanId: guanId,
                  subscribeRes: res,
                })
              }
            })
          }
        } else if (request.requestFinishBiggerThanCode(res, enumerate.GUAN_SUCCESS_WITH_NOTI_MIN_CODE)) {
          that.setData(res.data.data)
          wx.showModal({
            title: res.data.errMsg,
            showCancel: false,
            confirmText: '确认',
          })
        } else if (request.requestFinishWithCode(res, enumerate.NEED_FILL_INFORMATION_CODE)) {
          wx.navigateTo({
            url: res.data.data.operate.myInformationPage,
          })
        } else {
          wx.showModal({
            title: res.data.errMsg,
            showCancel: false,
            confirmText: '确认',
          })
        }
      },
      fail(res) {
        request.logRequestErr("guaninfoUrl err:", res)
      }
    })
  },

  meetResultChoice: function (event) {
    let that = this
    let guanId = event.currentTarget.dataset.guan_id;
    let url = config.meetResultUrl
    let requestData = {
      guanId: guanId,
      value: event.detail.value
    }
    request.normalUpdateRequest(that, url, requestData)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.state
    })

    let that = this
    request.myRequest({
      url: config.guaninfoUrl,
      data: {
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

  onShow: function() {
    var that=this;
    let guanId = that.data.guanId
    if (guanId === undefined) {
      return
    }
    request.myRequest({
      url: config.guaninfoUrl,
      data: {
        guanId: that.data.guanId
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

  onShareAppMessage: function (ops) {
    return {
      title: '关关雎鸠',
      path: pageUrl.getSharePageWithOpenid(config.GUANGUAN_PAGE),
      success: function (res) {
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },

  updateRequirement: function (ops) {
    wx.navigateTo({
      url: this.data.operate.myRequirementPage,
    })
  },

})
