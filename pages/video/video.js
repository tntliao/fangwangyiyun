import request from '../../utils/request';
// pages/video/video.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList: [], //导航标签数据
    currentId: '', //导航的标识
    videoUrl: [], //视频的列表数据
    videoId: '', //视频id标识
    videoUpdataTime: [], //播放信息 
    isTriggered: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGrounpList();
  },
  /* 获取导航列表 */
  getVideoGrounpList: async function () {
    const result = await request('/video/group/list')
    this.setData({
      videoList: result.data.slice(0, 14),
      currentId: result.data[0].id
    })
    /* 发送请求 */
    this.getVideoList(this.data.currentId);
  },

  /* 携带cookie发送请求 获取视频列表*/
  getVideoList: async function (id) {
    const videoListData = await request('/video/group', { id });
    let index = 0;
    const newvideoListData = videoListData.datas.map(item => {
      item.id = index++;
      return item
    })
    this.setData({
      videoUrl: newvideoListData,
      isTriggered: false
    })
    wx.hideLoading()
  },

  /* 看是否被选中 */
  changeActive: function (event) {
    /* 
      id --> 获取到的是 string
      data-xxx  --> 获取到的是 number
     */
    const currentId = Number(event.currentTarget.id);
    this.setData({
      currentId,
      videoUrl: []
    })
    /* 更新视频 */
    wx.showLoading({
      title: '正在加载~',
    })
    this.getVideoList(currentId)
  },

  /* 视频不能多个播放 */
  handlePlay: function (event) {
    //当前点击的节点的id
    let vid = event.currentTarget.id;
    //关闭上一个播放的视频
    /* 如果this.vid 不等于 当前点击的vid，有this.videoContent 执行 后面的 */
    this.vid !== vid && this.videoContent && this.videoContent.stop();
    this.vid = vid;
    //更新data中video的状态数据
    this.setData({ videoId: vid, })
    //控制video表示的状态数据
    this.videoContent = wx.createVideoContext(vid);
    //判断之前是否有播放记录，有就跳转到指定位置
    const { videoUpdataTime } = this.data;
    const videoItem = videoUpdataTime.find(item => item.vid === vid);
    if (videoItem) {
      this.videoContent.seek(videoItem.currentTime)
    }

    // this.videoContent.play();
  },

  /* 监听视频播放进度的回调 */
  handleTimeUpdata: function (event) {
    const currentPlayInfo = { vid: event.currentTarget.id, currentTime: event.detail.currentTime };
    const { videoUpdataTime } = this.data;

    /* 
      1.如果有添加过，在原有的播放记录中修改播放事件为当前的播放时间
      2.如果没有，需要在数组中添加当前视频的播放对象
     */
    let videoItem = videoUpdataTime.find(item => item.vid === currentPlayInfo.vid)
    if (videoItem) { //之前有
      videoItem.currentTime = event.detail.currentTime;
    } else { //之前没有
      videoUpdataTime.push(currentPlayInfo)
    }
    this.setData({
      videoUpdataTime
    })
  },

  /* 视频播放完 */
  handleEned: function (event) {
    //移除记录播放时长当前视频对象
    const { videoUpdataTime } = this.data;
    videoUpdataTime.splice(videoUpdataTime.findIndex(item => item.vid === event.currentTarget.id), 1);
    this.setData({
      videoUpdataTime
    })
  },

  /* 视频下拉 */
  handleScroll: function (event) {
    this.setData({
      isTriggered: true
    })
    this.getVideoList(this.data.currentId);
  },

  /* 底部加载更多 */
  bandleToLower: function () {
    console.log('scroll-view 上拉抵触');
    /* 
      数据分页 1.后端分页 2.前端分页
        发送请求 || 在前端截取最新的数据 追加到视频列表后的后方
        网易云暂时没有提供分页的api
    */

    const newVideoList = [
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_C5E6756DCDE0EA4003C77D58F8778923",
          "coverUrl": "https://p1.music.126.net/r0oUQlH0D0_balniFXBsYg==/109951163573740783.jpg",
          "height": 720,
          "width": 1280,
          "title": "上万老外疯狂的蒙古民族摇滚乐队“九宝乐队”",
          "description": null,
          "commentCount": 1185,
          "shareCount": 4536,
          "resolutions": [
            {
              "resolution": 240,
              "size": 33199314
            },
            {
              "resolution": 480,
              "size": 63724431
            },
            {
              "resolution": 720,
              "size": 64931904
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 140000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/5nc8xS6XCytEpmi1pb-SUA==/109951165846857566.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 140100,
            "birthday": 691516800000,
            "userId": 55692959,
            "userType": 0,
            "nickname": "虾仔剪影",
            "signature": "超燃BGM",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951165846857570,
            "backgroundImgId": 109951165846855100,
            "backgroundUrl": "http://p1.music.126.net/P604NLDn68xwlPNFR2RjYA==/109951165846855096.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "舞蹈视频达人"
            },
            "djStatus": 10,
            "vipType": 0,
            "remarkName": null,
            "backgroundImgIdStr": "109951165846855096",
            "avatarImgIdStr": "109951165846857566"
          },
          "urlInfo": {
            "id": "C5E6756DCDE0EA4003C77D58F8778923",
            "url": "http://vodkgeyttp9.vod.126.net/cloudmusic/GwIRpBSg_1691493613_shd.mp4?ts=1626317303&rid=A7996AF39978E47E41462FAC84EDC9AB&rl=3&rs=nspvNCValhQOywCwiyDmNvzZkWjxoYpS&sign=800e0b25453a6ae0a8195802a711b3c5&ext=TXTdpEVNfaSRq9hQfoGoqGeCDegGhc1%2BIrejo0klbo9fOFkqZfCqoAV%2BIIkx0vLZU3S4c6WqTT5qnM%2BdjAXFiN7uC4D1b61quGtiS3M%2BFz9Lel4pzHVP5ppcjPvHVvNyZCj4vqiqqhMz4BDKk9Z0SxqUpDW8A5PMS6L7EUiAFnMi%2Fhl3bDXl7UqCJQIwSATMmxYciqzOxNiG4pFGBeZBvz%2FqqN%2BLrwnKtTqbQSr5CD3iJ1QbdNNaU5qmE4wzaotf",
            "size": 64931904,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [
            {
              "id": 58100,
              "name": "现场",
              "alg": null
            },
            {
              "id": 59101,
              "name": "华语现场",
              "alg": null
            },
            {
              "id": 57109,
              "name": "民谣现场",
              "alg": null
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "C5E6756DCDE0EA4003C77D58F8778923",
          "durationms": 219000,
          "playTime": 1463148,
          "praisedCount": 8236,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_F5CC95D04A666650D999E2202C164500",
          "coverUrl": "https://p1.music.126.net/fX38diM7LrE_Pm0aKY3vaw==/109951163574262084.jpg",
          "height": 360,
          "width": 640,
          "title": "林肯公园麦迪逊广场花园《in the end》炸裂现场",
          "description": "永远缅怀主唱查斯特大人！\n怀念那个最好的林肯公园！\n和林肯公园击掌庆祝的那些歌迷应该一辈子都不会忘了那个时刻，那个晚上吧！\n如果你有想去并且能去的演唱会就赶紧去吧，因为我们谁也不知道哪一天，我们只能在视频里缅怀了\n所以小肥羊乐队一定会尽全力做出最好的音乐，将来为大家准备最好的现场的！",
          "commentCount": 359,
          "shareCount": 1032,
          "resolutions": [
            {
              "resolution": 240,
              "size": 24719124
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 450000,
            "authStatus": 1,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/OWQK04kWJsa-bwXLx4XuJg==/109951163249044475.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 450100,
            "birthday": 1448197200000,
            "userId": 362506061,
            "userType": 4,
            "nickname": "小肥羊乐队",
            "signature": "南宁本地原创独立摇滚乐队小肥羊乐队官方账号",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951163249044480,
            "backgroundImgId": 109951163249054000,
            "backgroundUrl": "http://p1.music.126.net/w2Ex4MpHGIKA8Q4QNCLgyw==/109951163249054001.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 10,
            "vipType": 11,
            "remarkName": null,
            "backgroundImgIdStr": "109951163249054001",
            "avatarImgIdStr": "109951163249044475"
          },
          "urlInfo": {
            "id": "F5CC95D04A666650D999E2202C164500",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/IaGYp6Ef_1930567931_sd.mp4?ts=1626317303&rid=A7996AF39978E47E41462FAC84EDC9AB&rl=3&rs=CTPJIxPvxrOBgPRrIrLjAqwoHjUWBcro&sign=5bf19cebea57ec7906eb069729eaac00&ext=TXTdpEVNfaSRq9hQfoGoqGeCDegGhc1%2BIrejo0klbo9fOFkqZfCqoAV%2BIIkx0vLZU3S4c6WqTT5qnM%2BdjAXFiN7uC4D1b61quGtiS3M%2BFz9Lel4pzHVP5ppcjPvHVvNyZCj4vqiqqhMz4BDKk9Z0SxqUpDW8A5PMS6L7EUiAFnMi%2Fhl3bDXl7UqCJQIwSATMmxYciqzOxNiG4pFGBeZBvz%2FqqN%2BLrwnKtTqbQSr5CD3iJ1QbdNNaU5qmE4wzaotf",
            "size": 24719124,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 240
          },
          "videoGroup": [
            {
              "id": 58100,
              "name": "现场",
              "alg": null
            },
            {
              "id": 57106,
              "name": "欧美现场",
              "alg": null
            },
            {
              "id": 59108,
              "name": "巡演现场",
              "alg": null
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 14208,
              "name": "Linkin Park",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": [
            109
          ],
          "relateSong": [
            {
              "name": "In The End",
              "id": 4153632,
              "pst": 0,
              "t": 0,
              "ar": [
                {
                  "id": 95439,
                  "name": "Linkin Park",
                  "tns": [],
                  "alias": []
                }
              ],
              "alia": [],
              "pop": 100,
              "st": 0,
              "rt": "600902000005314371",
              "fee": 1,
              "v": 27,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 419897,
                "name": "In The End",
                "picUrl": "http://p4.music.126.net/kACfPVCIjo67lPo8ca0REQ==/1719636185851311.jpg",
                "tns": [],
                "pic": 1719636185851311
              },
              "dt": 220000,
              "h": {
                "br": 320000,
                "fid": 0,
                "size": 8818051,
                "vd": -26300
              },
              "m": {
                "br": 192000,
                "fid": 0,
                "size": 5290893,
                "vd": -24000
              },
              "l": {
                "br": 128000,
                "fid": 0,
                "size": 3527314,
                "vd": -22600
              },
              "a": null,
              "cd": "1",
              "no": 1,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 1,
              "s_id": 0,
              "rtype": 0,
              "rurl": null,
              "mst": 9,
              "cp": 7002,
              "mv": 509036,
              "publishTime": 1006185600007,
              "privilege": {
                "id": 4153632,
                "fee": 1,
                "payed": 0,
                "st": 0,
                "pl": 0,
                "dl": 0,
                "sp": 0,
                "cp": 0,
                "subp": 0,
                "cs": false,
                "maxbr": 320000,
                "fl": 0,
                "toast": false,
                "flag": 260,
                "preSell": false
              }
            },
            {
              "name": "生活要继续",
              "id": 440796882,
              "pst": 0,
              "t": 0,
              "ar": [
                {
                  "id": 12184598,
                  "name": "小肥羊乐队",
                  "tns": [],
                  "alias": []
                }
              ],
              "alia": [],
              "pop": 10,
              "st": 0,
              "rt": null,
              "fee": 0,
              "v": 39,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 34995711,
                "name": "绽放的理由",
                "picUrl": "http://p4.music.126.net/wXBCwFRRHQaw-ybnXv3NIg==/109951162809626151.jpg",
                "tns": [],
                "pic_str": "109951162809626151",
                "pic": 109951162809626140
              },
              "dt": 279267,
              "h": {
                "br": 320000,
                "fid": 0,
                "size": 11173138,
                "vd": -19600
              },
              "m": {
                "br": 192000,
                "fid": 0,
                "size": 6703900,
                "vd": -17100
              },
              "l": {
                "br": 128000,
                "fid": 0,
                "size": 4469281,
                "vd": -15300
              },
              "a": null,
              "cd": "1",
              "no": 5,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 2,
              "s_id": 0,
              "rtype": 0,
              "rurl": null,
              "mst": 9,
              "cp": 0,
              "mv": 0,
              "publishTime": 1479220331262,
              "privilege": {
                "id": 440796882,
                "fee": 0,
                "payed": 0,
                "st": 0,
                "pl": 320000,
                "dl": 999000,
                "sp": 7,
                "cp": 1,
                "subp": 1,
                "cs": false,
                "maxbr": 999000,
                "fl": 320000,
                "toast": false,
                "flag": 66,
                "preSell": false
              }
            }
          ],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "F5CC95D04A666650D999E2202C164500",
          "durationms": 218802,
          "playTime": 1316341,
          "praisedCount": 7531,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_A5952D1DEB9DD9A2E39FF4FA08912C55",
          "coverUrl": "https://p1.music.126.net/ovuFWc98Ch6SYZNpWVGDHQ==/109951165196493170.jpg",
          "height": 720,
          "width": 1280,
          "title": "Begin Again4 刘宪华Henry<Savage Love>",
          "description": null,
          "commentCount": 86,
          "shareCount": 510,
          "resolutions": [
            {
              "resolution": 240,
              "size": 28853580
            },
            {
              "resolution": 480,
              "size": 43459417
            },
            {
              "resolution": 720,
              "size": 69960768
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 330000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/1WQhUxvNqWhlno13PrIhrw==/109951164654006252.jpg",
            "accountStatus": 0,
            "gender": 2,
            "city": 330200,
            "birthday": 614703600000,
            "userId": 425660916,
            "userType": 0,
            "nickname": "summer_喵喵",
            "signature": "",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951164654006260,
            "backgroundImgId": 109951164296406800,
            "backgroundUrl": "http://p1.music.126.net/Rar-nH8pCz0-_mlOKMvL_w==/109951164296406793.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 0,
            "vipType": 11,
            "remarkName": null,
            "backgroundImgIdStr": "109951164296406793",
            "avatarImgIdStr": "109951164654006252"
          },
          "urlInfo": {
            "id": "A5952D1DEB9DD9A2E39FF4FA08912C55",
            "url": "http://vodkgeyttp9.vod.126.net/cloudmusic/caHuYCaz_3077139830_shd.mp4?ts=1626317303&rid=A7996AF39978E47E41462FAC84EDC9AB&rl=3&rs=PkgVrPRrgXPQdrlRlkAHUpjRixxHBEhR&sign=1f23dd27d9f8a88deb9f1972d215bcb9&ext=TXTdpEVNfaSRq9hQfoGoqGeCDegGhc1%2BIrejo0klbo9fOFkqZfCqoAV%2BIIkx0vLZU3S4c6WqTT5qnM%2BdjAXFiN7uC4D1b61quGtiS3M%2BFz9Lel4pzHVP5ppcjPvHVvNyZCj4vqiqqhMz4BDKk9Z0SxqUpDW8A5PMS6L7EUiAFnMi%2Fhl3bDXl7UqCJQIwSATMmxYciqzOxNiG4pFGBeZBvz%2FqqN%2BLrwnKtTqbQSr5CD3iJ1QbdNNaU5qmE4wzaotf",
            "size": 69960768,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [
            {
              "id": 58100,
              "name": "现场",
              "alg": null
            },
            {
              "id": 57106,
              "name": "欧美现场",
              "alg": null
            },
            {
              "id": 57108,
              "name": "流行现场",
              "alg": null
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 4101,
              "name": "娱乐",
              "alg": null
            },
            {
              "id": 3101,
              "name": "综艺",
              "alg": null
            },
            {
              "id": 24134,
              "name": "弹唱",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "A5952D1DEB9DD9A2E39FF4FA08912C55",
          "durationms": 213000,
          "playTime": 180909,
          "praisedCount": 2472,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_E5678E01D6D54A50FA309924E169877B",
          "coverUrl": "https://p1.music.126.net/I1FFJABsksXQulXgk7pwtg==/109951163808612862.jpg",
          "height": 720,
          "width": 1290,
          "title": "五月天《你不是真正的快乐》现场版",
          "description": "五月天《你不是真正的快乐》现场版，讲一个故事，一个成年人的故事",
          "commentCount": 1056,
          "shareCount": 10164,
          "resolutions": [
            {
              "resolution": 240,
              "size": 30721555
            },
            {
              "resolution": 480,
              "size": 52389133
            },
            {
              "resolution": 720,
              "size": 77131207
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 350000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/BqaqjmfOOP0nRhil3M2y1A==/19041342370266626.jpg",
            "accountStatus": 0,
            "gender": 2,
            "city": 350100,
            "birthday": -2209017600000,
            "userId": 1287906511,
            "userType": 202,
            "nickname": "音乐奇葩君",
            "signature": "合作联系weiqipa",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 19041342370266624,
            "backgroundImgId": 109951162868126480,
            "backgroundUrl": "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "视频达人(华语、音乐现场)",
              "2": "音乐图文达人"
            },
            "djStatus": 0,
            "vipType": 11,
            "remarkName": null,
            "backgroundImgIdStr": "109951162868126486",
            "avatarImgIdStr": "19041342370266626"
          },
          "urlInfo": {
            "id": "E5678E01D6D54A50FA309924E169877B",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/qYCAePgc_2269242985_shd.mp4?ts=1626317303&rid=A7996AF39978E47E41462FAC84EDC9AB&rl=3&rs=MDGbthaAwAayKWcOEkkytYFfWrHpZlFS&sign=3cbff2418b63a5c0a8a01aaf14fb4427&ext=TXTdpEVNfaSRq9hQfoGoqGeCDegGhc1%2BIrejo0klbo9fOFkqZfCqoAV%2BIIkx0vLZU3S4c6WqTT5qnM%2BdjAXFiN7uC4D1b61quGtiS3M%2BFz9Lel4pzHVP5ppcjPvHVvNyZCj4vqiqqhMz4BDKk9Z0SxqUpDW8A5PMS6L7EUiAFnMi%2Fhl3bDXl7UqCJQIwSATMmxYciqzOxNiG4pFGBeZBvz%2FqqN%2BLrwnKtTqbQSr5CD0vf16%2F%2FTMAJlBSvlH41UK%2B",
            "size": 77131207,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [
            {
              "id": 58100,
              "name": "现场",
              "alg": null
            },
            {
              "id": 59101,
              "name": "华语现场",
              "alg": null
            },
            {
              "id": 57108,
              "name": "流行现场",
              "alg": null
            },
            {
              "id": 59108,
              "name": "巡演现场",
              "alg": null
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 24140,
              "name": "五月天",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "E5678E01D6D54A50FA309924E169877B",
          "durationms": 254549,
          "playTime": 2320433,
          "praisedCount": 15953,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_E675DA2F5030B804BC70BBE0504A9FE0",
          "coverUrl": "https://p1.music.126.net/jiFPu0PI-uuitkbAJag1xA==/109951163572693780.jpg",
          "height": 720,
          "width": 1280,
          "title": "你可以不知道崔开潮，但一定要听一下《声声慢》",
          "description": "你可以不知道崔开潮，但一定要听一下《声声慢》。",
          "commentCount": 454,
          "shareCount": 823,
          "resolutions": [
            {
              "resolution": 240,
              "size": 23642208
            },
            {
              "resolution": 480,
              "size": 33937778
            },
            {
              "resolution": 720,
              "size": 54423303
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 510000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/rYx8h-spuAYLc24RgvHo8g==/18644418674243834.jpg",
            "accountStatus": 0,
            "gender": 2,
            "city": 510100,
            "birthday": 1466179200000,
            "userId": 351763406,
            "userType": 0,
            "nickname": "更成都",
            "signature": "二更视频旗下新媒体，关注音乐人故事",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 18644418674243830,
            "backgroundImgId": 109951162997447220,
            "backgroundUrl": "http://p1.music.126.net/EpmzTzQgewEVmyy1PzNzzw==/109951162997447223.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "泛生活视频达人"
            },
            "djStatus": 0,
            "vipType": 11,
            "remarkName": null,
            "backgroundImgIdStr": "109951162997447223",
            "avatarImgIdStr": "18644418674243834"
          },
          "urlInfo": {
            "id": "E675DA2F5030B804BC70BBE0504A9FE0",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/7D7ul3hT_32593435_shd.mp4?ts=1626317303&rid=A7996AF39978E47E41462FAC84EDC9AB&rl=3&rs=GejkkOWzNiOLlGjuWGvfOaerNHkIHtPa&sign=f25efb9c9d0ab41aedf71836848d24b0&ext=TXTdpEVNfaSRq9hQfoGoqGeCDegGhc1%2BIrejo0klbo9fOFkqZfCqoAV%2BIIkx0vLZU3S4c6WqTT5qnM%2BdjAXFiN7uC4D1b61quGtiS3M%2BFz9Lel4pzHVP5ppcjPvHVvNyZCj4vqiqqhMz4BDKk9Z0SxqUpDW8A5PMS6L7EUiAFnMi%2Fhl3bDXl7UqCJQIwSATMmxYciqzOxNiG4pFGBeZBvz%2FqqN%2BLrwnKtTqbQSr5CD3iJ1QbdNNaU5qmE4wzaotf",
            "size": 54423303,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [
            {
              "id": 58100,
              "name": "现场",
              "alg": null
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": null
            },
            {
              "id": 2104,
              "name": "民谣",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 13222,
              "name": "华语",
              "alg": null
            },
            {
              "id": 14191,
              "name": "清新",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [
            {
              "name": "声声慢",
              "id": 439139384,
              "pst": 0,
              "t": 0,
              "ar": [
                {
                  "id": 12174110,
                  "name": "崔开潮",
                  "tns": [],
                  "alias": []
                }
              ],
              "alia": [],
              "pop": 100,
              "st": 0,
              "rt": null,
              "fee": 8,
              "v": 63,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 34978161,
                "name": "急驶的马车",
                "picUrl": "http://p4.music.126.net/qMiFV8V6zlOSS9D4FLwFMw==/109951162807427178.jpg",
                "tns": [],
                "pic_str": "109951162807427178",
                "pic": 109951162807427180
              },
              "dt": 212000,
              "h": {
                "br": 320000,
                "fid": 0,
                "size": 8482525,
                "vd": 635
              },
              "m": {
                "br": 192000,
                "fid": 0,
                "size": 5089533,
                "vd": -2
              },
              "l": {
                "br": 128000,
                "fid": 0,
                "size": 3393036,
                "vd": 1716
              },
              "a": null,
              "cd": "1",
              "no": 2,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 2,
              "s_id": 0,
              "rtype": 0,
              "rurl": null,
              "mst": 9,
              "cp": 0,
              "mv": 0,
              "publishTime": 1489593600007,
              "privilege": {
                "id": 439139384,
                "fee": 8,
                "payed": 0,
                "st": 0,
                "pl": 128000,
                "dl": 0,
                "sp": 7,
                "cp": 1,
                "subp": 1,
                "cs": false,
                "maxbr": 999000,
                "fl": 128000,
                "toast": false,
                "flag": 64,
                "preSell": false
              }
            }
          ],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "E675DA2F5030B804BC70BBE0504A9FE0",
          "durationms": 201120,
          "playTime": 683454,
          "praisedCount": 5286,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_96343206A4F47605FCBE0BA3EE6E9A4B",
          "coverUrl": "https://p1.music.126.net/WN67jZW9FR148q2S32pOZw==/109951165111985952.jpg",
          "height": 720,
          "width": 1280,
          "title": "黄霄雲连名带姓",
          "description": "",
          "commentCount": 112,
          "shareCount": 293,
          "resolutions": [
            {
              "resolution": 240,
              "size": 17451407
            },
            {
              "resolution": 480,
              "size": 28509894
            },
            {
              "resolution": 720,
              "size": 38280191
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 410000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/PYRf-8FwJAQwJeRLj9OD5w==/109951164527755615.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 410100,
            "birthday": -2209017600000,
            "userId": 317873199,
            "userType": 0,
            "nickname": "kkkkkkk_mJ",
            "signature": "私信我帮你下载想听的歌",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951164527755620,
            "backgroundImgId": 109951164938910240,
            "backgroundUrl": "http://p1.music.126.net/l0jgCIcmxCFvhY_-jEqChg==/109951164938910240.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "backgroundImgIdStr": "109951164938910240",
            "avatarImgIdStr": "109951164527755615"
          },
          "urlInfo": {
            "id": "96343206A4F47605FCBE0BA3EE6E9A4B",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/37czOhzx_3048803931_shd.mp4?ts=1626317303&rid=A7996AF39978E47E41462FAC84EDC9AB&rl=3&rs=nxXYukXYKxhXTlIQdKpZFbXZZbiqQeEP&sign=4f76530090b53f91d1e7f9536f071341&ext=TXTdpEVNfaSRq9hQfoGoqGeCDegGhc1%2BIrejo0klbo9fOFkqZfCqoAV%2BIIkx0vLZU3S4c6WqTT5qnM%2BdjAXFiN7uC4D1b61quGtiS3M%2BFz9Lel4pzHVP5ppcjPvHVvNyZCj4vqiqqhMz4BDKk9Z0SxqUpDW8A5PMS6L7EUiAFnMi%2Fhl3bDXl7UqCJQIwSATMmxYciqzOxNiG4pFGBeZBvz%2FqqN%2BLrwnKtTqbQSr5CD3iJ1QbdNNaU5qmE4wzaotf",
            "size": 38280191,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [
            {
              "id": 58100,
              "name": "现场",
              "alg": null
            },
            {
              "id": 59101,
              "name": "华语现场",
              "alg": null
            },
            {
              "id": 57108,
              "name": "流行现场",
              "alg": null
            },
            {
              "id": 59108,
              "name": "巡演现场",
              "alg": null
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [
            {
              "name": "连名带姓 (Live)",
              "id": 1428598955,
              "pst": 0,
              "t": 0,
              "ar": [
                {
                  "id": 14077324,
                  "name": "黄霄雲",
                  "tns": [],
                  "alias": []
                }
              ],
              "alia": [],
              "pop": 100,
              "st": 0,
              "rt": "",
              "fee": 8,
              "v": 1,
              "crbt": null,
              "cf": "",
              "al": {
                "id": 86269349,
                "name": "歌手·当打之年 第5期",
                "picUrl": "http://p4.music.126.net/8CBeG0BF2C0dPiA1FDflGQ==/109951164773621591.jpg",
                "tns": [],
                "pic_str": "109951164773621591",
                "pic": 109951164773621580
              },
              "dt": 295850,
              "h": {
                "br": 320000,
                "fid": 0,
                "size": 11836845,
                "vd": -26310
              },
              "m": {
                "br": 192000,
                "fid": 0,
                "size": 7102125,
                "vd": -23675
              },
              "l": {
                "br": 128000,
                "fid": 0,
                "size": 4734765,
                "vd": -22009
              },
              "a": null,
              "cd": "01",
              "no": 3,
              "rtUrl": null,
              "ftype": 0,
              "rtUrls": [],
              "djId": 0,
              "copyright": 0,
              "s_id": 0,
              "rtype": 0,
              "rurl": null,
              "mst": 9,
              "cp": 1416682,
              "mv": 0,
              "publishTime": 0,
              "privilege": {
                "id": 1428598955,
                "fee": 8,
                "payed": 0,
                "st": 0,
                "pl": 128000,
                "dl": 0,
                "sp": 7,
                "cp": 1,
                "subp": 1,
                "cs": false,
                "maxbr": 999000,
                "fl": 128000,
                "toast": false,
                "flag": 68,
                "preSell": false
              }
            }
          ],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "96343206A4F47605FCBE0BA3EE6E9A4B",
          "durationms": 276950,
          "playTime": 212710,
          "praisedCount": 2591,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_46E90CBE370A04528EA4E8D71E3B4B55",
          "coverUrl": "https://p1.music.126.net/MXj_VMnHfdiGPXW_BXWKEg==/109951165210607483.jpg",
          "height": 1080,
          "width": 1920,
          "title": "【BLACKPINK朴彩英】ROSÉ【TVPP】韩版蒙面歌王 If It Is",
          "description": " BP主唱不是盖的！！！！",
          "commentCount": 31,
          "shareCount": 31,
          "resolutions": [
            {
              "resolution": 240,
              "size": 20482823
            },
            {
              "resolution": 480,
              "size": 38593934
            },
            {
              "resolution": 720,
              "size": 62440344
            },
            {
              "resolution": 1080,
              "size": 121319654
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 110000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/MX9saEx_ZVikAGarPOcTzg==/109951165044871751.jpg",
            "accountStatus": 0,
            "gender": 2,
            "city": 110101,
            "birthday": -2209017600000,
            "userId": 3359247845,
            "userType": 0,
            "nickname": "茜茜Xi_",
            "signature": "",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951165044871740,
            "backgroundImgId": 109951162868126480,
            "backgroundUrl": "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "backgroundImgIdStr": "109951162868126486",
            "avatarImgIdStr": "109951165044871751"
          },
          "urlInfo": {
            "id": "46E90CBE370A04528EA4E8D71E3B4B55",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/aoCJj1kN_3080907257_uhd.mp4?ts=1626317303&rid=A7996AF39978E47E41462FAC84EDC9AB&rl=3&rs=etVJOLtOxSzMFgBeiVWHeWqfbgHcgqub&sign=fad72205d2e7e0f52f95d56d6fed4cd1&ext=TXTdpEVNfaSRq9hQfoGoqGeCDegGhc1%2BIrejo0klbo9fOFkqZfCqoAV%2BIIkx0vLZU3S4c6WqTT5qnM%2BdjAXFiN7uC4D1b61quGtiS3M%2BFz9Lel4pzHVP5ppcjPvHVvNyZCj4vqiqqhMz4BDKk9Z0SxqUpDW8A5PMS6L7EUiAFnMi%2Fhl3bDXl7UqCJQIwSATMmxYciqzOxNiG4pFGBeZBvz%2FqqN%2BLrwnKtTqbQSr5CD0vf16%2F%2FTMAJlBSvlH41UK%2B",
            "size": 121319654,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 1080
          },
          "videoGroup": [
            {
              "id": 58100,
              "name": "现场",
              "alg": null
            },
            {
              "id": 57107,
              "name": "韩语现场",
              "alg": null
            },
            {
              "id": 57108,
              "name": "流行现场",
              "alg": null
            },
            {
              "id": 59108,
              "name": "巡演现场",
              "alg": null
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "46E90CBE370A04528EA4E8D71E3B4B55",
          "durationms": 144597,
          "playTime": 64350,
          "praisedCount": 699,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_A7176D2479220F2252D4735C8D5C6537",
          "coverUrl": "https://p1.music.126.net/UoGyHhmebi-gm4vlizKaAw==/109951164901693156.jpg",
          "height": 1080,
          "width": 1920,
          "title": "汪苏泷 炎亚纶《想自由》 两大男神四手联弹林宥嘉名曲",
          "description": "汪苏泷 炎亚纶《想自由》 两大男神四手联弹林宥嘉名曲 ",
          "commentCount": 107,
          "shareCount": 654,
          "resolutions": [
            {
              "resolution": 240,
              "size": 20634835
            },
            {
              "resolution": 480,
              "size": 32665279
            },
            {
              "resolution": 720,
              "size": 47041750
            },
            {
              "resolution": 1080,
              "size": 83774248
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 110000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/KQYslSH26t337VbuSstbTQ==/109951163117881906.jpg",
            "accountStatus": 0,
            "gender": 2,
            "city": 110101,
            "birthday": 826300800000,
            "userId": 1345107052,
            "userType": 0,
            "nickname": "壹颗橙子阿",
            "signature": "是一颗喜欢音乐现场的橙子阿",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951163117881900,
            "backgroundImgId": 109951162868126480,
            "backgroundUrl": "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "音乐视频达人"
            },
            "djStatus": 0,
            "vipType": 11,
            "remarkName": null,
            "backgroundImgIdStr": "109951162868126486",
            "avatarImgIdStr": "109951163117881906"
          },
          "urlInfo": {
            "id": "A7176D2479220F2252D4735C8D5C6537",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/Sl3OemGr_2969550407_uhd.mp4?ts=1626317303&rid=A7996AF39978E47E41462FAC84EDC9AB&rl=3&rs=gdwrsrdVjKXrSoZmCQgHEtnJTYTUPaLD&sign=ab608175444b9fb53c7de2ebdb08e630&ext=TXTdpEVNfaSRq9hQfoGoqGeCDegGhc1%2BIrejo0klbo9fOFkqZfCqoAV%2BIIkx0vLZU3S4c6WqTT5qnM%2BdjAXFiN7uC4D1b61quGtiS3M%2BFz9Lel4pzHVP5ppcjPvHVvNyZCj4vqiqqhMz4BDKk9Z0SxqUpDW8A5PMS6L7EUiAFnMi%2Fhl3bDXl7UqCJQIwSATMmxYciqzOxNiG4pFGBeZBvz%2FqqN%2BLrwnKtTqbQSr5CD0vf16%2F%2FTMAJlBSvlH41UK%2B",
            "size": 83774248,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 1080
          },
          "videoGroup": [
            {
              "id": 58100,
              "name": "现场",
              "alg": null
            },
            {
              "id": 59101,
              "name": "华语现场",
              "alg": null
            },
            {
              "id": 57108,
              "name": "流行现场",
              "alg": null
            },
            {
              "id": 59108,
              "name": "巡演现场",
              "alg": null
            },
            {
              "id": 1100,
              "name": "音乐现场",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 30100,
              "name": "汪苏泷",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "A7176D2479220F2252D4735C8D5C6537",
          "durationms": 230180,
          "playTime": 189361,
          "praisedCount": 2344,
          "praised": false,
          "subscribed": false
        }
      }
    ];
    const videoUrl = this.data.videoUrl;
    //将最新的数据更新原有列表数据中
    videoUrl.push(...newVideoList);
    this.setData({ videoUrl })
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
    console.log('用户下拉');
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('用户上拉');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (from) {
    console.log(from);
    if (from.from === 'menu') {
      return {
        title: '来自menu的转发',
        path: '/pages/video/video',
        imageUrl: '/static/images/1.jpg'
      }
    } else {
      return {
        title: '来自button的转发',
        path: '/pages/video/video',
        imageUrl: '/static/images/1.jpg'
      }
    }
  }
})