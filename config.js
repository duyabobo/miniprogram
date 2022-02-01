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
const myself_url = '/myself'
const operate_url = '/operate'

const GUANGUAN_PAGE = '/page/guanguan/guanguan?errmsg='
const GUANINFO_PAGE = '/page/guan_info/guan_info?guan_id='
const LOGIN_PAGE = '/page/login/login'
const ABOUT_PAGE = '/page/about/about'
const SETTING_PAGE = '/page/setting/setting'
const SHARE_PAGE = '/page/share/share'
const SUGGESTION_PAGE = '/page/suggestion/suggestion'
const MYGUAN_PAGE = '/page/my_guan/my_guan'

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
module.exports.myself_url = myself_url
module.exports.operate_url = operate_url

module.exports.GUANGUAN_PAGE = GUANGUAN_PAGE
module.exports.GUANINFO_PAGE = GUANINFO_PAGE
module.exports.LOGIN_PAGE = LOGIN_PAGE
module.exports.ABOUT_PAGE = ABOUT_PAGE
module.exports.SETTING_PAGE = SETTING_PAGE
module.exports.SHARE_PAGE = SHARE_PAGE
module.exports.SUGGESTION_PAGE = SUGGESTION_PAGE
module.exports.MYGUAN_PAGE = MYGUAN_PAGE

module.exports.subscribe_offline_noti_tid = subscribe_offline_noti_tid
module.exports.wxlogin = wxlogin
