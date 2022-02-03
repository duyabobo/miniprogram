const config = require('../../config.js')
const request = require("../../util/request");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    requirement_list: [
      {
        id: 1,
        op_type: "ceshi",
        desc: "周末有时间", 
        value: "是的",
        item_list: ["是的", "没有"],
      }
    ]
  },

  upsertRequirement: function(event) {
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
        let url = config.HTTP_HOST_TEST + config.upsertRequirementUrl
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
    let that = this;
    let app = getApp();
    let requestData = {
      access_token: app.globalData.accessToken,
    };
    wx.request({
      url: config.HTTP_HOST_TEST + config.requirementUrl,
      data: requestData,
      success(res) {
        if (res.data.code === 0) {
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