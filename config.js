/**
 * 小程序配置文件
 */
const HOST_TEST = 'www.ggjjzhzz.cn'
const HTTP_HOST_TEST = 'https://' + HOST_TEST 

const CDN_QINIU_URL = 'http://img.ggjjzhzz.cn/'

const init_url = '/init'
const login_url = '/login' 
const guanguan_url = '/guanguan'
const guaninfo_url = '/guan_info'
const guananswer_url = '/guan_answer'
const guanpoint_url = '/guan_point'
const evaluation_url = '/guan_evaluation' 
const user_url = '/user'
const suggestion_url = '/suggestion'

const subscribe_offline_noti_tid = '0LeRGd69AHugmAOYDLHxut1DBZhpkZUdZb5f57DeD3g'

function wxlogin(suc_uri) {
  wx.showActionSheet({
    itemList: ['微信登录'],
    success: function (res) {
      console.log('wx login success')
      wx.login({
        success(res) {
          if (res.code) {
            // 发起网络请求
            wx.request({
              url: HTTP_HOST_TEST + login_url,
              data: {
                code: res.code,
              },
              success(res) {
                const app = getApp()
                app.globalData.access_token = res.data.access_token
                app.globalData.hasLogin = true
                wx.navigateTo({
                  url: suc_uri,
                })
              },
              fail(res) {
                console.log('login fail')
              }
            })
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

module.exports.HTTP_HOST_TEST = HTTP_HOST_TEST 
module.exports.CDN_QINIU_URL = CDN_QINIU_URL
module.exports.init_url = init_url
module.exports.login_url = login_url 
module.exports.guanguan_url = guanguan_url
module.exports.guaninfo_url = guaninfo_url
module.exports.guananswer_url = guananswer_url
module.exports.evaluation_url = evaluation_url 
module.exports.guanpoint_url = guanpoint_url
module.exports.user_url = user_url
module.exports.suggestion_url = suggestion_url
module.exports.subscribe_offline_noti_tid = subscribe_offline_noti_tid
module.exports.wxlogin = wxlogin
