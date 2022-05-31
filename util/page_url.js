function getSharePageWithOpenid(page) {
    let openid = wx.getStorageSync('openid');
    return page + '?shareOpenid=' + openid
}

module.exports = {
    getSharePageWithOpenid
}
