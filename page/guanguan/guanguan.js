const config = require('../../config.js')
const wxLogin = require("../../util/wx_login");
const request = require("../../util/request");
const wxInteractive = require("../../util/wx_interactive");
const pageUrl = require("../../util/page_url");
const guanguanPreview = require("../../util/mock_guanguan");
const navBar = require("../../util/nav_bar");

let app = getApp();

Page({

  data: {
    guanguanList: guanguanPreview.fillGuanguanList([], null),
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
    this.setData(next)
  },

  /** 点击列表项进入详情页 */
  clickGuanInfo: function (event) {
    if (event.currentTarget.dataset.guan_id === 0) return;

    // 匹配配置不足：引导去配置
    if (!this.data.configSufficient) {
      this.goToMatchConfig();
      return;
    }

    const needLogin = !wx.getStorageSync('hasLogin')
    const jumpUrl = config.GUANINFO_PAGE
      + "?guanId=" + event.currentTarget.dataset.guan_id
      + "&state=" + event.currentTarget.dataset.progress_desc

    wxLogin.checkLoginBeforeJump(function () {
      wx.showToast({ title: "登陆成功", duration: 500 });
      setTimeout(() => {
        wx.navigateTo({ url: jumpUrl })
      }, 500)
    }, jumpUrl, needLogin)
  },

  /** 底部「关关雎鸠」按钮，进入匹配配置 */
  goToMatchConfig: function () {
    const needLogin = !wx.getStorageSync('hasLogin')
    wxLogin.checkLoginBeforeJump(function () {
      wx.navigateTo({ url: config.MATCH_CONFIG_PAGE })
    }, config.MATCH_CONFIG_PAGE, needLogin)
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
