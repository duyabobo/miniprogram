const config = require('../../config.js')
const request = require("../../util/request");
const enumerate = require("../../util/enumerate");

let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: { },

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
    this.updateRequirement(enumerate.MODEL_USER_OP_TYPE_SEX, event.detail.value)
  },

  updateBirthYearPeriod: function(event) {
    this.updateRequirement(enumerate.MODEL_USER_OP_TYPE_BIRTH_YEAR_PERIOD, event.detail.value)
  },

  updateHeightPeriod: function(event) {
    this.updateRequirement(enumerate.MODEL_USER_OP_TYPE_HEIGHT_PERIOD, event.detail.value)
  },

  updateWeightPeriod: function(event) {
    this.updateRequirement(enumerate.MODEL_USER_OP_TYPE_WEIGHT_PERIOD, event.detail.value)
  },

  updateMonthPayPeriod: function(event) {
    this.updateRequirement(enumerate.MODEL_USER_OP_TYPE_MONTH_PAY_PERIOD, event.detail.value)
  },

  updateMartialStatus: function(event) {
    this.updateRequirement(enumerate.MODEL_USER_OP_TYPE_MARTIAL_STATUS, event.detail.value)
  },

  updateEducationPeriod: function(event) {
    this.updateRequirement(enumerate.MODEL_USER_OP_TYPE_EDUCATION_PERIOD, event.detail.value)
  },
  
  updateExtend1: function(event) {
    this.updateRequirement(enumerate.MODEL_USER_OP_TYPE_EXTEND_1, event.detail.value)
  },

  updateExtend2: function(event) {
    this.updateRequirement(enumerate.MODEL_USER_OP_TYPE_EXTEND_2, event.detail.value)
  },

  updateExtend3: function(event) {
    this.updateRequirement(enumerate.MODEL_USER_OP_TYPE_EXTEND_3, event.detail.value)
  },

  updateExtend4: function(event) {
    this.updateRequirement(enumerate.MODEL_USER_OP_TYPE_EXTEND_4, event.detail.value)
  },

  updateExtend5: function(event) {
    this.updateRequirement(enumerate.MODEL_USER_OP_TYPE_EXTEND_5, event.detail.value)
  },

  updateExtend6: function(event) {
    this.updateRequirement(enumerate.MODEL_USER_OP_TYPE_EXTEND_6, event.detail.value)
  },

  updateExtend7: function(event) {
    this.updateRequirement(enumerate.MODEL_USER_OP_TYPE_EXTEND_7, event.detail.value)
  },

  updateExtend8: function(event) {
    this.updateRequirement(enumerate.MODEL_USER_OP_TYPE_EXTEND_8, event.detail.value)
  },

  updateExtend9: function(event) {
    this.updateRequirement(enumerate.MODEL_USER_OP_TYPE_EXTEND_9, event.detail.value)
  },

  updateExtend10: function(event) {
    this.updateRequirement(enumerate.MODEL_USER_OP_TYPE_EXTEND_10, event.detail.value)
  },

  updatePeriodExtend1: function(event) {
    this.updateRequirement(enumerate.MODEL_USER_OP_TYPE_PERIOD_EXTEND_1, event.detail.value)
  },

  updatePeriodExtend2: function(event) {
    this.updateRequirement(enumerate.MODEL_USER_OP_TYPE_PERIOD_EXTEND_2, event.detail.value)
  },

  updatePeriodExtend3: function(event) {
    this.updateRequirement(enumerate.MODEL_USER_OP_TYPE_PERIOD_EXTEND_3, event.detail.value)
  },

  updatePeriodExtend4: function(event) {
    this.updateRequirement(enumerate.MODEL_USER_OP_TYPE_PERIOD_EXTEND_4, event.detail.value)
  },

  updatePeriodExtend5: function(event) {
    this.updateRequirement(enumerate.MODEL_USER_OP_TYPE_PERIOD_EXTEND_5, event.detail.value)
  },

  updatePeriodExtend6: function(event) {
    this.updateRequirement(enumerate.MODEL_USER_OP_TYPE_PERIOD_EXTEND_6, event.detail.value)
  },

  updatePeriodExtend7: function(event) {
    this.updateRequirement(enumerate.MODEL_USER_OP_TYPE_PERIOD_EXTEND_7, event.detail.value)
  },

  updatePeriodExtend8: function(event) {
    this.updateRequirement(enumerate.MODEL_USER_OP_TYPE_PERIOD_EXTEND_8, event.detail.value)
  },

  updatePeriodExtend9: function(event) {
    this.updateRequirement(enumerate.MODEL_USER_OP_TYPE_PERIOD_EXTEND_9, event.detail.value)
  },

  updatePeriodExtend10: function(event) {
    this.updateRequirement(enumerate.MODEL_USER_OP_TYPE_PERIOD_EXTEND_10, event.detail.value)
  },

  columnChange(e, columnChangeType) {
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

  educationPeriodColumnChange(e) {
    this.columnChange(e, "educationPeriod")
  },

  weightPeriodColumnChange(e) {
    this.columnChange(e, "weightPeriod")
  },

  birthYearPeriodColumnChange(e) {
    this.columnChange(e, "birthYearPeriod")
  },

  heightPeriodColumnChange(e) {
    this.columnChange(e, "heightPeriod")
  },

  monthPayPeriodColumnChange(e) {
    this.columnChange(e, "monthPayPeriod")
  },

  periodExtend1ColumnChange(e) {
    this.columnChange(e, "PeriodExtend1")
  },

  periodExtend2ColumnChange(e) {
    this.columnChange(e, "PeriodExtend2")
  },

  periodExtend3ColumnChange(e) {
    this.columnChange(e, "PeriodExtend3")
  },

  periodExtend4ColumnChange(e) {
    this.columnChange(e, "PeriodExtend4")
  },

  periodExtend5ColumnChange(e) {
    this.columnChange(e, "PeriodExtend5")
  },

  periodExtend6ColumnChange(e) {
    this.columnChange(e, "PeriodExtend6")
  },

  periodExtend7ColumnChange(e) {
    this.columnChange(e, "PeriodExtend7")
  },

  periodExtend8ColumnChange(e) {
    this.columnChange(e, "PeriodExtend8")
  },

  periodExtend9ColumnChange(e) {
    this.columnChange(e, "PeriodExtend9")
  },

  periodExtend10ColumnChange(e) {
    this.columnChange(e, "PeriodExtend10")
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