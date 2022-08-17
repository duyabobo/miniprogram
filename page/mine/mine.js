const config = require('../../config.js')
const wxLogin = require("../../util/wx_login");
const request = require("../../util/request");
const pageUrl = require("../../util/page_url");
const wxInteractive = require("../../util/wx_interactive");

let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: { 
    headImg: config.CDN_QINIU_URL + 'unknown.jpg',
    hasLogin: wx.getStorageSync('hasLogin'),
  },

  handleContact(e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
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

  clickMine: function(event) {
    let needLogin = !wx.getStorageSync('hasLogin') && event.currentTarget.dataset.need_login
    wxLogin.checkLoginBeforeJump(event.currentTarget.dataset.url, needLogin)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    request.myRequest({
      url: config.mineUrl,
      data: {
        accessToken: wx.getStorageSync('accessToken'),
      },
      success(res) {
        if (request.requestIsSuccess(res)) {
          that.setData(res.data.data)
        }
      },
      fail(res) {
        request.logRequestErr("mineUrl err:", res)
      }
    })
  },

  logout: function () {
    wx.showModal({
      title: '确认要退出登录？',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          request.myRequest({
            url: config.loginUrl,
            method: 'PUT',
            data: {
              accessToken: wx.getStorageSync('accessToken'),
            },
            success(res) {
              if (request.requestIsSuccess(res)) {
                wx.setStorageSync('hasLogin', false)
                wx.setStorageSync('accessToken', '')
                wx.reLaunch({
                  url: config.MINE_PAGE,
                })
              }
            },
            fail(res) {
              request.logRequestErr("loginUrl err:", res)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
})