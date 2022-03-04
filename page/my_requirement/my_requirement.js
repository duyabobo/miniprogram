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
      accessToken: wx.getStorageSync('accessToken'),
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
    let that = this;
    let url = config.HTTP_HOST_TEST + config.requirementUrl
    let requestData = {
      accessToken: wx.getStorageSync('accessToken'),
      opType: enumerate.MODEL_USER_OP_TYPE_HEIGHT_PERIOD,
      value: event.detail.value
    }
    request.normalUpdateRequest(that, url, requestData)
  },

  heightColumnChange(e) {  // todo 这里对于区间处理，重复代码过多，可能可以优化
    let currentColunm = e.detail.column;
    let currentValue = e.detail.value
    if (currentColunm === 0 || (currentColunm === 1 && currentValue < this.data.height.fromAndToIndex[0])) {
      this.setData({
        ["height.fromAndToIndex[0]"]: currentValue,
        ["height.fromAndToIndex[1]"]: currentValue,
      })
    } else {
      this.setData({
        ["height.fromAndToIndex[1]"]: currentValue,
      })
    }
  },

  updateWeight: function(event) {
    let that = this;
    let url = config.HTTP_HOST_TEST + config.requirementUrl
    let requestData = {
      accessToken: wx.getStorageSync('accessToken'),
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
        ["weight.fromAndToIndex[0]"]: currentValue,
        ["weight.fromAndToIndex[1]"]: currentValue,
      })
    } else {
      this.setData({
        ["weight.fromAndToIndex[1]"]: currentValue,
      })
    }
  },

  updateMonthPay: function(event) {
    let that = this;
    let url = config.HTTP_HOST_TEST + config.requirementUrl
    let requestData = {
      accessToken: wx.getStorageSync('accessToken'),
      opType: enumerate.MODEL_USER_OP_TYPE_MONTH_PAY_PERIOD,
      value: event.detail.value
    }
    request.normalUpdateRequest(that, url, requestData)
  },

  monthPayColumnChange(e) {
    let currentColunm = e.detail.column;
    let currentValue = e.detail.value
    if (currentColunm === 0 || (currentColunm === 1 && currentValue < this.data.monthPay.fromAndToIndex[0])) {
      this.setData({
        ["monthPay.fromAndToIndex[0]"]: currentValue,
        ["monthPay.fromAndToIndex[1]"]: currentValue,
      })
    } else {
      this.setData({
        ["monthPay.fromAndToIndex[1]"]: currentValue,
      })
    }
  },

  upsertRequirement: function(event) {
    let that = this;
    wx.showActionSheet({
      itemList: event.currentTarget.dataset.item_list,
      success (res) {
        let url = config.HTTP_HOST_TEST + config.requirementUrl
        let requestData = { 
          accessToken: wx.getStorageSync('accessToken'),
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
        accessToken: wx.getStorageSync('accessToken'),
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