import request from '../../../utils/request';
import PubSub from 'pubsub-js';

// pages/recommend/recommend.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    month: '', //月
    day: '', //日
    recommendedMusic: '', //推荐列表数据
    index: 0 //点击音乐的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* 判断用户是否登录 */
    let userInfo = wx.getStorageSync('cookies');
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: () => {
          //跳转至登录页面
          setTimeout(() => {
            wx.reLaunch({
              url: '/loginPack/pages/login/login',
            })
          }, 2000)
        }
      })
    }
    this.getRecommendedMusic();
    this.setData({
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
      // recommendedMusic: result.recommend
    });

    // 订阅songDetail发布的消息
    PubSub.subscribe('switchType', (msg, type) => {
      let { recommendedMusic, index } = this.data;
      if (type === 'pre') {
        index -= 1;
        // if (index < 0) index = recommendedMusic.length - 1;
        index < 0 ? index = recommendedMusic.length -1 : null;
      } else {
        index += 1
        if (index >= recommendedMusic.length - 1) index = 0;
      }
      //更新下标
      this.setData({ index });
      const musicId = recommendedMusic[index].id;
      //将音乐id回传给songDetail
      PubSub.publish('musicId', musicId);
    })
  },

  //获取用户每天推荐数据  
  getRecommendedMusic: async function () {
    const result = await request('/recommend/songs');
    this.setData({
      recommendedMusic: result.recommend
    })
  },
  // 前往歌曲播放页
  toSongDetail: function (event) {
    const { index, song } = event.currentTarget.dataset
    this.setData({ index })
    wx.navigateTo({
      /* 不能直接将song对象作为参数传递，长度过长会被截掉 */
      url: '/musicPack/pages/songDetail/songDetail?musicId=' + song.id,
    })
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