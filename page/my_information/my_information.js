var config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_info: [
      {
        id: 1,
        op_type: "ceshi",
        desc: "周末有时间", 
        value: "是的",
        item_list: ["是的", "没有"],
      }
    ]
  },

  upsert_myself: function(event) {
    const that = this;
    const id = event.currentTarget.dataset.id;
    const op_type = event.currentTarget.dataset.op_type;
    const item_list = event.currentTarget.dataset.item_list;
    wx.showActionSheet({
      itemList: item_list,
      success (res) {
        console.log(res.tapIndex)
        wx.request({
          url: config.HTTP_HOST_TEST + config.update_myself_url,
          data: {
            id: id,
            op_type: op_type,
            value: res.tapIndex
          },
          success(res) {
            that.setData(res.data)  // 有性能问题
          },
          fail(res) {
            console.log('update_myself fail')
          }
        })
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    const app = getApp();
    const request_data = {
      access_token: app.globalData.access_token,
    };
    wx.request({
      url: config.HTTP_HOST_TEST + config.myself_url,
      data: request_data,
      success(res) {
        const code = res.data.code;
        if (code == 0) {
          that.setData(res.data)
        }
      },
      fail(res) {
        console.log('myself err')
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