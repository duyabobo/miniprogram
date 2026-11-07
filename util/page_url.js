const MEET_VIEWER_FLAG = '1'

function getSharePageWithOpenid(page) {
    const passportId = wx.getStorageSync('passportId')
    return page + '?sharePassportId=' + passportId
}

function getMeetViewerPage(page, guanId) {
    const passportId = wx.getStorageSync('passportId')
    return page + '?guanId=' + guanId + '&viewer=' + MEET_VIEWER_FLAG + '&sharePassportId=' + passportId
}

function meetSharePayload(activity, placeImgHidden) {
    const time = activity && activity.time ? activity.time : ''
    const address = activity && activity.address ? activity.address : ''
    const detail = [time, address].filter(function (part) { return part }).join(' ')
    const payload = {
        title: detail ? ('安全见面 ' + detail) : '安全见面，分享亲友',
    }
    const img = activity && activity.img ? activity.img : ''
    if (img && !placeImgHidden) {
        payload.imageUrl = img
    }
    return payload
}

module.exports = {
    MEET_VIEWER_FLAG,
    getSharePageWithOpenid,
    getMeetViewerPage,
    meetSharePayload,
}
