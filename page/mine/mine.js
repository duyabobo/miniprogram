var config = require('../../config.js')

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    has_login: app.hasLogin, 
    head_img_url: config.CDN_QINIU_URL + 'unknown.jpg',
    func_group_list: [ 
      [
        {
          id: 1,
          url: config.MYGUAN_PAGE,
          name: '我的资料',
          need_login: true,
          open_type: '',
          bind_func_name: 'click_mine'
        },
        {
          id: 2,
          url: config.MYREQUIREMENT_PAGE,
          name: '择偶条件',
          need_login: true,
          open_type: '',
          bind_func_name: 'click_mine'
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
          bind_func_name: 'click_mine'
        },
        {
          id: 6,
          url: config.ABOUT_PAGE,
          name: '关于',
          need_login: false,
          open_type: '',
          bind_func_name: 'click_mine'
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {   
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  click_mine: function(event) {
    var app = getApp() 
    var suc_url = event.currentTarget.dataset.url
    var need_login = event.currentTarget.dataset.need_login
    if (!app.globalData.hasLogin && need_login) {
      config.wxlogin(suc_url)
    } else {
      wx.navigateTo({
        url: suc_url,
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    var request_data = {
      access_token: app.globalData.access_token,
      guan_info_id: 1 
    }
    wx.request({
      url: config.HTTP_HOST_TEST + config.myself_url,
      data: request_data,
      success(res) {
        that.setData(res.data)
      },
      fail(res) {
        console.log('myself fail')
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
})