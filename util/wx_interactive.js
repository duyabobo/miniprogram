function wxCheckToast(msg) {
  if (msg !== undefined && msg !== "" && msg !== "undefined") {
    wx.showToast({
      title: msg,
      icon: 'loading',
      duration: 1000,
      mask: true
    })
  }
}

module.exports = {
  wxCheckToast
}