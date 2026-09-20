const config = require('../../config.js')
const enumerate = require("../../util/enumerate");
const request = require("../../util/request");
const pageUrl = require("../../util/page_url")

const PROGRESS_NOT_SELECTED = 0
const PROGRESS_SELECTED = 1
const PROGRESS_WAIT_MEET = 2
const PROGRESS_MET = 3
const PROGRESS_AGREE = 4
const PROGRESS_DISAGREE = 5

let app = getApp();

Page({

  data: {
    guanId: null,
    progressStatus: null,
    progressDesc: '',
    activity: {},
    opposite: { infoDataPairs: [], requirementDataPairs: [] },
    operate: { bottomButtons: [] },
  },

  subscribeTemplate: function (guanId, subscribeTemplateIds) {
    if (!subscribeTemplateIds || subscribeTemplateIds.length === 0) return;
    wx.requestSubscribeMessage({
      tmplIds: subscribeTemplateIds,
      complete(res) {
        const openid = wx.getStorageSync('openid')
        request.simplePostRequest(config.subscribeCBUrl, { openid, guanId, subscribeRes: res })
      }
    })
  },

  /** 执行活动操作（见面/取消），有 needConfirm 时先弹框 */
  operate: function (event) {
    const that = this
    const btn = event.currentTarget.dataset.btn
    if (!btn) return;

    if (btn.needConfirm) {
      wx.showModal({
        title: '确认' + btn.label + '？',
        content: '',
        confirmText: btn.label,
        cancelText: '再想想',
        success(res) {
          if (res.confirm) {
            that._doOperate(btn)
          }
        }
      })
    } else {
      this._doOperate(btn)
    }
  },

  _doOperate: function (btn) {
    const that = this
    const guanId = that.data.guanId

    if (btn.action === 'operate') {
      app.preventActive(() => {
        request.myRequest({
          url: config.guaninfoUrl,
          method: 'PUT',
          data: { guanId, opType: btn.opType },
          success(res) {
            if (request.requestIsSuccess(res) || request.requestFinishBiggerThanCode(res, enumerate.GUAN_SUCCESS_WITH_NOTI_MIN_CODE)) {
              that.setData(res.data.data)
              wx.showModal({ title: res.data.errMsg || '操作成功', showCancel: false, confirmText: '确认' })
            } else if (request.requestFinishWithCode(res, enumerate.NEED_FILL_INFORMATION_CODE)) {
              wx.navigateTo({ url: config.MATCH_CONFIG_PAGE })
            } else {
              wx.showModal({ title: res.data.errMsg, showCancel: false, confirmText: '确认' })
            }
          }
        })
      })
    } else if (btn.action === 'meetResult') {
      request.myRequest({
        url: config.meetResultUrl,
        method: 'PUT',
        data: { guanId, value: btn.value },
        success(res) {
          if (request.requestIsSuccess(res)) {
            that._reloadInfo()
          } else {
            wx.showModal({ title: res.data.errMsg || '操作失败', showCancel: false, confirmText: '确认' })
          }
        }
      })
    }
  },

  _reloadInfo: function () {
    const that = this
    request.myRequest({
      url: config.guaninfoUrl,
      data: { guanId: that.data.guanId },
      success(res) {
        if (request.requestIsSuccess(res)) {
          that.setData(res.data.data)
        }
      }
    })
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: options.state || '见面详情' })
    const that = this
    request.myRequest({
      url: config.guaninfoUrl,
      data: { guanId: options.guanId },
      success(res) {
        if (request.requestIsSuccess(res)) {
          that.setData(res.data.data)
        }
      }
    })
  },

  onShow: function () {
    const guanId = this.data.guanId
    if (!guanId) return;
    this._reloadInfo()
  },

  onShareAppMessage: function () {
    return {
      title: '关关雎鸠',
      path: pageUrl.getSharePageWithOpenid(config.GUANGUAN_PAGE),
      success: function (res) { console.log("转发成功:" + JSON.stringify(res)) },
      fail: function (res) { console.log("转发失败:" + JSON.stringify(res)) }
    }
  },

})
