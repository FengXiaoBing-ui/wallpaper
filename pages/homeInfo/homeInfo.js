// d:\lingfe\xcx\bzhiDome\pages\homeInfo\homeInfo.js
var app = getApp();

Page({
  data: {
  },

  //页面加载
  onLoad: function (options) {
    var that=this;
    console.log(options)
    const res = tt.getSystemInfoSync();
    var windowHeight=res.screenHeight;
    console.log(windowHeight)
    that.setData({
      windowHeight:windowHeight,
      infoData:tt.getStorageSync("infoData")
    });
    
    //插屏广告
    app.interstitialAd();
    //this.datetimeKozhi();
  },

  //调用插屏广告，每个s调用一次
  datetimeKozhi:function(){
    let date = app.globalData.datetime;
    let now = Date.now();
    var date2=date + (1 * 30 * 1000);
    if( date2 < now){
        console.log('超过了当前30s分钟，启动插屏广告')
        app.globalData.datetime=now;
        app.interstitialAd();//插屏广告
    }else{
        console.log('没有超过当前30s秒，不启动插屏广告')
    }
    console.log(date);
    console.log(now);
    console.log(date2);
  },

  //返回
  btnReturn:function(){
    tt.navigateBack();
  },

  //开启弹窗
  showTip:function (e) {
    this.setData({
      showModal:true
    });
  },

  //隐藏弹窗
  preventHide:function(e){
    this.setData({showModal:false});
    //tt.showToast({ title: "求支持!",icon:"fail",duration:2000});
  },

  //下载
  btnDownload:function(e){
    tt.showToast({
      title: '正在处理..',
      icon: 'loading',
    })

    var that=this;
    var url=that.data.infoData.sattDir;
    //app.btnDownload(url);
    var indexof=url.indexOf(app.globalData.domainName);
    if(indexof!=-1){
      app.btnDownload(url);
    }else{
      tt.request({
        url: app.globalData.domainName + '/api/public/qrcode/imgUrlSaveFiles',
        data:{
          folder:app.globalData.config.applicationID,
          pid:999,
          imgUrl:url
        },
        success: (res1) => {
          console.log(res1);
          var data=res1.data.data;
          if(data == null ){
            tt.showToast({ title: "请稍后重试!",icon:"fail",duration:2000});
          }else{
            var url999=data[0].url;
            app.btnDownload(url999);
          }
        },
        fail: (res) => {
          tt.showToast({ title: "请稍后重试!",icon:"fail",duration:2000});
        },
      });
    }

    // tt.showModal({
    //   title: "求支持",
    //   content: "看广告下载高清原图，为创作者注力！",
    //   success(res) {
    //     if (res.confirm) {

    //     } else if (res.cancel) {
    //       tt.showToast({ title: "很遗憾，取消无法获得!",icon:"fail",duration:2000});
    //     } else {
    //       // what happend?
    //       tt.showToast({ title: "您好像发现了bug!",icon:"fail",duration:2000});
    //     }
    //   },
    //   fail(err) {
    //     console.log(`showModal 调用失败`, err);
    //   },
    // });
  },

  //分享
  btnShare:function(e){
    var that=this;
  },
  
})