function wxToast(msg) {
  if (msg !== undefined && msg !== "" && msg !== "undefined") {
    wx.showToast({
      title: msg,
      icon: 'loading',
      duration: 800,
      mask: true
    })
  }
}

module.exports = {
  wxToast
}