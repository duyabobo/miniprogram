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
          url: config.MYINFORMATION_PAGE,
          name: '我的资料',
          needLogin: true,
          openType: '',
          bindFuncName: 'clickMine'
        },
        {
          id: 2,
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
          url: config.SUGGESTION_PAGE,
          name: '客服',
          needLogin: false,
          openType: 'contact',
          bindFuncName: 'handleContact'
        }, 
        {
          id: 4,
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
          url: config.SETTING_PAGE,
          name: '设置',
          needLogin: true,
          openType: '',
          bindFuncName: 'clickMine'
        },
        {
          id: 6,
          url: config.ABOUT_PAGE,
          name: '关于',
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
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
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
    let needLogin = !app.globalData.hasLogin && event.currentTarget.dataset.need_login
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
        accessToken: app.globalData.accessToken,
      },
      success(res) {
        if (request.requestIsSuccess(res)) {
          that.setData(res.data)
        }
      },
      fail(res) {
        request.logRequestErr("mineUrl err:", res)
      }
    })
  },
})