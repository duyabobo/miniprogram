const request = require('../../util/request')

const CODE_TICK_MS = 1000

Component({
  properties: {
    copy: {
      type: Object,
      value: {},
    },
  },

  data: {
    phoneInput: '',
    codeInput: '',
    codeWait: 0,
  },

  lifetimes: {
    detached() {
      this._clearCodeWait()
    },
  },

  methods: {
    onPhoneInput(event) {
      this.setData({ phoneInput: event.detail.value })
    },

    onCodeInput(event) {
      this.setData({ codeInput: event.detail.value })
    },

    sendPhoneCode() {
      if (this.data.codeWait > 0) return
      const phone = this.data.phoneInput || ''
      const that = this
      request.sendPhoneCodeRequest(phone, function (retryAfter) {
        that._startCodeWait(retryAfter)
      })
    },

    submitPhoneBind() {
      const phone = this.data.phoneInput || ''
      const code = this.data.codeInput || ''
      const that = this
      request.bindPhoneRequest(phone, code, function () {
        that._clearCodeWait()
        that.triggerEvent('done')
      })
    },

    close() {
      this.triggerEvent('close')
    },

    _startCodeWait(retryAfter) {
      const wait = Number(retryAfter) || 0
      this._clearCodeWait()
      this.setData({ codeWait: wait })
      if (wait <= 0) return
      const that = this
      this._codeTimer = setInterval(function () {
        const left = that.data.codeWait - 1
        if (left <= 0) {
          that._clearCodeWait()
          that.setData({ codeWait: 0 })
          return
        }
        that.setData({ codeWait: left })
      }, CODE_TICK_MS)
    },

    _clearCodeWait() {
      if (!this._codeTimer) return
      clearInterval(this._codeTimer)
      this._codeTimer = null
    },
  },
})
