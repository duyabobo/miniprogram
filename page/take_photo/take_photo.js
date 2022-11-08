const config = require('../../config.js')
const {myRequest} = require("../../util/request");

Page({
  onLoad() {
    this.ctx = wx.createCameraContext()
  },

  cancelPhoto() {
    myRequest({
      url: config.updateHeadImgUrl,
      method: "PUT",
      data: {},
      success(res) {
        wx.switchTab({
          url: config.MINE_PAGE,
        })
      }
    })
  },

  takePhoto() {
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        wx.showToast({ icon: "loading", title: "虚拟头像制作中", duration: 500});
        wx.uploadFile({
          url: config.HTTP_HOST_TEST + config.updateHeadImgUrl,
          filePath: res.tempImagePath,
          name: 'file',
          formData: {
            'accessToken': wx.getStorageSync('accessToken')
          },
          success (res){
            wx.showModal({
              title: '虚拟头像制作成功',
              showCancel: false,
              success (res) {
                if (res.confirm) {
                  wx.switchTab({
                    url: config.MINE_PAGE,
                  })
                } 
              }
            })
          },
          fail (res) {
            console.log(res)
          }
        })
      }
    })
  }, 
  
  error(e) {
    console.log(e.detail)
  }
})