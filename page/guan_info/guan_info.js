const config = require('../../config.js')
const enumerate = require("../../util/enumerate");
const request = require("../../util/request");
const pageUrl = require("../../util/page_url")
const phoneGate = require("../../util/phone_gate")

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
    subscribe: { templateIds: [] },
    phoneGate: false,
    phoneRequired: true,
  },

  _templateIds: function () {
    const fromPage = (this.data.subscribe && this.data.subscribe.templateIds) || []
    if (fromPage.length) return fromPage
    if (config.SUBSCRIBE_OFFLINE_NOTI_TID) return [config.SUBSCRIBE_OFFLINE_NOTI_TID]
    return []
  },

  _requestSubscribe: function (done) {
    const ids = this._templateIds()
    if (this.data.viewer || !ids.length) {
      if (done) done()
      return
    }
    const guanId = this.data.guanId
    wx.requestSubscribeMessage({
      tmplIds: ids,
      complete(res) {
        const openid = wx.getStorageSync('openid')
        request.simplePostRequest(config.subscribeCBUrl, { openid, guanId, subscribeRes: res })
        if (done) done(res)
      }
    })
  },

  /** 没有可展示的对方资料时，不画两列标题，也不提示空状态。 */
  _hasOpposite: function (opposite) {
    return ((opposite && opposite.rows) || []).length > 0
  },

  /** 将服务端返回的页面数据写入，注入按钮 styleKey 以支持 WXSS 样式绑定 */
  _applyPageData: function (data) {
    const enriched = Object.assign({}, data);
    const opposite = enriched.opposite || { rows: [] }
    enriched.opposite = opposite
    enriched.showOpposite = this._hasOpposite(opposite)
    enriched.placeImgHidden = false
    if (this.data.viewer) {
      enriched.viewer = true
      enriched.opposite = { rows: [] }
      enriched.showOpposite = false
      enriched.operate = Object.assign({}, enriched.operate, { bottomButtons: [] })
      enriched.share = { enabled: false, label: '' }
    }
    if (typeof enriched.phoneBound !== 'undefined') {
      phoneGate.rememberBound(enriched.phoneBound)
    }
    console.log('详情页', enriched.progressStatus, enriched.viewer, enriched.showOpposite, !!(enriched.share && enriched.share.enabled))
    this.setData(enriched);
  },

  onPlaceImgError: function () {
    console.log('地点图片加载失败')
    this.setData({ placeImgHidden: true })
  },

  /** 未绑定手机号时先绑定。需要确认的先确认。每个操作按钮确认后都申请一次订阅。 */
  operate: function (event) {
    if (this.data.viewer) return
    const btn = event.currentTarget.dataset.btn
    if (!btn) return
    const that = this
    phoneGate.requireBound(this, function () {
      that._operateAfterPhone(btn)
    })
  },

  _operateAfterPhone: function (btn) {
    const that = this
    const needConfirm = btn.needConfirm || btn.needconfirm
    if (!needConfirm) {
      this._runOperate(btn)
      return
    }
    wx.showModal({
      title: '确认' + btn.label + '？',
      content: btn.hint || '',
      confirmText: btn.label,
      cancelText: '再想想',
      success(res) {
        if (res.confirm) {
          that._runOperate(btn)
        }
      }
    })
  },

  _runOperate: function (btn) {
    const that = this
    if (!(btn.askSubscribe || btn.asksubscribe)) {
      this._doOperate(btn)
      return
    }
    this._requestSubscribe(function () {
      that._doOperate(btn)
    })
  },

  _doOperate: function (btn) {
    if (this.data.viewer) return
    const that = this
    const guanId = that.data.guanId

    if (btn.action === 'operate') {
      this._postOperate(btn, guanId)
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

  _postOperate: function (btn, guanId) {
    const that = this
    app.preventActive(() => {
      request.myRequest({
        url: config.guaninfoUrl,
        method: 'PUT',
        data: { guanId, opType: btn.opType },
        success(res) {
          if (request.requestIsSuccess(res) || request.requestFinishBiggerThanCode(res, enumerate.GUAN_SUCCESS_WITH_NOTI_MIN_CODE)) {
            that._applyPageData(res.data.data)
            wx.showModal({ title: res.data.errMsg || '操作成功', showCancel: false, confirmText: '确认' })
          } else if (request.requestFinishWithCode(res, enumerate.PHONE_REQUIRED_CODE)) {
            phoneGate.markUnbound(that)
          } else if (request.requestFinishWithCode(res, enumerate.NEED_FILL_INFORMATION_CODE)) {
            wx.navigateTo({ url: config.MATCH_CONFIG_PAGE })
          } else {
            wx.showModal({ title: res.data.errMsg, showCancel: false, confirmText: '确认' })
          }
        }
      })
    })
  },

  _reloadInfo: function () {
    const that = this
    const data = { guanId: that.data.guanId }
    if (that.data.viewer) {
      data.viewer = Number(pageUrl.MEET_VIEWER_FLAG)
      data.sharePassportId = that.meetSharePassportId || ''
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

  closePhoneGate: function () {
    phoneGate.closePhoneGate(this)
  },

  onPhoneBound: function () {
    phoneGate.onPhoneBound(this)
  },

  onLoad: function (options) {
    const viewer = options.viewer === pageUrl.MEET_VIEWER_FLAG
    this.meetSharePassportId = viewer ? (options.sharePassportId || '') : ''
    if (this.meetSharePassportId && wx.getStorageSync('sharePassportId') === '') {
      wx.setStorageSync('sharePassportId', this.meetSharePassportId)
    }
    this.setData({
      guanId: options.guanId,
      viewer: viewer,
      progressDesc: options.state || '',
    })
    console.log('打开详情', options.guanId, viewer)
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
      console.log('分享详情', this.data.guanId)
      const copy = this.data.copy || {}
      const payload = pageUrl.meetSharePayload(this.data.activity, this.data.placeImgHidden, copy.shareCardTitle)
      payload.path = pageUrl.getMeetViewerPage(config.GUANINFO_PAGE, this.data.guanId)
      return payload
    }
    return {
      title: (this.data.copy && this.data.copy.shareTitle) || '',
      path: pageUrl.getSharePageWithOpenid(config.GUANGUAN_PAGE),
    }
  },

})
