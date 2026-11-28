const config = require('../../config.js')
const request = require("../../util/request");
const wxInteractive = require("../../util/wx_interactive");
const pageUrl = require("../../util/page_url");
const guanguanPreview = require("../../util/mock_guanguan");
const navBar = require("../../util/nav_bar");
const wxLogin = require("../../util/wx_login");

const LIST_PAGE_SIZE = 20

let app = getApp();

Page({

  data: {
    guanguanList: guanguanPreview.fillGuanguanList([], null),
    copy: {},
    statusBarHeight: 20,
    navContentHeight: 44,
    navBarHeight: 64,
    loginSheet: false,
    hasMore: false,
    loadingMore: false,
    showNoMore: false,
  },

  _listForView: function (rawList, loginHint) {
    return guanguanPreview.fillGuanguanList(rawList || [], this.userLocation, null, loginHint)
  },

  /** 列表顺序和去留都按接口返回，这里只补展示文案。append 时接到现有列表后面。 */
  applyGuanguanData: function (payload, append) {
    const data = payload || {}
    const loginHint = data.copy && data.copy.loginHint
    const pageList = this._listForView(data.guanguanList, loginHint)
    const pageCount = (data.guanguanList || []).length
    if (append) {
      this._serverCount = (this._serverCount || 0) + pageCount
      this.latestPayload = Object.assign({}, this.latestPayload || {}, data, {
        guanguanList: ((this.latestPayload && this.latestPayload.guanguanList) || []).concat(data.guanguanList || []),
      })
    } else {
      this._serverCount = pageCount
      this.latestPayload = data
    }
    const loginOnly = !append && pageCount === 1 && pageList[0] && pageList[0].needLogin
    const next = {
      guanguanList: append
        ? (this.data.guanguanList || []).concat(pageList)
        : pageList,
      hasMore: !!data.hasMore,
      loadingMore: false,
      showNoMore: !data.hasMore && !loginOnly && (append || pageCount > 0),
    }
    if (data.copy) {
      next.copy = data.copy
    }
    if (typeof data.phoneBound !== 'undefined') {
      wx.setStorageSync('phoneBound', !!data.phoneBound)
    }
    const that = this
    this.setData(next, function () { that._openPending() })
  },

  onGuanguanLoadMoreDone: function () {
    this._loadingMore = false
    this.setData({ loadingMore: false })
  },

  guideLogin: function (afterLogin) {
    if (this._loginBusy) {
      console.log('微信登录进行中')
      return false
    }
    console.log('打开微信登录')
    this._afterLogin = afterLogin
    this.setData({ loginSheet: true })
    return true
  },

  confirmLogin: function () {
    if (this._loginBusy) return
    const afterLogin = this._afterLogin
    this._loginBusy = true
    this._afterLogin = null
    const that = this
    this.setData({ loginSheet: false })
    wxLogin.startWxLogin(function () {
      that._loginBusy = false
      if (typeof afterLogin === 'function') afterLogin()
    }, function () {
      that._loginBusy = false
      that._pendingOpen = null
    })
  },

  cancelLogin: function () {
    if (this._loginBusy) return
    console.log('取消微信登录')
    this._afterLogin = null
    this._pendingOpen = null
    this.setData({ loginSheet: false })
  },

  holdLoginSheet: function () {},

  _openGuan: function (guanId, progressDesc) {
    if (!guanId || guanId <= 0) return
    const jumpUrl = config.GUANINFO_PAGE
      + "?guanId=" + guanId
      + "&state=" + (progressDesc || '')
    wx.navigateTo({ url: jumpUrl })
  },

  /** 登录成功并且列表已经写回之后，再打开刚才点的那场。 */
  _openPending: function () {
    const pending = this._pendingOpen
    if (!pending || !pending.armed || !wx.getStorageSync('hasLogin')) return
    this._pendingOpen = null
    this._openGuan(pending.guanId, pending.progressDesc)
  },

  /** 未登录时先登录。登录成功后刷新首页，并打开刚才点的那场。 */
  clickGuanInfo: function (event) {
    const that = this
    const guanId = Number(event.currentTarget.dataset.guan_id)
    const progressDesc = event.currentTarget.dataset.progress_desc
    if (!wx.getStorageSync('hasLogin')) {
      const opened = this.guideLogin(function () {
        if (that._pendingOpen) that._pendingOpen.armed = true
        that.loadList()
      })
      if (opened) {
        this._pendingOpen = { guanId: guanId, progressDesc: progressDesc, armed: false }
      }
      return
    }
    this._openGuan(guanId, progressDesc)
  },

  /** 底部入口。未登录先登录，成功后再进入语音页。 */
  goToMatchConfig: function () {
    const open = function () {
      wx.navigateTo({ url: config.MATCH_CONFIG_PAGE })
    }
    if (!wx.getStorageSync('hasLogin')) {
      this.guideLogin(open)
      return
    }
    open()
  },

  onLoad: function (options) {
    this.setData(navBar.getNavBarLayout())
    if (wx.getStorageSync('sharePassportId') === '' && options.sharePassportId) {
      wx.setStorageSync('sharePassportId', options.sharePassportId)
    }
    wxInteractive.wxCheckToast(options.errMsg)
  },

  loadList: function (options) {
    const append = !!(options && options.append)
    if (append) {
      if (!this.data.hasMore || this._loadingMore) return
      this._loadingMore = true
      this.setData({ loadingMore: true })
      this._fetchList(true)
      return
    }
    this._loadingMore = false
    this._serverCount = 0
    this._listStamp = (this._listStamp || 0) + 1
    this.setData({ hasMore: false, loadingMore: false, showNoMore: false })
    this._fetchList(false)
  },

  _fetchList: function (append) {
    const that = this
    const stamp = this._listStamp
    const send = function () {
      if (stamp !== that._listStamp) {
        if (append) that.onGuanguanLoadMoreDone()
        return
      }
      const requestData = {
        limit: LIST_PAGE_SIZE,
        offset: append ? (that._serverCount || 0) : 0,
      }
      if (wx.getStorageSync('hasLogin') && that.userLocation) {
        requestData.latitude = that.userLocation.latitude
        requestData.longitude = that.userLocation.longitude
      }
      if (!append && that.userLocation && that.latestPayload) {
        const hint = that.data.copy && that.data.copy.loginHint
        that.setData({
          guanguanList: that._listForView(that.latestPayload.guanguanList, hint),
        })
      }
      request.getGuanguanRequest(that, requestData, stamp, append)
    }
    if (append && that.userLocation) {
      send()
      return
    }
    wx.getLocation({
      type: 'wgs84',
      complete(res) {
        if (typeof res.latitude === 'number' && typeof res.longitude === 'number') {
          that.userLocation = { latitude: res.latitude, longitude: res.longitude }
        }
        send()
      }
    })
  },

  onListReachBottom: function () {
    this.loadList({ append: true })
  },

  onShow: function () {
    this.loadList()
  },

  onShareAppMessage: function () {
    return {
      title: (this.data.copy && this.data.copy.shareTitle) || '',
      path: pageUrl.getSharePageWithOpenid(config.GUANGUAN_PAGE),
      success: function (res) { console.log("转发成功:" + JSON.stringify(res)) },
      fail: function (res) { console.log("转发失败:" + JSON.stringify(res)) }
    }
  },

})
