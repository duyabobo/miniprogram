var config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    guanguan_list: [
      {
        id: 1,
        img: config.CDN_QINIU_URL + "202010201143196086.png",
        address: "地点：玉檀园公园",
        time: "时间：2月12日",
        status: "状态：虚位以待",
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
})