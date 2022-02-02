var config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    guanguan_list: [
      {
        id: 1,
        img: config.CDN_QINIU_URL + "question_background.png",
        address: "玉檀园公园",
        time: "2月12日",
      }
    ],
  },

  click_guan_info: function (event) {
    const app = getApp();
    const suc_url = config.GUANINFO_PAGE + event.currentTarget.dataset.guan_id;
    if (!app.globalData.hasLogin) {
      config.wxlogin(suc_url)
    } else {
      wx.navigateTo({
        url: suc_url,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const errmsg = options.errmsg;
    console.log(errmsg)
    if (errmsg !== undefined) {
      wx.showToast({
        title: errmsg,
        icon: 'loading',
        duration: 800,
        mask: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const app = getApp()
    const that = this;
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
    wx.getLocation({
      type: 'wgs84',
      complete(res) {
        const request_data = {
          access_token: app.globalData.access_token,
          latitude: res.latitude,
          longitude: res.longitude
        };
        wx.request({
          url: config.HTTP_HOST_TEST + config.guanguan_url,
          data: request_data,
          success(res) {
            that.setData(res.data)
          },
          fail(res) {
            console.log('guanguan err')
            console.log(res)
          }
        })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})