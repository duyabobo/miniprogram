const config = require('../../config.js');
const request = require("../../util/request");
const wxInteractive = require("../../util/wx_interactive");

let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: { },

  verify: function (event) {
    wx.navigateTo({
      url: config.WORKVERIFY_PAGE,
    })
  },

  updateBirthYear: function(event) {
    console.log('picker发送选择改变，携带值为', event.detail.value)
    let that = this;
    let url = config.HTTP_HOST_TEST + config.myselfUrl
    let requestData = { 
      accessToken: app.globalData.accessToken,
      opType: 2,
      value: event.detail.value
    }
    request.normalUpdateRequest(that, url, requestData)
  },

  upsertMyself: function(event) {
    let that = this;
    wx.showActionSheet({
      itemList: event.currentTarget.dataset.item_list,
      success (res) {
        let url = config.HTTP_HOST_TEST + config.myselfUrl
        let requestData = {
          accessToken: app.globalData.accessToken,
          opType: event.currentTarget.dataset.op_type,
          value: res.tapIndex
        }
        request.normalUpdateRequest(that, url, requestData)
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
    wxInteractive.wxCheckToast(options.errMsg)
    let that = this; 
    wx.request({
      url: config.HTTP_HOST_TEST + config.myselfUrl,
      data: {
        accessToken: app.globalData.accessToken,
      },
      success(res) {
        if (request.requestIsSuccess(res)) {
          that.setData(res.data)
        }
      },
      fail(res) {
        request.logRequestErr("myselfUrl err:", res)
      }
    })
  },

})