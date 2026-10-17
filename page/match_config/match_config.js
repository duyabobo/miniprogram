const config = require('../../config.js')
const request = require("../../util/request");

const RECORD_STATE_IDLE = 'idle'
const RECORD_STATE_RECORDING = 'recording'
const RECORD_STATE_PROCESSING = 'processing'

const RECORD_FORMAT = 'mp3'
const RECORD_SAMPLE_RATE = 16000

const VOICE_STATUS_TEXT = {
  idle: '说说你自己和期望',
  recording: '正在录音，再次点击结束',
  processing: '正在整理个人信息和期望',
}

const MIC_DENIED_TITLE = '需要麦克风'
const MIC_DENIED_CONTENT = '语音搜集需要使用麦克风，请在设置里允许录音。'

Page({

  data: {
    myInfoPairs: [],
    myRequirementPairs: [],
    recordState: RECORD_STATE_IDLE,
    voiceStatusText: VOICE_STATUS_TEXT[RECORD_STATE_IDLE],
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
        }
      }
    })
  },

  _setRecordState: function (state) {
    console.log('语音状态', state)
    this.setData({
      recordState: state,
      voiceStatusText: VOICE_STATUS_TEXT[state] || VOICE_STATUS_TEXT[RECORD_STATE_IDLE],
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
        wx.showModal({
          title: MIC_DENIED_TITLE,
          content: MIC_DENIED_CONTENT,
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

  _uploadAndRecognize: function (filePath) {
    const that = this
    wx.uploadFile({
      url: config.HTTP_HOST_TEST + config.voiceTextUrl,
      filePath: filePath,
      name: 'audio',
      header: {
        sign: ''
      },
      formData: {
        accessToken: wx.getStorageSync('accessToken')
      },
      success(res) {
        const data = JSON.parse(res.data)
        if (data.code === 0 && data.data && data.data.text) {
          const text = data.data.text
          console.log('语音识别完成', text.length)
          that.setData({ recognizedText: text })
          that._updateFromVoiceText(text)
          return
        }
        wx.showToast({ title: '识别失败，请重试', icon: 'none' })
        that._setRecordState(RECORD_STATE_IDLE)
      },
      fail() {
        wx.showToast({ title: '上传失败，请重试', icon: 'none' })
        that._setRecordState(RECORD_STATE_IDLE)
      }
    })
  },

  _updateFromVoiceText: function (voiceText) {
    const that = this
    request.myRequest({
      url: config.matchConfigUrl,
      method: 'PUT',
      data: { voiceText },
      success(res) {
        that._setRecordState(RECORD_STATE_IDLE)
        if (request.requestIsSuccess(res)) {
          that.setData(res.data.data)
          wx.showToast({ title: '更新成功', icon: 'success' })
          return
        }
        wx.showModal({ title: '提取失败', content: res.data.errMsg || '请重试', showCancel: false, confirmText: '好的' })
      },
      fail() {
        that._setRecordState(RECORD_STATE_IDLE)
        wx.showToast({ title: '更新失败，请重试', icon: 'none' })
      }
    })
  },

  openPrivacy: function () {
    console.log('打开隐私说明')
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
