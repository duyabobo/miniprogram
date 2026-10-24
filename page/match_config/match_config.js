const config = require('../../config.js')
const enumerate = require("../../util/enumerate");
const request = require("../../util/request");

const RECORD_STATE_IDLE = 'idle'
const RECORD_STATE_RECORDING = 'recording'
const RECORD_STATE_PROCESSING = 'processing'

const RECORD_FORMAT = 'mp3'
const RECORD_SAMPLE_RATE = 16000
const UPLOAD_TIMEOUT_MS = 60000

Page({

  data: {
    copy: {},
    rows: [],
    recordState: RECORD_STATE_IDLE,
    voiceStatusText: '',
    recognizedText: '',
    showPrivacy: false,
    voiceEnabled: true,
    voiceBlockText: '',
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
          that._applyPayload(res.data.data || {}, true)
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

  _applyPayload: function (payload, resetIdle) {
    const voiceEnabled = payload.voiceEnabled !== false
    const voiceBlockText = payload.voiceBlockText || ''
    const copy = payload.copy || this.data.copy
    const voiceStatus = (copy && copy.voiceStatus) || {}
    const next = {
      copy: copy,
      rows: payload.rows || [],
      voiceEnabled: voiceEnabled,
      voiceBlockText: voiceBlockText,
    }
    if (typeof payload.text === 'string') {
      next.recognizedText = payload.text
    }
    if (!voiceEnabled) {
      next.recordState = 'blocked'
      next.voiceStatusText = voiceBlockText
    } else if (resetIdle) {
      next.recordState = RECORD_STATE_IDLE
      next.voiceStatusText = voiceStatus.idle || ''
    }
    console.log('资料页', voiceEnabled, (next.rows || []).length)
    this.setData(next)
  },

  _showNotice: function (title, content) {
    wx.showModal({
      title: title || '',
      content: content || '',
      showCancel: false,
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
    if (this.data.voiceEnabled === false) {
      this._showNotice(this.data.copy.voiceBlockTitle, this.data.voiceBlockText)
      return
    }
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
      timeout: UPLOAD_TIMEOUT_MS,
      success(res) {
        let data = {}
        try {
          data = JSON.parse(res.data)
        } catch (err) {
          console.log('语音识别响应无法解析', err)
        }
        const payload = data.data || {}
        const accepted = data.code === enumerate.SUCESS_CODE || data.code > enumerate.GUAN_SUCCESS_WITH_NOTI_MIN_CODE
        if (accepted) {
          console.log('语音识别完成', (payload.text || '').length)
          that._applyPayload(payload, true)
          if (data.code > enumerate.GUAN_SUCCESS_WITH_NOTI_MIN_CODE) {
            that._showNotice(that.data.copy.profileConflictTitle, data.errMsg)
            return
          }
          if (!payload.text) {
            wx.showToast({ title: '没有识别到内容', icon: 'none' })
            return
          }
          wx.showToast({ title: '更新成功', icon: 'success' })
          return
        }
        that._setRecordState(RECORD_STATE_IDLE)
        that._showNotice((that.data.copy && that.data.copy.voiceRejectTitle) || '', data.errMsg || '')
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
