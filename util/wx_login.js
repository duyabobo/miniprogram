const request = require("./request");

function checkLoginBeforeJump(sucJumpFunc, jumpUrl, needLogin) {  // 不需要登录就直接跳转jumpurl，需要登录就登录后跳转sucUrl
  if (needLogin) {
      wxLogin(sucJumpFunc)
    } else {
      wx.navigateTo({
        url: jumpUrl,
      })
    }
}

function wxLogin(sucJumpFunc) {
  wx.showActionSheet({
    itemList: ['微信登录'],
    success: function (res) {
      console.log('wx login success')
      wx.login({
        success(res) {
          if (res.code) {
            request.loginRequest(res.code, sucJumpFunc)
          } else {
            console.log('登录失败！' + res.data.errMsg)
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