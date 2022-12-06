import request from '../../utils/request';

// pages/personal/personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userData: {},
    playbackRecord: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const loginData = wx.getStorageSync('loginData')
    this.setData({
      userData: JSON.parse(loginData),
    })

    this.getRecord('5086894063')
  },
  /* 点击跳转到login */
  toLogin: function () {
    wx.navigateTo({
      url: '/loginPack/pages/login/login'
    })
  },

  /* 获取播放历史 */
  getRecord: async function (userId) {
    let result = await request('/user/record', { uid: userId, type: 1 })
    let index = 0;
    let newResult = result.weekData.map(item => {
      item.id = index++;
      return item;
    })
    this.setData({
      playbackRecord: newResult
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