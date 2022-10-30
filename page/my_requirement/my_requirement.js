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

  updateRequirement(op, e) {
    let opType = util.getFunName(op)
    let column = e.detail.column
    let value = e.detail.value
    let that = this;
    let url = config.requirementUrl
    let requestData = {
      opType: opType,
      column: column,
      value: value
    }
    request.normalUpdateRequest(that, url, requestData)
  },

  updateVerify: function(event) {
    this.updateRequirement(this.updateVerify, event)
  },

  updateSex: function(event) {
    this.updateRequirement(this.updateSex, event)
  },

  updateEducationLevel: function(event) {
    this.updateRequirement(this.updateEducationLevel, event)
  },

  updateBirthYearPeriod: function(event) {
    this.updateRequirement(this.updateBirthYearPeriod, event)
  },

  updateHeightPeriod: function(event) {
    this.updateRequirement(this.updateHeightPeriod, event)
  },

  updateWeightPeriod: function(event) {
    this.updateRequirement(this.updateWeightPeriod, event)
  },

  updateMonthPayPeriod: function(event) {
    this.updateRequirement(this.updateMonthPayPeriod, event)
  },

  updateMartialStatus: function(event) {
    this.updateRequirement(this.updateMartialStatus, event)
  },

  updateHomeRegionPeriod: function (event) {
    this.updateRequirement(this.updateHomeRegionPeriod, event)
  },

  updateStudyFromYearPeriod: function (event) {
    this.updateRequirement(this.updateStudyFromYearPeriod, event)
  },

  updateStudyRegionPeriod: function (event) {
    this.updateRequirement(this.updateStudyRegionPeriod, event)
  },

  updateWorkRegionPeriod: function (event) {
    this.updateRequirement(this.updateWorkRegionPeriod, event)
  },

  updateEducationMulti: function (event) {
    this.updateRequirement(this.updateEducationMulti, event)
  },

  updateEducationMultiColumnChange: function (event) {
    this.updateRequirement(this.updateEducationMultiColumnChange, event)
  },

  updateWorkMulti: function (event) {
    this.updateRequirement(this.updateWorkMulti, event)
  },

  updateWorkMultiColumnChange: function (event) {
    this.updateRequirement(this.updateWorkMultiColumnChange, event)
  },

  columnChange: function(columnChange, e) {
    let columnChangeType = util.getFunName(columnChange)
    let currentColunm = e.detail.column;
    let currentValue = e.detail.value
    let columnChangeTypeIndex = this.data.columnChangeTypeIndexMap[columnChangeType]
    if ((currentColunm === 0 && currentValue > this.data.requirementList[columnChangeTypeIndex].fromAndToSelectValueIndex[1]) || (currentColunm === 1 && currentValue < this.data.requirementList[columnChangeTypeIndex].fromAndToSelectValueIndex[0]))
    { // 第一列变动后比第二列大，或者第二列变动后必第一列小，需要同时重新赋值第一列的选择给第一列和第二列
      this.setData({
        ["requirementList["+columnChangeTypeIndex+"].fromAndToSelectValueIndex[0]"]: currentValue,
        ["requirementList["+columnChangeTypeIndex+"].fromAndToSelectValueIndex[1]"]: currentValue,
      })
    } else {
      this.setData({
        ["requirementList["+columnChangeTypeIndex+"].fromAndToSelectValueIndex["+currentColunm+"]"]: currentValue,
      })
    }
  },

  weightPeriodColumnChange: function(e) {
    this.columnChange(this.weightPeriodColumnChange, e)
  },

  birthYearPeriodColumnChange: function(e) {
    this.columnChange(this.birthYearPeriodColumnChange, e)
  },

  heightPeriodColumnChange: function(e) {
    this.columnChange(this.heightPeriodColumnChange, e)
  },

  studyFromYearPeriodColumnChange: function(e) {
    this.columnChange(this.studyFromYearPeriodColumnChange, e)
  },

  monthPayPeriodColumnChange: function(e) {
    this.columnChange(this.monthPayPeriodColumnChange, e)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title
    })
    
    let that = this; 
    request.myRequest({
      url: config.requirementUrl,
      data: {
      },
      success(res) {
        if (request.requestIsSuccess(res)) {
          that.setData(res.data.data)
        }
      }
    })
  },
})