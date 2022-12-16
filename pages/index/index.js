//index.js
//获取应用实例

var Bmob = require('../../utils/bmob.js');
var app = getApp();

Page({
  data: {
    page:1,
    pageSize:24,
    animationData: {},
    cardInfoList: []
  },

  //页面加载
  onLoad: function(e){
    
  },

  //页面显示
  onShow:function(){
    //得到数据
    this.getImgList();

    //插屏广告
    app.interstitialAd();
  },

  //得到图片列表
  getImgList(){
    var that=this;
    var flag=true;
    tt.request({
      url: app.globalData.domainName + 'api/public/qrcode/imgList',
      data:{
        pidStr: tt.getStorageSync("pidStr"),
        limit:that.data.pageSize,
        page:that.data.page
      },
      success: (res) => {
        var data=res.data.data.list;
        that.setData({
          cardInfoList:data,
        });
        flag = false;
      },
      fail: (res) => {
        
      },
    });

    if(flag==true){
      wx.showToast({
        title: '正在加载',
        icon: 'loading',
      })
    }
  },

  //下载
  btnDownload:function(e){
    tt.showToast({
      title: '正在处理..',
      icon: 'loading',
    })
    
    var url=e.target.id;
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
  },

  //事件处理函数
  slidethis: function (e) {
    console.log(e);
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'cubic-bezier(.8,.2,.1,0.8)',
    });
    var self = this;
    this.animation = animation;
    this.animation.translateY(-420).rotate(-5).translateX(0).step();
    this.animation.translateY(62).translateX(25).rotate(0).step();
    this.setData({
      animationData: this.animation.export()
    });
    setTimeout(function () {
      var cardInfoList = self.data.cardInfoList;
      var slidethis = self.data.cardInfoList.shift();
      self.data.cardInfoList.push(slidethis);
      self.setData({
        cardInfoList: self.data.cardInfoList,
        animationData: {}
      });
    }, 350);
  },

  buythis: function (e) {
    console.log(e);
    app.buyDetail = this.data.cardInfoList[e.target.id];
    wx.navigateTo({
      url: '../log/log'
    });
  }
})
