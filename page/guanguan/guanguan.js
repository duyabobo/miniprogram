const config = require('../../config.js')
const request = require("../../util/request");
const wxInteractive = require("../../util/wx_interactive");
const pageUrl = require("../../util/page_url");
const guanguanPreview = require("../../util/mock_guanguan");
const navBar = require("../../util/nav_bar");

let app = getApp();

Page({

  data: {
    guanguanList: guanguanPreview.fillGuanguanList([], null),
    copy: {},
    phoneGate: false,
    configSufficient: true,  // 默认认为配置足够，接口返回后更新
    statusBarHeight: 20,
    navContentHeight: 44,
    navBarHeight: 64,
  },

  /** 真实活动排在前面，后面用预览数据把首页铺满 */
  applyGuanguanData: function (payload) {
    const data = payload || {}
    this.latestPayload = data
    const next = {
      guanguanList: guanguanPreview.fillGuanguanList(data.guanguanList, this.userLocation),
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

  enterAfterPhone: function (url) {
    if (wx.getStorageSync('hasLogin') && wx.getStorageSync('phoneBound')) {
      wx.navigateTo({ url: url })
      return
    }
    this.pendingUrl = url
    this.setData({ phoneGate: true })
  },

  closePhoneGate: function () {
    this.pendingUrl = ''
    this.setData({ phoneGate: false })
  },

  onGetPhoneNumber: function (event) {
    const phoneCode = (event.detail && event.detail.code) || ''
    if (!phoneCode) {
      wx.showToast({ title: '需要手机号才能继续', icon: 'none' })
      return
    }
    const that = this
    const url = this.pendingUrl
    const go = function () {
      that.setData({ phoneGate: false })
      if (url) {
        wx.navigateTo({ url: url })
      }
    }
    if (wx.getStorageSync('hasLogin')) {
      request.bindPhoneRequest(phoneCode, go)
      return
    }
    wx.login({
      success(res) {
        if (!res.code) {
          wx.showToast({ title: '登录没有完成', icon: 'none' })
          return
        }
        request.loginRequest(res.code, phoneCode, function () {
          if (!wx.getStorageSync('phoneBound')) {
            wx.showToast({ title: '没有拿到手机号，请再授权一次', icon: 'none' })
            return
          }
          go()
        })
      }
    })
  },

  /** 点击列表项进入详情页 */
  clickGuanInfo: function (event) {
    if (event.currentTarget.dataset.guan_id === 0) return;

    // 匹配配置不足：引导去配置
    if (!this.data.configSufficient) {
      this.goToMatchConfig();
      return;
    }

    const jumpUrl = config.GUANINFO_PAGE
      + "?guanId=" + event.currentTarget.dataset.guan_id
      + "&state=" + event.currentTarget.dataset.progress_desc
    this.enterAfterPhone(jumpUrl)
  },

  /** 底部「关关雎鸠」按钮，进入匹配配置 */
  goToMatchConfig: function () {
    this.enterAfterPhone(config.MATCH_CONFIG_PAGE)
  },

  onLoad: function (options) {
    this.setData(navBar.getNavBarLayout())
    if (wx.getStorageSync('shareOpenid') === '') {
      wx.setStorageSync('shareOpenid', options.shareOpenid)
    }
    wxInteractive.wxCheckToast(options.errMsg)
  },

  onShow: function () {
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
        if (that.userLocation) {
          that.setData({
            guanguanList: guanguanPreview.fillGuanguanList(
              (that.latestPayload && that.latestPayload.guanguanList) || [],
              that.userLocation
            ),
          })
        }
        request.getGuanguanRequest(that, requestData)
      }
    })
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
