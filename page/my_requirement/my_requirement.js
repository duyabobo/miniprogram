const config = require('../../config.js')
const request = require("../../util/request");
const enumerate = require("../../util/enumerate");

let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: { },

  updateBirthYear: function(event) {
    console.log('picker发送选择改变，携带值为', event.detail.value)
    let that = this;
    let url = config.HTTP_HOST_TEST + config.requirementUrl
    let requestData = { 
      accessToken: app.globalData.accessToken,
      opType: enumerate.MODEL_USER_OP_TYPE_BIRTH_YEAR,
      value: event.detail.value
    }
    request.normalUpdateRequest(that, url, requestData)
  },

  updateHeight: function(event) {
    console.log('picker发送选择改变，携带值为', event.detail.value)
    let that = this;
    let url = config.HTTP_HOST_TEST + config.requirementUrl
    let requestData = {
      accessToken: app.globalData.accessToken,
      opType: enumerate.MODEL_USER_OP_TYPE_HEIGHT,
      value: event.detail.value
    }
    request.normalUpdateRequest(that, url, requestData)
  },

  updateWeight: function(event) {
    console.log('picker发送选择改变，携带值为', event.detail.value)
    let that = this;
    let url = config.HTTP_HOST_TEST + config.requirementUrl
    let requestData = {
      accessToken: app.globalData.accessToken,
      opType: enumerate.MODEL_USER_OP_TYPE_WEIGHT,
      value: event.detail.value
    }
    request.normalUpdateRequest(that, url, requestData)
  },

  updateMonthPay: function(event) {
    console.log('picker发送选择改变，携带值为', event.detail.value)
    let that = this;
    let url = config.HTTP_HOST_TEST + config.requirementUrl
    let requestData = {
      accessToken: app.globalData.accessToken,
      opType: enumerate.MODEL_USER_OP_TYPE_MONTH_PAY,
      value: event.detail.value
    }
    request.normalUpdateRequest(that, url, requestData)
  },

  upsertRequirement: function(event) {
    let that = this;
    wx.showActionSheet({
      itemList: event.currentTarget.dataset.item_list,
      success (res) {
        let url = config.HTTP_HOST_TEST + config.requirementUrl
        let requestData = { 
          accessToken: app.globalData.accessToken,
          opType: event.currentTarget.dataset.op_type,
          value: res.tapIndex
        }
        request.normalUpdateRequest(that, url, requestData)
      },
      fail (res) {
        request.logRequestErr("upsertRequirementUrl err:", res)
      }
    })    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this; 
    wx.request({
      url: config.HTTP_HOST_TEST + config.requirementUrl,
      data: {
        accessToken: app.globalData.accessToken,
      },
      success(res) {
        if (request.requestIsSuccess(res)) {
          that.setData(res.data.data)
        }
      },
      fail(res) {
        request.logRequestErr("requirementUrl err:", res)
      }
    })
  },
})