const config = require('../../config.js')
const request = require("../../util/request");
const wxInteractive = require("../../util/wx_interactive");
const pageUrl = require("../../util/page_url");
const guanguanPreview = require("../../util/mock_guanguan");
const navBar = require("../../util/nav_bar");
const wxLogin = require("../../util/wx_login");

let app = getApp();

Page({

  data: {
    guanguanList: guanguanPreview.fillGuanguanList([], null),
    copy: {},
    configSufficient: true,  // 默认认为配置足够，接口返回后更新
    statusBarHeight: 20,
    navContentHeight: 44,
    navBarHeight: 64,
  },

  _listForView: function (rawList, loginHint) {
    return guanguanPreview.fillGuanguanList(rawList || [], this.userLocation, null, loginHint)
  },

  /** 列表顺序和去留都按接口返回，这里只补展示文案。 */
  applyGuanguanData: function (payload) {
    const data = payload || {}
    this.latestPayload = data
    const loginHint = data.copy && data.copy.loginHint
    const next = {
      guanguanList: this._listForView(data.guanguanList, loginHint),
    }
    if (typeof data.configSufficient !== 'undefined') {
      next.configSufficient = data.configSufficient
    }
    if (data.copy) {
      next.copy = data.copy
    }
    if (typeof data.phoneBound !== 'undefined') {
      wx.setStorageSync('phoneBound', !!data.phoneBound)
    }
    this.setData(next)
  },

  guideLogin: function (afterLogin) {
    wxLogin.wxLogin(afterLogin)
  },

  /** 未登录时点占位场次，先登录再刷新首页。 */
  clickGuanInfo: function (event) {
    const that = this
    if (!wx.getStorageSync('hasLogin')) {
      this.guideLogin(function () { that.loadList() })
      return
    }
    const guanId = Number(event.currentTarget.dataset.guan_id)
    if (!guanId || guanId <= 0) return

    if (!this.data.configSufficient) {
      this.goToMatchConfig();
      return;
    }

    const jumpUrl = config.GUANINFO_PAGE
      + "?guanId=" + guanId
      + "&state=" + event.currentTarget.dataset.progress_desc
    wx.navigateTo({ url: jumpUrl })
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

  loadList: function () {
    const that = this
    wx.getLocation({
      type: 'wgs84',
      complete(res) {
        if (typeof res.latitude === 'number' && typeof res.longitude === 'number') {
          that.userLocation = { latitude: res.latitude, longitude: res.longitude }
        }
        const requestData = {}
        if (wx.getStorageSync('hasLogin') && that.userLocation) {
          requestData.latitude = that.userLocation.latitude
          requestData.longitude = that.userLocation.longitude
        }
        if (that.userLocation && that.latestPayload) {
          const hint = that.data.copy && that.data.copy.loginHint
          that.setData({
            guanguanList: that._listForView(that.latestPayload.guanguanList, hint),
          })
        }
        request.getGuanguanRequest(that, requestData)
      }
    })
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
