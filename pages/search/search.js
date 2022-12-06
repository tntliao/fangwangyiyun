// pages/search/search.js
import request from '../../utils/request'
let timer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder: '', //推荐搜索的内容
    hotList: [], //搜索排行
    inputContent: '', //输入框的内容
    searchContent: [],// 搜索的内容
    historyList: [] //搜索的历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData();
    if (wx.getStorageSync('history')) {
      const historyList = wx.getStorageSync('history');
      this.setData({
        historyList
      })
    }
  },
  //初始化数据
  getInitData: async function () {
    const placeholder = await request('/search/default');
    const hotListData = await request('/search/hot/detail');
    this.setData({
      placeholder: placeholder.data.showKeyword,
      hotList: hotListData.data
    })
  },
  //
  getSearchContainer: function (event) {
    this.setData({
      inputContent: event.detail.value.trim()
    })
    clearTimeout(timer);
    timer = setTimeout(() => {
      this.searchRequest();
    }, 300)
  },

  searchRequest: async function () {
    if (!this.data.searchContent) {
      this.setData({
        searchContent: []
      })
      return;
    }
    const { inputContent, historyList } = this.data;
    if (!inputContent) return;
    const searchContent = await request('/search', { keywords: inputContent, limit: 10 });
    this.setData({
      searchContent: searchContent.result.songs,
    })

    //搜索结果为重复解决方法1
    /* if (historyList.indexOf(inputContent) === -1) {
      historyList.unshift(inputContent);
    } else {
      historyList.splice(historyList.indexOf(inputContent), 1);
      historyList.unshift(inputContent);
    } */

    //搜索结果为重复解决方法2
    if (historyList.indexOf(inputContent) !== -1) {
      historyList.splice(historyList.indexOf(inputContent), 1);
    }
    historyList.unshift(inputContent);
    this.setData({
      historyList
    })
    wx.setStorageSync('history', historyList)
  },

  //清楚搜索框输入的内容
  clearContent: function () {
    this.setData({
      inputContent: ''
    })
  },
  //清楚历史记录
  removeHistory: function () {
    const _this = this;
    wx.showModal({
      content: '确认要输出吗?',
      success(res) {
        if (res.confirm) {
          _this.setData({
            historyList: []
          });
          wx.removeStorageSync('history')
        }
      }
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