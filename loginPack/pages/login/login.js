import request from '../../../utils/request';
// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '13536361414',
    password: '1qaz2wsx'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  collectingData: function (event) {
    // let type = event.currentTarget.id //id传值
    let type = event.currentTarget.dataset.type //data-key传值
    this.setData({
      [type]: event.detail.value
    })
  },

  login: async function () {
    const { phone, password } = this.data;
    if (!phone) {
      wx.showToast({
        title: "手机号不能为空~",
        icon: "none"
      })
      return;
    }
    let reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if (!reg.test(phone)) {
      wx.showToast({
        title: "手机号格式不对~",
        icon: "none"
      })
      return;
    }
    if (!password) {
      wx.showToast({
        title: "密码不能为空~",
        icon: "none"
      })
      return;
    }

    //向服务器发送请求，返回结果
    const result = await request('/login/cellphone', { phone, password, isLogin: true });
    switch (result.code) {
      case 200:
        wx.showToast({
          title: `登录成功,欢迎你${result.profile.nickname}`,
          icon: 'none'
        })
        console.log(result);
        wx.setStorageSync('loginData', JSON.stringify(result.profile));
        wx.reLaunch({
          url: '/pages/personal/personal'
        })
        break;
      case 501:
        wx.showToast({
          title: result.msg,
          icon: 'none'
        })
        break;
      case 502:
        wx.showToast({
          title: result.msg,
          icon: 'none'
        })
        break;
      default:
        wx.showToast({
          title: '登录失败，请重新登录',
          icon: 'none'
        })
    }
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