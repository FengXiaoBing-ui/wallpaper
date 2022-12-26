//获取应用实例
var app = getApp();
Page({
  data: {
    hasLogin: false,
    code: tt.getStorageSync('login.code'),
    userInfo: {},
    labelList:[
      {
        label:"创作者",
        icon:"/images/user/cerator.png"
      },
      {
        label:"收藏",
        icon:"/images/user/collection.png"
      },
      {
        label:"分享",
        icon:"/images/user/share.png"
      },
      {
        label:"申请入驻",
        icon:"/images/user/settleIn.png"
      },
      {
        label:"联系我们",
        icon:"/images/user/call.png"
      },
      {
        label:"设置",
        icon:"/images/user/setting.png"
      },
      {
        label:"常见问题",
        icon:"/images/user/problem.png"
      }
    ]
  },
  onLoad: function () {
    tt.setNavigationBarTitle({title: app.globalData.config.applicationName});
    let that = this;
    tt.getStorage({
      key: 'userInfo',
      success: (res) => {
        that.setData({
          userInfo: res.data
        })
      }
    })
    tt.checkSession({
      success: function () {
        that.setData({
          hasLogin: true
        });
      },
      fail: function () {
        that.setData({
          hasLogin: false
        });
      }
    });
  },
  login: function () {
    let that = this;
    tt.getUserProfile({
      success: (res) => {
        console.log(res);
        tt.setStorage({
          key: "userInfo",
          data: res.userInfo
        });
        that.setData({
          userInfo: res.userInfo
        })
        tt.login({
          force: true,
          success(res) {
            const { code, errMsg, anonymousCode, isLogin } = res;
            console.log(`tt-login success`, errMsg);
            console.log(`code(临时登录凭证, 有效期 3 分钟) : `, code);
            console.log(`anonymousCode(用于标识当前设备, 无论登录与否都会返回, 有效期 3 分钟) : `, anonymousCode);
            console.log(`isLogin(判断在当前 APP（头条、抖音等）是否处于登录状态) : `, isLogin);
            tt.request({
              url: app.globalData.domainName + "api/front/creator/index/login",
              method: "POST",
              header: {
                "content-type": "multipart/form-data",
              },
              data: {
                code:code,
                request:{
                  tokenType:2,
                  zhijieAppid:'ttee1398ae712d721c01'
                }
              },
              success: (res) => {
                console.log(res);
              },
              fail: (res) => {
              },
            });
            that.setData({
              hasLogin: true
            });

          },
          fail(err) {
            tt.showModal({
              title: '登录失败',
              content: JSON.stringify(err),
              showCancel: false
            });
            console.log(`tt-login failed`, err.errMsg);
          },
          complete(res) {
            console.log(`tt-login completed`);
          }
        });
      },
      fail: (err) => {
        console.log(err);
      }
    })

  }
})