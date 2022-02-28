/**
 * 小程序配置文件
 */
const HOST_TEST = 'www.ggjjzhzz.cn'  // 后台api域名
const HTTP_HOST_TEST = 'https://' + HOST_TEST
const CDN_QINIU_URL = 'http://img.ggjjzhzz.cn/'  // 七牛云存储域名
// 后台api接口
const loginUrl = '/login'  // 登录
const aboutUrl = '/about'  // 关于
const guanguanUrl = '/guanguan'  // 关关列表获取
const guaninfoUrl = '/guan_info'  // 关关详情页信息
const mineUrl = '/mine'  // 我的页面信息获取
const myselfUrl = '/myself'  // 我的资料
const requirementUrl = '/requirement'  // 我的期望
const emailVerifyUrl = '/email_verify'  // 验证邮件
const sendPhoneCodeUrl = '/send_phone_code'  // 发送手机短信验证码
const verifyPhoneCodeUrl = '/verify_phone_code'  // 手机短信验证
// 小程序页面
const GUANGUAN_PAGE = '/page/guanguan/guanguan?errMsg='  // 关关页面
const GUANINFO_PAGE = '/page/guan_info/guan_info?guanId='  // 关关详情页
const ABOUT_PAGE = '/page/about/about'  // 关于
const SETTING_PAGE = '/page/setting/setting'  // 设置
const SHARE_PAGE = '/page/share/share'  // 分享
const SUGGESTION_PAGE = '/page/suggestion/suggestion'  // 客服（建议）
const MYINFORMATION_PAGE = '/page/my_information/my_information?errMsg='  // 我的资料
const MYREQUIREMENT_PAGE = '/page/my_requirement/my_requirement'  // 我的期望
const WORKVERIFY_PAGE = '/page/work_verify/work_verify'  // 工作认证
// 提醒发消息用的
const SUBSCRIBE_OFFLINE_NOTI_TID = '0LeRGd69AHugmAOYDLHxut1DBZhpkZUdZb5f57DeD3g'

module.exports = {
    HTTP_HOST_TEST,
    CDN_QINIU_URL,
    aboutUrl,
    loginUrl,
    guanguanUrl,
    guaninfoUrl,
    myselfUrl,
    mineUrl,
    requirementUrl,
    emailVerifyUrl,
    sendPhoneCodeUrl,
    verifyPhoneCodeUrl,
    GUANGUAN_PAGE,
    GUANINFO_PAGE,
    ABOUT_PAGE,
    SETTING_PAGE,
    SHARE_PAGE,
    SUGGESTION_PAGE,
    MYINFORMATION_PAGE,
    MYREQUIREMENT_PAGE,
    WORKVERIFY_PAGE,
    SUBSCRIBE_OFFLINE_NOTI_TID
}
