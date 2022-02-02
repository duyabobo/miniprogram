var config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: config.CDN_QINIU_URL + "question_background.png",
    address: "玉檀园公园",
    time: "2月12日",
    op_desc: "确认参加"
  },

  operate: function (event) {
    const app = getApp();
    const guan_id = event.currentTarget.dataset.guan_id;
    const op_type = event.currentTarget.dataset.op_type;
    wx.request({
      url: config.HTTP_HOST_TEST + config.operate_url,
      data: {
        access_token: app.globalData.access_token,
        guan_id: guan_id,
        op_type: op_type,
      },
      success(res) {
        const code = res.data.code;
        if (code !== 0) {
          const errmsg = res.data.errmsg;
          wx.reLaunch({
            url: config.GUANGUAN_PAGE + errmsg,
          })
        } else {
          wx.reLaunch({
            url: config.GUANINFO_PAGE + guan_id,
          })
        }
      },
      fail(res) {
        console.log('operate fail')
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const app = getApp();
    const guan_id = options.guan_id;
    const request_data = {
      access_token: app.globalData.access_token,
      guan_id: guan_id
    };
    wx.request({
      url: config.HTTP_HOST_TEST + config.guaninfo_url,
      data: request_data,
      success(res) {
        const code = res.data.code;
        if (code !== 0) {
          const errmsg = res.data.errmsg;
          wx.reLaunch({
            url: config.GUANGUAN_PAGE + errmsg,
          })
        }
      },
      fail(res) {
        console.log('guaninfo err')
        console.log(res)
      }
    })
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
