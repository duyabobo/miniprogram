const config = require('../../config.js')
const wxLogin = require("../../util/wx_login");

let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    has_login: app.globalData.hasLogin,
    head_imgUrl: config.CDN_QINIU_URL + 'unknown.jpg',
    func_group_list: [ 
      [
        {
          id: 1,
          url: config.MYINFORMATION_PAGE,
          name: '我的资料',
          need_login: true,
          open_type: '',
          bind_func_name: 'clickMine'
        },
        {
          id: 2,
          url: config.MYREQUIREMENT_PAGE,
          name: '我的期望',
          need_login: true,
          open_type: '',
          bind_func_name: 'clickMine'
        }
      ],
      [
        {
          id: 3,
          url: config.SUGGESTION_PAGE,
          name: '客服',
          need_login: false,
          open_type: 'contact',
          bind_func_name: 'handleContact'
        }, 
        {
          id: 4,
          url: config.SHARE_PAGE,
          name: '分享',
          need_login: false,
          open_type: 'share',
          bind_func_name: 'onShareAppMessage'
        }
      ], 
      [
        {
          id: 5,
          url: config.SETTING_PAGE,
          name: '设置',
          need_login: true,
          open_type: '',
          bind_func_name: 'clickMine'
        },
        {
          id: 6,
          url: config.ABOUT_PAGE,
          name: '关于',
          need_login: false,
          open_type: '',
          bind_func_name: 'clickMine'
        }
      ]
    ]
  },

  handleContact(e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
  },

  onShareAppMessage: function (ops) {
    console.log('share from button')
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '关关雎鸠',
      path: config.GUANGUAN_PAGE,  // 路径，传递参数到指定页面。
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },

  clickMine: function(event) {
    let sucUrl = event.currentTarget.dataset.url
    let needLogin = event.currentTarget.dataset.need_login
    if (!app.globalData.hasLogin && needLogin) {
      wxLogin.wxLogin(sucUrl)
    } else {
      wx.navigateTo({
        url: sucUrl,
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    let requestData = {
      access_token: app.globalData.accessToken,
      guan_info_id: 1 
    }
    wx.request({
      url: config.HTTP_HOST_TEST + config.myselfUrl,
      data: requestData,
      success(res) {
        that.setData(res.data)
      },
      fail(res) {
        console.log('myself fail')
      }
    })
  },
})