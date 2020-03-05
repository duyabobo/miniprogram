/**
 * 小程序配置文件
 */
const HOST_TEST = 'localhost:7777'
const HTTP_HOST_TEST = 'http://' + HOST_TEST 

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

function check_res(res) {
  var code = res.data.code
  if (code != 0) {
    var errmsg = res.data.errmsg
    wx.showToast({
      title: errmsg,
      icon: 'loading',
      duration: 600,
      mask: true
    })
    return code
  }
  return 0
}

module.exports.HTTP_HOST_TEST = HTTP_HOST_TEST 
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

module.exports.check_res = check_res
