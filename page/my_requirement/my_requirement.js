const config = require('../../config.js')
const request = require("../../util/request");
const util = require("../../util/util");

let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: { 
  },

  updateRequirement(opType, value) {
    let that = this;
    let url = config.HTTP_HOST_TEST + config.requirementUrl
    let requestData = {
      accessToken: wx.getStorageSync('accessToken'),
      opType: opType,
      value: value
    }
    request.normalUpdateRequest(that, url, requestData)
  },

  updateSex: function(event) {
    this.updateRequirement(util.getFunName(this.updateSex), event.detail.value)
  },

  updateBirthYearPeriod: function(event) {
    this.updateRequirement(util.getFunName(this.updateBirthYearPeriod), event.detail.value)
  },

  updateHeightPeriod: function(event) {
    this.updateRequirement(util.getFunName(this.updateHeightPeriod), event.detail.value)
  },

  updateWeightPeriod: function(event) {
    this.updateRequirement(util.getFunName(this.updateWeightPeriod), event.detail.value)
  },

  updateMonthPayPeriod: function(event) {
    this.updateRequirement(util.getFunName(this.updateMonthPayPeriod), event.detail.value)
  },

  updateMartialStatus: function(event) {
    this.updateRequirement(util.getFunName(this.updateMartialStatus), event.detail.value)
  },

  updateHomeRegionPeriod: function (event) {
    this.updateRequirement(util.getFunName(this.updateHomeRegionPeriod), event.detail.value)
  },

  updateStudyRegionPeriod: function (event) {
    this.updateRequirement(util.getFunName(this.updateStudyRegionPeriod), event.detail.value)
  },

  updateEducationMulti: function (event) {
    this.updateRequirement(util.getFunName(this.updateEducationMulti), event.detail.value)
  },

  educationMultiColumnChange: function (event) {
    this.updateRequirement(util.getFunName(this.educationMultiColumnChange
    ), event.detail.value)
  },

  columnChange: function(e, columnChangeType) {
    let currentColunm = e.detail.column;
    let currentValue = e.detail.value
    let columnChangeTypeIndex = this.data.columnChangeTypeIndexMap[columnChangeType]
    if (currentColunm === 0 || (currentColunm === 1 && currentValue < this.data.requirementList[columnChangeTypeIndex].fromAndToSelectValueIndex[0])) {
      this.setData({
        ["requirementList["+columnChangeTypeIndex+"].fromAndToSelectValueIndex[0]"]: currentValue,
        ["requirementList["+columnChangeTypeIndex+"].fromAndToSelectValueIndex[1]"]: currentValue,
      })
    } else {
      this.setData({
        ["requirementList["+columnChangeTypeIndex+"].fromAndToSelectValueIndex[1]"]: currentValue,
      })
    }
  },

  weightPeriodColumnChange: function(e) {
    this.columnChange(e, util.getFunName(this.weightPeriodColumnChange))
  },

  birthYearPeriodColumnChange: function(e) {
    this.columnChange(e, util.getFunName(this.birthYearPeriodColumnChange))
  },

  heightPeriodColumnChange: function(e) {
    this.columnChange(e, util.getFunName(this.heightPeriodColumnChange))
  },

  monthPayPeriodColumnChange: function(e) {
    this.columnChange(e, util.getFunName(this.monthPayPeriodColumnChange))
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title
    })
    
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