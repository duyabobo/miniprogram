const MEET_VIEWER_FLAG = '1'

function getSharePageWithOpenid(page) {
    let openid = wx.getStorageSync('openid');
    return page + '?shareOpenid=' + openid
}

function getMeetViewerPage(page, guanId) {
    const openid = wx.getStorageSync('openid')
    return page + '?guanId=' + guanId + '&viewer=' + MEET_VIEWER_FLAG + '&shareOpenid=' + openid
}

module.exports = {
    MEET_VIEWER_FLAG,
    getSharePageWithOpenid,
    getMeetViewerPage,
}
