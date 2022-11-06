/**
 * 小程序配置文件
 */
// const HOST_TEST = 'localhost:443'
const HOST_TEST = 'www.ggjjzhzz.cn'  // 后台api域名
const HTTP_HOST_TEST = 'https://' + HOST_TEST
const CDN_QINIU_URL = 'http://img.ggjjzhzz.cn/'  // 七牛云存储域名
// 后台api接口
const loginUrl = '/login'  // 登录
const aboutUrl = '/about'  // 关于
const secretUrl = '/secret'  // 隐私条款
const guanguanUrl = '/guanguan'  // 关关列表获取
const guaninfoUrl = '/guan_info'  // 关关详情页信息
const mineUrl = '/mine'  // 我的页面信息获取
const updateHeadImgUrl = '/update_head_img'  // 拍照上传制作虚拟头像
const informationUrl = '/myself'  // 我的资料
const requirementUrl = '/requirement'  // 我的期望
const phoneVerifyUrl = '/phone_verify'  // 手机短信验证
const emailVerifyUrl = '/email_verify'  // email验证
const subscribeCBUrl = '/subscribe_cb'  // 用户订阅事件回调
const meetResultUrl = '/meet_result'  // 见面结果
// 小程序页面
const GUANGUAN_PAGE = '/page/guanguan/guanguan'  // 关关页面
const GUANINFO_PAGE = '/page/guan_info/guan_info'  // 关关详情页
const MINE_PAGE = '/page/mine/mine'  // 我的
const TAKE_PHOTO = '/page/take_photo/take_photo'  // 拍照制作虚拟头像
const ABOUT_PAGE = '/page/about/about'  // 关于
const SECRET_PAGE = '/page/secret/secret'  // 隐私条款
const SHARE_PAGE = '/page/share/share'  // 分享
const SUGGESTION_PAGE = '/page/suggestion/suggestion'  // 客服（建议）
const MYINFORMATION_PAGE = '/page/my_information/my_information'  // 我的资料
const MYREQUIREMENT_PAGE = '/page/my_requirement/my_requirement'  // 我的期望
// 提醒发消息用的
const SUBSCRIBE_OFFLINE_NOTI_TID = '0LeRGd69AHugmAOYDLHxut1DBZhpkZUdZb5f57DeD3g'

module.exports = {
    HTTP_HOST_TEST,
    CDN_QINIU_URL,
    aboutUrl,
    secretUrl,
    loginUrl,
    guanguanUrl,
    guaninfoUrl,
    subscribeCBUrl,
    informationUrl,
    mineUrl,
    updateHeadImgUrl,
    requirementUrl,
    phoneVerifyUrl,
    emailVerifyUrl,
    meetResultUrl,
    GUANGUAN_PAGE,
    GUANINFO_PAGE,
    MINE_PAGE,
    TAKE_PHOTO,
    ABOUT_PAGE,
    SECRET_PAGE,
    SHARE_PAGE,
    SUGGESTION_PAGE,
    MYINFORMATION_PAGE,
    MYREQUIREMENT_PAGE,
    SUBSCRIBE_OFFLINE_NOTI_TID
}
