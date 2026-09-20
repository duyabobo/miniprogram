/**
 * 小程序配置文件
 */
// const HOST_TEST = 'localhost:443'
const HOST_TEST = 'www.ggjjzhzz.cn'
const HTTP_HOST_TEST = 'https://' + HOST_TEST

// 后台 API 接口路径
const loginUrl = '/login'
const guanguanUrl = '/guanguan'
const guaninfoUrl = '/guan_info'
const matchConfigUrl = '/match_config'
const voiceTextUrl = '/voice_text'
const phoneVerifyUrl = '/phone_verify'
const subscribeCBUrl = '/subscribe_cb'
const meetResultUrl = '/meet_result'

// 小程序页面路径
const GUANGUAN_PAGE = '/page/guanguan/guanguan'
const GUANINFO_PAGE = '/page/guan_info/guan_info'
const MATCH_CONFIG_PAGE = '/page/match_config/match_config'

// 订阅消息模板 ID
const SUBSCRIBE_OFFLINE_NOTI_TID = '0LeRGd69AHugmAOYDLHxut1DBZhpkZUdZb5f57DeD3g'

module.exports = {
    HTTP_HOST_TEST,
    loginUrl,
    guanguanUrl,
    guaninfoUrl,
    matchConfigUrl,
    voiceTextUrl,
    phoneVerifyUrl,
    subscribeCBUrl,
    meetResultUrl,
    GUANGUAN_PAGE,
    GUANINFO_PAGE,
    MATCH_CONFIG_PAGE,
    SUBSCRIBE_OFFLINE_NOTI_TID
}
