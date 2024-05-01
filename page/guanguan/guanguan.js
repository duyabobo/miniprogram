const config = require('../../config.js')
const wxLogin = require("../../util/wx_login");
const request = require("../../util/request");
const wxInteractive = require("../../util/wx_interactive");
const pageUrl = require("../../util/page_url");
const constVar = require("../../util/const_var");

let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    locationIsAllow: false, // 当前用户是否已允许获取地理位置，如果之前允许过，那么就允许
    couldAskLocation: false,  // 当前用户的当前上下文是否可以获取地理位置，如果用户已经知道产品功能，就可以
    guanguanList: [
      constVar.defaultGuan,
      constVar.defaultGuan,
      constVar.defaultGuan,
      constVar.defaultGuan,
      constVar.defaultGuan,
      constVar.defaultGuan,
      constVar.defaultGuan,
      constVar.defaultGuan,
      constVar.defaultGuan,
      constVar.defaultGuan
    ]
  },

  clickGuanInfo: function (event) {
    if (event.currentTarget.dataset.guan_id === 0) {
      return
    }

    let needLogin = !wx.getStorageSync('hasLogin')
    let jumpUrl = config.GUANINFO_PAGE + "?guanId=" + event.currentTarget.dataset.guan_id + "&state=" + event.currentTarget.dataset.state
    wxLogin.checkLoginBeforeJump(function () {
      wx.showToast({ title: "登陆成功", duration: 500});
      setTimeout(()=> {
        wx.switchTab({
          url: config.GUANGUAN_PAGE,
          success: function(e) {
            let page = getCurrentPages().pop();
            if (page === undefined || page == null) return;
            page.onLoad({"couldAskLocation":true});
            page.onShow();
          }
        })
      }, 500)
    }, jumpUrl, needLogin)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('shareOpenid') === '') {
      wx.setStorageSync('shareOpenid', options.shareOpenid)
    }
    wxInteractive.wxCheckToast(options.errMsg)

    let couldAskLocation = false
    if (options.couldAskLocation) {
      couldAskLocation = true
    }
    this.setData({"couldAskLocation": couldAskLocation})
    const that = this;
    let requestData = {};
    request.getLocationAllowState(that, requestData)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this;
    let requestData = {}
    if (this.data.locationIsAllow || this.data.couldAskLocation) {
      wx.getLocation({
        type: 'wgs84',
        complete(res) {
          requestData = {
            latitude: res.latitude,
            longitude: res.longitude
          };
        }
      })
    } 
    request.getGuanguanRequest(that, requestData)
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