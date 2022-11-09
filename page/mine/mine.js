const config = require('../../config.js')
const wxLogin = require("../../util/wx_login");
const request = require("../../util/request");
const pageUrl = require("../../util/page_url");

let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: { 
    headImg: config.CDN_QINIU_URL + 'miniprogress/user_head/camera.jpeg',
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

  takePhoto: function(event) {
    let needLogin = !wx.getStorageSync('hasLogin')
    let url = config.TAKE_PHOTO
    wxLogin.checkLoginBeforeJump(function (){
      wx.navigateTo({
        url: url,
      })
    }, url, needLogin)
  },

  clickMine: function(event) {
    let needLogin = !wx.getStorageSync('hasLogin') && event.currentTarget.dataset.need_login
    let url = event.currentTarget.dataset.url
    wxLogin.checkLoginBeforeJump(function (){
      wx.navigateTo({
        url: url,
      })
    }, url, needLogin)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    request.myRequest({
      url: config.mineUrl,
      data: {
      },
      success(res) {
        if (request.requestIsSuccess(res)) {
          that.setData(res.data.data)
        }
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
            data: {},
            success(res) {
              if (request.requestIsSuccess(res)) {
                wx.setStorageSync('hasLogin', false)
                wx.setStorageSync('accessToken', '')
                wx.setStorageSync('secret', '')
                wx.reLaunch({
                  url: config.MINE_PAGE,
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
})