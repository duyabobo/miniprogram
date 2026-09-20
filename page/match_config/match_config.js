const config = require('../../config.js')
const request = require("../../util/request");

// 录音状态
const RECORD_STATE_IDLE = 'idle'
const RECORD_STATE_RECORDING = 'recording'
const RECORD_STATE_PROCESSING = 'processing'

Page({

  data: {
    myInfoPairs: [],
    myRequirementPairs: [],
    recordState: RECORD_STATE_IDLE,  // idle | recording | processing
    recognizedText: '',              // 语音识别结果文字
  },

  _recorderManager: null,

  onLoad: function () {
    this._recorderManager = wx.getRecorderManager()
    this._initRecorderEvents()
    this._loadConfig()
  },

  _loadConfig: function () {
    const that = this
    request.myRequest({
      url: config.matchConfigUrl,
      data: {},
      success(res) {
        if (request.requestIsSuccess(res)) {
          that.setData(res.data.data)
        }
      }
    })
  },

  /** 初始化录音事件 */
  _initRecorderEvents: function () {
    const that = this
    const rm = this._recorderManager

    rm.onStart(() => {
      console.log('录音开始')
      that.setData({ recordState: RECORD_STATE_RECORDING })
    })

    rm.onError((err) => {
      console.error('录音错误', err)
      wx.showToast({ title: '录音失败，请重试', icon: 'none' })
      that.setData({ recordState: RECORD_STATE_IDLE })
    })

    rm.onStop((res) => {
      console.log('录音结束, tempFilePath:', res.tempFilePath)
      that.setData({ recordState: RECORD_STATE_PROCESSING })
      that._uploadAndRecognize(res.tempFilePath)
    })
  },

  /** 点击语音按钮：开始/停止录音 */
  onVoiceBtnTap: function () {
    const state = this.data.recordState
    if (state === RECORD_STATE_IDLE) {
      this._startRecord()
    } else if (state === RECORD_STATE_RECORDING) {
      this._stopRecord()
    }
    // processing 状态下不响应
  },

  _startRecord: function () {
    wx.authorize({
      scope: 'scope.record',
      success: () => {
        this._recorderManager.start({ format: 'mp3', sampleRate: 16000 })
      },
      fail: () => {
        wx.showModal({
          title: '需要麦克风权限',
          content: '请在设置中允许使用麦克风',
          confirmText: '去设置',
          success(res) {
            if (res.confirm) wx.openSetting()
          }
        })
      }
    })
  },

  _stopRecord: function () {
    this._recorderManager.stop()
  },

  /** 上传录音文件，获取识别文字 */
  _uploadAndRecognize: function (filePath) {
    const that = this
    wx.uploadFile({
      url: config.HTTP_HOST_TEST + config.voiceTextUrl,
      filePath: filePath,
      name: 'audio',
      header: {
        sign: ''  // 此处 sign 由后端统一处理或跳过（上传接口鉴权可放宽）
      },
      formData: {
        accessToken: wx.getStorageSync('accessToken')
      },
      success(res) {
        const data = JSON.parse(res.data)
        if (data.code === 0 && data.data && data.data.text) {
          const text = data.data.text
          that.setData({ recognizedText: text })
          that._updateFromVoiceText(text)
        } else {
          wx.showToast({ title: '识别失败，请重试', icon: 'none' })
          that.setData({ recordState: RECORD_STATE_IDLE })
        }
      },
      fail() {
        wx.showToast({ title: '上传失败，请重试', icon: 'none' })
        that.setData({ recordState: RECORD_STATE_IDLE })
      }
    })
  },

  /** 将识别文字发给后端提取条件/期望 */
  _updateFromVoiceText: function (voiceText) {
    const that = this
    request.myRequest({
      url: config.matchConfigUrl,
      method: 'PUT',
      data: { voiceText },
      success(res) {
        that.setData({ recordState: RECORD_STATE_IDLE })
        if (request.requestIsSuccess(res)) {
          that.setData(res.data.data)
          wx.showToast({ title: '更新成功', icon: 'success' })
        } else {
          wx.showModal({ title: '提取失败', content: res.data.errMsg || '请重试', showCancel: false, confirmText: '好的' })
        }
      },
      fail() {
        that.setData({ recordState: RECORD_STATE_IDLE })
        wx.showToast({ title: '更新失败，请重试', icon: 'none' })
      }
    })
  },

  onUnload: function () {
    // 页面卸载时停止录音
    if (this.data.recordState === RECORD_STATE_RECORDING) {
      this._recorderManager.stop()
    }
  },

})
