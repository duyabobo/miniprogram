const config = require('../../config.js')
const wxLogin = require("../../util/wx_login");
const request = require("../../util/request");

let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: { 
    headImg: config.CDN_QINIU_URL + 'unknown.jpg',
    mainGroupList: [
      [
        {
          id: 1,
          index: 0,
          url: config.MYINFORMATION_PAGE,
          name: '我的资料',
          needLogin: true,
          openType: '',
          bindFuncName: 'clickMine'
        },
        {
          id: 2,
          index: 1,
          url: config.MYREQUIREMENT_PAGE,
          name: '我的期望',
          needLogin: true,
          openType: '',
          bindFuncName: 'clickMine'
        }
      ],
      [
        {
          id: 3,
          index: 0,
          url: config.SUGGESTION_PAGE,
          name: '客服',
          needLogin: false,
          openType: 'contact',
          bindFuncName: 'handleContact'
        }, 
        {
          id: 4,
          index: 1,
          url: config.SHARE_PAGE,
          name: '分享',
          needLogin: false,
          openType: 'share',
          bindFuncName: 'onShareAppMessage'
        }
      ], 
      [
        {
          id: 5,
          index: 0,
          url: config.SECRET_PAGE,
          name: '隐私条款',
          needLogin: false,
          openType: '',
          bindFuncName: 'clickMine'
        },
        {
          id: 6,
          index: 1,
          url: config.ABOUT_PAGE,
          name: '关于我们',
          needLogin: false,
          openType: '',
          bindFuncName: 'clickMine'
        }
      ]
    ]
  },

  handleContact(e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
  },

  onShareAppMessage: function (ops) {
    return {
      title: '关关雎鸠',
      path: config.GUANGUAN_PAGE,
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
    wx.request({
      url: config.HTTP_HOST_TEST + config.mineUrl,
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
    wx.request({
      url: config.HTTP_HOST_TEST + config.loginUrl,
      method: 'PUT',
      data: {
        accessToken: wx.getStorageSync('accessToken'),
      },
      success(res) {
        if (request.requestIsSuccess(res)) {
          wx.setStorageSync('hasLogin', false)
          wx.setStorageSync('accessToken', '')
          wx.reLaunch({
            url: config.GUANGUAN_PAGE,
          })
        }
      },
      fail(res) {
        request.logRequestErr("loginUrl err:", res)
      }
    })
  },
})