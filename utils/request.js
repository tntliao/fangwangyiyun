//发送ajax请求
/* 1.封装功能函数 */
import config from './config'
export default (url, data = {}, method = 'GET') => {
  return new Promise((resolve, reject) => {
    //1.new Promise初始化promise实例的状态为pending
    wx.request({
      url: config.host + url,
      // url: config.winHost + url,
      data,
      method,
      header: {
        cookie: wx.getStorageSync('cookies') ?wx.getStorageSync('cookies').find(item => item.indexOf("MUSIC_U") !== -1) : ''
        // cookie: wx.getStorageSync('cookies')[1]
      },
      // header: {},
      success: (res) => {
        //resolve修改promise的状态为成功状态resolve
        if (data.isLogin) {
          wx.setStorage({
            key: 'cookies',
            data: res.cookies
          });
        }
        resolve(res.data)
      },
      fail: (err) => {
        //reject修改promise的状态为失败的状态rejected
        reject(err)
      }
    })
  })
}