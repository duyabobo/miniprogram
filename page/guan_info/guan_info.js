var config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: config.CDN_QINIU_URL + "202010201143196086.png",
    address: "地点：玉檀园公园",
    time: "时间：2月12日",
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
        if (res.data.code !== 0) {
          wx.reLaunch({
            url: config.GUANGUAN_PAGE + res.data.errmsg,
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
        if (res.data.code !== 0) {
          wx.reLaunch({
            url: config.GUANGUAN_PAGE + res.data.errmsg,
          })
        }
      },
      fail(res) {
        console.log('guaninfo err')
        console.log(res)
      }
    })
  },
})
