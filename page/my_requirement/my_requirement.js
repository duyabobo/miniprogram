const config = require('../../config.js')
const request = require("../../util/request");
const enumerate = require("../../util/enumerate");

let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: { },

  updateBirthYear(event) {
    let that = this;
    let url = config.HTTP_HOST_TEST + config.requirementUrl
    let requestData = {
      accessToken: app.globalData.accessToken,
      opType: enumerate.MODEL_USER_OP_TYPE_BIRTH_YEAR_PERIOD,
      value: event.detail.value
    }
    request.normalUpdateRequest(that, url, requestData)
  },
  
  birthYearColumnChange(e) {
    let currentColunm = e.detail.column; 
    let currentValue = e.detail.value 
    if (currentColunm === 0 || (currentColunm === 1 && currentValue < this.data.birthYear.fromAndToIndex[0])) {
      this.setData({
        ["birthYear.fromAndToIndex[0]"]: currentValue,
        ["birthYear.fromAndToIndex[1]"]: currentValue,
      })
    } else {
      this.setData({
        ["birthYear.fromAndToIndex[1]"]: currentValue,
      })
    }
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
    let that = this;
    let url = config.HTTP_HOST_TEST + config.requirementUrl
    let requestData = {
      accessToken: app.globalData.accessToken,
      opType: enumerate.MODEL_USER_OP_TYPE_WEIGHT_PERIOD,
      value: event.detail.value
    }
    request.normalUpdateRequest(that, url, requestData)
  },

  weightColumnChange(e) {
    let currentColunm = e.detail.column;
    let currentValue = e.detail.value
    if (currentColunm === 0 || (currentColunm === 1 && currentValue < this.data.weight.fromAndToIndex[0])) {
      this.setData({
        ["birthYear.fromAndToIndex[0]"]: currentValue,
        ["birthYear.fromAndToIndex[1]"]: currentValue,
      })
    } else {
      this.setData({
        ["birthYear.fromAndToIndex[1]"]: currentValue,
      })
    }
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