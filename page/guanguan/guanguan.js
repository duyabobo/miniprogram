const config = require('../../config.js')
const wxLogin = require("../../util/wx_login");
const request = require("../../util/request");
const wxInteractive = require("../../util/wx_interactive");
const pageUrl = require("../../util/page_url");

let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    guanguanList: [],
  },

  clickGuanInfo: function (event) {
    let needLogin = !wx.getStorageSync('hasLogin')
    let sucUrl = config.GUANINFO_PAGE + "?guanId=" + event.currentTarget.dataset.guan_id + "&state=" + event.currentTarget.dataset.state
    wxLogin.checkLoginBeforeJump(sucUrl, needLogin)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('shareOpenid') === '') {
      wx.setStorageSync('shareOpenid', options.shareOpenid)
    }
    wxInteractive.wxCheckToast(options.errMsg)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getSetting({
      success(res) {
        let status = res.authSetting['scope.userLocation']
        if (!status) {
          wx.authorize({ // 发起请求用户授权
            scope: 'scope.userLocation'
          })
        }
      }
    })

    const that = this;
    wx.getLocation({
      type: 'wgs84',
      complete(res) {
        let requestData = {
          accessToken: wx.getStorageSync('accessToken'),
          latitude: res.latitude,
          longitude: res.longitude
        };
        request.getGuanguanRequest(that, requestData)
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
  
})