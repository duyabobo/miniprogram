const config = require('../../config.js')
const wxLogin = require("../../util/wx_login");
const request = require("../../util/request");
const wxInteractive = require("../../util/wx_interactive");

let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    guanguanList: [
      {
        id: 1,
        img: config.CDN_QINIU_URL + "202010201143196086.png",
        address: "地点：玉檀园公园",
        time: "时间：2月12日",
        status: "状态：虚位以待",
      }
    ],
  },

  clickGuanInfo: function (event) {
    let needLogin = !app.globalData.hasLogin
    wxLogin.checkLoginBeforeJump(config.GUANINFO_PAGE + event.currentTarget.dataset.guan_id, needLogin)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
          accessToken: app.globalData.accessToken,
          latitude: res.latitude,
          longitude: res.longitude
        };
        request.getGuanguanRequest(that, requestData)
      }
    })
  },
  
})