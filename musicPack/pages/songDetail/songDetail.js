import request from '../../../utils/request';
import PubSub from 'pubsub-js';
import moment from 'moment';
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, //是否在播放
    musicId: '', //当前音乐的id
    musicInfo: {}, //当前音乐信息
    musicLink: '', //音乐的链接
    cuurentTime: '00:00', //当前音乐时间
    totalDuration: '00:00', //音乐总时间
    currentWidth: 0 //已播放的时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      musicId: options.musicId
    })
    //获取音乐详细
    this.getSongDetail(options.musicId)
    //创建控制音频实例
    this.backgroundAudioManager = wx.getBackgroundAudioManager();

    //判断当前页面音乐是否在播放
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === this.data.musicId) {
      this.setData({
        isPlay: true
      })
    }

    //监视音乐播放/暂停
    this.backgroundAudioManager.onPlay(() => {
      this.changeIsPlay(true)
      appInstance.globalData.isMusicPlay = true;
      appInstance.globalData.musicId = this.data.musicId
    });
    this.backgroundAudioManager.onPause(() => {
      this.changeIsPlay(false)
      appInstance.globalData.isMusicPlay = false;
    });
    this.backgroundAudioManager.onStop(() => {
      this.changeIsPlay(false)
      appInstance.globalData.isMusicPlay = false;
    });
    this.backgroundAudioManager.onTimeUpdate(() => {
      /* console.log('总时长:', this.backgroundAudioManager.duration);
      console.log('当前时间:', this.backgroundAudioManager.currentTime); */
      const cuurentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss');
      const currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 450;
      this.setData({
        cuurentTime,
        currentWidth
      })
    })
    this.backgroundAudioManager.onEnded(() => {
      PubSub.publish('switchType', 'next');
      this.setData({
        currentTime: '00:00',
        currentWidth: 0
      })
    })
  },

  changeIsPlay: function (isPlay) {
    this.setData({
      isPlay
    })
  },
  /* 播放与暂停 */
  handlePlay: function () {
    let isPlay = !this.data.isPlay;
    /* this.setData({
      isPlay
    }); */

    //调用会开始播放音乐，然后上面就会监视到，改变isPlay的值
    const { musicId, musicLink } = this.data
    this.musicControl(isPlay, musicId, musicLink)
    // this.musicControl(isPlay, musicId)
  },

  //获取音乐详细
  getSongDetail: async function (musicId) {
    // if (musicId == this.data.musicId) return
    const result = await request('/song/detail', { ids: musicId });
    //这个时间必须是毫秒
    const totalDuration = moment(result.songs[0].dt).format('mm:ss');
    this.setData({
      musicInfo: result.songs[0],
      totalDuration
    })
    //动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.musicInfo.name,
    })
  },

  /* 控制音乐播放/暂停的功能函数 */
  musicControl: async function (isPlay, musicId, musicLink) {
    //创建控制音乐的实例
    if (isPlay) { //音乐

      //获取音乐链接

      // 优化了,直接跳过发请求 节省 4ms 左右
      if (!musicLink) {
        const musicLinkData = await request('/song/url', { id: musicId });
        musicLink = musicLinkData.data[0].url;
        this.setData({ musicLink })
      }

      // 没有优化 会走本地缓存
      /* const musicLinkData = await request('/song/url', { id: musicId });
      const musicLink = musicLinkData.data[0].url; */

      this.backgroundAudioManager.src = musicLink;
      this.backgroundAudioManager.title = this.data.musicInfo.name;
    } else {//暂停播放
      this.backgroundAudioManager.pause();
    }
  },

  // 切换歌曲
  handleSwitch: function (event) {
    const type = event.currentTarget.id;
    //停止当前音乐的播放
    this.backgroundAudioManager.stop();
    //订阅recommend回传的音乐id
    PubSub.subscribe('musicId', (msg, musicId) => {
      console.log(musicId);
      //获取最新的音乐详细信息
      this.getSongDetail(musicId);
      //自动播放最新的音乐
      this.musicControl(true, musicId)
      //取消订阅
      PubSub.unsubscribe('musicId');
    })
    //发布消息给recommend
    PubSub.publish('switchType', type);


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})