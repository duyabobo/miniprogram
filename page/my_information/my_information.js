const config = require('../../config.js');
const request = require("../../util/request");
const wxInteractive = require("../../util/wx_interactive");
const enumerate = require("../../util/enumerate");

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

  upsertMyself: function(event) {
    let that = this;
    let id = event.currentTarget.dataset.id;
    let opType = event.currentTarget.dataset.op_type;
    let itemList = event.currentTarget.dataset.item_list;
    wx.showActionSheet({
      itemList: itemList,
      success (res) {
        console.log(res.tapIndex)
        let requestData = {
          id: id,
          op_type: opType,
          value: res.tapIndex
        }
        let url = config.HTTP_HOST_TEST + config.updateMyselfUrl
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
    wxInteractive.wxToast(options.errMsg)
    let that = this;
    let app = getApp();
    let requestData = {
      access_token: app.globalData.accessToken,
    };
    wx.request({
      url: config.HTTP_HOST_TEST + config.myselfUrl,
      data: requestData,
      success(res) {
        if (res.data.code === enumerate.SUCESS_CODE) {
          that.setData(res.data)
        }
      },
      fail(res) {
        console.log('myself err')
        console.log(res)
      }
    })
  },

})