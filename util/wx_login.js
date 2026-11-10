const request = require("./request");

function checkLoginBeforeJump(sucJumpFunc, jumpUrl, needLogin) {
  if (needLogin) {
    startWxLogin(sucJumpFunc)
    return
  }
  wx.navigateTo({
    url: jumpUrl,
  })
}

function endLogin(next) {
  wx.hideLoading()
  if (typeof next === 'function') next()
}

function startWxLogin(onSuccess, onFail) {
  console.log('开始微信登录')
  wx.login({
    success(res) {
      if (!res.code) {
        console.log('微信没有返回 code')
        request.loginFailed(res, onFail)
        return
      }
      wx.showLoading({ title: '登录中', mask: true })
      request.loginRequest(
        res.code,
        function () { endLogin(onSuccess) },
        function () { endLogin(onFail) },
      )
    },
    fail(err) {
      console.log('微信登录失败', err && err.errMsg)
      request.loginFailed(err, onFail)
    },
  })
}

module.exports = {
  checkLoginBeforeJump,
  startWxLogin,
}
