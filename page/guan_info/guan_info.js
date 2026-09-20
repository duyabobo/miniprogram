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

// 按钮 label（中文）→ CSS styleKey（英文）映射，用于避免 WXSS 不支持中文类名的问题
const BUTTON_LABEL_STYLE_MAP = {
  '见面': 'meet',
  '发起见面': 'start-meet',
  '取消': 'cancel',
  '合适': 'suitable',
  '不合适': 'unsuitable',
  '结束关系': 'end',
  '恢复关系': 'restore',
}

/** 给按钮列表注入 styleKey，用于 WXSS 样式绑定 */
function enrichButtonsWithStyleKey(buttons) {
  if (!buttons || !buttons.length) return buttons;
  return buttons.map(btn => ({
    ...btn,
    styleKey: BUTTON_LABEL_STYLE_MAP[btn.label] || 'default',
  }));
}

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

  /** 将服务端返回的页面数据写入，注入按钮 styleKey 以支持 WXSS 样式绑定 */
  _applyPageData: function (data) {
    const enriched = Object.assign({}, data);
    if (enriched.operate && enriched.operate.bottomButtons) {
      enriched.operate = Object.assign({}, enriched.operate, {
        bottomButtons: enrichButtonsWithStyleKey(enriched.operate.bottomButtons),
      });
    }
    this.setData(enriched);
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
              that._applyPageData(res.data.data)
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
          that._applyPageData(res.data.data)
        }
      }
    })
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: options.state || '见面详情' })
    const guanId = options.guanId
    // 先写入 guanId，避免 onShow 因空值跳过刷新
    this.setData({ guanId })
    const that = this
    request.myRequest({
      url: config.guaninfoUrl,
      data: { guanId },
      success(res) {
        if (request.requestIsSuccess(res)) {
          that._applyPageData(res.data.data)
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
