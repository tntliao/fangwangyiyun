import request from '../../utils/request'
// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    recommendList: [],
    topList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    /* 轮播图 */
    let bannerListData = await request('/banner', { type: 2 });
    this.setData({
      bannerList: bannerListData.banners
    })
    /* 推荐歌曲 */
    let recommendListDta = await request('/personalized', { limit: 10 })
    this.setData({
      recommendList: recommendListDta.result
    })
    /* 歌曲排行榜 */
    let index = 0;
    let resultArr = [];
    while (index < 8) {
      let topListData = await request('/top/list', { idx: index++ });
      //splice(会修改原数组，可以只当的数组进行增删改) slice(不会修改原数组)
      let topListItem = { name: topListData.playlist.name, tracks: topListData.playlist.tracks.slice(0, 3) };
      resultArr.push(topListItem);

      this.setData({
        topList: resultArr
      })
    }
    //更新topList
    /* this.setData({
      topList: resultArr
    }) */
  },

  //跳转到推荐音乐
  jump: function (event) {
    const page = event.currentTarget.dataset.page;
    wx.navigateTo({
      url: `/musicPack/pages/${page}/${page}`,
    })
  },
  //跳转到搜索音乐
  toSearch: function () {
    wx.navigateTo({
      url: '/pages/search/search'
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