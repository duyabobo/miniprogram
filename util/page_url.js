const MEET_VIEWER_FLAG = '1'

function getSharePageWithOpenid(page) {
    let openid = wx.getStorageSync('openid');
    return page + '?shareOpenid=' + openid
}

function getMeetViewerPage(page, guanId) {
    const openid = wx.getStorageSync('openid')
    return page + '?guanId=' + guanId + '&viewer=' + MEET_VIEWER_FLAG + '&shareOpenid=' + openid
}

const MEET_SHARE_COVER = '/resources/share-meet.png'

function meetSharePayload(activity) {
    const time = activity && activity.time ? activity.time : ''
    const address = activity && activity.address ? activity.address : ''
    const detail = [time, address].filter(function (part) { return part }).join(' ')
    return {
        title: detail ? ('安全见面 ' + detail) : '安全见面，分享亲友',
        imageUrl: MEET_SHARE_COVER,
    }
}

module.exports = {
    MEET_VIEWER_FLAG,
    getSharePageWithOpenid,
    getMeetViewerPage,
    meetSharePayload,
}
