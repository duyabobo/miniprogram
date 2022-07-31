const config = require('../../config.js')
const request = require("../../util/request");
const util = require("../../util/util");

let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: { 
    region: ['广东省', '广州市', '海珠区'],
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

  updateEducationPeriod: function(event) {
    this.updateRequirement(util.getFunName(this.updateEducationPeriod), event.detail.value)
  },
  
  updateExtend1: function(event) {
    this.updateRequirement(util.getFunName(this.updateExtend1), event.detail.value)
  },

  updateExtend2: function(event) {
    this.updateRequirement(util.getFunName(this.updateExtend2), event.detail.value)
  },

  updateExtend3: function(event) {
    this.updateRequirement(util.getFunName(this.updateExtend3), event.detail.value)
  },

  updateExtend4: function(event) {
    this.updateRequirement(util.getFunName(this.updateExtend4), event.detail.value)
  },

  updateExtend5: function(event) {
    this.updateRequirement(util.getFunName(this.updateExtend5), event.detail.value)
  },

  updateExtend6: function(event) {
    this.updateRequirement(util.getFunName(this.updateExtend6), event.detail.value)
  },

  updateExtend7: function(event) {
    this.updateRequirement(util.getFunName(this.updateExtend7), event.detail.value)
  },

  updateExtend8: function(event) {
    this.updateRequirement(util.getFunName(this.updateExtend8), event.detail.value)
  },

  updateExtend9: function(event) {
    this.updateRequirement(util.getFunName(this.updateExtend9), event.detail.value)
  },

  updateExtend10: function(event) {
    this.updateRequirement(util.getFunName(this.updateExtend10), event.detail.value)
  },

  updatePeriodExtend1: function(event) {
    this.updateRequirement(util.getFunName(this.updatePeriodExtend1), event.detail.value)
  },

  updatePeriodExtend2: function(event) {
    this.updateRequirement(util.getFunName(this.updatePeriodExtend2), event.detail.value)
  },

  updatePeriodExtend3: function(event) {
    this.updateRequirement(util.getFunName(this.updatePeriodExtend3), event.detail.value)
  },

  updatePeriodExtend4: function(event) {
    this.updateRequirement(util.getFunName(this.updatePeriodExtend4), event.detail.value)
  },

  updatePeriodExtend5: function(event) {
    this.updateRequirement(util.getFunName(this.updatePeriodExtend5), event.detail.value)
  },

  updatePeriodExtend6: function(event) {
    this.updateRequirement(util.getFunName(this.updatePeriodExtend6), event.detail.value)
  },

  updatePeriodExtend7: function(event) {
    this.updateRequirement(util.getFunName(this.updatePeriodExtend7), event.detail.value)
  },

  updatePeriodExtend8: function(event) {
    this.updateRequirement(util.getFunName(this.updatePeriodExtend8), event.detail.value)
  },

  updatePeriodExtend9: function(event) {
    this.updateRequirement(util.getFunName(this.updatePeriodExtend9), event.detail.value)
  },

  updatePeriodExtend10: function(event) {
    this.updateRequirement(util.getFunName(this.updatePeriodExtend10), event.detail.value)
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

  educationPeriodColumnChange: function(e) {
    this.columnChange(e, util.getFunName(this.educationPeriodColumnChange))
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

  periodExtend1ColumnChange: function(e) {
    this.columnChange(e, util.getFunName(this.periodExtend1ColumnChange))
  },

  periodExtend2ColumnChange: function(e) {
    this.columnChange(e, util.getFunName(this.periodExtend2ColumnChange))
  },

  periodExtend3ColumnChange: function(e) {
    this.columnChange(e, util.getFunName(this.periodExtend3ColumnChange))
  },

  periodExtend4ColumnChange: function(e) {
    this.columnChange(e, util.getFunName(this.periodExtend4ColumnChange))
  },

  periodExtend5ColumnChange: function(e) {
    this.columnChange(e, util.getFunName(this.periodExtend5ColumnChange))
  },

  periodExtend6ColumnChange: function(e) {
    this.columnChange(e, util.getFunName(this.periodExtend6ColumnChange))
  },

  periodExtend7ColumnChange: function(e) {
    this.columnChange(e, util.getFunName(this.periodExtend7ColumnChange))
  },

  periodExtend8ColumnChange: function(e) {
    this.columnChange(e, util.getFunName(this.periodExtend8ColumnChange))
  },

  periodExtend9ColumnChange: function(e) {
    this.columnChange(e, util.getFunName(this.periodExtend9ColumnChange))
  },

  periodExtend10ColumnChange: function(e) {
    this.columnChange(e, util.getFunName(this.periodExtend10ColumnChange))
  },

  bindHomeRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
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