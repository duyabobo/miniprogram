const config = require('../../config.js')
const wxLogin = require("../../util/wx_login");
const request = require("../../util/request");
const wxInteractive = require("../../util/wx_interactive");
const pageUrl = require("../../util/page_url");
const constVar = require("../../util/const_var");
const recorderManager = wx.getRecorderManager();

let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    guanguanList: [
      constVar.defaultGuan,
      constVar.defaultGuan,
      constVar.defaultGuan,
      constVar.defaultGuan,
      constVar.defaultGuan,
      constVar.defaultGuan,
      constVar.defaultGuan,
      constVar.defaultGuan,
      constVar.defaultGuan,
      constVar.defaultGuan
    ]
  },

  clickGuanInfo: function (event) {
    if (event.currentTarget.dataset.guan_id === 0) {
      return
    }

    let needLogin = !wx.getStorageSync('hasLogin')
    let jumpUrl = config.GUANINFO_PAGE + "?guanId=" + event.currentTarget.dataset.guan_id + "&state=" + event.currentTarget.dataset.state
    wxLogin.checkLoginBeforeJump(function () {
      wx.showToast({ title: "登陆成功", duration: 500});
      setTimeout(()=> {
        wx.switchTab({
          url: config.GUANGUAN_PAGE,
          success: function(e) {
            let page = getCurrentPages().pop();
            if (page === undefined || page == null) return;
            page.onShow();
          }
        })
      }, 500)
    }, jumpUrl, needLogin)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('shareOpenid') === '') {
      wx.setStorageSync('shareOpenid', options.shareOpenid)
    }
    wxInteractive.wxCheckToast(options.errMsg)
    // 设置录音结束后的处理
    recorderManager.onStop((res) => {
      console.log('录音文件路径:', res.tempFilePath);
      // 在这里可以对录音文件进行处理，比如上传或播放
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { 
    let that = this
    if (wx.getStorageSync('hasLogin')) {
      wx.getLocation({
        type: 'wgs84',
        complete(res) {
          let requestData = {
            latitude: res.latitude,
            longitude: res.longitude
          };
          request.getGuanguanRequest(that, requestData)
        }
      })
    } else {
      let requestData = {}
      request.getGuanguanRequest(that, requestData)
    }
  },
// 开始录音
startRecording() {
  console.log("长按开始录音");
  const options = {
    duration: 60000, // 最长录音时间，单位 ms
    sampleRate: 44100, // 采样率
    numberOfChannels: 1, // 声道
    encodeBitRate: 96000, // 编码比特率
    format: 'mp3' // 音频格式
  };
    recorderManager.start(options);
    console.log('开始录音');
  },

  // 停止录音
  stopRecording() {
    console.log("长按停止录音");
    recorderManager.stop();
    console.log('停止录音');
  },
  onShareAppMessage: function (ops) {
    return {
      title: '关关雎鸠',
      path: pageUrl.getSharePageWithOpenid(config.GUANGUAN_PAGE),
      success: function (res) {
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  onIconClick: function () {
    wx.navigateTo({
      url: '/page/mine/mine' // 在这里跳转到你想要的页面
    });
  },
  
})