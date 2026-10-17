const TITLE_ROW_HEIGHT = 32
const FALLBACK_STATUS_BAR = 20

/** 标题与右上角胶囊齐平，避免贴到状态栏 */
function getNavBarLayout() {
  const info = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
  const menu = wx.getMenuButtonBoundingClientRect()
  const statusBar = info.statusBarHeight || FALLBACK_STATUS_BAR
  const screenTop = info.screenTop || 0
  let topInset = menu.top > 0 ? menu.top : statusBar - screenTop
  if (topInset < 0) topInset = 0
  const navBarHeight = topInset + TITLE_ROW_HEIGHT
  console.log('导航高度', topInset, navBarHeight)
  return {
    statusBarHeight: topInset,
    navContentHeight: TITLE_ROW_HEIGHT,
    navBarHeight,
  }
}

function goBackHome(homeUrl) {
  const pages = getCurrentPages()
  console.log('导航返回', pages.length)
  if (pages.length > 1) {
    wx.navigateBack()
    return
  }
  wx.reLaunch({ url: homeUrl })
}

module.exports = {
  getNavBarLayout,
  goBackHome,
}
