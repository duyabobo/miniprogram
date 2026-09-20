const config = require('../../config.js')
const wxLogin = require("../../util/wx_login");
const request = require("../../util/request");
const wxInteractive = require("../../util/wx_interactive");
const pageUrl = require("../../util/page_url");
const constVar = require("../../util/const_var");

let app = getApp();

Page({

  data: {
    guanguanList: [
      constVar.defaultGuan,
      constVar.defaultGuan,
      constVar.defaultGuan,
      constVar.defaultGuan,
      constVar.defaultGuan,
    ],
    configSufficient: true,  // 默认认为配置足够，接口返回后更新
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

  /** 底部"匹配配置"按钮 */
  goToMatchConfig: function () {
    const needLogin = !wx.getStorageSync('hasLogin')
    wxLogin.checkLoginBeforeJump(function () {
      wx.navigateTo({ url: config.MATCH_CONFIG_PAGE })
    }, config.MATCH_CONFIG_PAGE, needLogin)
  },

  onLoad: function (options) {
    if (wx.getStorageSync('shareOpenid') === '') {
      wx.setStorageSync('shareOpenid', options.shareOpenid)
    }
    wxInteractive.wxCheckToast(options.errMsg)
  },

  onShow: function () {
    const that = this
    if (wx.getStorageSync('hasLogin')) {
      wx.getLocation({
        type: 'wgs84',
        complete(res) {
          request.getGuanguanRequest(that, {
            latitude: res.latitude,
            longitude: res.longitude
          })
        }
      })
    } else {
      request.getGuanguanRequest(that, {})
    }
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
