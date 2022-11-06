Page({
  onLoad() {
    this.ctx = wx.createCameraContext()
  },
  takePhoto() {
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        wx.showModal({
          title: '虚拟头像制作完成',
          content: '',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    })
  }, 
  error(e) {
    console.log(e.detail)
  }
})