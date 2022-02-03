const request = require("./request");

function checkLoginBeforeJump(sucUrl, needLogin) {
  if (needLogin) {
      wxLogin(sucUrl)
    } else {
      wx.navigateTo({
        url: sucUrl,
      })
    }
}

function wxLogin(sucUrl) {
  wx.showActionSheet({
    itemList: ['微信登录'],
    success: function (res) {
      console.log('wx login success')
      wx.login({
        success(res) {
          if (res.code) {
            request.loginRequest(res.code, sucUrl)
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
  checkLoginBeforeJump,
}