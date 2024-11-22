const config = require('../../config.js')
const wxLogin = require("../../util/wx_login");
const request = require("../../util/request");
const wxInteractive = require("../../util/wx_interactive");
const pageUrl = require("../../util/page_url");
const constVar = require("../../util/const_var");
const recorderManager = wx.getRecorderManager();
const socketTask = wx.connectSocket({
  url: 'wss://asr.tencentcloudapi.com/', // 替换为腾讯云ASR WebSocket URL
  header: {
    'Content-Type': 'application/json'
  }
});

let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTitle: "", 
    showOverlay: false, // 默认不显示蒙层
    promptHeader: '',         // 提示语
    promptSentences: [],      // 提示词句子数组
    recognizedText: '',       // 实时识别文本
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
    this.setData({
      navTitle: "见面邀请",
    });
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
    this.setData({
      showOverlay: true // 显示蒙层
    });
    // WebSocket 打开后，发送开始识别的指令
    socketTask.onOpen(() => {
      console.log('WebSocket连接成功');
      socketTask.send(JSON.stringify({
        action: 'start',
        engine_model_type: '16k_zh',
        res_type: 0,
        result_text_format: 0,
        secretid: '你的SecretId', // todo
        secretkey: '你的SecretKey'  // todo
      }));
    });
    const options = {
      duration: 60000, // 最长录音时间，单位 ms
      sampleRate: 44100, // 采样率
      numberOfChannels: 1, // 声道
      encodeBitRate: 96000, // 编码比特率
      format: 'mp3' // 音频格式
    };
    recorderManager.onFrameRecorded((res) => {
      console.log('录音帧数据:', res);
      if (socketTask && res.frameBuffer) {
        // 实时发送音频帧数据到WebSocket
        socketTask.send(res.frameBuffer);
      }
    });

    recorderManager.onStop(() => {
      console.log('录音结束');
      if (socketTask) {
        // 通知WebSocket停止识别
        socketTask.send(JSON.stringify({ action: 'end' }));
        socketTask.close();
        socketTask = null;
      }
    });

    recorderManager.start(options);
    console.log('开始录音');
    // 监听实时识别结果
    socketTask.onMessage((res) => {
      const result = JSON.parse(res.data);
      console.log('实时识别结果:', result.text);
      this.setData({ 
        isSpeaking: true,
        recognizedText: result.text 
      });
    });
  },

  // 停止录音
  stopRecording() {
    console.log("长按停止录音");
    this.setData({
      showOverlay: false // 显示蒙层
    });
    recorderManager.stop();
    console.log('停止录音');
    // 上传识别结果到后端
    this.uploadRecognizedText();
  },

  // 上传识别内容到后端
  uploadRecognizedText() {
    wx.request({
      url: 'https://your-backend-api.com/submitRecognition', // todo 替换为实际后端API地址
      method: 'POST',
      data: { content: this.data.recognizedText },
      success(res) {
        console.log('后端响应:', res.data);
      },
      fail(err) {
        console.error('上传识别结果失败:', err);
      }
    });
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