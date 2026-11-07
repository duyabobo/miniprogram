const MEET_VIEWER_FLAG = '1'

function getSharePageWithOpenid(page) {
    const passportId = wx.getStorageSync('passportId')
    return page + '?sharePassportId=' + passportId
}

function getMeetViewerPage(page, guanId) {
    const passportId = wx.getStorageSync('passportId')
    return page + '?guanId=' + guanId + '&viewer=' + MEET_VIEWER_FLAG + '&sharePassportId=' + passportId
}

function meetSharePayload(activity, placeImgHidden, shareCardTitle) {
    const time = activity && activity.time ? activity.time : ''
    const address = activity && activity.address ? activity.address : ''
    const detail = [time, address].filter(function (part) { return part }).join(' ')
    const cardTitle = shareCardTitle || ''
    const title = detail ? [cardTitle, detail].filter(function (part) { return part }).join(' ') : cardTitle
    const payload = {
        title: title,
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
