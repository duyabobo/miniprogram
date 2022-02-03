const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: config.CDN_QINIU_URL + "202010201143196086.png",
    address: "地点：玉檀园公园",
    time: "时间：2月12日",
    op_desc: "报名参加"
  },

  operate: function (event) {
    let app = getApp();
    let guan_id = event.currentTarget.dataset.guan_id;
    let opType = event.currentTarget.dataset.op_type;
    wx.request({
      url: config.HTTP_HOST_TEST + config.operateUrl,
      data: {
        access_token: app.globalData.accessToken,
        guan_id: guan_id,
        op_type: opType,
      },
      success(res) {
        if (res.data.code !== 0) {
          wx.reLaunch({
            url: config.GUANGUAN_PAGE + res.data.errMsg,
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
    let app = getApp();
    let guan_id = options.guan_id;
    let requestData = {
      access_token: app.globalData.accessToken,
      guan_id: guan_id
    };
    wx.request({
      url: config.HTTP_HOST_TEST + config.guaninfoUrl,
      data: requestData,
      success(res) {
        if (res.data.code !== 0) {
          wx.reLaunch({
            url: config.GUANGUAN_PAGE + res.data.errMsg,
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
