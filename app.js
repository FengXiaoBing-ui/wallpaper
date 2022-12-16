//app.js
var Bmob = require('utils/bmob.js');
Bmob.initialize("b1570180b6be6862540d997a7df885d5", "2a6a531bfd423a4f122bae7bc48b10c6");
var config = require('utils/config.js');

App({

  //小程序加载
  onLaunch: function () {
    //广告
    if (this.globalData.videoAd) {
      // 广告关闭
      this.globalData.videoAd.onClose(res => {
        if (res.isEnded) {
          console.log('广告关闭', res)
          //给予奖励
          this.baocunImg(this.globalData.url);//保存图片
          this.globalData.adNum = this.globalData.adNum+1;
        } else {
          tt.showToast({ title:"没有看完广告无法获得奖励！",icon:"none",duration:3000 });
        }
      })
      
      //加载错误
      this.globalData.videoAd.onError((err) => {
        console.log('加载异常', err)
        tt.showToast({ title:"广告调用失败！直接给予奖励！",icon:"none",duration:3000 });
        this.baocunImg(this.globalData.url); //保存图片
      });
    }

    // 登录
    tt.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    
    // 获取用户信息
    tt.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          tt.getUserProfile({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  // 在页面中定义插屏广告
  interstitialAd: function () {
    var that=this;
    let interstitialAd = null;
    if (tt.createInterstitialAd) {
      interstitialAd = tt.createInterstitialAd({ adUnitId: that.globalData.config.adUnitIdInsertScreen })
    }
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
  },

  // 保存图片
  baocunImg:function(url){ 
    if(url===undefined)return;
    tt.showLoading({title:"正在保存.."});
    console.log("url="+url);
    var httpsUrl=url.replaceAll("http://","https://");
    console.log("httpsUrl="+httpsUrl);
    tt.downloadFile({
      url: httpsUrl,
      success: (res) => {
        console.log(res);
        tt.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: (res) => {
            console.log(res);
            tt.hideLoading();
            tt.showToast({ title: "保存成功！",duration:2000 });
          },
          fail: (res) => {
            tt.hideLoading();
            console.log(res);
            tt.showToast({ title: "保存失败！",icon:"fail",duration:2000});
          },
        });
      },
      fail: (res) => {
        console.log(res);
        tt.hideLoading();
        tt.showToast({ title: "保存失败！",icon:"fail",duration:2000});
      },
    });
  },

  // 下载广告
  btnDownload:function(url){
    try{
      var that=this;
      this.globalData.url=url;
      let videoAd = this.globalData.videoAd;
      console.log(this.globalData.url);
      console.log("adnum:");
      console.log(this.globalData.adNum);
      var adNum=this.globalData.adNum;

      //验证观看次数是否达到了3次
      if(1>=3){
        this.globalData.adNum = adNum + 1;
        if(adNum >=8){
          tt.showModal({title:"提示",content:"今日已达下载上限，请明天再来！",showCancel:false});
        }else{
          that.baocunImg(url); //保存图片
        }
      }else{
        // 照抄的官方例子
        videoAd
        .show()
        .then(() => {
          console.log("广告显示成功");
        })
        .catch((err) => {
          console.log("广告组件出现问题", err);
          tt.showToast({ title:"检测到特殊用户!直接给予奖励！",icon:"none",duration:3000,success:function(res){
            that.baocunImg(url); //保存图片
          }});
          // 可以手动加载一次
          videoAd.load().then(() => {
            console.log("手动加载成功");
            // 加载成功后需要再显示广告
            return videoAd.show();
          });
        });
      }
    } catch (error) {
        console.log("错误:");
        console.error(error);
    }
  },

  // 全局配置
  globalData: {
    adNum:0,
    config:config.configThis,
    videoAd:tt.createRewardedVideoAd({
      adUnitId: config.configThis.adUnitId,
    }),

    datetime:null,
    datetime2:null,
    domainName:"https://600bq.com/", //服务器-
    //domainName:"https://gz9188.com/", //服务器
    //domainName:"https://adminjcx.gzsskj.cn/", //服务器-
    //domainName:"http://localhost:8080/",//本地
    userInfo: null
  }
})