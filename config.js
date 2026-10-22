/**
 * 小程序配置文件
 * ENV = 'local'  → 连接本地开发服务（http://localhost:8888）
 * ENV = 'prod'   → 连接线上服务（https://www.ggjjzhzz.cn）
 */
const ENV = 'local'

const HOST_MAP = {
  local: 'http://localhost:8888',
  prod:  'https://www.ggjjzhzz.cn',
}

const HTTP_HOST_TEST = HOST_MAP[ENV]

// 后台 API 接口路径
const loginUrl = '/login'
const guanguanUrl = '/guanguan'
const guaninfoUrl = '/guan_info'
const matchConfigUrl = '/match_config'
const voiceTextUrl = '/voice_text'
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
    subscribeCBUrl,
    meetResultUrl,
    GUANGUAN_PAGE,
    GUANINFO_PAGE,
    MATCH_CONFIG_PAGE,
    SUBSCRIBE_OFFLINE_NOTI_TID
}
