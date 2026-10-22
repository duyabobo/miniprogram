const config = require('../../config.js')
const enumerate = require("../../util/enumerate");
const request = require("../../util/request");
const pageUrl = require("../../util/page_url")

const PROGRESS_SELECTED = 1

let app = getApp();

Page({

  data: {
    guanId: null,
    viewer: false,
    progressStatus: null,
    progressDesc: '',
    copy: {},
    showOpposite: false,
    activity: {},
    placeImgHidden: false,
    opposite: { rows: [] },
    operate: { bottomButtons: [] },
    share: { enabled: false, label: '' },
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

  /** 单心及以上一定有对象；待选择时看接口是否带回了对方资料 */
  _hasOpposite: function (progressStatus, opposite) {
    if (progressStatus >= PROGRESS_SELECTED) return true
    return ((opposite && opposite.rows) || []).length > 0
  },

  /** 将服务端返回的页面数据写入，注入按钮 styleKey 以支持 WXSS 样式绑定 */
  _applyPageData: function (data) {
    const enriched = Object.assign({}, data);
    const opposite = enriched.opposite || { rows: [] }
    enriched.opposite = opposite
    enriched.showOpposite = this._hasOpposite(enriched.progressStatus, opposite)
    enriched.placeImgHidden = false
    if (this.data.viewer) {
      enriched.viewer = true
      enriched.operate = Object.assign({}, enriched.operate, { bottomButtons: [] })
      enriched.share = { enabled: false, label: '' }
    }
    console.log('详情页', enriched.progressStatus, enriched.viewer, enriched.showOpposite, !!(enriched.share && enriched.share.enabled))
    this.setData(enriched);
  },

  onPlaceImgError: function () {
    console.log('地点图片加载失败')
    this.setData({ placeImgHidden: true })
  },

  /** 执行活动操作，有 needConfirm 时先弹框 */
  operate: function (event) {
    if (this.data.viewer) return
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
    if (this.data.viewer) return
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
    const data = { guanId: that.data.guanId }
    if (that.data.viewer) {
      data.viewer = Number(pageUrl.MEET_VIEWER_FLAG)
      data.shareOpenid = that.meetShareOpenid || ''
    }
    request.myRequest({
      url: config.guaninfoUrl,
      data: data,
      success(res) {
        if (request.requestIsSuccess(res)) {
          that._applyPageData(res.data.data)
        }
      }
    })
  },

  onLoad: function (options) {
    const viewer = options.viewer === pageUrl.MEET_VIEWER_FLAG
    this.meetShareOpenid = viewer ? (options.shareOpenid || '') : ''
    if (this.meetShareOpenid && wx.getStorageSync('shareOpenid') === '') {
      wx.setStorageSync('shareOpenid', this.meetShareOpenid)
    }
    this.setData({
      guanId: options.guanId,
      viewer: viewer,
      progressDesc: options.state || '',
    })
    console.log('打开见面', options.guanId, viewer)
    this._reloadInfo()
  },

  onShow: function () {
    const guanId = this.data.guanId
    if (!guanId) return;
    this._reloadInfo()
  },

  onShareAppMessage: function () {
    const share = this.data.share || {}
    if (share.enabled && this.data.guanId) {
      console.log('分享见面', this.data.guanId)
      return {
        title: share.label,
        path: pageUrl.getMeetViewerPage(config.GUANINFO_PAGE, this.data.guanId),
      }
    }
    return {
      title: '关关雎鸠',
      path: pageUrl.getSharePageWithOpenid(config.GUANGUAN_PAGE),
    }
  },

})
