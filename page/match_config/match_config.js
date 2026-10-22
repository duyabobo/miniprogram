const config = require('../../config.js')
const request = require("../../util/request");

const RECORD_STATE_IDLE = 'idle'
const RECORD_STATE_RECORDING = 'recording'
const RECORD_STATE_PROCESSING = 'processing'

const RECORD_FORMAT = 'mp3'
const RECORD_SAMPLE_RATE = 16000

Page({

  data: {
    copy: {},
    rows: [],
    recordState: RECORD_STATE_IDLE,
    voiceStatusText: '',
    recognizedText: '',
    showPrivacy: false,
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
          that._setRecordState(that.data.recordState)
        }
      }
    })
  },

  _setRecordState: function (state) {
    const voiceStatus = (this.data.copy && this.data.copy.voiceStatus) || {}
    console.log('语音状态', state)
    this.setData({
      recordState: state,
      voiceStatusText: voiceStatus[state] || '',
    })
  },

  _initRecorderEvents: function () {
    const that = this
    const rm = this._recorderManager

    rm.onStart(() => {
      console.log('录音开始')
      that._setRecordState(RECORD_STATE_RECORDING)
    })

    rm.onError((err) => {
      console.log('录音失败', err)
      wx.showToast({ title: '录音失败，请重试', icon: 'none' })
      that._setRecordState(RECORD_STATE_IDLE)
    })

    rm.onStop((res) => {
      console.log('录音结束', res.tempFilePath)
      that._setRecordState(RECORD_STATE_PROCESSING)
      that._uploadAndRecognize(res.tempFilePath)
    })
  },

  onVoiceBtnTap: function () {
    const state = this.data.recordState
    if (state === RECORD_STATE_IDLE) {
      this._startRecord()
      return
    }
    if (state === RECORD_STATE_RECORDING) {
      this._stopRecord()
    }
  },

  _startRecord: function () {
    const that = this
    wx.authorize({
      scope: 'scope.record',
      success() {
        console.log('麦克风已允许')
        that._recorderManager.start({ format: RECORD_FORMAT, sampleRate: RECORD_SAMPLE_RATE })
      },
      fail() {
        console.log('麦克风未允许')
        const copy = that.data.copy || {}
        wx.showModal({
          title: copy.micDeniedTitle || '',
          content: copy.micDeniedContent || '',
          confirmText: copy.micDeniedConfirm || '',
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

  _uploadAndRecognize: function (filePath) {
    const that = this
    const signed = request.signedForm(config.voiceTextUrl, 'POST', {})
    wx.uploadFile({
      url: config.HTTP_HOST_TEST + config.voiceTextUrl,
      filePath: filePath,
      name: 'audio',
      header: signed.header,
      formData: signed.formData,
      success(res) {
        let data = {}
        try {
          data = JSON.parse(res.data)
        } catch (err) {
          console.log('语音识别响应无法解析', err)
        }
        const payload = data.data || {}
        if (data.code === 0) {
          console.log('语音识别完成', (payload.text || '').length)
          that.setData({
            recognizedText: payload.text || '',
            copy: payload.copy || that.data.copy,
            rows: payload.rows || that.data.rows,
          })
          that._setRecordState(RECORD_STATE_IDLE)
          if (!payload.text) {
            wx.showToast({ title: '没有识别到内容', icon: 'none' })
            return
          }
          wx.showToast({ title: '更新成功', icon: 'success' })
          return
        }
        wx.showToast({ title: data.errMsg || '识别失败，请重试', icon: 'none' })
        that._setRecordState(RECORD_STATE_IDLE)
      },
      fail() {
        wx.showToast({ title: '上传失败，请重试', icon: 'none' })
        that._setRecordState(RECORD_STATE_IDLE)
      }
    })
  },

  openPrivacy: function () {
    console.log('打开说明')
    this.setData({ showPrivacy: true })
  },

  closePrivacy: function () {
    this.setData({ showPrivacy: false })
  },

  holdSheet: function () {},

  onUnload: function () {
    if (this.data.recordState === RECORD_STATE_RECORDING) {
      this._recorderManager.stop()
    }
  },

})
