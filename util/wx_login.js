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

function wxLogin(sucJumpFunc, onCancel) {
  wx.showActionSheet({
    itemList: ['微信登录'],
    success: function () {
      console.log('wx login success')
      wx.login({
        success(res) {
          if (res.code) {
            request.loginRequest(res.code, sucJumpFunc, onCancel)
            return
          }
          request.loginFailed(res, onCancel)
        },
        fail(err) {
          request.loginFailed(err, onCancel)
        }
      })
    },
    fail: function () {
      console.log('cancel wx login')
      if (typeof onCancel === 'function') onCancel()
    }
  })
}

module.exports = {
  checkLoginBeforeJump,
  wxLogin,
}