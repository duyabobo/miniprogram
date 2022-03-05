/**
 * 小程序配置文件
 */
const HOST_TEST = 'localhost:443'  // 后台api域名
const HTTP_HOST_TEST = 'http://' + HOST_TEST
const CDN_QINIU_URL = 'http://img.ggjjzhzz.cn/'  // 七牛云存储域名
// 后台api接口
const loginUrl = '/login'  // 登录
const aboutUrl = '/about'  // 关于
const guanguanUrl = '/guanguan'  // 关关列表获取
const guaninfoUrl = '/guan_info'  // 关关详情页信息
const mineUrl = '/mine'  // 我的页面信息获取
const informationUrl = '/myself'  // 我的资料
const requirementUrl = '/requirement'  // 我的期望
const phoneVerifyUrl = '/phone_verify'  // 手机短信验证
const emailVerifyUrl = '/email_verify'  // email验证
// 小程序页面
const GUANGUAN_PAGE = '/page/guanguan/guanguan?errMsg='  // 关关页面
const GUANINFO_PAGE = '/page/guan_info/guan_info?guanId='  // 关关详情页
const ABOUT_PAGE = '/page/about/about'  // 关于
const SETTING_PAGE = '/page/setting/setting'  // 设置
const SHARE_PAGE = '/page/share/share'  // 分享
const SUGGESTION_PAGE = '/page/suggestion/suggestion'  // 客服（建议）
const MYINFORMATION_PAGE = '/page/my_information/my_information?errMsg='  // 我的资料
const MYREQUIREMENT_PAGE = '/page/my_requirement/my_requirement'  // 我的期望
// 提醒发消息用的
const SUBSCRIBE_OFFLINE_NOTI_TID = '0LeRGd69AHugmAOYDLHxut1DBZhpkZUdZb5f57DeD3g'

module.exports = {
    HTTP_HOST_TEST,
    CDN_QINIU_URL,
    aboutUrl,
    loginUrl,
    guanguanUrl,
    guaninfoUrl,
    informationUrl,
    mineUrl,
    requirementUrl,
    phoneVerifyUrl,
    emailVerifyUrl,
    GUANGUAN_PAGE,
    GUANINFO_PAGE,
    ABOUT_PAGE,
    SETTING_PAGE,
    SHARE_PAGE,
    SUGGESTION_PAGE,
    MYINFORMATION_PAGE,
    MYREQUIREMENT_PAGE,
    SUBSCRIBE_OFFLINE_NOTI_TID
}
