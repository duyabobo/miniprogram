/**
 * 小程序配置文件
 */
const HOST_TEST = 'www.ggjjzhzz.cn'
const HTTP_HOST_TEST = 'https://' + HOST_TEST
const CDN_QINIU_URL = 'http://img.ggjjzhzz.cn/'

const initUrl = '/init'
const loginUrl = '/login'
const aboutUrl = '/about'
const guanguanUrl = '/guanguan'
const guaninfoUrl = '/guan_info'
const operateUrl = '/operate'
const myselfUrl = '/myself'
const updateMyselfUrl = '/update_myself'
const requirementUrl = '/requirement'
const upsertRequirementUrl = '/upsertRequirement'

const GUANGUAN_PAGE = '/page/guanguan/guanguan?errMsg='
const GUANINFO_PAGE = '/page/guan_info/guan_info?guan_id='
const ABOUT_PAGE = '/page/about/about'
const SETTING_PAGE = '/page/setting/setting'
const SHARE_PAGE = '/page/share/share'
const SUGGESTION_PAGE = '/page/suggestion/suggestion'
const MYINFORMATION_PAGE = '/page/my_information/my_information'
const MYREQUIREMENT_PAGE = '/page/my_requirement/my_requirement'

const SUBSCRIBE_OFFLINE_NOTI_TID = '0LeRGd69AHugmAOYDLHxut1DBZhpkZUdZb5f57DeD3g'

module.exports = {
    HTTP_HOST_TEST,
    CDN_QINIU_URL,
    initUrl,
    aboutUrl,
    loginUrl,
    guanguanUrl,
    guaninfoUrl,
    operateUrl,
    myselfUrl,
    updateMyselfUrl,
    requirementUrl,
    upsertRequirementUrl,
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
