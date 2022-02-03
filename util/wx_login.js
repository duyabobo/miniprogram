const request = require("./request");

function wxLogin(suc_uri) {
  wx.showActionSheet({
    itemList: ['微信登录'],
    success: function (res) {
      console.log('wx login success')
      wx.login({
        success(res) {
          if (res.code) {
            request.loginRequest(res.code, suc_uri)
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    },
    fail: function (res) {
      console.log('cancel wx login')
    }
  })
}

module.exports = {
  wxLogin
}